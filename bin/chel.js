#!/usr/bin/env node

// Root launcher for `@chelonia/cli`.
//
// npm only links the *root* package's `bin` to the global bin directory, so a
// root entry is required for `npm install -g @chelonia/cli` to put `chel` on
// the PATH (optional-dependency bins are not globally promoted). This shim
// resolves the platform sub-package selected by npm and spawns its native
// binary, forwarding all arguments and stdio.
//
// The sub-packages deliberately declare no `bin` of their own: doing so would
// make them fight the root package for the `chel` link inside
// `node_modules/.bin`. See BINARY_FIELD in scripts/targets.ts.
//
// The sub-package naming convention `@chelonia/cli-<arch>-<platform>` matches
// `subPackageName` in scripts/targets.ts, where <arch> is `process.arch`
// ('x64' | 'arm64') and <platform> is `process.platform`
// ('linux' | 'darwin' | 'win32'). This duplication is intentional (this file
// is CommonJS run at install time and cannot import the TS module) and is
// pinned by `scripts/targets.test.ts` — if you change the convention here or
// in targets.ts, that test will fail. Update both together.

const { spawn } = require('node:child_process')
const path = require('node:path')
const os = require('node:os')
const fs = require('node:fs')

// Translate the child's (code, signal) into a POSIX-conformant exit status:
// 128 + signum when killed by a signal (130 for SIGINT, 143 for SIGTERM), so
// callers can distinguish "interrupted" from "failed".
function exitCodeFor (code, signal) {
  if (code != null) return code
  if (signal && os.constants.signals[signal] != null) {
    return 128 + os.constants.signals[signal]
  }
  return 1
}

const subPkgName = `@chelonia/cli-${process.arch}-${process.platform}`

let pkgJsonPath
try {
  pkgJsonPath = require.resolve(`${subPkgName}/package.json`)
} catch {
  console.error(
    `chel: no binary for ${process.platform}/${process.arch}. ` +
    `The platform package '${subPkgName}' is not installed. ` +
    `This platform may be unsupported; see ` +
    `https://github.com/okTurtles/chel#supported-platforms for the list of supported platforms.`
  )
  process.exit(127)
}

const subPkg = require(pkgJsonPath)
// Sub-packages advertise their binary under `chelBinary` rather than `bin`, so
// that npm links the name `chel` for this package only (see BINARY_FIELD in
// scripts/targets.ts). The platform-derived fallback keeps the shim working
// with sub-packages that predate that field, and is pinned by
// scripts/targets.test.ts against the filenames in TARGETS.
const binRel = typeof subPkg.chelBinary === 'string' && subPkg.chelBinary
  ? subPkg.chelBinary
  : (process.platform === 'win32' ? 'chel.exe' : 'chel')

const binPath = path.join(path.dirname(pkgJsonPath), binRel)

// Check the binary before spawning so a broken install reports something
// actionable instead of a raw ENOENT/EACCES stack trace. This is worth doing
// explicitly because the sub-package declares no `bin`, so npm never touches
// the file's permissions at install time: the executable bit comes from the
// published tarball, and a package manager or filesystem that drops it would
// otherwise fail here in a confusing way.
try {
  fs.accessSync(binPath, fs.constants.X_OK)
} catch (err) {
  const reason = err.code === 'ENOENT'
    ? 'its binary is missing'
    : (err.code === 'EACCES'
        ? 'its binary is not executable'
        : `its binary cannot be run (${err.code})`)
  console.error(
    `chel: platform package '${subPkgName}' is installed but ${reason}:\n  ${binPath}\n` +
    `Try reinstalling: npm install --force @chelonia/cli`
  )
  process.exit(126)
}

const child = spawn(binPath, process.argv.slice(2), { stdio: 'inherit' })

// Track whether the child has actually exited, so we keep forwarding repeat
// signals until it's truly gone. (child.killed flips to true on the first
// kill() call, not on exit, so it can't be used to gate forwarding.) With
// stdio:'inherit' the process group usually delivers these to both already;
// this covers a targeted `kill <parent-pid>`.
let childExited = false

// Forward every catchable signal the platform knows about, so the child sees
// the same control flow the parent does. SIGKILL/SIGSTOP cannot be caught
// (Node throws if you try to add a listener) and SIGCHLD is reserved by libuv
// for child-process bookkeeping, so those are skipped. Deriving the set from
// os.constants.signals also picks up platform-specific entries (SIGINFO on
// BSDs, SIGPWR/SIGSTKFLT on Linux, etc.) instead of a hardcoded list.
const nonForwardable = new Set(['SIGKILL', 'SIGSTOP', 'SIGCHLD'])
for (const name of Object.keys(os.constants.signals)) {
  if (nonForwardable.has(name)) continue
  process.on(name, () => { if (!childExited) child.kill(name) })
}

child.on('error', (err) => {
  console.error('chel:', err)
  process.exit(1)
})
child.on('close', (code, signal) => {
  childExited = true
  process.exit(exitCodeFor(code, signal))
})

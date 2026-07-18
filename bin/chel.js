#!/usr/bin/env node

// Root launcher for `@chelonia/cli`.
//
// npm only links the *root* package's `bin` to the global bin directory, so a
// root entry is required for `npm install -g @chelonia/cli` to put `chel` on
// the PATH (optional-dependency bins are not globally promoted). This shim
// resolves the platform sub-package selected by npm and spawns its native
// binary, forwarding all arguments and stdio.
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
    `https://github.com/okTurtles/chel for the list of supported targets.`
  )
  process.exit(127)
}

const subPkg = require(pkgJsonPath)
const binRel = typeof subPkg.bin === 'string'
  ? subPkg.bin
  : subPkg.bin && (subPkg.bin.chel || Object.values(subPkg.bin)[0])
if (!binRel) {
  console.error(`chel: '${subPkgName}' does not declare a binary`)
  process.exit(1)
}

const binPath = path.join(path.dirname(pkgJsonPath), binRel)
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

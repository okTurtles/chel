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
// ('linux' | 'darwin' | 'win32'). Keeping the convention identical on both
// sides is what lets this stay in sync without importing the TS module.

const { spawn } = require('node:child_process')
const path = require('node:path')

const subPkgName = `@chelonia/cli-${process.arch}-${process.platform}`

let pkgJsonPath
try {
  pkgJsonPath = require.resolve(`${subPkgName}/package.json`)
} catch {
  console.error(
    `chel: no binary for ${process.platform}/${process.arch}. ` +
    `The platform package '${subPkgName}' is not installed.`
  )
  process.exit(127)
}

const subPkg = require(pkgJsonPath)
const binRel = subPkg.bin && (subPkg.bin.chel || Object.values(subPkg.bin)[0])
if (!binRel) {
  console.error(`chel: '${subPkgName}' does not declare a binary`)
  process.exit(1)
}

const binPath = path.join(path.dirname(pkgJsonPath), binRel)
const child = spawn(binPath, process.argv.slice(2), { stdio: 'inherit' })
child.on('error', (err) => {
  console.error('chel:', err)
  process.exit(1)
})
child.on('close', (code) => {
  process.exit(code ?? 1)
})

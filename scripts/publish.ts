#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=./dist --allow-env

// Pre-publish helper for @chelonia/cli.
//
// Wired into `npm publish` via the `prepublishOnly` npm script (see package.json),
// which calls `deno task publish`. It:
//   1. Builds the JS bundle (`deno task build`)
//   2. For each OS/CPU target, compiles a native binary and writes it under
//      `dist/cli-<cpu>-<os>/` together with a minimal `package.json`
//   3. Publishes each platform sub-package to npm
//
// When this script finishes, the outer `npm publish` publishes the main package,
// whose `optionalDependencies` now reference the freshly published sub-packages.
//
// Compiled binaries live under `dist/` (gitignored) and are never committed,
// matching the previous `bin/` behavior.

import { shell } from '~/utils.ts'

function $ (command: string): Promise<string> {
  return shell(command, { printOutput: true })
}

const { default: rootPkg } = await import('../package.json', { with: { type: 'json' } })

// Maps each `deno compile --target` value to the npm platform identifiers
// (`os` matches `process.platform`, `cpu` matches `process.arch`) and the
// resulting binary filename.
const TARGETS = [
  { denoTarget: 'x86_64-unknown-linux-gnu', os: 'linux', cpu: 'x64', binary: 'chel' },
  { denoTarget: 'aarch64-unknown-linux-gnu', os: 'linux', cpu: 'arm64', binary: 'chel' },
  { denoTarget: 'x86_64-pc-windows-msvc', os: 'win32', cpu: 'x64', binary: 'chel.exe' },
  { denoTarget: 'x86_64-apple-darwin', os: 'darwin', cpu: 'x64', binary: 'chel' },
  { denoTarget: 'aarch64-apple-darwin', os: 'darwin', cpu: 'arm64', binary: 'chel' }
] as const

async function buildBundle (): Promise<void> {
  console.log('=== Step 1: Building JS bundle ===')
  await $('deno task build')
}

async function createSubPackages (): Promise<void> {
  console.log('\n=== Step 2: Compiling binaries & creating sub-packages ===')
  await $('rm -rf ./dist && mkdir -p ./dist')

  for (const target of TARGETS) {
    const subPkgName = `@chelonia/cli-${target.cpu}-${target.os}`
    const subDir = `dist/cli-${target.cpu}-${target.os}`

    console.log(`\n--- ${subPkgName} (${target.denoTarget}) ---`)
    await $(`mkdir -p ${subDir}`)

    await $(
      'deno compile --allow-env --allow-ffi --allow-sys=hostname --allow-read --allow-write=./ --allow-net ' +
      `-o ${subDir}/${target.binary} --target ${target.denoTarget} ` +
      '--exclude node_modules --include ./build/serve --include ./build/dist-dashboard ./build/main.js'
    )

    const subPkg = {
      name: subPkgName,
      version: rootPkg.version,
      description: `${rootPkg.description} (${target.os}/${target.cpu})`,
      os: [target.os],
      cpu: [target.cpu],
      bin: {
        chel: target.binary
      }
    }
    await Deno.writeTextFile(
      `${subDir}/package.json`,
      JSON.stringify(subPkg, null, 2) + '\n'
    )
  }
}

async function publishSubPackages (): Promise<void> {
  console.log('\n=== Step 3: Publishing sub-packages ===')
  for (const target of TARGETS) {
    const subPkgName = `@chelonia/cli-${target.cpu}-${target.os}`
    const subDir = `dist/cli-${target.cpu}-${target.os}`
    console.log(`\n--- Publishing ${subPkgName} ---`)
    await $(`cd ${subDir} && npm publish --access public`)
  }
}

try {
  await buildBundle()
  await createSubPackages()
  await publishSubPackages()
  console.log('\n=== Sub-packages published. Publishing main package... ===')
} catch (e) {
  console.error('caught:', e)
  Deno.exit(1)
}

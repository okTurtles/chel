#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=./dist,./package.json --allow-env

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

import { $ } from '~/utils.ts'
import { TARGETS, compileBinary, subPackageName, subPackageDir } from './targets.ts'
import { reconcileOptionalDeps, rootPackagePath } from './sync-versions.ts'

// Static import for TS JSON-import-attribute type inference. The path also
// lives in `rootPackagePath()` from `./sync-versions.ts` (used in the `try`
// block below); keep both in sync if it ever changes.
const { default: rootPkg } = await import('../package.json', { with: { type: 'json' } })

async function buildBundle (): Promise<void> {
  console.log('=== Step 1: Building JS bundle ===')
  await $('deno task build')
}

async function createSubPackages (): Promise<void> {
  console.log('\n=== Step 2: Compiling binaries & creating sub-packages ===')
  await $('rm -rf ./dist && mkdir -p ./dist')

  for (const target of TARGETS) {
    const subPkgName = subPackageName(target)
    const subDir = subPackageDir(target)

    console.log(`\n--- ${subPkgName} (${target.denoTarget}) ---`)
    await $(`mkdir -p ${subDir}`)

    await compileBinary(`${subDir}/${target.binary}`, target)

    const subPkg = {
      name: subPkgName,
      version: rootPkg.version,
      description: `${rootPkg.description} (${target.os}/${target.cpu})`,
      repository: rootPkg.repository,
      author: rootPkg.author,
      license: rootPkg.license,
      os: [target.os],
      cpu: [target.cpu],
      files: [target.binary],
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
    const subPkgName = subPackageName(target)
    const subDir = subPackageDir(target)
    console.log(`\n--- Publishing ${subPkgName} ---`)
    await $(`cd ${subDir} && npm publish --access public`)
  }
}

try {
  await buildBundle()
  await createSubPackages()
  await publishSubPackages()
  const pkgPath = rootPackagePath()
  const synced = await reconcileOptionalDeps(pkgPath, rootPkg.version, TARGETS)
  if (synced) console.log(`\nSynced optionalDependencies -> ${rootPkg.version}`)
  console.log('\n=== Sub-packages published. Publishing main package... ===')
} catch (e) {
  console.error('caught:', e)
  Deno.exit(1)
}

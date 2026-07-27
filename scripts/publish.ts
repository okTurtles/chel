#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=./dist,./package.json --allow-env

// When: Automatically invoked by `npm publish` via the "prepublishOnly"
//       script in package.json. Runs just before the main package is
//       published to the npm registry.
//
// How:  deno task publish
//
// Pre-publish helper for @chelonia/cli.
//
// Wired into `npm publish` via the `prepublishOnly` npm script (see package.json),
// which calls `deno task publish`. It:
//   0. Verifies the committed bundle is fresh and the tree is clean for the
//      bundle paths (see assertFreshBundle); refuses to publish otherwise
//   1. For each OS/CPU target, compiles a native binary from the committed
//      `build/` bundle and writes it under `dist/cli-<cpu>-<os>/` together
//      with a minimal `package.json`
//   2. Publishes each platform sub-package to npm
//
// The JS bundle itself is NOT rebuilt here: it is built and committed by the
// npm `version` lifecycle hook (see package.json), so what gets published is
// exactly what the version commit and tag contain.
//
// When this script finishes, the outer `npm publish` publishes the main package,
// whose `optionalDependencies` now reference the freshly published sub-packages.
//
// Compiled binaries live under `dist/` (gitignored) and are never committed,
// matching the previous `bin/` behavior.

import { shell, $ } from '~/utils.ts'
import { TARGETS, compileBinary, subPackageName, subPackageDir } from './targets.ts'
import { reconcileOptionalDeps, rootPackagePath } from './sync-versions.ts'

// Static import for TS JSON-import-attribute type inference. The path also
// lives in `rootPackagePath()` from `./sync-versions.ts` (used in the `try`
// block below); keep both in sync if it ever changes.
const { default: rootPkg } = await import('../package.json', { with: { type: 'json' } })

// Refuses to publish unless the bundle about to be compiled is exactly what
// the version commit and tag contain:
//   - `build/version.json` (written by scripts/build.ts, committed by the npm
//     `version` hook) must exist and match the package.json version
//   - `build/dist-dashboard` (embedded into every binary via targets.ts) must
//     be present
//   - git must report no staged/unstaged changes or untracked files under
//     `build/` or `package.json`
async function assertFreshBundle (): Promise<void> {
  console.log('=== Step 0: Verifying committed bundle ===')

  let stamp: { version?: string }
  try {
    stamp = JSON.parse(await Deno.readTextFile('./build/version.json'))
  } catch {
    throw new Error(
      'build/version.json is missing; run `npm version <patch|minor|major>` ' +
      'to rebuild and commit the bundle before publishing'
    )
  }
  if (stamp.version !== rootPkg.version) {
    throw new Error(
      `build/version.json is stamped with ${stamp.version ?? '(nothing)'} but ` +
      `package.json has ${rootPkg.version}; run \`npm version\` to rebuild and ` +
      'commit the bundle before publishing'
    )
  }

  try {
    await Deno.stat('./build/dist-dashboard/index.html')
  } catch {
    throw new Error(
      'build/dist-dashboard is missing or incomplete; run `npm version` ' +
      'to rebuild the dashboard before publishing'
    )
  }

  const git = (args: string[]) => new Deno.Command('git', {
    args, stdout: 'piped', stderr: 'null'
  }).output()

  for (const staged of [false, true]) {
    const { code } = await git(
      ['diff', ...(staged ? ['--cached'] : []), '--quiet', '--', 'build', 'package.json']
    )
    if (code !== 0) {
      throw new Error(
        `${staged ? 'Staged' : 'Unstaged'} changes under build/ or package.json; ` +
        'the published bundle must match the version commit — run `npm version` ' +
        'again, or commit/discard the changes first'
      )
    }
  }

  const { stdout } = await git(['ls-files', '--others', '--exclude-standard', '--', 'build'])
  if (new TextDecoder().decode(stdout).trim()) {
    throw new Error(
      'Untracked files under build/ would be embedded into the binaries but are ' +
      'not committed; remove them or run `npm version` again'
    )
  }
}

async function createSubPackages (): Promise<void> {
  console.log('=== Step 1: Compiling binaries & creating sub-packages ===')
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
      files: [target.binary, 'LICENSE'],
      bin: {
        chel: target.binary
      }
    }
    await Deno.writeTextFile(
      `${subDir}/package.json`,
      JSON.stringify(subPkg, null, 2) + '\n'
    )
    await Deno.writeTextFile(
      `${subDir}/README.md`,
      `# ${subPkgName}\n\n` +
      `Platform-specific binary for ${rootPkg.description} ` +
      `(${target.os}/${target.cpu}).\n\n` +
      'Installed automatically via the `optionalDependencies` of `@chelonia/cli`; ' +
      'do not depend on this package directly.\n'
    )
    await Deno.copyFile('./LICENSE', `${subDir}/LICENSE`)
  }
}

async function publishSubPackages (): Promise<void> {
  console.log('\n=== Step 2: Publishing sub-packages ===')
  for (const target of TARGETS) {
    const subPkgName = subPackageName(target)
    const subDir = subPackageDir(target)

    const check = new Deno.Command('npm', {
      args: ['view', `${subPkgName}@${rootPkg.version}`, 'version'],
      stdout: 'null',
      stderr: 'null'
    })
    const { code: alreadyPublished } = await check.output()
    if (alreadyPublished === 0) {
      console.log(`\n--- Skipping ${subPkgName} (already published) ---`)
      continue
    }

    console.log(`\n--- Publishing ${subPkgName} ---`)
    await shell('npm publish --access public', { printOutput: true, cwd: subDir })
  }
}

try {
  await assertFreshBundle()
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

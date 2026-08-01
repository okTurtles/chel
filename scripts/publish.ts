#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=./build,./dist,./package.json --allow-env

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
//   1. For each OS/CPU target, obtains a native binary built from the
//      committed `build/` bundle and assembles `dist/cli-<cpu>-<os>/` around
//      it, together with a minimal `package.json`
//   2. Publishes each platform sub-package to npm
//
// The JS bundle itself is NOT rebuilt here: it is built and committed by the
// npm `version` lifecycle hook (see package.json), so what gets published is
// exactly what the version commit and tag contain.
//
// The binaries are likewise not necessarily compiled here: they come from the
// shared cache in `./binaries.ts`. A release that already produced the GitHub
// tarballs (`deno task dist`) therefore reuses those exact binaries instead of
// spending minutes recompiling identical ones, which also guarantees npm and
// GitHub ship the same bytes. If no cached binary matches the committed
// bundle, it is compiled on demand, so publishing on its own still works.
// Compiling writes nothing to `build/` beyond pinning mtimes for
// reproducibility, which is why this script may write there.
//
// When this script finishes, the outer `npm publish` publishes the main package,
// whose `optionalDependencies` now reference the freshly published sub-packages.
//
// Compiled binaries live under `dist/` (gitignored) and are never committed,
// matching the previous `bin/` behavior.

import { shell, $ } from '~/utils.ts'
import {
  TARGETS,
  EXEC_MODE,
  subPackageName,
  subPackageDir,
  subPackageManifest
} from './targets.ts'
import { binaryPath, ensureBinaries } from './binaries.ts'
import { reconcileOptionalDeps, rootPackagePath } from './sync-versions.ts'
import { BUILD_DIR, VERSION_STAMP_PATH, SERVE_DIR, DASHBOARD_DIR } from './paths.ts'

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
//   - git must report no staged/unstaged changes under `build/` or
//     `package.json`, and no untracked files under the two directories that
//     `deno compile` embeds into every binary (`build/serve`,
//     `build/dist-dashboard`)
async function assertFreshBundle (): Promise<void> {
  console.log('=== Step 0: Verifying committed bundle ===')

  let stamp: { version?: string }
  try {
    stamp = JSON.parse(await Deno.readTextFile(VERSION_STAMP_PATH))
  } catch {
    throw new Error(
      `${VERSION_STAMP_PATH} is missing; run \`npm version <patch|minor|major>\` ` +
      'to rebuild and commit the bundle before publishing'
    )
  }
  if (stamp.version !== rootPkg.version) {
    throw new Error(
      `${VERSION_STAMP_PATH} is stamped with ${stamp.version ?? '(nothing)'} but ` +
      `package.json has ${rootPkg.version}; run \`npm version\` to rebuild and ` +
      'commit the bundle before publishing'
    )
  }

  try {
    await Deno.stat(`${DASHBOARD_DIR}/index.html`)
  } catch {
    throw new Error(
      `${DASHBOARD_DIR} is missing or incomplete; run \`npm version\` ` +
      'to rebuild the dashboard before publishing'
    )
  }

  const git = (args: string[]) => new Deno.Command('git', {
    args, stdout: 'piped', stderr: 'null'
  }).output()

  for (const staged of [false, true]) {
    const { code } = await git(
      ['diff', ...(staged ? ['--cached'] : []), '--quiet', '--', BUILD_DIR, 'package.json']
    )
    if (code !== 0) {
      throw new Error(
        `${staged ? 'Staged' : 'Unstaged'} changes under ${BUILD_DIR}/ or package.json; ` +
        'the published bundle must match the version commit. Discard them with ' +
        `\`git checkout -- ${BUILD_DIR}/ package.json\`, or rebuild and amend with ` +
        `\`deno task build && git add ${BUILD_DIR}/ package.json && git commit --amend --no-edit\` ` +
        '(then re-tag with `git tag -f v<version>` if you amended)'
      )
    }
  }

  const { stdout } = await git([
    'ls-files', '--others', '--', SERVE_DIR, DASHBOARD_DIR
  ])
  if (new TextDecoder().decode(stdout).trim()) {
    throw new Error(
      `Untracked files under ${SERVE_DIR}/ or ${DASHBOARD_DIR}/ would be embedded ` +
      'into the compiled binaries but are not committed; remove them, or rebuild ' +
      'and amend the version commit (see the release steps in README.md)'
    )
  }
}

async function createSubPackages (): Promise<void> {
  console.log('=== Step 1: Obtaining binaries & creating sub-packages ===')
  await ensureBinaries()

  for (const target of TARGETS) {
    const subPkgName = subPackageName(target)
    const subDir = subPackageDir(target)

    console.log(`\n--- ${subPkgName} (${target.denoTarget}) ---`)
    // Only the sub-package directory is wiped, never the whole of `dist/`:
    // that is where the shared binary cache and the release tarballs live.
    await $(`rm -rf ${subDir} && mkdir -p ${subDir}`)

    const binaryDest = `${subDir}/${target.binary}`
    await Deno.copyFile(binaryPath(target), binaryDest)
    // Deno.copyFile preserves the mode, but the executable bit has to be
    // present in the published tarball (npm never fixes it up, see
    // BINARY_FIELD), so make it a guarantee rather than an assumption.
    if (target.os !== 'win32') {
      await Deno.chmod(binaryDest, EXEC_MODE)
    }

    const subPkg = subPackageManifest(target, rootPkg)
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
    // Inherit stdio so npm keeps its TTY and can prompt for an OTP
    // (otherwise 2FA-protected publishes fail with EOTP).
    await shell('npm publish --access public', { interactive: true, cwd: subDir })
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

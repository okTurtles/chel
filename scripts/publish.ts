#!/usr/bin/env -S deno run --allow-run --allow-read --allow-write=./build,./dist,./node_modules,./package.json --allow-env

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
//   0. Refuses to publish unless HEAD is the commit of the `v<version>` tag
//      and no tracked file differs from it, then rebuilds `build/` from that
//      commit (see buildCommittedSource)
//   1. For each OS/CPU target, obtains a native binary built from that
//      `build/` bundle and assembles `dist/cli-<cpu>-<os>/` around it,
//      together with a minimal `package.json`
//   2. Publishes each platform sub-package to npm
//
// The binaries are not necessarily compiled here: they come from the
// shared cache in `./binaries.ts`. The build is reproducible, so step 0 gives
// the same `build/` that `deno task dist` compiled, and a release that already
// produced the GitHub tarballs reuses those exact binaries instead of
// spending minutes recompiling identical ones, which also guarantees npm and
// GitHub ship the same bytes. If no cached binary matches the rebuilt
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

// Static import for TS JSON-import-attribute type inference. The path also
// lives in `rootPackagePath()` from `./sync-versions.ts` (used in the `try`
// block below); keep both in sync if it ever changes.
const { default: rootPkg } = await import('../package.json', { with: { type: 'json' } })

// `build/` is gitignored, so what is on disk may be stale or built from
// uncommitted edits. It is rebuilt here from the commit that the version tag
// points to, with no tracked file changed, so the binaries embed exactly what
// the tag contains, which is also what the tag-push build audit checks.
// Untracked files are not checked: every checkout has some, for example the
// files `deno install` adds under `vendor/`.
async function buildCommittedSource (): Promise<void> {
  console.log('=== Step 0: Building the bundle from the committed source ===')

  // Checked first: only a clean `package.json` gives the version of HEAD.
  const changed = await shell('git diff --name-only HEAD')
  if (changed) {
    throw new Error(
      'These tracked files differ from HEAD, so the published bundle would not ' +
      `match the version tag. Stash or discard them first:\n${changed}`
    )
  }

  const tag = `v${rootPkg.version}`
  if (await shell(`git tag --points-at HEAD --list ${tag}`) !== tag) {
    throw new Error(
      `HEAD is not the commit that the ${tag} tag points to, so the published ` +
      `bundle would not match the tag. Run \`git checkout ${tag}\`, or move the ` +
      `tag to this commit with \`git tag -f ${tag}\` first.`
    )
  }

  await $('deno task build')
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

// Guarded like ./compile.ts and ./sync-versions.ts, so importing this module
// can never publish to npm as a side effect. publish.ts is the one place
// where that would be destructive: publishing is close to irreversible
// (sub-packages can only be unpublished within 72h), so it must only happen
// when the script is actually run, never when it is merely imported.
if (import.meta.main) {
  try {
    await buildCommittedSource()
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
}

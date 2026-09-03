// Symlink behavior of the binary cache, kept apart from binaries.test.ts for
// one reason: creating a symlink requires Deno's *unscoped* `--allow-write`
// (and unscoped `--allow-read`), and the main test task deliberately confines
// both to the project. These steps therefore run under their own task
// (`deno task test:symlinks`, chained into `deno task test`) and skip
// themselves anywhere the permissions are absent.
//
// What they protect is the reproducibility of releases. The native addon paths
// reach `node_modules` through a version-less symlink, and `deno compile
// --include` embeds what a link points at, so both halves of the cache have to
// follow links as well: the mtime pinning (or a fresh install silently changes
// the released bytes) and the fingerprint (or the change never invalidates the
// cache).
import { assertEquals } from 'jsr:@std/assert'
import { resolve } from 'jsr:@std/path/'
import { assertNativeAddonsPresent, computeFingerprint, normalizeMtimes } from './binaries.ts'
import {
  FAKE_COMPILE_FLAGS as FLAGS,
  symlinkSupported,
  withTempDir
} from '../test/test-helpers.ts'

const canSymlink = await symlinkSupported()

// A relative symlink target is resolved against the link's own directory, so
// the temp paths below have to be made absolute or every link ends up
// dangling. withTempDir already hands out absolute paths; this covers the
// targets assembled from elsewhere.
const linkTo = async (target: string, link: string): Promise<void> => {
  await Deno.symlink(resolve(target), link)
}

Deno.test({
  name: 'symlinked build inputs',
  ignore: !canSymlink,
  async fn (t: Deno.TestContext) {
    await t.step('normalizeMtimes stamps what a symlink points at', async () => {
      // Deno.utime has no lutime counterpart, so the link itself can never be
      // stamped. Leaving it alone would mean the binary embeds whatever mtime
      // the last `npm install` happened to give the target.
      await withTempDir(async (dir) => {
        await withTempDir(async (real) => {
          const target = `${real}/addon.node`
          await Deno.writeTextFile(target, 'v1')
          await linkTo(target, `${dir}/linked-addon`)
          await normalizeMtimes(dir, 0)
          assertEquals((await Deno.stat(target)).mtime?.getTime(), 0)
        })
      })
    })

    await t.step('normalizeMtimes descends through a symlinked directory', async () => {
      await withTempDir(async (dir) => {
        await withTempDir(async (real) => {
          await Deno.mkdir(`${real}/prebuilds`)
          const target = `${real}/prebuilds/linux-x64.node`
          await Deno.writeTextFile(target, 'v1')
          await linkTo(real, `${dir}/package`)
          await normalizeMtimes(dir, 0)
          assertEquals((await Deno.stat(target)).mtime?.getTime(), 0)
        })
      })
    })

    await t.step('the fingerprint hashes what a symlinked path points at', async () => {
      await withTempDir(async (dir) => {
        await withTempDir(async (real) => {
          await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
          await Deno.writeTextFile(`${real}/addon.node`, 'v1')
          const link = `${dir}/linked-addon`
          await linkTo(`${real}/addon.node`, link)
          const before = await computeFingerprint(dir, [link], FLAGS)
          await Deno.writeTextFile(`${real}/addon.node`, 'v2')
          assertEquals(await computeFingerprint(dir, [link], FLAGS) === before, false)
        })
      })
    })

    await t.step('the fingerprint walks into a symlinked directory', async () => {
      await withTempDir(async (dir) => {
        await withTempDir(async (real) => {
          await Deno.mkdir(`${real}/prebuilds`)
          await Deno.writeTextFile(`${real}/prebuilds/linux-x64.node`, 'v1')
          const link = `${dir}/package`
          await linkTo(real, link)
          const before = await computeFingerprint(dir, [link], FLAGS)
          await Deno.writeTextFile(`${real}/prebuilds/linux-x64.node`, 'v2')
          assertEquals(await computeFingerprint(dir, [link], FLAGS) === before, false)
        })
      })
    })

    await t.step('a symlink cycle terminates instead of hanging the build', async () => {
      // Following links is only safe with a guard: a self-referential link
      // would otherwise spin forever in the middle of a release.
      await withTempDir(async (dir) => {
        await Deno.mkdir(`${dir}/nested`)
        await Deno.writeTextFile(`${dir}/nested/file.js`, 'x')
        await linkTo(dir, `${dir}/nested/loop`)
        assertEquals(typeof await computeFingerprint(dir, [`${dir}/nested`], FLAGS), 'string')
        await normalizeMtimes(dir, 0)
      })
    })

    await t.step('a dangling symlink is skipped instead of aborting the walk', async () => {
      // The deterministic stand-in for the race the walk has to survive: a
      // path that is gone by the time it is read. A real one is a concurrent
      // `npm install` moving files under node_modules mid-fingerprint; a link
      // whose target no longer exists reaches the same code paths, and the
      // whole release must not fall over because of either.
      await withTempDir(async (dir) => {
        await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
        const before = await computeFingerprint(dir, [], FLAGS)
        const gone = `${dir}/vanished`
        await Deno.writeTextFile(gone, 'v1')
        await linkTo(gone, `${dir}/dangling`)
        await Deno.remove(gone)
        // Same fingerprint as the tree without the link at all: neither the
        // dangling link nor its missing target contributes a digest line.
        assertEquals(await computeFingerprint(dir, [], FLAGS), before)
        // And the same holds when the dangling link is named as an embedded
        // input directly, plus for the mtime half of the cache.
        assertEquals(await computeFingerprint(dir, [`${dir}/dangling`], FLAGS), before)
        await normalizeMtimes(dir, 0)
      })
    })

    await t.step('a symlinked addon path counts as present', async () => {
      await withTempDir(async (dir) => {
        await withTempDir(async (real) => {
          await Deno.writeTextFile(`${real}/addon.node`, 'v1')
          await linkTo(`${real}/addon.node`, `${dir}/linked-addon`)
          await assertNativeAddonsPresent([`${dir}/linked-addon`])
        })
      })
    })
  }
})

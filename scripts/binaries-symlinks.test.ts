// Symlink behavior of the binary cache, kept apart from binaries.test.ts for
// one reason: creating a symlink requires Deno's *unscoped* `--allow-write`,
// and the main test task deliberately confines writes to the project. These
// steps therefore run under their own task (`deno task test:symlinks`, chained
// into `deno task test`) and skip themselves anywhere the permission is absent.
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

const FLAGS = '--fake-compile-flags'

// Unscoped write is what Deno.symlink needs; anything narrower fails with
// NotCapable regardless of where the link is being created.
const canSymlink = Deno.permissions.querySync({ name: 'write' }).state === 'granted'

await Deno.mkdir('./test/temp', { recursive: true })

const withTempDir = async (fn: (dir: string) => Promise<void>): Promise<void> => {
  const dir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    await fn(dir)
  } finally {
    await Deno.remove(dir, { recursive: true })
  }
}

// A relative symlink target is resolved against the link's own directory, so
// the temp paths below have to be made absolute or every link ends up dangling.
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

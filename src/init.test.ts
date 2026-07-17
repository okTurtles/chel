import { assert } from 'jsr:@std/assert'
import { assertEquals, assertRejects } from 'jsr:@std/assert'
import * as path from 'jsr:@std/path'
import * as toml from 'npm:smol-toml'
import { init } from './init.ts'

// Run `chel init` against a clean temporary working directory so the test
// never touches a real repo-local `chel.toml`. Each subtest gets its own
// subdir so we can also exercise the "refuse to overwrite" path. We put the
// temp dirs under `./test/temp/` (the project's scratch space, already covered
// by `deno task test`'s `--allow-write=.` permission) rather than the OS temp
// dir, which is outside the allowed write scope.
let tempCounter = 0
async function withTempCwd<T> (fn: (dir: string) => Promise<T>): Promise<T> {
  const base = path.resolve('test/temp')
  await Deno.mkdir(base, { recursive: true })
  const dir = path.join(base, `chel-init-test-${Date.now()}-${tempCounter++}`)
  await Deno.mkdir(dir, { recursive: true })
  const originalCwd = Deno.cwd()
  try {
    Deno.chdir(dir)
    return await fn(dir)
  } finally {
    Deno.chdir(originalCwd)
    await Deno.remove(dir, { recursive: true }).catch(() => {})
  }
}

Deno.test({
  name: 'chel init',
  async fn (t: Deno.TestContext) {
    await t.step('writes a chel.toml with a non-empty server_id', async () => {
      await withTempCwd(async () => {
        await init({} as never)

        const stat = await Deno.stat('chel.toml')
        assert(stat.isFile, 'chel.toml should exist and be a regular file')

        const contents = await Deno.readTextFile('chel.toml')
        const parsed = toml.parse(contents) as { server_id?: string }
        assert(
          typeof parsed.server_id === 'string' && parsed.server_id.length > 0,
          `server_id should be a non-empty string, got: ${JSON.stringify(parsed.server_id)}`
        )
        // Looks like a UUID produced by crypto.randomUUID()
        assert(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(parsed.server_id!),
          `server_id should be a UUID, got: ${parsed.server_id}`
        )
      })
    })

    await t.step('refuses to overwrite an existing chel.toml without --force', async () => {
      await withTempCwd(async () => {
        await init({} as never)
        const firstContents = await Deno.readTextFile('chel.toml')

        await assertRejects(
          () => init({} as never),
          Error,
          'Refusing to overwrite'
        )

        // Contents unchanged after the refused overwrite.
        assertEquals(await Deno.readTextFile('chel.toml'), firstContents)
      })
    })

    await t.step('overwrites an existing chel.toml when --force is given', async () => {
      await withTempCwd(async () => {
        await init({} as never)
        const firstContents = await Deno.readTextFile('chel.toml')

        // Small delay isn't needed: randomUUID is unique per call, so the
        // second invocation's server_id is guaranteed to differ.
        await init({ force: true } as never)
        const secondContents = await Deno.readTextFile('chel.toml')

        assert(firstContents !== secondContents, 'chel.toml should have changed after --force')

        const parsed = toml.parse(secondContents) as { server_id?: string }
        assert(
          typeof parsed.server_id === 'string' && parsed.server_id.length > 0,
          'server_id should be present after overwrite'
        )
      })
    })

    await t.step('writes the file at the resolved absolute path', async () => {
      await withTempCwd(async (dir) => {
        await init({} as never)
        const resolved = path.resolve('chel.toml')
        assertEquals(resolved, path.join(dir, 'chel.toml'))
        const stat = await Deno.stat(resolved)
        assert(stat.isFile, 'resolved chel.toml path should exist')
      })
    })
  }
})

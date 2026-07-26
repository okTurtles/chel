import { assert, assertEquals, assertRejects } from 'jsr:@std/assert'
import * as path from 'jsr:@std/path'
import * as toml from 'npm:smol-toml'
import { init } from './init.ts'
import { SERVER_DEFAULTS } from './parseConfig.ts'

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

    // Drift guard: the template in `init.ts` interpolates every default from
    // `SERVER_DEFAULTS` (single source of truth in `parseConfig.ts`). This
    // step fails if anyone hardcodes a value in the template instead of
    // interpolating, or if `SERVER_DEFAULTS` changes shape without updating
    // the template structure.
    await t.step('template values match SERVER_DEFAULTS (active and commented)', async () => {
      await withTempCwd(async () => {
        await init({} as never)
        const raw = await Deno.readTextFile('chel.toml')
        const parsed = toml.parse(raw) as Record<string, unknown> & {
          server?: Record<string, unknown>
          database?: Record<string, unknown>
        }

        assertEquals(parsed.server!.host, SERVER_DEFAULTS.server.host)
        assertEquals(parsed.server!.port, SERVER_DEFAULTS.server.port)
        assertEquals(parsed.server!.dashboardPort, SERVER_DEFAULTS.server.dashboardPort)
        assertEquals(parsed.database!.backend, SERVER_DEFAULTS.database.backend)

        const d = SERVER_DEFAULTS
        const expectedCommented = [
          `# appDir = "${d.server.appDir}"`,
          `# fileUploadMaxBytes = ${d.server.fileUploadMaxBytes}`,
          `# logLevel = "${d.server.logLevel}"`,
          `# maxEventsBatchSize = ${d.server.maxEventsBatchSize}`,
          `# archiveMode = ${d.server.archiveMode}`,
          `# reclaimForeignSubscriptions = ${d.server.reclaimForeignSubscriptions}`,
          `# disabled = ${d.server.signup.disabled}`,
          `# disabled = ${d.server.signup.limit.disabled}`,
          `# minute = ${d.server.signup.limit.minute}`,
          `# hour = ${d.server.signup.limit.hour}`,
          `# day = ${d.server.signup.limit.day}`,
          `# lruNumItems = ${d.database.lruNumItems}`
        ]
        for (const line of expectedCommented) {
          assert(raw.includes(line), `template should contain guidance line: ${line}`)
        }
      })
    })
  }
})

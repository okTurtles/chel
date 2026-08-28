// Regression test for archive mode: `startServer()` must not write to the
// database while the server is read-only.
//
// The database rejects every write in archive mode (see `chelonia.db/set` in
// database.ts), so any unconditional write during startup makes an archive
// server fail to boot. A persistent backend is required to reproduce this: the
// in-memory backend never installs the archive-mode guards.
//
// `jsr:@db/sqlite` is loaded purely to keep the Deno memory-leak checker happy
// (see other *.test.ts files in this directory).
import 'jsr:@db/sqlite'
import { assert, assertEquals } from 'jsr:@std/assert'
import process from 'node:process'
import sbp from 'npm:@sbp/sbp'
import { startIsolatedServer } from './server-test-helpers.ts'

// Deliberately not the default (10 MiB): finding this value in the database
// proves it came from the configuration rather than coinciding with the default
// in `config-defaults.ts`.
const FREE_ALLOWANCE_BYTES = 2 * 1024 * 1024

const configFor = (dirname: string, archiveMode: boolean): Record<string, unknown> => ({
  server_id: 'archive-mode-test-id',
  'server:host': '127.0.0.1',
  'server:port': 0,
  'server:appDir': '.',
  'server:archiveMode': archiveMode,
  'server:billing:freeAllowanceBytes': FREE_ALLOWANCE_BYTES,
  'server:messages': [],
  'database:backend': 'fs',
  'database:backendOptions': { fs: { dirname } },
  'database:lruNumItems': 100
})

Deno.test({
  name: 'archive mode server startup',
  async fn (t: Deno.TestContext) {
    // `test/temp` is inside the project, so `deno task test`'s `--allow-write=.`
    // covers it. `makeTempDir` does not create intermediate directories.
    await Deno.mkdir('./test/temp', { recursive: true })
    const dirname = await Deno.makeTempDir({ dir: './test/temp', prefix: 'archive-mode-' })
    const previousNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    try {
      await t.step('a writable server populates the database', async () => {
        const server = await startIsolatedServer(configFor(dirname, false))
        try {
          assert(server.uri.startsWith('http://127.0.0.1:'))
          // The free allowance is persisted for the credits worker to read
          assertEquals(
            await sbp('chelonia.db/get', '_private_freeAllowanceBytes'),
            String(FREE_ALLOWANCE_BYTES)
          )
        } finally {
          await server.stop()
        }
      })

      await t.step('the same database can then be served in archive mode', async () => {
        // Before the startup write was made conditional this threw
        // 'Unable to write in archive mode'
        const server = await startIsolatedServer(configFor(dirname, true))
        try {
          assert(server.uri.startsWith('http://127.0.0.1:'))
        } finally {
          await server.stop()
        }
      })
    } finally {
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV
      else process.env.NODE_ENV = previousNodeEnv
      await Deno.remove(dirname, { recursive: true })
    }
  }
})

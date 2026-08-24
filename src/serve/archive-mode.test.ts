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
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import process from 'node:process'
import sbp from 'npm:@sbp/sbp'
import { startServer, stopServer } from './index.ts'

const FREE_ALLOWANCE_BYTES = 10 * 1024 * 1024

// nconf is process-global and its `defaults` store is read-only, so a writable
// store is used to override settings for this file and the keys are cleared
// again afterwards.
const CONFIG_KEYS = [
  'server_id',
  'server:host',
  'server:port',
  'server:appDir',
  'server:archiveMode',
  'server:billing:freeAllowanceBytes',
  'server:messages',
  'database:backend',
  'database:backendOptions',
  'database:lruNumItems'
]

const applyConfig = (dirname: string, archiveMode: boolean): void => {
  nconf.use('memory')
  nconf.set('server_id', 'archive-mode-test-id')
  nconf.set('server:host', '127.0.0.1')
  nconf.set('server:port', 0)
  nconf.set('server:appDir', '.')
  nconf.set('server:archiveMode', archiveMode)
  nconf.set('server:billing:freeAllowanceBytes', FREE_ALLOWANCE_BYTES)
  nconf.set('server:messages', [])
  nconf.set('database:backend', 'fs')
  nconf.set('database:backendOptions', { fs: { dirname } })
  nconf.set('database:lruNumItems', 100)
}

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
        applyConfig(dirname, false)
        const { uri } = await startServer({ installSignalHandlers: false })
        try {
          assert(uri.startsWith('http://127.0.0.1:'))
          // The free allowance is persisted for the credits worker to read
          assertEquals(
            await sbp('chelonia.db/get', '_private_freeAllowanceBytes'),
            String(FREE_ALLOWANCE_BYTES)
          )
        } finally {
          await stopServer()
        }
      })

      await t.step('the same database can then be served in archive mode', async () => {
        // Before the startup write was made conditional this threw
        // 'Unable to write in archive mode'
        applyConfig(dirname, true)
        const { uri } = await startServer({ installSignalHandlers: false })
        try {
          assert(uri.startsWith('http://127.0.0.1:'))
        } finally {
          await stopServer()
        }
      })
    } finally {
      for (const key of CONFIG_KEYS) nconf.clear(key)
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV
      else process.env.NODE_ENV = previousNodeEnv
      await Deno.remove(dirname, { recursive: true })
    }
  }
})

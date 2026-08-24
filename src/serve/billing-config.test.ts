// The credits worker runs in its own Worker thread, with a separate module
// instance and therefore no access to nconf, so
// `server.billing.freeAllowanceBytes` is persisted to the database at startup
// and re-read by the worker every billing cycle (see creditsWorker.ts). These
// tests verify that contract from the main process: the key must exist and
// hold the configured value as a decimal string once the server has started.
// (creditsWorker.ts cannot be imported directly here because registering its
// `chelonia.db/*` RPC selector would shadow the real database selectors.)
//
// `jsr:@db/sqlite` is loaded purely to keep the Deno memory-leak checker happy
// (see other *.test.ts files in this directory).
import 'jsr:@db/sqlite'
import { assertEquals } from 'jsr:@std/assert'
import { sbp, startTestServer, stopTestServer } from './routes-test-helpers.ts'
Deno.test({
  name: 'billing configuration',
  async fn (t: Deno.TestContext) {
    await startTestServer()

    try {
      await t.step('server persists the free allowance at startup', async () => {
        const stored = await sbp('chelonia.db/get', '_private_freeAllowanceBytes')
        // 10 MiB, matching the test-server default in routes-test-helpers.ts
        assertEquals(stored, String(10 * 1024 * 1024))
      })
    } finally {
      await stopTestServer()
    }
  }
})

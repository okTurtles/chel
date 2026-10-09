// The dashboard is a single page app, so every path under /dashboard has to
// answer with index.html, or reloading any page but the landing one is a 404.
import { assert, assertEquals } from 'jsr:@std/assert'
import { existsSync } from 'node:fs'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { getDashboardPath, startDashboard } from './dashboard-server.ts'

Deno.test({
  name: 'dashboard server',
  async fn (t: Deno.TestContext) {
    // `deno task test` doesn't build it, so say so rather than fail every step
    assert(
      existsSync(getDashboardPath()),
      'build/dist-dashboard is missing, run `deno task build` first'
    )

    nconf.use('memory')
    nconf.set('server:dashboardPort', 0)
    nconf.set('server:host', '127.0.0.1')
    const server = await startDashboard()
    const { port } = server.address() as { port: number }
    const get = (p: string) => fetch(`http://127.0.0.1:${port}${p}`)

    try {
      const pages = [
        '/dashboard', '/dashboard/', '/dashboard/main', '/dashboard/contracts',
        '/dashboard/no-such-page'
      ]
      for (const page of pages) {
        await t.step(`${page} answers with the app`, async () => {
          const res = await get(page)
          const body = await res.text()
          assertEquals(res.status, 200)
          assert(body.includes('<div id="app"'), 'expected index.html')
        })
      }

      await t.step('the app script is served', async () => {
        const res = await get('/assets/js/main.js')
        await res.body?.cancel()
        assertEquals(res.status, 200)
        assert(res.headers.get('content-type')?.includes('javascript'))
      })
    } finally {
      await new Promise((resolve) => server.close(resolve))
      nconf.clear('server:dashboardPort')
      nconf.clear('server:host')
    }
  }
})

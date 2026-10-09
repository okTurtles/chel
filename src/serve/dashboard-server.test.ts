// The dashboard is a single page app, so every path under /dashboard has to
// answer with index.html, or reloading any page but the landing one is a 404.
// Its data shows usernames, storage and credits, so it needs a password.
import { assert, assertEquals } from 'jsr:@std/assert'
import { Buffer } from 'node:buffer'
import { existsSync } from 'node:fs'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { getDashboardPath, startDashboard } from './dashboard-server.ts'
import { createTestContractRegistration, startTestServer, stopTestServer } from './routes-test-helpers.ts'

const PASSWORD = 'a long dashboard password'

const startOnFreePort = async (password?: string | number) => {
  nconf.use('memory')
  nconf.set('server:dashboardPort', 0)
  nconf.set('server:dashboardListenIP', '127.0.0.1')
  if (password) nconf.set('server:dashboardAdminPassword', password)
  else nconf.clear('server:dashboardAdminPassword')
  const server = await startDashboard()
  const { port } = server.address() as { port: number }
  const get = (p: string, headers: Record<string, string> = {}) =>
    fetch(`http://127.0.0.1:${port}${p}`, { headers })
  const stop = async () => {
    await new Promise((resolve) => server.close(resolve))
    for (const key of ['dashboardPort', 'dashboardListenIP', 'dashboardAdminPassword']) {
      nconf.clear(`server:${key}`)
    }
  }
  return { get, stop }
}

// Only the password is checked, so any user name works
// Browsers send it as UTF-8, which `btoa` can't encode
const asAdmin = (password = PASSWORD) =>
  ({ authorization: 'Basic ' + Buffer.from(`anyone:${password}`).toString('base64') })

Deno.test({
  name: 'dashboard server',
  async fn (t: Deno.TestContext) {
    // `deno task test` doesn't build it, so say so rather than fail every step
    assert(
      existsSync(getDashboardPath()),
      'build/dist-dashboard is missing, run `deno task build` first'
    )

    const { get, stop } = await startOnFreePort()

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

      await t.step('without a password, there is no data', async () => {
        const res = await get('/api/users')
        assertEquals(res.status, 403)
        assertEquals(await res.json(), { error: 'no-password' })
      })
    } finally {
      await stop()
    }
  }
})

Deno.test({
  name: 'dashboard data',
  async fn (t: Deno.TestContext) {
    const baseURL = await startTestServer()
    const { serialized, contractID } = await createTestContractRegistration({
      name: 'com.example/dashboard-identity'
    })
    const registered = await fetch(`${baseURL}/event`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'shelter-namespace-registration': 'dashboard-user' },
      body: serialized
    })
    assertEquals(registered.status, 200, await registered.text())

    const { get, stop } = await startOnFreePort(PASSWORD)

    try {
      await t.step('pages and data ask for the password', async () => {
        for (const [path, headers] of [
          ['/dashboard/main', {}],
          ['/api/users', {}],
          ['/api/users', asAdmin('not the password')]
        ] as const) {
          const res = await get(path, headers)
          await res.body?.cancel()
          assertEquals(res.status, 401, path)
          assertEquals(res.headers.get('www-authenticate'), 'Basic realm="Chelonia dashboard"')
        }
        const res = await get('/dashboard/main', asAdmin())
        await res.body?.cancel()
        assertEquals(res.status, 200)
      })

      await t.step('lists the user with what it owns', async () => {
        const users = await (await get('/api/users', asAdmin())).json()
        const user = users.find((u: { username: string }) => u.username === 'dashboard-user')
        assertEquals(user.contractID, contractID)
        assertEquals(user.deleted, false)
        assertEquals(user.ownedContracts, 0)
        assertEquals(user.ownedFiles, 0)
        assertEquals(user.picocredits, '0')
        assertEquals(typeof user.size, 'number')
      })

      await t.step('lists the contract with its type and size', async () => {
        const contracts = await (await get('/api/contracts', asAdmin())).json()
        const contract = contracts.find((c: { contractID: string }) => c.contractID === contractID)
        assertEquals(contract.type, 'com.example/dashboard-identity')
        assertEquals(contract.messages, 1)
        assertEquals(contract.name, 'dashboard-user')
        assertEquals(contract.owner, null)
        assert(contract.size > 0, 'expected the first message to be counted')
      })

      await t.step('counts them in the overview', async () => {
        const overview = await (await get('/api/overview', asAdmin())).json()
        assert(overview.users >= 1)
        assert(overview.contracts >= 1)
        assert(overview.newestUsers.some((u: { username: string }) => u.username === 'dashboard-user'))
        assertEquals(typeof overview.storage.total, 'number')
      })

      await t.step('shows the manifest the contract was written with', async () => {
        const res = await get(`/api/contracts/${contractID}/manifest`, asAdmin())
        assertEquals(res.status, 200)
        const { manifest } = await res.json()
        assertEquals(JSON.parse(manifest.body).name, 'com.example/dashboard-identity')
      })

      await t.step('anything else under /api is a 404', async () => {
        for (const path of ['/api/nope', '/api/contracts/not-a-cid/manifest']) {
          const res = await get(path, asAdmin())
          assertEquals(res.status, 404, path)
          assertEquals(await res.json(), { error: 'not-found' })
        }
      })
    } finally {
      await stop()
      await stopTestServer()
    }
  }
})

Deno.test({
  name: 'dashboard password from the environment',
  async fn () {
    // nconf parses environment values, so this one arrives as a number
    const { get, stop } = await startOnFreePort(12345678)
    try {
      // Read rather than cancelled: a cancelled body keeps fetch's connection
      // open, and closing the server then waits for it
      const denied = await get('/dashboard/main')
      await denied.text()
      assertEquals(denied.status, 401)
      const allowed = await get('/dashboard/main', asAdmin('12345678'))
      await allowed.text()
      assertEquals(allowed.status, 200)
    } finally {
      await stop()
    }
  }
})

Deno.test({
  name: 'dashboard password with any characters',
  async fn (t: Deno.TestContext) {
    const password = 'pässwörd: with spaces'
    const { get, stop } = await startOnFreePort(password)
    // Bodies are read rather than cancelled, for the same reason as above
    const status = async (headers: Record<string, string>) => {
      const res = await get('/dashboard/main', headers)
      await res.text()
      return res.status
    }
    try {
      await t.step('the whole password counts, colons and all', async () => {
        assertEquals(await status(asAdmin(password)), 200)
        // Same length, one letter off
        assertEquals(await status(asAdmin('Pässwörd: with spaces')), 401)
        assertEquals(await status(asAdmin('pässwörd')), 401)
        assertEquals(await status(asAdmin(password + ' ')), 401)
      })

      await t.step('anything that isn\'t Basic auth is refused', async () => {
        const encoded = Buffer.from(password).toString('base64')
        for (const authorization of [
          `Bearer ${encoded}`, `Basic ${encoded}`, 'Basic', 'Basic !!!', 'Basic '
        ]) {
          assertEquals(await status({ authorization }), 401, authorization)
        }
      })
    } finally {
      await stop()
    }
  }
})

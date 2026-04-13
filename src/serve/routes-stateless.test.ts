import 'jsr:@db/sqlite'
import { startTestServer, stopTestServer } from './routes-test-helpers.ts'

Deno.test({
  name: 'routes: stateless endpoints',
  sanitizeResources: false,
  sanitizeOps: false,
  async fn (t: Deno.TestContext) {
    const baseURL = await startTestServer()

    try {
      await t.step('GET /time returns ISO timestamp', async () => {
        const res = await fetch(`${baseURL}/time`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.text()
        const parsed = new Date(body)
        if (isNaN(parsed.getTime())) throw new Error(`Response is not a valid ISO date: ${body}`)
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('text/plain')) {
          throw new Error(`Expected text/plain content-type but got ${contentType}`)
        }
      })

      await t.step('GET /time has Cache-Control: no-store', async () => {
        const res = await fetch(`${baseURL}/time`)
        await res.body?.cancel()
        const cacheControl = res.headers.get('cache-control')
        if (!cacheControl || !cacheControl.includes('no-store')) {
          throw new Error(`Expected Cache-Control no-store but got ${cacheControl}`)
        }
      })

      await t.step('GET /time has X-Frame-Options: DENY', async () => {
        const res = await fetch(`${baseURL}/time`)
        await res.body?.cancel()
        const xfo = res.headers.get('x-frame-options')
        if (xfo !== 'DENY') {
          throw new Error(`Expected X-Frame-Options DENY but got ${xfo}`)
        }
      })

      await t.step('GET /serverMessages returns configured messages', async () => {
        const res = await fetch(`${baseURL}/serverMessages`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.json()
        if (!Array.isArray(body)) throw new Error('Expected array response')
        if (body.length !== 1) throw new Error(`Expected 1 message but got ${body.length}`)
        if (body[0].type !== 'info') throw new Error(`Expected type 'info' but got ${body[0].type}`)
        if (body[0].text !== 'test message') throw new Error(`Expected text 'test message' but got ${body[0].text}`)
      })

      await t.step('GET /serverMessages has Cache-Control: no-store', async () => {
        const res = await fetch(`${baseURL}/serverMessages`)
        await res.body?.cancel()
        const cacheControl = res.headers.get('cache-control')
        if (!cacheControl || !cacheControl.includes('no-store')) {
          throw new Error(`Expected Cache-Control no-store but got ${cacheControl}`)
        }
      })

      await t.step('POST /streams-test with "ok" returns 204', async () => {
        const res = await fetch(`${baseURL}/streams-test`, {
          method: 'POST',
          body: 'ok',
          headers: { 'content-type': 'application/octet-stream' }
        })
        await res.body?.cancel()
        if (res.status !== 204) throw new Error(`Expected 204 but got ${res.status}`)
      })

      await t.step('POST /streams-test with wrong body returns 400', async () => {
        const res = await fetch(`${baseURL}/streams-test`, {
          method: 'POST',
          body: 'wrong',
          headers: { 'content-type': 'application/octet-stream' }
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /streams-test with empty body returns 400', async () => {
        const res = await fetch(`${baseURL}/streams-test`, {
          method: 'POST',
          body: '',
          headers: { 'content-type': 'application/octet-stream' }
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /log with valid payload returns 200', async () => {
        const res = await fetch(`${baseURL}/log`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ level: 'info', value: 'test log message' })
        })
        await res.body?.cancel()
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
      })

      await t.step('POST /log with missing level returns 400', async () => {
        const res = await fetch(`${baseURL}/log`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ value: 'test log message' })
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /log with missing value returns 400', async () => {
        const res = await fetch(`${baseURL}/log`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ level: 'info' })
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /name with invalid name format returns 400', async () => {
        const res = await fetch(`${baseURL}/name/INVALID_NAME!!`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /name with valid but unregistered name returns 404', async () => {
        const res = await fetch(`${baseURL}/name/nonexistentuser`)
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })
    } finally {
      await stopTestServer()
    }
  }
})

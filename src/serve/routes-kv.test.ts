import 'jsr:@db/sqlite'
import {
  buildShelterAuthHeader,
  buildSignedKvPayload,
  createCID,
  createTestIdentity,
  multicodes,
  sbp,
  startTestServer,
  stopTestServer
} from './routes-test-helpers.ts'

Deno.test({
  name: 'routes: KV store endpoints',
  async fn (t: Deno.TestContext) {
    const baseURL = await startTestServer()

    try {
      const owner = createTestIdentity()

      await t.step('setup: register billable entity for owner', async () => {
        await sbp('chelonia.db/set', owner.contractID, 'identity-contract-data')
        await sbp('chelonia.db/set', `head=${owner.contractID}`, JSON.stringify({
          HEAD: createCID('owner-head', multicodes.SHELTER_CONTRACT_DATA),
          previousKeyOp: null,
          height: 0
        }))
      })

      await t.step('POST /kv without auth returns 401', async () => {
        const cid = createCID('kv-contract', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/kv/${cid}/mykey`, {
          method: 'POST',
          headers: { 'content-type': 'application/octet-stream', 'if-match': '*' },
          body: 'test'
        })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /kv with auth but mismatched contractID returns 401', async () => {
        const other = createTestIdentity()
        const otherAuth = buildShelterAuthHeader(other.contractID, other.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/mykey`, {
          method: 'POST',
          headers: {
            authorization: otherAuth,
            'content-type': 'application/octet-stream',
            'if-match': '*'
          },
          body: 'test'
        })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /kv without If-Match header returns 400', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/mykey`, {
          method: 'POST',
          headers: { authorization: auth, 'content-type': 'application/octet-stream' },
          body: 'test'
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /kv with invalid key (_private prefix) returns 400', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/_private_secret`, {
          method: 'POST',
          headers: {
            authorization: auth,
            'content-type': 'application/octet-stream',
            'if-match': '*'
          },
          body: 'test'
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /kv with wrong CID type returns 400', async () => {
        const fileCID = createCID('not-contract', multicodes.SHELTER_FILE_MANIFEST)
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${fileCID}/mykey`, {
          method: 'POST',
          headers: {
            authorization: auth,
            'content-type': 'application/octet-stream',
            'if-match': '*'
          },
          body: 'test'
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /kv with valid signed payload stores value and returns 204', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const payload = buildSignedKvPayload(owner.contractID, 'testkey', 0, { hello: 'world' }, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          method: 'POST',
          headers: {
            authorization: auth,
            'content-type': 'application/octet-stream',
            'if-match': '*'
          },
          body: payload
        })
        await res.body?.cancel()
        if (res.status !== 204) throw new Error(`Expected 204 but got ${res.status}`)
        const postEtag = res.headers.get('etag')
        const postCid = res.headers.get('x-cid')
        if (!postEtag) throw new Error('Expected ETag header on 204')
        if (!postCid) throw new Error('Expected x-cid header on 204')
        if (postEtag !== postCid) throw new Error('Expected x-cid to match ETag on 204')
        // Round-trip: a subsequent GET must compute the same CID the POST returned.
        const getRes = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          headers: { authorization: buildShelterAuthHeader(owner.contractID, owner.SAK) }
        })
        const getCid = getRes.headers.get('x-cid')
        await getRes.body?.cancel()
        if (getCid !== postCid) throw new Error('POST x-cid must match subsequent GET x-cid')
      })

      await t.step('GET /kv without auth returns 401', async () => {
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`)
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('GET /kv with valid auth returns stored value with ETag', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          headers: { authorization: auth }
        })
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.text()
        if (!body) throw new Error('Expected non-empty body')
        const etag = res.headers.get('etag')
        if (!etag) throw new Error('Expected ETag header')
        const xcid = res.headers.get('x-cid')
        if (!xcid) throw new Error('Expected x-cid header')
        if (!etag.startsWith('W/') && etag !== xcid) throw new Error('Expected x-cid to match ETag')
      })

      await t.step('GET /kv with valid auth for nonexistent key returns 404', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/nonexistent`, {
          headers: { authorization: auth }
        })
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })

      await t.step('POST /kv with mismatched ETag returns 412 with current value', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const payload = buildSignedKvPayload(owner.contractID, 'testkey', 0, { updated: true }, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          method: 'POST',
          headers: {
            authorization: auth,
            'content-type': 'application/octet-stream',
            'if-match': '"wrong-etag"'
          },
          body: payload
        })
        if (res.status !== 412) throw new Error(`Expected 412 but got ${res.status}`)
        const body = await res.text()
        if (!body) throw new Error('Expected response body with current value')
        const xcid = res.headers.get('x-cid')
        if (!xcid) throw new Error('Expected x-cid header on 412')
      })

      await t.step('POST /kv with matching ETag updates value', async () => {
        const auth1 = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const getRes = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          headers: { authorization: auth1 }
        })
        const etag = getRes.headers.get('etag')
        const xcid = getRes.headers.get('x-cid')
        await getRes.body?.cancel()
        if (!xcid) throw new Error('Expected x-cid from GET')
        if (!etag) throw new Error('Expected ETag from GET')
        if (!etag.startsWith('W/') && etag !== xcid) throw new Error('Expected x-cid to match ETag')

        const auth2 = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const payload = buildSignedKvPayload(owner.contractID, 'testkey', 0, { updated: true }, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          method: 'POST',
          headers: {
            authorization: auth2,
            'content-type': 'application/octet-stream',
            'if-match': xcid
          },
          body: payload
        })
        await res.body?.cancel()
        if (res.status !== 204) throw new Error(`Expected 204 but got ${res.status}`)
        // The POST response must carry the new ETag/x-cid for the stored value.
        const updatedCid = res.headers.get('x-cid')
        const updatedEtag = res.headers.get('etag')
        if (!updatedCid) throw new Error('Expected x-cid header from update')
        if (!updatedEtag) throw new Error('Expected ETag header from update')
        if (updatedEtag !== updatedCid) throw new Error('Expected x-cid to match ETag on update')
        // Feed the POST-returned ETag straight back into the next if-match to
        // prove the write-then-write workflow round-trips without a GET.
        const auth3 = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const payload2 = buildSignedKvPayload(owner.contractID, 'testkey', 0, { again: 1 }, owner.SAK)
        const res2 = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          method: 'POST',
          headers: {
            authorization: auth3,
            'content-type': 'application/octet-stream',
            'if-match': updatedCid
          },
          body: payload2
        })
        await res2.body?.cancel()
        if (res2.status !== 204) throw new Error(`Expected 204 using POST-returned ETag but got ${res2.status}`)
      })

      await t.step('POST /kv with wrong height returns 409', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const payload = buildSignedKvPayload(owner.contractID, 'testkey', 999, { bad: true }, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          method: 'POST',
          headers: {
            authorization: auth,
            'content-type': 'application/octet-stream',
            'if-match': '*'
          },
          body: payload
        })
        if (res.status !== 409) throw new Error(`Expected 409 but got ${res.status}`)
        await res.body?.cancel()
      })

      await t.step('POST /kv with invalid payload returns 422', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/kv/${owner.contractID}/testkey`, {
          method: 'POST',
          headers: {
            authorization: auth,
            'content-type': 'application/octet-stream',
            'if-match': '*'
          },
          body: 'not-valid-json'
        })
        await res.body?.cancel()
        if (res.status !== 422) throw new Error(`Expected 422 but got ${res.status}`)
      })
    } finally {
      await stopTestServer()
    }
  }
})

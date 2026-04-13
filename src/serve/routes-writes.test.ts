import 'jsr:@db/sqlite'
import {
  blake32Hash,
  buildShelterAuthHeader,
  createCID,
  createTestIdentity,
  multicodes,
  sbp,
  startTestServer,
  stopTestServer
} from './routes-test-helpers.ts'

Deno.test({
  name: 'routes: write endpoints',
  sanitizeResources: false,
  sanitizeOps: false,
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

      await t.step('POST /dev-file with valid hash and data returns file path', async () => {
        const data = 'dev-file-test-content'
        const hash = createCID(data, multicodes.SHELTER_FILE_CHUNK)
        const form = new FormData()
        form.append('hash', hash)
        form.append('data', data)
        const res = await fetch(`${baseURL}/dev-file`, {
          method: 'POST',
          body: form
        })
        const body = await res.text()
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}: ${body}`)
        if (body !== `/file/${hash}`) {
          throw new Error(`Expected /file/${hash} but got ${body}`)
        }
      })

      await t.step('POST /dev-file with missing hash returns 400', async () => {
        const form = new FormData()
        form.append('data', 'some-data')
        const res = await fetch(`${baseURL}/dev-file`, {
          method: 'POST',
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /dev-file with missing data returns 400', async () => {
        const form = new FormData()
        form.append('hash', createCID('test', multicodes.SHELTER_FILE_CHUNK))
        const res = await fetch(`${baseURL}/dev-file`, {
          method: 'POST',
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /dev-file with mismatched hash returns 400', async () => {
        const data = 'actual-data'
        const wrongHash = createCID('different-data', multicodes.SHELTER_FILE_CHUNK)
        const form = new FormData()
        form.append('hash', wrongHash)
        form.append('data', data)
        const res = await fetch(`${baseURL}/dev-file`, {
          method: 'POST',
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /dev-file with invalid hash returns 400', async () => {
        const form = new FormData()
        form.append('hash', 'not-a-valid-cid')
        form.append('data', 'some-data')
        const res = await fetch(`${baseURL}/dev-file`, {
          method: 'POST',
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /dev-file stored file is retrievable via GET /file', async () => {
        const data = 'retrievable-dev-file'
        const hash = createCID(data, multicodes.SHELTER_FILE_MANIFEST)
        const form = new FormData()
        form.append('hash', hash)
        form.append('data', data)
        const uploadRes = await fetch(`${baseURL}/dev-file`, {
          method: 'POST',
          body: form
        })
        if (uploadRes.status !== 200) throw new Error(`Upload failed: ${uploadRes.status}`)
        await uploadRes.body?.cancel()

        const getRes = await fetch(`${baseURL}/file/${hash}`)
        if (getRes.status !== 200) throw new Error(`GET failed: ${getRes.status}`)
        const body = await getRes.text()
        if (body !== data) throw new Error(`Expected ${data} but got ${body}`)
      })

      await t.step('GET /ownResources without auth returns 401', async () => {
        const res = await fetch(`${baseURL}/ownResources`)
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('GET /ownResources with invalid auth returns 401', async () => {
        const res = await fetch(`${baseURL}/ownResources`, {
          headers: { authorization: 'shelter invalid-token' }
        })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('GET /ownResources with valid auth returns empty array initially', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/ownResources`, {
          headers: { authorization: auth }
        })
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.json()
        if (!Array.isArray(body)) throw new Error('Expected array')
      })

      await t.step('GET /ownResources returns owned resources after seeding', async () => {
        const resourceID = createCID('owned-resource-1', multicodes.SHELTER_FILE_MANIFEST)
        await sbp('chelonia.db/set', `_private_owner_${resourceID}`, owner.contractID)
        await sbp('chelonia.db/set', `_private_resources_${owner.contractID}`, resourceID)

        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/ownResources`, {
          headers: { authorization: auth }
        })
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.json()
        if (!Array.isArray(body)) throw new Error('Expected array')
        if (!body.includes(resourceID)) {
          throw new Error(`Expected resources to include ${resourceID}`)
        }
      })

      await t.step('POST /deleteFile without auth returns 401', async () => {
        const hash = createCID('some-file', multicodes.SHELTER_FILE_MANIFEST)
        const res = await fetch(`${baseURL}/deleteFile/${hash}`, { method: 'POST' })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /deleteFile with wrong CID type returns 400', async () => {
        const hash = createCID('test', multicodes.SHELTER_CONTRACT_DATA)
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/deleteFile/${hash}`, {
          method: 'POST',
          headers: { authorization: auth }
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /deleteFile with nonexistent file returns 404', async () => {
        const hash = createCID('nonexistent-file', multicodes.SHELTER_FILE_MANIFEST)
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/deleteFile/${hash}`, {
          method: 'POST',
          headers: { authorization: auth }
        })
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })

      await t.step('POST /deleteFile with shelter auth deletes owned file', async () => {
        const chunkData = 'chunk-to-delete'
        const chunkHash = createCID(chunkData, multicodes.SHELTER_FILE_CHUNK)
        await sbp('chelonia.db/set', chunkHash, chunkData)

        const manifestData = JSON.stringify({
          version: '1.0.0',
          cipher: 'aes256gcm',
          size: chunkData.length,
          chunks: [[chunkData.length, chunkHash]]
        })
        const manifestHash = createCID(manifestData, multicodes.SHELTER_FILE_MANIFEST)
        await sbp('chelonia.db/set', manifestHash, manifestData)
        await sbp('chelonia.db/set', `_private_owner_${manifestHash}`, owner.contractID)
        await sbp('chelonia.db/set', `_private_size_${manifestHash}`, String(chunkData.length + manifestData.length))

        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/deleteFile/${manifestHash}`, {
          method: 'POST',
          headers: { authorization: auth }
        })
        await res.body?.cancel()
        if (res.status < 200 || res.status > 204) throw new Error(`Expected 2xx but got ${res.status}`)

        const getRes = await fetch(`${baseURL}/file/${manifestHash}`)
        await getRes.body?.cancel()
        if (getRes.status !== 410) throw new Error(`Expected 410 after deletion but got ${getRes.status}`)
      })

      await t.step('POST /deleteFile with bearer token deletes file', async () => {
        const chunkData2 = 'chunk-to-delete-bearer'
        const chunkHash2 = createCID(chunkData2, multicodes.SHELTER_FILE_CHUNK)
        await sbp('chelonia.db/set', chunkHash2, chunkData2)

        const manifestData2 = JSON.stringify({
          version: '1.0.0',
          cipher: 'aes256gcm',
          size: chunkData2.length,
          chunks: [[chunkData2.length, chunkHash2]]
        })
        const manifestHash2 = createCID(manifestData2, multicodes.SHELTER_FILE_MANIFEST)
        await sbp('chelonia.db/set', manifestHash2, manifestData2)
        await sbp('chelonia.db/set', `_private_owner_${manifestHash2}`, owner.contractID)
        await sbp('chelonia.db/set', `_private_size_${manifestHash2}`, String(chunkData2.length + manifestData2.length))

        const deletionToken = 'my-secret-deletion-token'
        const tokenDigest = blake32Hash(deletionToken)
        await sbp('chelonia.db/set', `_private_deletionTokenDgst_${manifestHash2}`, tokenDigest)

        const res = await fetch(`${baseURL}/deleteFile/${manifestHash2}`, {
          method: 'POST',
          headers: { authorization: `bearer ${deletionToken}` }
        })
        await res.body?.cancel()
        if (res.status < 200 || res.status > 204) throw new Error(`Expected 2xx but got ${res.status}`)
      })

      await t.step('POST /deleteFile with wrong bearer token returns 401', async () => {
        const chunkData3 = 'chunk-bearer-wrong'
        const chunkHash3 = createCID(chunkData3, multicodes.SHELTER_FILE_CHUNK)
        await sbp('chelonia.db/set', chunkHash3, chunkData3)

        const manifestData3 = JSON.stringify({
          version: '1.0.0',
          cipher: 'aes256gcm',
          size: chunkData3.length,
          chunks: [[chunkData3.length, chunkHash3]]
        })
        const manifestHash3 = createCID(manifestData3, multicodes.SHELTER_FILE_MANIFEST)
        await sbp('chelonia.db/set', manifestHash3, manifestData3)
        await sbp('chelonia.db/set', `_private_owner_${manifestHash3}`, owner.contractID)
        const tokenDigest3 = blake32Hash('correct-token')
        await sbp('chelonia.db/set', `_private_deletionTokenDgst_${manifestHash3}`, tokenDigest3)

        const res = await fetch(`${baseURL}/deleteFile/${manifestHash3}`, {
          method: 'POST',
          headers: { authorization: 'bearer wrong-token' }
        })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /deleteFile with non-owner shelter auth returns 401', async () => {
        const nonOwner = createTestIdentity()
        const chunkData4 = 'chunk-non-owner'
        const chunkHash4 = createCID(chunkData4, multicodes.SHELTER_FILE_CHUNK)
        await sbp('chelonia.db/set', chunkHash4, chunkData4)

        const manifestData4 = JSON.stringify({
          version: '1.0.0',
          cipher: 'aes256gcm',
          size: chunkData4.length,
          chunks: [[chunkData4.length, chunkHash4]]
        })
        const manifestHash4 = createCID(manifestData4, multicodes.SHELTER_FILE_MANIFEST)
        await sbp('chelonia.db/set', manifestHash4, manifestData4)
        await sbp('chelonia.db/set', `_private_owner_${manifestHash4}`, owner.contractID)

        const auth = buildShelterAuthHeader(nonOwner.contractID, nonOwner.SAK)
        const res = await fetch(`${baseURL}/deleteFile/${manifestHash4}`, {
          method: 'POST',
          headers: { authorization: auth }
        })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /deleteContract without auth returns 401', async () => {
        const hash = createCID('some-contract', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/deleteContract/${hash}`, { method: 'POST' })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /deleteContract with _private prefix returns 404', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const res = await fetch(`${baseURL}/deleteContract/_private_something`, {
          method: 'POST',
          headers: { authorization: auth }
        })
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })

      await t.step('POST /deleteContract with nonexistent contract returns 404', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const hash = createCID('nonexistent-contract', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/deleteContract/${hash}`, {
          method: 'POST',
          headers: { authorization: auth }
        })
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })

      await t.step('POST /deleteContract with bearer token and matching deletion token returns 202', async () => {
        const contractData = 'deletable-contract-data'
        const contractCID = createCID(contractData, multicodes.SHELTER_CONTRACT_DATA)
        await sbp('chelonia.db/set', contractCID, contractData)
        await sbp('chelonia.db/set', `head=${contractCID}`, JSON.stringify({
          HEAD: createCID('del-head', multicodes.SHELTER_CONTRACT_DATA),
          previousKeyOp: null,
          height: 0
        }))
        await sbp('chelonia.db/set', `_private_owner_${contractCID}`, owner.contractID)

        const deletionToken = 'contract-deletion-token'
        const tokenDigest = blake32Hash(deletionToken)
        await sbp('chelonia.db/set', `_private_deletionTokenDgst_${contractCID}`, tokenDigest)

        const res = await fetch(`${baseURL}/deleteContract/${contractCID}`, {
          method: 'POST',
          headers: { authorization: `bearer ${deletionToken}` }
        })
        const body = await res.json()
        if (res.status !== 202) throw new Error(`Expected 202 but got ${res.status}`)
        if (!body.id) throw new Error('Expected response to have an id field')
      })

      await t.step('POST /deleteContract with wrong bearer token returns 401', async () => {
        const contractData = 'contract-wrong-bearer'
        const contractCID = createCID(contractData, multicodes.SHELTER_CONTRACT_DATA)
        await sbp('chelonia.db/set', contractCID, contractData)
        await sbp('chelonia.db/set', `_private_owner_${contractCID}`, owner.contractID)
        const tokenDigest = blake32Hash('the-right-token')
        await sbp('chelonia.db/set', `_private_deletionTokenDgst_${contractCID}`, tokenDigest)

        const res = await fetch(`${baseURL}/deleteContract/${contractCID}`, {
          method: 'POST',
          headers: { authorization: 'bearer wrong-token' }
        })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /event with invalid payload returns 400', async () => {
        const res = await fetch(`${baseURL}/event`, {
          method: 'POST',
          headers: { 'content-type': 'text/plain' },
          body: ''
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /event with non-JSON payload returns 500', async () => {
        const res = await fetch(`${baseURL}/event`, {
          method: 'POST',
          headers: { 'content-type': 'text/plain' },
          body: 'not-json-at-all'
        })
        await res.body?.cancel()
        if (res.status !== 500) throw new Error(`Expected 500 but got ${res.status}`)
      })

      await t.step('POST /file without auth returns 401', async () => {
        const form = new FormData()
        form.append('manifest', new Blob(['{}'], { type: 'application/json' }), 'manifest.json')
        const res = await fetch(`${baseURL}/file`, {
          method: 'POST',
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 401) throw new Error(`Expected 401 but got ${res.status}`)
      })

      await t.step('POST /file with auth but missing manifest returns 400', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const form = new FormData()
        form.append('notmanifest', new Blob(['data'], { type: 'application/octet-stream' }), 'something.bin')
        const res = await fetch(`${baseURL}/file`, {
          method: 'POST',
          headers: { authorization: auth },
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /file with wrong manifest filename returns 400', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const form = new FormData()
        form.append('manifest', new Blob(['{}'], { type: 'application/vnd.shelter.filemanifest' }), 'wrong.json')
        const res = await fetch(`${baseURL}/file`, {
          method: 'POST',
          headers: { authorization: auth },
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /file with invalid manifest JSON returns 422', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const form = new FormData()
        form.append('manifest', new Blob(['not-json'], { type: 'application/vnd.shelter.filemanifest' }), 'manifest.json')
        const res = await fetch(`${baseURL}/file`, {
          method: 'POST',
          headers: { authorization: auth },
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 422) throw new Error(`Expected 422 but got ${res.status}`)
      })

      await t.step('POST /file with unsupported manifest version returns 422', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const manifest = JSON.stringify({ version: '2.0.0', cipher: 'aes256gcm', chunks: [[1, 'z']] })
        const form = new FormData()
        form.append('manifest', new Blob([manifest], { type: 'application/vnd.shelter.filemanifest' }), 'manifest.json')
        const res = await fetch(`${baseURL}/file`, {
          method: 'POST',
          headers: { authorization: auth },
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 422) throw new Error(`Expected 422 but got ${res.status}`)
      })

      await t.step('POST /file with valid manifest and chunk uploads file', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const chunkContent = new Uint8Array([72, 101, 108, 108, 111])
        const chunkHash = createCID(chunkContent, multicodes.SHELTER_FILE_CHUNK)
        const manifest = JSON.stringify({
          version: '1.0.0',
          cipher: 'aes256gcm',
          size: chunkContent.byteLength,
          chunks: [[chunkContent.byteLength, chunkHash]]
        })
        const form = new FormData()
        form.append('manifest', new Blob([manifest], { type: 'application/vnd.shelter.filemanifest' }), 'manifest.json')
        form.append('0', new Blob([chunkContent], { type: 'application/octet-stream' }), '0')
        const res = await fetch(`${baseURL}/file`, {
          method: 'POST',
          headers: { authorization: auth },
          body: form
        })
        const body = await res.text()
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}: ${body}`)
        const manifestHash = createCID(new TextEncoder().encode(manifest), multicodes.SHELTER_FILE_MANIFEST)
        if (body !== manifestHash) {
          throw new Error(`Expected manifest hash ${manifestHash} but got ${body}`)
        }

        const getRes = await fetch(`${baseURL}/file/${manifestHash}`)
        if (getRes.status !== 200) throw new Error(`GET file failed: ${getRes.status}`)
        await getRes.body?.cancel()
      })

      await t.step('POST /file rejects duplicate upload', async () => {
        const auth = buildShelterAuthHeader(owner.contractID, owner.SAK)
        const chunkContent = new Uint8Array([72, 101, 108, 108, 111])
        const chunkHash = createCID(chunkContent, multicodes.SHELTER_FILE_CHUNK)
        const manifest = JSON.stringify({
          version: '1.0.0',
          cipher: 'aes256gcm',
          size: chunkContent.byteLength,
          chunks: [[chunkContent.byteLength, chunkHash]]
        })
        const form = new FormData()
        form.append('manifest', new Blob([manifest], { type: 'application/vnd.shelter.filemanifest' }), 'manifest.json')
        form.append('0', new Blob([chunkContent], { type: 'application/octet-stream' }), '0')
        const res = await fetch(`${baseURL}/file`, {
          method: 'POST',
          headers: { authorization: auth },
          body: form
        })
        await res.body?.cancel()
        if (res.status !== 500) throw new Error(`Expected 500 for duplicate but got ${res.status}`)
      })
    } finally {
      await stopTestServer()
    }
  }
})

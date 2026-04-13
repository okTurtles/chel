import 'jsr:@db/sqlite'
import {
  createCID,
  multicodes,
  sbp,
  startTestServer,
  stopTestServer
} from './routes-test-helpers.ts'

Deno.test({
  name: 'routes: state-dependent reads',
  sanitizeResources: false,
  sanitizeOps: false,
  async fn (t: Deno.TestContext) {
    const baseURL = await startTestServer()

    try {
      const testContractData = 'test-contract-data-content'
      const testContractID = createCID(testContractData, multicodes.SHELTER_CONTRACT_DATA)
      const testFileContent = '{"version":"1.0.0","cipher":"aes256gcm","chunks":[]}'
      const testFileManifestHash = createCID(testFileContent, multicodes.SHELTER_FILE_MANIFEST)
      const testChunkContent = 'binary-chunk-data'
      const testChunkHash = createCID(testChunkContent, multicodes.SHELTER_FILE_CHUNK)
      const testEntryContent = JSON.stringify({
        head: JSON.stringify({
          version: '1.0.0',
          previousHEAD: null,
          contractID: testContractID,
          op: 'c',
          manifest: testContractID,
          height: 0
        }),
        signedMessageData: 'test-signed-data'
      })
      const testEntryHash = createCID(testEntryContent, multicodes.SHELTER_CONTRACT_DATA)

      await t.step('setup: seed DB with test data', async () => {
        await sbp('backend/db/registerName', 'testuser', testContractID)
        await sbp('chelonia.db/set', testContractID, testContractData)
        await sbp('chelonia.db/set', testFileManifestHash, testFileContent)
        await sbp('chelonia.db/set', testChunkHash, testChunkContent)
        await sbp('chelonia.db/set', `head=${testContractID}`, JSON.stringify({
          HEAD: testEntryHash,
          previousKeyOp: null,
          height: 0
        }))
        await sbp('chelonia.db/set', testEntryHash, testEntryContent)
        await sbp('chelonia.db/set', `_private_hidx=${testContractID}#0`, JSON.stringify({
          hash: testEntryHash,
          date: new Date().toISOString()
        }))
      })

      await t.step('GET /name/{name} returns contract ID for registered name', async () => {
        const res = await fetch(`${baseURL}/name/testuser`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.text()
        if (body !== testContractID) {
          throw new Error(`Expected ${testContractID} but got ${body}`)
        }
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('text/plain')) {
          throw new Error(`Expected text/plain but got ${contentType}`)
        }
      })

      await t.step('GET /latestHEADinfo with non-CID param returns 400', async () => {
        const res = await fetch(`${baseURL}/latestHEADinfo/not-a-valid-cid`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /latestHEADinfo with wrong CID type returns 400', async () => {
        const wrongTypeCID = createCID('test', multicodes.SHELTER_FILE_MANIFEST)
        const res = await fetch(`${baseURL}/latestHEADinfo/${wrongTypeCID}`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /latestHEADinfo with unknown contractID returns 404', async () => {
        const unknownCID = createCID('unknown-contract', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/latestHEADinfo/${unknownCID}`)
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })

      await t.step('GET /latestHEADinfo returns HEADinfo for known contract', async () => {
        const res = await fetch(`${baseURL}/latestHEADinfo/${testContractID}`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.json()
        if (body.HEAD !== testEntryHash) {
          throw new Error(`Expected HEAD ${testEntryHash} but got ${body.HEAD}`)
        }
        if (body.height !== 0) {
          throw new Error(`Expected height 0 but got ${body.height}`)
        }
      })

      await t.step('GET /latestHEADinfo has Cache-Control: no-store', async () => {
        const res = await fetch(`${baseURL}/latestHEADinfo/${testContractID}`)
        await res.body?.cancel()
        const cacheControl = res.headers.get('cache-control')
        if (!cacheControl || !cacheControl.includes('no-store')) {
          throw new Error(`Expected Cache-Control no-store but got ${cacheControl}`)
        }
      })

      await t.step('GET /latestHEADinfo returns 410 for deleted contract', async () => {
        const deletedContractData = 'deleted-contract-data'
        const deletedContractID = createCID(deletedContractData, multicodes.SHELTER_CONTRACT_DATA)
        await sbp('chelonia.db/set', `head=${deletedContractID}`, '')
        const res = await fetch(`${baseURL}/latestHEADinfo/${deletedContractID}`)
        await res.body?.cancel()
        if (res.status !== 410) throw new Error(`Expected 410 but got ${res.status}`)
      })

      await t.step('GET /file/{hash} with unknown hash returns 404', async () => {
        const unknownHash = createCID('nonexistent-file', multicodes.SHELTER_FILE_MANIFEST)
        const res = await fetch(`${baseURL}/file/${unknownHash}`)
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })

      await t.step('GET /file/{hash} with invalid CID returns 400', async () => {
        const res = await fetch(`${baseURL}/file/not-a-valid-cid`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /file/{hash} returns file manifest with correct content-type', async () => {
        const res = await fetch(`${baseURL}/file/${testFileManifestHash}`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.text()
        if (body !== testFileContent) {
          throw new Error(`Expected file content but got ${body}`)
        }
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/vnd.shelter.filemanifest+json')) {
          throw new Error(`Expected filemanifest content-type but got ${contentType}`)
        }
      })

      await t.step('GET /file/{hash} returns chunk with correct content-type', async () => {
        const res = await fetch(`${baseURL}/file/${testChunkHash}`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.text()
        if (body !== testChunkContent) {
          throw new Error(`Expected chunk content but got ${body}`)
        }
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/vnd.shelter.filechunk+octet-stream')) {
          throw new Error(`Expected filechunk content-type but got ${contentType}`)
        }
      })

      await t.step('GET /file/{hash} has immutable Cache-Control and ETag', async () => {
        const res = await fetch(`${baseURL}/file/${testFileManifestHash}`)
        await res.body?.cancel()
        const cacheControl = res.headers.get('cache-control')
        if (!cacheControl || !cacheControl.includes('immutable')) {
          throw new Error(`Expected immutable Cache-Control but got ${cacheControl}`)
        }
        const etag = res.headers.get('etag')
        if (!etag) {
          throw new Error('Expected ETag header but none found')
        }
      })

      await t.step('GET /file/{hash} has CSP and nosniff headers', async () => {
        const res = await fetch(`${baseURL}/file/${testFileManifestHash}`)
        await res.body?.cancel()
        const csp = res.headers.get('content-security-policy')
        if (!csp || !csp.includes('default-src \'none\'')) {
          throw new Error(`Expected restrictive CSP but got ${csp}`)
        }
        const nosniff = res.headers.get('x-content-type-options')
        if (nosniff !== 'nosniff') {
          throw new Error(`Expected nosniff but got ${nosniff}`)
        }
      })

      await t.step('GET /file/{hash} returns 410 for deleted file', async () => {
        const deletedFileData = 'deleted-file-data'
        const deletedFileHash = createCID(deletedFileData, multicodes.SHELTER_FILE_MANIFEST)
        await sbp('chelonia.db/set', deletedFileHash, '')
        const res = await fetch(`${baseURL}/file/${deletedFileHash}`)
        await res.body?.cancel()
        if (res.status !== 410) throw new Error(`Expected 410 but got ${res.status}`)
      })

      await t.step('GET /file/{hash} returns contract data content-type', async () => {
        const res = await fetch(`${baseURL}/file/${testContractID}`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/vnd.shelter.contractdata+json')) {
          throw new Error(`Expected contractdata content-type but got ${contentType}`)
        }
        await res.body?.cancel()
      })

      await t.step('GET /eventsAfter with invalid contractID returns 400', async () => {
        const res = await fetch(`${baseURL}/eventsAfter/not-a-cid/0`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /eventsAfter with wrong CID type returns 400', async () => {
        const wrongTypeCID = createCID('test', multicodes.SHELTER_FILE_MANIFEST)
        const res = await fetch(`${baseURL}/eventsAfter/${wrongTypeCID}/0`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /eventsAfter with unknown contractID returns 404', async () => {
        const unknownCID = createCID('unknown-events', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/eventsAfter/${unknownCID}/0`)
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
        await res.body?.cancel()
      })

      await t.step('GET /eventsAfter returns JSON array with HEADinfo headers for known contract', async () => {
        const res = await fetch(`${baseURL}/eventsAfter/${testContractID}/0`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.text()
        const parsed = JSON.parse(body)
        if (!Array.isArray(parsed)) throw new Error('Expected JSON array response')
        const headinfoHead = res.headers.get('shelter-headinfo-head')
        if (headinfoHead !== testEntryHash) {
          throw new Error(`Expected shelter-headinfo-head ${testEntryHash} but got ${headinfoHead}`)
        }
        const headinfoHeight = res.headers.get('shelter-headinfo-height')
        if (headinfoHeight !== '0') {
          throw new Error(`Expected shelter-headinfo-height 0 but got ${headinfoHeight}`)
        }
      })

      await t.step('GET /eventsAfter with height beyond contract returns empty array', async () => {
        const res = await fetch(`${baseURL}/eventsAfter/${testContractID}/999`)
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.text()
        const parsed = JSON.parse(body)
        if (!Array.isArray(parsed)) throw new Error('Expected JSON array response')
        if (parsed.length !== 0) throw new Error(`Expected 0 entries but got ${parsed.length}`)
      })

      await t.step('GET /eventsAfter with invalid since param returns 400', async () => {
        const res = await fetch(`${baseURL}/eventsAfter/${testContractID}/not-a-number`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /eventsAfter returns 410 for deleted contract', async () => {
        const deletedData = 'deleted-events-contract'
        const deletedCID = createCID(deletedData, multicodes.SHELTER_CONTRACT_DATA)
        await sbp('chelonia.db/set', `head=${deletedCID}`, '')
        const res = await fetch(`${baseURL}/eventsAfter/${deletedCID}/0`)
        if (res.status !== 410) throw new Error(`Expected 410 but got ${res.status}`)
        await res.body?.cancel()
      })
    } finally {
      await stopTestServer()
    }
  }
})

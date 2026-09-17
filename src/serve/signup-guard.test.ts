// Tests for the ownerless-first-message guards in `signup-guard.ts`.
//
// These used to be inline in the `POST /event` handler, reachable only through
// a fully signed registration message, so the malformed-manifest cases could
// not be covered directly. In particular, the hashes a manifest names are used
// as database keys, and an unvalidated hash could name any key at all.
//
// `jsr:@db/sqlite` is loaded purely to keep the Deno memory-leak checker happy
// (see other *.test.ts files in this directory).
import 'jsr:@db/sqlite'
import { assertEquals, assertRejects } from 'jsr:@std/assert'
import { createCID, multicodes } from 'npm:@chelonia/lib/functions'
import sbp from 'npm:@sbp/sbp'
import { HTTPException } from 'npm:hono/http-exception'
import { closeDB, initDB } from './database.ts'
import { assertContractSourcesWithinCap, parseContractSourceHashes } from './signup-guard.ts'

// A manifest as `chel manifest` writes it: the interesting part for these
// guards is the `contract` / `contractSlim` hashes inside the signed body.
const manifestWith = (body: Record<string, unknown>): string => {
  return JSON.stringify({
    head: JSON.stringify({ manifestVersion: '1.0.0' }),
    body: JSON.stringify(body),
    signature: { keyId: 'unused-by-these-guards', value: 'unused-by-these-guards' }
  })
}

const storeSource = async (contents: string): Promise<string> => {
  const hash = createCID(contents, multicodes.SHELTER_CONTRACT_TEXT)
  await sbp('chelonia.db/set', hash, contents)
  return hash
}

const assertStatus = async (status: number, fn: () => unknown | Promise<unknown>) => {
  const error = await assertRejects(async () => await fn(), HTTPException)
  assertEquals(error.status, status)
}

Deno.test({
  name: 'signup guard: contract source hashes',
  async fn (t: Deno.TestContext) {
    await initDB()

    try {
      const contractHash = await storeSource('export default {} // full')
      const slimHash = await storeSource('export default {} // slim')

      await t.step('a manifest naming a contract source yields its hash', () => {
        assertEquals(
          parseContractSourceHashes(manifestWith({ contract: { hash: contractHash } })),
          [contractHash]
        )
      })

      await t.step('a slim build is included, so that it is size-checked too', () => {
        assertEquals(
          parseContractSourceHashes(manifestWith({
            contract: { hash: contractHash },
            contractSlim: { hash: slimHash }
          })),
          [contractHash, slimHash]
        )
      })

      await t.step('a manifest that cannot be read is rejected', async () => {
        // The size check cannot be performed without the manifest, so these are
        // rejected here rather than left to fail later while being processed
        for (const manifest of [null, undefined, '', 'not json', '{}', '{"body":"not json"}']) {
          await assertStatus(422, () => parseContractSourceHashes(manifest))
        }
      })

      await t.step('a manifest that does not name a contract source is rejected', async () => {
        for (const body of [{}, { contract: {} }, { contract: { hash: 42 } }, { contract: null }]) {
          await assertStatus(422, () => parseContractSourceHashes(manifestWith(body)))
        }
      })

      await t.step('a present but unusable slim entry is rejected, not skipped', async () => {
        // Silently ignoring it would leave the slim source out of the size check
        await assertStatus(422, () => parseContractSourceHashes(manifestWith({
          contract: { hash: contractHash },
          contractSlim: { file: 'contract-slim.js' }
        })))
      })

      await t.step('a hash that is not a contract source CID is rejected', async () => {
        // Otherwise these strings would be used as database keys verbatim, so a
        // manifest could point the size check at arbitrary keys and learn
        // something about their contents from the accept/reject outcome
        const notContractSources = [
          '_private_freeAllowanceBytes',
          'head=zSomeContractID',
          // Syntactically a CID, but for a different kind of object
          createCID('some contract data', multicodes.SHELTER_CONTRACT_DATA),
          createCID(manifestWith({ contract: { hash: contractHash } }), multicodes.SHELTER_CONTRACT_MANIFEST)
        ]
        for (const hash of notContractSources) {
          await assertStatus(422, () => parseContractSourceHashes(manifestWith({ contract: { hash } })))
          await assertStatus(422, () => parseContractSourceHashes(manifestWith({
            contract: { hash: contractHash },
            contractSlim: { hash }
          })))
        }
      })
    } finally {
      await closeDB()
    }
  }
})

Deno.test({
  name: 'signup guard: contract source size cap',
  async fn (t: Deno.TestContext) {
    await initDB()

    try {
      const small = await storeSource('x'.repeat(100))
      const large = await storeSource('y'.repeat(400))

      await t.step('sizes are summed across all sources', async () => {
        assertEquals(await assertContractSourcesWithinCap([small, large], 1000), 500)
      })

      await t.step('a total exactly at the cap is accepted', async () => {
        assertEquals(await assertContractSourcesWithinCap([small, large], 500), 500)
      })

      await t.step('a total over the cap is rejected with 413', async () => {
        // Neither source exceeds the cap on its own here; only their sum does
        await assertStatus(413, () => assertContractSourcesWithinCap([small, large], 499))
      })

      await t.step('reading stops at the first source that crosses the cap', async () => {
        // A missing source would be a 422, so getting a 413 shows the second
        // source was never read
        await assertStatus(413, () => assertContractSourcesWithinCap([large, 'never-read'], 100))
      })

      await t.step('a source that is not deployed is rejected with 422', async () => {
        const undeployed = createCID('never stored', multicodes.SHELTER_CONTRACT_TEXT)
        await assertStatus(422, () => assertContractSourcesWithinCap([undeployed], 1000))
      })
    } finally {
      await closeDB()
    }
  }
})

import 'jsr:@db/sqlite'
import { Buffer } from 'node:buffer'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import {
  buildShelterAuthHeader,
  createCID,
  createTestContractRegistration,
  createTestIdentity,
  multicodes,
  sbp,
  startTestServer,
  stopTestServer
} from './routes-test-helpers.ts'

// Tests for unattributed (ownerless) first messages, i.e. identity contract
// registration. Registration used to require the manifest name to be exactly
// 'gi.contracts/identity'; it is now name-agnostic and guarded only by the
// signup size caps (see POST /event in src/serve/routes.ts).
Deno.test({
  name: 'routes: signup (unattributed contract registration)',
  async fn (t: Deno.TestContext) {
    const baseURL = await startTestServer()

    const postEvent = (body: string, headers: Record<string, string> = {}) => {
      return fetch(`${baseURL}/event`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
        body
      })
    }

    try {
      await t.step('unattributed first message with a non-identity contract name is accepted', async () => {
        // Before the name check was removed this exact request returned 401
        // ('This contract type requires ownership information')
        const { serialized, contractID } = await createTestContractRegistration({
          name: 'com.example/custom-identity'
        })
        const res = await postEvent(serialized)
        const body = await res.text()
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}: ${body}`)
        if (body !== contractID) throw new Error(`Expected ${contractID} but got ${body}`)

        // The contract became a billable entity and its size was recorded
        const billableEntities = await sbp('chelonia.db/get', '_private_billable_entities')
        if (!(billableEntities as string | null)?.split('\x00').includes(contractID)) {
          throw new Error(`Expected ${contractID} to be registered as a billable entity`)
        }
        const size = await sbp('chelonia.db/get', `_private_size_${contractID}`)
        if (size !== String(Buffer.byteLength(serialized))) {
          throw new Error(`Expected size ${Buffer.byteLength(serialized)} but got ${size}`)
        }
      })

      await t.step('a realistic registration fits comfortably under the message size cap', async () => {
        // The other steps use a minimal one-key first message, which says
        // nothing about whether the default cap is usable in practice. A real
        // registration carries several keys, each with its encrypted private
        // half, so this step pins the default against a realistic payload: if
        // clients grow their key set enough to cross the cap, every signup
        // starts failing with a 413, and this fails first.
        const maxFirstMessageBytes = 5 * 1024
        const { serialized, contractID } = await createTestContractRegistration({
          name: 'com.example/realistic-identity',
          keys: 'realistic'
        })
        const payloadBytes = Buffer.byteLength(serialized)
        if (payloadBytes > maxFirstMessageBytes * 0.75) {
          throw new Error(
            `A realistic registration is ${payloadBytes} bytes, leaving too little headroom under the ${maxFirstMessageBytes} byte cap`
          )
        }
        const res = await postEvent(serialized)
        const body = await res.text()
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}: ${body}`)
        if (body !== contractID) throw new Error(`Expected ${contractID} but got ${body}`)
      })

      await t.step('unattributed first message over the message size cap returns 413', async () => {
        const maxFirstMessageBytes = 5 * 1024
        const { serialized, contractID } = await createTestContractRegistration({
          name: 'com.example/too-large-message',
          messagePaddingBytes: maxFirstMessageBytes
        })
        if (Buffer.byteLength(serialized) <= maxFirstMessageBytes) {
          throw new Error(`Expected payload (${Buffer.byteLength(serialized)} bytes) to exceed the cap`)
        }
        const res = await postEvent(serialized)
        await res.body?.cancel()
        if (res.status !== 413) throw new Error(`Expected 413 but got ${res.status}`)

        // Nothing was registered
        const billableEntities = await sbp('chelonia.db/get', '_private_billable_entities')
        if ((billableEntities as string | null)?.split('\x00').includes(contractID)) {
          throw new Error('Expected over-sized message to not be registered')
        }
      })

      await t.step('contract source over the size cap returns 413', async () => {
        const maxContractSizeBytes = 500 * 1024
        const { serialized } = await createTestContractRegistration({
          name: 'com.example/too-large-source',
          sourceBytes: maxContractSizeBytes + 1
        })
        const res = await postEvent(serialized)
        await res.body?.cancel()
        if (res.status !== 413) throw new Error(`Expected 413 but got ${res.status}`)
      })

      await t.step('slim contract source counts toward the size cap', async () => {
        const maxContractSizeBytes = 500 * 1024
        // Each source is under the cap on its own; only their sum exceeds it
        const { serialized } = await createTestContractRegistration({
          name: 'com.example/too-large-total',
          sourceBytes: maxContractSizeBytes / 2 + 1,
          slimSourceBytes: maxContractSizeBytes / 2 + 1
        })
        const res = await postEvent(serialized)
        await res.body?.cancel()
        if (res.status !== 413) throw new Error(`Expected 413 but got ${res.status}`)
      })

      await t.step('a manifest with an unusable contractSlim entry returns 422', async () => {
        // Rejected rather than silently skipped: otherwise the slim source
        // would escape the size check
        const { serialized } = await createTestContractRegistration({
          name: 'com.example/bad-slim',
          malformedContractSlim: true
        })
        const res = await postEvent(serialized)
        await res.body?.cancel()
        if (res.status !== 422) throw new Error(`Expected 422 but got ${res.status}`)
      })

      await t.step('unattributed first message without a deployed manifest returns 422', async () => {
        // The size-cap branch requires the manifest (and its sources) to
        // already be deployed on the server; a missing one is bad data
        const { serialized } = await createTestContractRegistration({
          name: 'com.example/undeployed'
        })
        const head = JSON.parse(JSON.parse(serialized).head)
        await sbp('chelonia.db/delete', head.manifest)
        const res = await postEvent(serialized)
        await res.body?.cancel()
        if (res.status !== 422) throw new Error(`Expected 422 but got ${res.status}`)
      })

      await t.step('namespace registration works for a differently named identity contract', async () => {
        const { serialized, contractID } = await createTestContractRegistration({
          name: 'com.example/custom-identity-ns'
        })
        const res = await postEvent(serialized, { 'shelter-namespace-registration': 'customname' })
        const body = await res.text()
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}: ${body}`)

        const nameRes = await fetch(`${baseURL}/name/customname`)
        const nameBody = await nameRes.text()
        if (nameRes.status !== 200) throw new Error(`Expected 200 but got ${nameRes.status}`)
        if (nameBody !== contractID) throw new Error(`Expected ${contractID} but got ${nameBody}`)
      })

      await t.step('namespace registration is skipped for attributed contracts', async () => {
        const owner = createTestIdentity()
        await sbp('chelonia.db/set', owner.contractID, 'identity-contract-data')
        await sbp('chelonia.db/set', `head=${owner.contractID}`, JSON.stringify({
          HEAD: createCID('signup-owner-head', multicodes.SHELTER_CONTRACT_DATA),
          previousKeyOp: null,
          height: 0
        }))

        const { serialized, contractID } = await createTestContractRegistration({
          name: 'com.example/attributed'
        })
        const res = await postEvent(serialized, {
          authorization: buildShelterAuthHeader(owner.contractID, owner.SAK),
          'shelter-namespace-registration': 'attributedname'
        })
        const body = await res.text()
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}: ${body}`)

        // The message itself was accepted and attributed to the owner
        const attributedTo = await sbp('chelonia.db/get', `_private_owner_${contractID}`)
        if (attributedTo !== owner.contractID) {
          throw new Error(`Expected attribution to ${owner.contractID} but got ${attributedTo}`)
        }
        // ...but the name registration was silently ignored
        const nameRes = await fetch(`${baseURL}/name/attributedname`)
        await nameRes.body?.cancel()
        if (nameRes.status !== 404) throw new Error(`Expected 404 but got ${nameRes.status}`)
      })

      await t.step('the signup kill switch is checked before any manifest read', async () => {
        // Requests that are rejected outright must not be able to trigger the
        // manifest and contract source reads: a request whose manifest is not
        // even deployed (which would otherwise be a 422) gets the 403 instead
        const { serialized } = await createTestContractRegistration({
          name: 'com.example/disabled-signup'
        })
        const head = JSON.parse(JSON.parse(serialized).head)
        await sbp('chelonia.db/delete', head.manifest)
        nconf.set('server:signup:disabled', true)
        try {
          const res = await postEvent(serialized)
          await res.body?.cancel()
          if (res.status !== 403) throw new Error(`Expected 403 but got ${res.status}`)
        } finally {
          nconf.clear('server:signup:disabled')
        }
      })
    } finally {
      await stopTestServer()
    }
  }
})

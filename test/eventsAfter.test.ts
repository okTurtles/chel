// Tests for `chel eventsAfter` decryption pipeline.
//
// The fixture chain is built at runtime using `@chelonia/lib` primitives so
// it stays consistent with the installed library version (no committed
// snapshot to keep in sync). It contains a minimal contract with one
// `OP_CONTRACT`, one standalone `OP_ACTION_ENCRYPTED`, and one `OP_ATOMIC`
// containing two encrypted sub-ops, all signed/encrypted with synthetic keys
// whose serialized secret halves are then fed to `decryptEnvelopes`
// through a `--keys`-style map.

import { assertEquals, assertExists, assertStringIncludes } from 'jsr:@std/assert'
import { keygen, keyId, serializeKey, EDWARDS25519SHA512BATCH, CURVE25519XSALSA20POLY1305 } from 'npm:@chelonia/crypto'
import { SPMessage } from 'npm:@chelonia/lib/SPMessage'
import { signedOutgoingData } from 'npm:@chelonia/lib/signedData'
import { encryptedOutgoingData } from 'npm:@chelonia/lib/encryptedData'

import { decryptEnvelopes, loadSecretKeys } from '../src/eventsAfter.ts'

// Build a tiny encrypted contract chain in memory and return both the
// envelope objects (as `decryptEnvelopes` expects) and the secretKeys map.
function buildFixture() {
  const sigKey = keygen(EDWARDS25519SHA512BATCH)
  const encKey = keygen(CURVE25519XSALSA20POLY1305)
  const sigKeyId = keyId(sigKey)
  const encKeyId = keyId(encKey)

  const additionalKeys: Record<string, string> = {
    [sigKeyId]: serializeKey(sigKey, true),
    [encKeyId]: serializeKey(encKey, true)
  }

  // SPMessage.deserialize derives _vm.authorizedKeys for OP_CONTRACT itself,
  // so we don't need to hand-build a state for the contract message — just
  // a state object that signedOutgoingData/encryptedOutgoingData can read
  // off of when serializing.
  const initialState = {
    _vm: {
      type: 'test.contract',
      authorizedKeys: {
        [sigKeyId]: {
          id: sigKeyId,
          name: 'sig',
          purpose: ['sig'],
          ringLevel: 0,
          permissions: '*',
          data: serializeKey(sigKey, false),
          _notBeforeHeight: 0
        },
        [encKeyId]: {
          id: encKeyId,
          name: 'enc',
          purpose: ['enc'],
          ringLevel: 0,
          permissions: '*',
          data: serializeKey(encKey, false),
          _notBeforeHeight: 0
        }
      }
    }
  } as unknown

  const contractKeys = [
    {
      id: sigKeyId,
      name: 'sig',
      purpose: ['sig'],
      ringLevel: 0,
      permissions: '*',
      data: serializeKey(sigKey, false),
      _notBeforeHeight: 0
    },
    {
      id: encKeyId,
      name: 'enc',
      purpose: ['enc'],
      ringLevel: 0,
      permissions: '*',
      data: serializeKey(encKey, false),
      _notBeforeHeight: 0
    }
  ]

  // OP_CONTRACT
  const contractMsg = SPMessage.createV1_0({
    contractID: null,
    height: 0,
    op: [
      SPMessage.OP_CONTRACT,
      // deno-lint-ignore no-explicit-any
      signedOutgoingData(initialState as any, sigKeyId, {
        type: 'test.contract',
        keys: contractKeys
        // deno-lint-ignore no-explicit-any
      } as any, additionalKeys) as any
    ],
    manifest: 'z9999fakemanifest'
  })
  const contractID = contractMsg.hash()

  // OP_ACTION_ENCRYPTED
  const plaintext = { action: 'TestAction', data: { hello: 'world', n: 42 }, meta: {} }
  const actionMsg = SPMessage.createV1_0({
    contractID,
    height: 1,
    previousHEAD: contractMsg.hash(),
    op: [
      SPMessage.OP_ACTION_ENCRYPTED,
      // deno-lint-ignore no-explicit-any
      signedOutgoingData(initialState as any, sigKeyId,
        // deno-lint-ignore no-explicit-any
        encryptedOutgoingData(initialState as any, encKeyId, plaintext) as any,
        additionalKeys
        // deno-lint-ignore no-explicit-any
      ) as any
    ],
    manifest: 'z9999fakemanifest'
  })

  // OP_ATOMIC bundling two encrypted actions
  const atomicPlaintextA = { action: 'AtomicA', data: { x: 1 }, meta: {} }
  const atomicPlaintextB = { action: 'AtomicB', data: { y: 2 }, meta: {} }
  const atomicMsg = SPMessage.createV1_0({
    contractID,
    height: 2,
    previousHEAD: actionMsg.hash(),
    op: [
      SPMessage.OP_ATOMIC,
      // deno-lint-ignore no-explicit-any
      signedOutgoingData(initialState as any, sigKeyId, [
        [
          SPMessage.OP_ACTION_ENCRYPTED,
          // deno-lint-ignore no-explicit-any
          encryptedOutgoingData(initialState as any, encKeyId, atomicPlaintextA) as any
        ],
        [
          SPMessage.OP_ACTION_ENCRYPTED,
          // deno-lint-ignore no-explicit-any
          encryptedOutgoingData(initialState as any, encKeyId, atomicPlaintextB) as any
        ]
        // deno-lint-ignore no-explicit-any
      ] as any, additionalKeys) as any
    ],
    manifest: 'z9999fakemanifest'
  })

  const envelopes = [contractMsg, actionMsg, atomicMsg].map((m) => JSON.parse(m.serialize()))

  return {
    envelopes,
    additionalKeys,
    sigKeyId,
    encKeyId,
    contractID,
    plaintext,
    atomicPlaintextA,
    atomicPlaintextB
  }
}

Deno.test({
  name: 'eventsAfter decryption',
  async fn(t) {
    const f = buildFixture()

    await t.step('decrypts an OP_ACTION_ENCRYPTED with the right keys', async () => {
      const out = await decryptEnvelopes(f.envelopes, f.additionalKeys)
      assertEquals(out.length, 3)

      const contract = out[0]
      assertEquals(contract.op, SPMessage.OP_CONTRACT)
      assertEquals(contract.contractID, f.contractID)
      assertEquals(contract.error, undefined)
      assertExists(contract.decryptedValue)

      const action = out[1]
      assertEquals(action.op, SPMessage.OP_ACTION_ENCRYPTED)
      assertEquals(action.contractID, f.contractID)
      assertEquals(action.error, undefined)
      assertEquals(action.decryptedValue, f.plaintext)
    })

    await t.step('decrypts the local-DB wrapper shape', async () => {
      // `backend/db/streamEntriesAfter` returns each entry as
      // { serverMeta, message: "<serialized envelope>" }; make sure
      // decryptEnvelopes handles that without triggering
      // `"undefined" is not valid JSON`, AND preserves the original
      // wrapper (including `serverMeta`) on `raw`.
      const wrapped = f.envelopes.map((env, i) => ({
        serverMeta: { foo: 'bar', i },
        message: JSON.stringify(env)
      }))
      const out = await decryptEnvelopes(wrapped, f.additionalKeys)
      assertEquals(out.length, 3)
      assertEquals(out[1].error, undefined)
      assertEquals(out[1].decryptedValue, f.plaintext)
      // The full original wrapper must be preserved on `raw` so consumers
      // still see `serverMeta` and the un-decrypted `message`.
      assertEquals(out[1].raw, wrapped[1])
      assertEquals(out[0].raw, wrapped[0])
    })

    await t.step('decrypts each sub-op of OP_ATOMIC', async () => {
      const out = await decryptEnvelopes(f.envelopes, f.additionalKeys)
      const atomic = out[2]
      assertEquals(atomic.op, SPMessage.OP_ATOMIC)
      assertEquals(atomic.error, undefined)
      assertExists(atomic.ops)
      assertEquals(atomic.ops!.length, 2)
      assertEquals(atomic.ops![0].op, SPMessage.OP_ACTION_ENCRYPTED)
      assertEquals(atomic.ops![0].decryptedValue, f.atomicPlaintextA)
      assertEquals(atomic.ops![1].op, SPMessage.OP_ACTION_ENCRYPTED)
      assertEquals(atomic.ops![1].decryptedValue, f.atomicPlaintextB)
    })

    await t.step('emits raw when decryption keys are absent', async () => {
      const out = await decryptEnvelopes(f.envelopes, {})
      // The OP_CONTRACT case still carries authorizedKeys inside itself, so
      // its signature can be verified without `additionalKeys`. The encrypted
      // action however cannot be decrypted, so we expect `decryptedValue` to
      // be undefined for it, while preserving the original envelope on `raw`.
      assertEquals(out.length, 3)
      assertEquals(out[1].op, SPMessage.OP_ACTION_ENCRYPTED)
      assertEquals(out[1].decryptedValue, undefined)
      assertEquals(out[1].raw, f.envelopes[1])
    })
  }
})

Deno.test({
  name: 'loadSecretKeys validation',
  async fn(t) {
    const tmp = await Deno.makeTempDir({ dir: './test' })
    try {
      await t.step('parses a valid keys file', async () => {
        const path = `${tmp}/ok.json`
        await Deno.writeTextFile(path, JSON.stringify({ a: 'serialized-a', b: 'serialized-b' }))
        const result = await loadSecretKeys(path, { internal: true })
        assertEquals(result, { a: 'serialized-a', b: 'serialized-b' })
      })

      await t.step('rejects non-object JSON', async () => {
        const path = `${tmp}/array.json`
        await Deno.writeTextFile(path, '[]')
        try {
          await loadSecretKeys(path, { internal: true })
          throw new Error('expected loadSecretKeys to throw / exit')
        } catch (e) {
          assertStringIncludes((e as Error).message, 'must contain a JSON object')
        }
      })

      await t.step('rejects non-string values', async () => {
        const path = `${tmp}/bad-value.json`
        await Deno.writeTextFile(path, JSON.stringify({ a: 123 }))
        try {
          await loadSecretKeys(path, { internal: true })
          throw new Error('expected loadSecretKeys to throw / exit')
        } catch (e) {
          assertStringIncludes((e as Error).message, "entry 'a' is not a string")
        }
      })
    } finally {
      await Deno.remove(tmp, { recursive: true })
    }
  }
})

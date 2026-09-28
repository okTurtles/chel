import { Buffer } from 'node:buffer'
import process from 'node:process'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import sbp from 'npm:@sbp/sbp'
import 'npm:@sbp/okturtles.data'
import 'npm:@sbp/okturtles.events'
import 'npm:@sbp/okturtles.eventqueue'
import { blake32Hash, createCID, multicodes } from 'npm:@chelonia/lib/functions'
import { SPMessage } from 'npm:@chelonia/lib/SPMessage'
import type { SPOpContract, SPOpValue, SPKey } from 'npm:@chelonia/lib/SPMessage'
import { encryptedOutgoingDataWithRawKey } from 'npm:@chelonia/lib/encryptedData'
import { signedOutgoingDataWithRawKey } from 'npm:@chelonia/lib/signedData'
import { CURVE25519XSALSA20POLY1305, EDWARDS25519SHA512BATCH, keygen, keyId, serializeKey, sign } from 'npm:@chelonia/crypto'
import { AUTHSALT, CONTRACTSALT, CS, SALT_LENGTH_IN_OCTETS } from 'npm:@chelonia/lib/zkppConstants'
import tweetnacl from 'npm:tweetnacl'
import { nconfDefaults } from '../config-defaults.ts'
import { startServer, stopServer } from './index.ts'

export { blake32Hash, createCID, multicodes } from 'npm:@chelonia/lib/functions'
export { EDWARDS25519SHA512BATCH, keygen, keyId, serializeKey, sign } from 'npm:@chelonia/crypto'
export { default as sbp } from 'npm:@sbp/sbp'
// Re-exported so that tests asserting against the settings the test server
// runs with do not have to restate the numbers (see `startTestServer` below).
export { nconfDefaults } from '../config-defaults.ts'

export const nacl = tweetnacl

const TEST_PORT = 0

export function buildSignedKvPayload (
  _contractID: string,
  key: string,
  height: number,
  data: unknown,
  SAK: ReturnType<typeof keygen>
) {
  const SAKid = keyId(SAK)
  const heightStr = String(height)
  const serializedMessage = JSON.stringify(data)
  const additionalData = key + heightStr
  const sig = sign(SAK, blake32Hash(blake32Hash(additionalData) + blake32Hash(serializedMessage)))
  return JSON.stringify({
    height: heightStr,
    _signedData: [serializedMessage, SAKid, sig]
  })
}

export function saltsAndEncryptedHashedPassword (p: string, secretKey: Uint8Array, hash: string) {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  const dhKey = nacl.hash(nacl.box.before(Buffer.from(p, 'base64url'), secretKey))
  const authSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(AUTHSALT)), dhKey]))).subarray(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const contractSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(CONTRACTSALT)), dhKey]))).subarray(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const encryptionKey = nacl.hash(Buffer.from(authSalt + contractSalt)).subarray(0, nacl.secretbox.keyLength)
  const encryptedHashedPassword = Buffer.concat([nonce, nacl.secretbox(Buffer.from(hash), nonce, encryptionKey)]).toString('base64url')
  return [authSalt, contractSalt, encryptedHashedPassword]
}

export function decryptRegistrationRedemptionToken (p: string, secretKey: Uint8Array, encryptedToken: string) {
  const dhKey = nacl.hash(nacl.box.before(Buffer.from(p, 'base64url'), secretKey))
  const authSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(AUTHSALT)), dhKey]))).subarray(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const contractSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(CONTRACTSALT)), dhKey]))).subarray(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const encryptionKey = nacl.hash(Buffer.concat([Buffer.from(CS), nacl.hash(Buffer.from(authSalt + contractSalt)).subarray(0, nacl.secretbox.keyLength)])).subarray(0, nacl.secretbox.keyLength)
  const encryptedTokenBuf = Buffer.from(encryptedToken, 'base64url')
  const nonce = encryptedTokenBuf.subarray(0, nacl.secretbox.nonceLength)
  const ciphertext = encryptedTokenBuf.subarray(nacl.secretbox.nonceLength)
  const decrypted = nacl.secretbox.open(ciphertext, nonce, encryptionKey)
  if (!decrypted) throw new Error('Failed to decrypt token')
  return Buffer.from(decrypted).toString()
}

export function createTestIdentity () {
  const SAK = keygen(EDWARDS25519SHA512BATCH)
  const SAKid = keyId(SAK)
  const SAKpublic = serializeKey(SAK, false)
  const contractData = `identity-${SAKid}-${Date.now()}`
  const contractID = createCID(contractData, multicodes.SHELTER_CONTRACT_DATA)

  const rootState = sbp('chelonia/rootState')
  rootState[contractID] = {
    _vm: {
      authorizedKeys: {
        [SAKid]: {
          id: SAKid,
          name: '#sak',
          purpose: ['sak'],
          ringLevel: 0,
          permissions: [],
          allowedActions: [],
          data: SAKpublic,
          _notBeforeHeight: 0,
          _notAfterHeight: null
        }
      }
    }
  }
  rootState.contracts = rootState.contracts || Object.create(null)
  rootState.contracts[contractID] = {
    // No `type` is set: the server no longer treats contract names specially,
    // and identity is defined by being an unattributed billable entity
    HEAD: createCID(contractData + '-head', multicodes.SHELTER_CONTRACT_DATA),
    height: 0
  }

  return { contractID, SAK, SAKid }
}

export function buildShelterAuthHeader (contractID: string, SAK: ReturnType<typeof keygen>) {
  const nonceBytes = new Uint8Array(15)
  crypto.getRandomValues(nonceBytes)
  const data = `${contractID} ${Date.now()}.${Buffer.from(nonceBytes).toString('base64')}`
  return `shelter ${data}.${sign(SAK, data)}`
}

// Builds and seeds everything needed to register a new root contract over
// POST /event: a signed manifest with its contract source stored in the
// database, plus a validly signed OP_CONTRACT first message for it (the same
// shape `chelonia/out/registerContract` in @chelonia/lib produces).
// `messagePaddingBytes` inflates the serialized message itself (via a padding
// key name), for testing the signup size cap. `keys: 'realistic'` builds the
// key set a real client registration carries (see `realisticKeys` below)
// instead of a single bare signing key.
export async function createTestContractRegistration ({
  name,
  messagePaddingBytes = 0,
  keys = 'minimal'
}: {
  name: string
  messagePaddingBytes?: number
  keys?: 'minimal' | 'realistic'
}): Promise<{ serialized: string, contractID: string }> {
  const manifestSigningKey = keygen(EDWARDS25519SHA512BATCH)
  const contractSource = `export default {} // ${name}`
  const contractHash = createCID(contractSource, multicodes.SHELTER_CONTRACT_TEXT)
  await sbp('chelonia.db/set', contractHash, contractSource)

  const serializedBody = JSON.stringify({
    name,
    version: '0.0.1',
    contract: { hash: contractHash, file: 'contract.js' },
    signingKeys: [serializeKey(manifestSigningKey, false)]
  })
  const serializedHead = JSON.stringify({ manifestVersion: '1.0.0' })
  const manifest = JSON.stringify({
    head: serializedHead,
    body: serializedBody,
    signature: {
      keyId: keyId(manifestSigningKey),
      value: sign(manifestSigningKey, serializedBody + serializedHead)
    }
  })
  const manifestHash = createCID(manifest, multicodes.SHELTER_CONTRACT_MANIFEST)
  await sbp('chelonia.db/set', manifestHash, manifest)

  const { signingKey, keys: contractKeys } = keys === 'realistic'
    ? realisticKeys()
    : minimalKeys(messagePaddingBytes)
  const payload: SPOpContract = { type: name, keys: contractKeys }
  const message = SPMessage.createV1_0({
    contractID: null,
    height: 0,
    op: [
      SPMessage.OP_CONTRACT,
      signedOutgoingDataWithRawKey<SPOpValue, object>(signingKey, payload)
    ],
    manifest: manifestHash
  })
  return { serialized: message.serialize(), contractID: message.hash() }
}

type ContractKeys = { signingKey: ReturnType<typeof keygen>, keys: SPKey[] }

function minimalKeys (paddingBytes: number): ContractKeys {
  const CSK = keygen(EDWARDS25519SHA512BATCH)
  return {
    signingKey: CSK,
    keys: [{
      id: keyId(CSK),
      name: paddingBytes > 0 ? '#csk' + 'x'.repeat(paddingBytes) : '#csk',
      purpose: ['sig'],
      ringLevel: 0,
      permissions: '*',
      allowedActions: '*',
      data: serializeKey(CSK, false),
      _notBeforeHeight: 0,
      _notAfterHeight: undefined
    } as SPKey]
  }
}

// The key set a real registration carries, as opposed to the single bare
// signing key the minimal fixture uses. Mirrors the OP_CONTRACT that
// `gi.actions/identity/create` in Group Income sends: seven keys, most of them
// carrying their private half encrypted for the user, which is what makes a
// real first message an order of magnitude larger than the minimal fixture.
// (Its profile attributes are sent in a separate action, so they are not part
// of the first message.) With a 21-character contract name, the length of
// `gi.contracts/identity`, this yields a 4344 byte first message, the same size
// as registrations recorded from the client. Used to keep
// `server.signup.maxFirstMessageBytes` honest, so it should be kept in step
// with the client.
function realisticKeys (): ContractKeys {
  const IPK = keygen(EDWARDS25519SHA512BATCH)
  const IEK = keygen(CURVE25519XSALSA20POLY1305)
  const CSK = keygen(EDWARDS25519SHA512BATCH)
  const CEK = keygen(CURVE25519XSALSA20POLY1305)
  const PEK = keygen(CURVE25519XSALSA20POLY1305)
  const DMK = keygen(EDWARDS25519SHA512BATCH)
  const SAK = keygen(EDWARDS25519SHA512BATCH)

  const key = (
    k: ReturnType<typeof keygen>,
    fields: Pick<SPKey, 'name' | 'purpose' | 'ringLevel' | 'permissions' | 'allowedActions'>,
    // The private half, encrypted with this key; omitted for the keys the
    // user derives from their password
    encryptedWith?: ReturnType<typeof keygen>
  ): SPKey => {
    return {
      id: keyId(k),
      ...fields,
      meta: {
        private: encryptedWith
          ? { content: encryptedOutgoingDataWithRawKey(encryptedWith, serializeKey(k, true)) }
          : { transient: true }
      },
      data: serializeKey(k, false)
    } as unknown as SPKey
  }

  return {
    signingKey: IPK,
    keys: [
      key(IPK, { name: 'ipk', purpose: ['sig'], ringLevel: 0, permissions: '*', allowedActions: '*' }),
      key(IEK, { name: 'iek', purpose: ['enc'], ringLevel: 0, permissions: ['gi.contracts/identity/keymeta'] }),
      key(CSK, {
        name: 'csk',
        purpose: ['sig'],
        ringLevel: 1,
        permissions: [
          SPMessage.OP_KEY_ADD, SPMessage.OP_KEY_DEL, SPMessage.OP_ACTION_UNENCRYPTED,
          SPMessage.OP_ACTION_ENCRYPTED, SPMessage.OP_ATOMIC, SPMessage.OP_CONTRACT_AUTH,
          SPMessage.OP_CONTRACT_DEAUTH, SPMessage.OP_KEY_SHARE, SPMessage.OP_KEY_UPDATE,
          SPMessage.OP_ACTION_ENCRYPTED + '#inner'
        ],
        allowedActions: '*'
      }, IEK),
      key(CEK, {
        name: 'cek',
        purpose: ['enc'],
        ringLevel: 1,
        permissions: [
          SPMessage.OP_ACTION_ENCRYPTED, SPMessage.OP_KEY_ADD, SPMessage.OP_KEY_DEL,
          SPMessage.OP_KEY_REQUEST, SPMessage.OP_KEY_REQUEST_SEEN, SPMessage.OP_KEY_SHARE,
          SPMessage.OP_KEY_UPDATE
        ],
        allowedActions: '*'
      }, IEK),
      key(PEK, {
        name: 'pek',
        purpose: ['enc'],
        ringLevel: 2,
        permissions: [SPMessage.OP_ACTION_ENCRYPTED],
        allowedActions: ['gi.actions/identity/setAttributes']
      }, CEK),
      key(DMK, {
        name: 'dmk',
        purpose: ['sig'],
        ringLevel: 2,
        permissions: [SPMessage.OP_ACTION_ENCRYPTED],
        allowedActions: ['gi.contracts/identity/joinDirectMessage']
      }, PEK),
      // A `#sak` may not have permissions (see `keyAdditionProcessor` in
      // @chelonia/lib); its private half may still be encrypted
      key(SAK, { name: '#sak', purpose: ['sak'], ringLevel: 0, permissions: [], allowedActions: [] }, IEK)
    ]
  }
}

let cachedServerAddress: Promise<string> | undefined
let serverStartRefCount: number = 0
export function startTestServer (): Promise<string> {
  serverStartRefCount++
  if (cachedServerAddress !== undefined) {
    return cachedServerAddress
  }

  const internal = async () => {
    process.env.NODE_ENV = 'development'
    process.env.CI = 'true'

    // A writable store, added ahead of the defaults below so that it takes
    // precedence. The `defaults` store is read-only, so without this tests
    // cannot override an option (with `nconf.set`) for settings that the
    // server reads per request, such as `server:signup:disabled`.
    nconf.use('memory')

    nconf.defaults({
      // Stable, obviously-non-production id so the `server_id` guard in
      // `startServer()` is satisfied. Real ids are generated by `chel init`.
      server_id: 'test-server-instance',
      server: {
        host: '127.0.0.1',
        port: TEST_PORT,
        appDir: '.',
        fileUploadMaxBytes: nconfDefaults.server.fileUploadMaxBytes,
        // The signup size cap and the free allowance come from the shipped defaults
        // so that tests exercising them cannot drift from the values operators
        // actually get
        signup: {
          ...nconfDefaults.server.signup,
          // Raised well above the defaults so that the suite is not throttled
          // (they are inactive outside production anyway)
          limit: { disabled: false, minute: 100, hour: 1000, day: 10000 }
        },
        billing: { ...nconfDefaults.server.billing },
        messages: [{ type: 'info', text: 'test message' }],
        maxEventsBatchSize: nconfDefaults.server.maxEventsBatchSize,
        archiveMode: false
      },
      database: {
        lruNumItems: 100,
        backend: 'mem',
        backendOptions: {}
      }
    })

    const serverAddress = await startServer({ installSignalHandlers: false })

    return serverAddress.uri
  }

  cachedServerAddress = internal().catch(e => {
    cachedServerAddress = undefined
    serverStartRefCount = 0
    throw e
  })

  return cachedServerAddress
}

export async function stopTestServer (): Promise<void> {
  if (cachedServerAddress === undefined) {
    throw new Error('Server has not yet started')
  }
  try {
    await cachedServerAddress
  } catch {
    // If the server was starting and it encountered an error, this function
    // technically succeeded (server is not runnign).
    return
  }
  if (--serverStartRefCount > 0) {
    return
  }
  await stopServer()
  cachedServerAddress = undefined
}

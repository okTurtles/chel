import { Buffer } from 'node:buffer'
import process from 'node:process'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import sbp from 'npm:@sbp/sbp'
import 'npm:@sbp/okturtles.data'
import 'npm:@sbp/okturtles.events'
import 'npm:@sbp/okturtles.eventqueue'
import { blake32Hash, createCID, multicodes } from 'npm:@chelonia/lib/functions'
import { EDWARDS25519SHA512BATCH, keygen, keyId, serializeKey, sign } from 'npm:@chelonia/crypto'
import { AUTHSALT, CONTRACTSALT, CS, SALT_LENGTH_IN_OCTETS } from 'npm:@chelonia/lib/zkppConstants'
import tweetnacl from 'npm:tweetnacl'
import { SERVER_EXITING, SERVER_RUNNING } from './events.ts'

export { blake32Hash, createCID, multicodes } from 'npm:@chelonia/lib/functions'
export { EDWARDS25519SHA512BATCH, keygen, keyId, serializeKey, sign } from 'npm:@chelonia/crypto'
export { default as sbp } from 'npm:@sbp/sbp'

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
    type: 'gi.contracts/identity',
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

    nconf.defaults({
      server: {
        host: '127.0.0.1',
        port: TEST_PORT,
        appDir: '.',
        fileUploadMaxBytes: 31457280,
        signup: {
          disabled: false,
          limit: { disabled: false, minute: 100, hour: 1000, day: 10000 }
        },
        logLevel: 'error',
        messages: [{ type: 'info', text: 'test message' }],
        maxEventsBatchSize: 500,
        archiveMode: false
      },
      database: {
        lruNumItems: 100,
        backend: 'mem',
        backendOptions: {}
      }
    })

    const serverAddress = await new Promise<string>((resolve, reject) => {
      const unregister = sbp('okTurtles.events/once', SERVER_RUNNING, function (hapi: { info: { uri: string } }) {
        resolve(hapi.info.uri)
      })
      import('./index.ts').then(({ default: start }) => {
        return start()
      }).catch((e) => {
        unregister()
        reject(e)
      })
    })

    return serverAddress
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
  await new Promise<void>((resolve) => {
    sbp('okTurtles.events/once', SERVER_EXITING, () => {
      sbp('okTurtles.eventQueue/queueEvent', SERVER_EXITING, () => {
        resolve()
      })
    })
    sbp('okTurtles.events/emit', SERVER_EXITING)
  })
  cachedServerAddress = undefined
}

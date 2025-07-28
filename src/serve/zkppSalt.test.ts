'use strict'

import { initDB } from './database.ts'
import { tweetnacl } from '../deps.ts'
import { Buffer } from 'node:buffer'

// Type for Deno test context
type TestContext = {
  step(name: string, fn: () => void | Promise<void>): Promise<boolean>
}

// Simple assertion helpers to replace 'should'
const should = {
  be: {
    of: {
      type: (expectedType: string) => ({
        equal: (actual: any, message?: string) => {
          if (typeof actual !== expectedType) {
            throw new Error(message || `Expected type ${expectedType}, got ${typeof actual}`)
          }
        }
      })
    }
  },
  equal: (expected: any, message?: string) => (actual: any) => {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`)
    }
  }
}

// Helper function to replace should() calls
const shouldAssert = (value: any) => ({
  be: {
    of: {
      type: (expectedType: string) => {
        if (typeof value !== expectedType) {
          throw new Error(`Expected type ${expectedType}, got ${typeof value}`)
        }
      }
    }
  },
  equal: (expected: any, message?: string) => {
    if (value !== expected) {
      throw new Error(message || `Expected ${expected}, got ${value}`)
    }
  }
})

const nacl = tweetnacl

import { AUTHSALT, CONTRACTSALT, CS, SALT_LENGTH_IN_OCTETS, SU } from './shared/zkppConstants.ts'
import { getChallenge, getContractSalt, redeemSaltRegistrationToken, register, registrationKey, updateContractSalt } from './zkppSalt.ts'

const saltsAndEncryptedHashedPassword = (p: string, secretKey: Uint8Array, hash: string) => {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  const dhKey = nacl.hash(nacl.box.before(Buffer.from(p, 'base64url'), secretKey))
  const authSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(AUTHSALT)), dhKey]))).slice(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const contractSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(CONTRACTSALT)), dhKey]))).slice(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const encryptionKey = nacl.hash(Buffer.from(authSalt + contractSalt)).slice(0, nacl.secretbox.keyLength)
  const encryptedHashedPassword = Buffer.concat([nonce, nacl.secretbox(Buffer.from(hash), nonce, encryptionKey)]).toString('base64url')

  return [authSalt, contractSalt, encryptedHashedPassword]
}

const decryptRegistrationRedemptionToken = (p: string, secretKey: Uint8Array, encryptedToken: string) => {
  const dhKey = nacl.hash(nacl.box.before(Buffer.from(p, 'base64url'), secretKey))
  const authSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(AUTHSALT)), dhKey]))).slice(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const contractSalt = Buffer.from(nacl.hash(Buffer.concat([nacl.hash(Buffer.from(CONTRACTSALT)), dhKey]))).slice(0, SALT_LENGTH_IN_OCTETS).toString('base64')
  const encryptionKey = nacl.hash(Buffer.concat([Buffer.from(CS), nacl.hash(Buffer.from(authSalt + contractSalt)).slice(0, nacl.secretbox.keyLength)])).slice(0, nacl.secretbox.keyLength)
  const encryptedTokenBuf = Buffer.from(encryptedToken, 'base64url')
  const nonce = encryptedTokenBuf.slice(0, nacl.secretbox.nonceLength)
  const ciphertext = encryptedTokenBuf.slice(nacl.secretbox.nonceLength)
  const decrypted = nacl.secretbox.open(ciphertext, nonce, encryptionKey)
  if (!decrypted) throw new Error('Failed to decrypt token')
  const token = Buffer.from(decrypted).toString()

  return token
}

Deno.test({
  name: 'ZKPP Salt functions',
  async fn (t: TestContext) {
    // Setup
    await initDB()
    await t.step('register() conforms to the API to register a new salt', async () => {
      const keyPair = nacl.box.keyPair()
      const publicKey = Buffer.from(keyPair.publicKey).toString('base64url')
      const publicKeyHash = Buffer.from(nacl.hash(Buffer.from(publicKey))).toString('base64url')

      const regKeyAlice1 = registrationKey('alice', publicKeyHash)
      const regKeyAlice2 = registrationKey('alice', publicKeyHash)
      if (typeof regKeyAlice1 !== 'object') throw new Error('regKeyAlice1 should be object')
      if (typeof regKeyAlice2 !== 'object') throw new Error('regKeyAlice2 should be object')
      const [, , encryptedHashedPasswordAlice1] = saltsAndEncryptedHashedPassword(regKeyAlice1.p, keyPair.secretKey, 'hash')
      const res1 = register('alice', publicKey, regKeyAlice1.s, regKeyAlice1.sig, encryptedHashedPasswordAlice1)
      if (typeof res1 !== 'string') throw new Error('register should return a token (alice)')
      const token = decryptRegistrationRedemptionToken(regKeyAlice1.p, keyPair.secretKey, res1)
      await redeemSaltRegistrationToken('alice', 'alice', token)

      const [, , encryptedHashedPasswordAlice2] = saltsAndEncryptedHashedPassword(regKeyAlice1.p, keyPair.secretKey, 'hash')
      const res2 = register('alice', publicKey, regKeyAlice2.s, regKeyAlice2.sig, encryptedHashedPasswordAlice2)
      if (res2 !== false) throw new Error('register should not overwrite entry (alice)')

      const regKeyBob1 = registrationKey('bob', publicKeyHash)
      if (typeof regKeyBob1 !== 'object') throw new Error('regKeyBob1 should be object')
      const [, , encryptedHashedPasswordBob1] = saltsAndEncryptedHashedPassword(regKeyBob1.p, keyPair.secretKey, 'hash')
      const res3 = register('bob', publicKey, regKeyBob1.s, regKeyBob1.sig, encryptedHashedPasswordBob1)
      if (typeof res3 !== 'string') throw new Error('register should return a token (bob)')
    })

    await t.step('getContractSalt() conforms to the API to obtain salt', async () => {
      const keyPair = nacl.box.keyPair()
      const publicKey = Buffer.from(keyPair.publicKey).toString('base64url')
      const publicKeyHash = Buffer.from(nacl.hash(Buffer.from(publicKey))).toString('base64url')

      const [contract, hash, r] = ['getContractSalt', 'hash', 'r']
      const regKey = registrationKey(contract, publicKeyHash)
      if (typeof regKey !== 'object') throw new Error('regKey should be object')
      if (!regKey) throw new Error('regKey should not be false')

      const [authSalt, contractSalt, encryptedHashedPassword] = saltsAndEncryptedHashedPassword(regKey.p, keyPair.secretKey, hash)

      const res = register(contract, publicKey, regKey.s, regKey.sig, encryptedHashedPassword)
      if (typeof res !== 'string') throw new Error('register should allow new entry (' + contract + ')')
      const token = decryptRegistrationRedemptionToken(regKey.p, keyPair.secretKey, res as string)
      await redeemSaltRegistrationToken(contract, contract, token)

      const b = Buffer.from(nacl.hash(Buffer.from(r))).toString('base64url')
      const challenge = await getChallenge(contract, b)
      if (typeof challenge !== 'object') throw new Error('challenge should be object')
      if (!challenge) throw new Error('challenge should not be false')
      if (challenge.authSalt !== authSalt) throw new Error('mismatched authSalt')

      const ħ = nacl.hash(Buffer.concat([nacl.hash(Buffer.from(r)), nacl.hash(Buffer.from(challenge.s))]))
      const c = nacl.hash(Buffer.concat([nacl.hash(Buffer.from(hash)), nacl.hash(ħ)]))
      const hc = nacl.hash(c)

      const salt = await getContractSalt(contract, r, challenge.s, challenge.sig, Buffer.from(hc).toString('base64url'))
      if (typeof salt !== 'string') throw new Error('salt response should be string')
      if (!salt) throw new Error('salt should not be false')

      const saltBuf = Buffer.from(salt, 'base64url')
      const nonce = saltBuf.slice(0, nacl.secretbox.nonceLength)
      const encryptionKey = nacl.hash(Buffer.concat([Buffer.from(CS), c])).slice(0, nacl.secretbox.keyLength)
      const [retrievedContractSalt] = JSON.parse(
        (() => {
          const decrypted = nacl.secretbox.open(saltBuf.slice(nacl.secretbox.nonceLength), nonce, encryptionKey)
          if (!decrypted) throw new Error('Failed to decrypt salt')
          return Buffer.from(decrypted).toString()
        })()
      )
      if (retrievedContractSalt !== contractSalt) throw new Error('mismatched contractSalt')
    })

    await t.step('updateContractSalt() conforms to the API to update salt', async () => {
      const keyPair = nacl.box.keyPair()
      const publicKey = Buffer.from(keyPair.publicKey).toString('base64url')
      const publicKeyHash = Buffer.from(nacl.hash(Buffer.from(publicKey))).toString('base64url')

      const [contract, hash, r] = ['update', 'hash', 'r']
      const regKey = registrationKey(contract, publicKeyHash)
      if (typeof regKey !== 'object') throw new Error('regKey should be object')
      if (!regKey) throw new Error('regKey should not be false')

      const [authSalt, , encryptedHashedPassword] = saltsAndEncryptedHashedPassword(regKey.p, keyPair.secretKey, hash)

      const res = register(contract, publicKey, regKey.s, regKey.sig, encryptedHashedPassword)
      if (typeof res !== 'string') throw new Error('register should allow new entry (' + contract + ')')
      const token = decryptRegistrationRedemptionToken(regKey.p, keyPair.secretKey, res as string)
      await redeemSaltRegistrationToken(contract, contract, token)

      const b = Buffer.from(nacl.hash(Buffer.from(r))).toString('base64url')
      const challenge = await getChallenge(contract, b)
      if (typeof challenge !== 'object') throw new Error('challenge should be object')
      if (challenge.authSalt !== authSalt) throw new Error('mismatched authSalt')

      const ħ = nacl.hash(Buffer.concat([nacl.hash(Buffer.from(r)), nacl.hash(Buffer.from(challenge.s))]))
      const c = nacl.hash(Buffer.concat([nacl.hash(Buffer.from(hash)), nacl.hash(ħ)]))
      const hc = nacl.hash(c)

      const encryptionKey = nacl.hash(Buffer.concat([Buffer.from(SU), c])).slice(0, nacl.secretbox.keyLength)
      const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)

      const encryptedArgsCiphertext = nacl.secretbox(Buffer.from(JSON.stringify(['a', 'b', 'c'])), nonce, encryptionKey)

      const encryptedArgs = Buffer.concat([nonce, encryptedArgsCiphertext]).toString('base64url')

      const updateRes = await updateContractSalt(contract, r, challenge.s, challenge.sig, Buffer.from(hc).toString('base64url'), encryptedArgs)
      if (!updateRes) throw new Error('updateContractSalt should be successful')
    })
  }
})

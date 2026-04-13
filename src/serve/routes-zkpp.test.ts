import 'jsr:@db/sqlite'
import { Buffer } from 'node:buffer'
import {
  createCID,
  decryptRegistrationRedemptionToken,
  multicodes,
  nacl,
  saltsAndEncryptedHashedPassword,
  sbp,
  startTestServer,
  stopTestServer
} from './routes-test-helpers.ts'
import { CS } from 'npm:@chelonia/lib/zkppConstants'

Deno.test({
  name: 'routes: ZKPP endpoints',
  sanitizeResources: false,
  sanitizeOps: false,
  async fn (t: Deno.TestContext) {
    const baseURL = await startTestServer()

    try {
      await t.step('POST /zkpp/register step 1: returns {s, p, sig}', async () => {
        const keyPair = nacl.box.keyPair()
        const publicKeyHash = Buffer.from(nacl.hash(Buffer.from(
          Buffer.from(keyPair.publicKey).toString('base64url')
        ))).toString('base64url')
        const res = await fetch(`${baseURL}/zkpp/register/zkppuser1`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ b: publicKeyHash })
        })
        if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}`)
        const body = await res.json()
        if (!body.s) throw new Error('Expected s in response')
        if (!body.p) throw new Error('Expected p in response')
        if (!body.sig) throw new Error('Expected sig in response')
      })

      await t.step('POST /zkpp/register step 2: completes registration', async () => {
        const keyPair = nacl.box.keyPair()
        const publicKey = Buffer.from(keyPair.publicKey).toString('base64url')
        const publicKeyHash = Buffer.from(nacl.hash(Buffer.from(publicKey))).toString('base64url')

        const res1 = await fetch(`${baseURL}/zkpp/register/zkppuser2`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ b: publicKeyHash })
        })
        if (res1.status !== 200) throw new Error(`Step 1 failed: ${res1.status}`)
        const step1 = await res1.json()

        const [, , encryptedHashedPassword] = saltsAndEncryptedHashedPassword(step1.p, keyPair.secretKey, 'testhash')
        const res2 = await fetch(`${baseURL}/zkpp/register/zkppuser2`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            r: publicKey,
            s: step1.s,
            sig: step1.sig,
            Eh: encryptedHashedPassword
          })
        })
        if (res2.status !== 200) throw new Error(`Step 2 failed: ${res2.status}`)
        const token = await res2.text()
        if (!token) throw new Error('Expected registration token')
      })

      await t.step('POST /zkpp/register with invalid name returns 400', async () => {
        const res = await fetch(`${baseURL}/zkpp/register/INVALID_NAME!!`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ b: 'test' })
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /zkpp/register with already registered name returns 409', async () => {
        await sbp('backend/db/registerName', 'zkppregistered', createCID('zkpp-contract', multicodes.SHELTER_CONTRACT_DATA))
        const res = await fetch(`${baseURL}/zkpp/register/zkppregistered`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ b: 'test' })
        })
        await res.body?.cancel()
        if (res.status !== 409) throw new Error(`Expected 409 but got ${res.status}`)
      })

      await t.step('GET /zkpp/{contractID}/auth_hash with unknown contract returns 404', async () => {
        const unknownCID = createCID('zkpp-unknown', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/zkpp/${unknownCID}/auth_hash?b=test`)
        await res.body?.cancel()
        if (res.status !== 404) throw new Error(`Expected 404 but got ${res.status}`)
      })

      await t.step('GET /zkpp/{contractID}/auth_hash with invalid CID returns 400', async () => {
        const res = await fetch(`${baseURL}/zkpp/not-a-cid/auth_hash?b=test`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /zkpp/{contractID}/auth_hash with missing b param returns 400', async () => {
        const cid = createCID('zkpp-test', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/zkpp/${cid}/auth_hash`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('GET /zkpp/{contractID}/contract_hash with missing params returns 400', async () => {
        const cid = createCID('zkpp-test', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/zkpp/${cid}/contract_hash?r=a&s=b`)
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('POST /zkpp/{contractID}/updatePasswordHash with missing params returns 400', async () => {
        const cid = createCID('zkpp-test', multicodes.SHELTER_CONTRACT_DATA)
        const res = await fetch(`${baseURL}/zkpp/${cid}/updatePasswordHash`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ r: 'a', s: 'b' })
        })
        await res.body?.cancel()
        if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`)
      })

      await t.step('ZKPP full flow: register, challenge, get contract salt', async () => {
        const keyPair = nacl.box.keyPair()
        const publicKey = Buffer.from(keyPair.publicKey).toString('base64url')
        const publicKeyHash = Buffer.from(nacl.hash(Buffer.from(publicKey))).toString('base64url')
        const hash = 'myhash'
        const name = 'zkppfullflow'

        const res1 = await fetch(`${baseURL}/zkpp/register/${name}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ b: publicKeyHash })
        })
        if (res1.status !== 200) throw new Error(`Reg step 1 failed: ${res1.status}`)
        const step1 = await res1.json()

        const [authSalt, , encryptedHashedPassword] = saltsAndEncryptedHashedPassword(step1.p, keyPair.secretKey, hash)
        const res2 = await fetch(`${baseURL}/zkpp/register/${name}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ r: publicKey, s: step1.s, sig: step1.sig, Eh: encryptedHashedPassword })
        })
        if (res2.status !== 200) throw new Error(`Reg step 2 failed: ${res2.status}`)
        const encryptedToken = (await res2.text()).replace(/^"|"$/g, '')
        const token = decryptRegistrationRedemptionToken(step1.p, keyPair.secretKey, encryptedToken)

        const contractCID = createCID(`${name}-contract`, multicodes.SHELTER_CONTRACT_DATA)
        await sbp('backend/db/registerName', name, contractCID)

        const { redeemSaltRegistrationToken } = await import('./zkppSalt.ts')
        await redeemSaltRegistrationToken(name, contractCID, token)

        const r = 'challenge-r'
        const b = Buffer.from(nacl.hash(Buffer.from(r))).toString('base64url')
        const challengeRes = await fetch(`${baseURL}/zkpp/${contractCID}/auth_hash?b=${encodeURIComponent(b)}`)
        if (challengeRes.status !== 200) throw new Error(`auth_hash failed: ${challengeRes.status}`)
        const challenge = await challengeRes.json()
        if (!challenge.authSalt) throw new Error('Expected authSalt')
        if (!challenge.s) throw new Error('Expected s')
        if (!challenge.sig) throw new Error('Expected sig')
        if (challenge.authSalt !== authSalt) throw new Error(`authSalt mismatch: ${challenge.authSalt} !== ${authSalt}`)

        const ħ = nacl.hash(Buffer.concat([nacl.hash(Buffer.from(r)), nacl.hash(Buffer.from(challenge.s))]))
        const c = nacl.hash(Buffer.concat([nacl.hash(Buffer.from(hash)), nacl.hash(ħ)]))
        const hc = nacl.hash(c)

        const saltRes = await fetch(
          `${baseURL}/zkpp/${contractCID}/contract_hash?` +
          `r=${encodeURIComponent(r)}&s=${encodeURIComponent(challenge.s)}` +
          `&sig=${encodeURIComponent(challenge.sig)}&hc=${encodeURIComponent(Buffer.from(hc).toString('base64url'))}`
        )
        if (saltRes.status !== 200) throw new Error(`contract_hash failed: ${saltRes.status}`)
        const encryptedSalt = await saltRes.text()
        if (!encryptedSalt) throw new Error('Expected encrypted salt response')

        const saltBuf = Buffer.from(encryptedSalt.replace(/^"|"$/g, ''), 'base64url')
        const nonce = saltBuf.slice(0, nacl.secretbox.nonceLength)
        const encryptionKey = nacl.hash(Buffer.concat([Buffer.from(CS), c])).slice(0, nacl.secretbox.keyLength)
        const decrypted = nacl.secretbox.open(saltBuf.slice(nacl.secretbox.nonceLength), nonce, encryptionKey)
        if (!decrypted) throw new Error('Failed to decrypt contract salt')
        const [retrievedContractSalt] = JSON.parse(Buffer.from(decrypted).toString())
        if (!retrievedContractSalt) throw new Error('Expected non-empty contract salt')
      })
    } finally {
      await stopTestServer()
    }
  }
})

'use strict'

import { assertRejects } from '../src/deps.ts'
import { verifySignature } from '../src/verifySignature.ts'
// import { CID, assertEquals, base58btc } from '../src/deps.ts'

Deno.test({
    name: "Verify signature tests",
    async fn (t) {
        await t.step('it should validate a valid signature', async () => {
            const manifestFile = './test/assets/valid-signature.x.manifest.json'
            await verifySignature([manifestFile], true)
        })

        await t.step('it should validate a valid signature (using a matching external key descriptor file)', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature.x.manifest.json'
            await verifySignature(['-k', signingKeyFile, manifestFile], true)
        })

        await t.step('it should not validate a valid signature when using the wrong key file', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-jy3R1NPmA17o.pub.json'
            const manifestFile = './test/assets/valid-signature.x.manifest.json'
            await assertRejects(() => verifySignature(['-k', signingKeyFile, manifestFile], true), Error, 'key ID doesn\'t match the provided key file')
        })

        await t.step('it should not validate a valid signature if the public key isn\'t enumerated', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/invalid-signature-missing-pubkey.x.manifest.json'
            await assertRejects(() => verifySignature([manifestFile], true), Error, 'The manifest appears to be signed')
            await assertRejects(() => verifySignature(['-k', signingKeyFile, manifestFile], true), Error, 'signing key is not listed')
        })

        await t.step('it should not validate a valid signature missing its key ID', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature-missing-id.x.manifest.json'
            await assertRejects(() => verifySignature([manifestFile], true), Error, 'missing signature key ID')
            await assertRejects(() => verifySignature(['-k', signingKeyFile, manifestFile], true), Error, 'missing signature key ID')
        })

        await t.step('it should not validate a valid signature with a wrong key ID', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature-wrong-id.x.manifest.json'
            await assertRejects(() => verifySignature(['-k', signingKeyFile, manifestFile], true), Error, 'key ID doesn\'t match the provided key file')
        })

        await t.step('it should not validate a manifest file that\'s been tampered with', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature-tampered.x.manifest.json'
            await assertRejects(() => verifySignature([manifestFile], true), Error, 'Invalid signature')
            await assertRejects(() => verifySignature(['-k', signingKeyFile, manifestFile], true), Error, 'Invalid signature')
        })

        await t.step('it should not validate a tampered with bundle contract', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/bundle-tampered.bundle.x.manifest.json'
            await assertRejects(() => verifySignature([manifestFile], true), Error, 'Invalid contract file hash')
            await assertRejects(() => verifySignature(['-k', signingKeyFile, manifestFile], true), Error, 'Invalid contract file hash')
        })

        await t.step('it should not validate a tampered with slim contract', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/slim-tampered.bundle.x.manifest.json'
            await assertRejects(() => verifySignature([manifestFile], true), Error, 'Invalid slim contract file hash')
            await assertRejects(() => verifySignature(['-k', signingKeyFile, manifestFile], true), Error, 'Invalid slim contract file hash')
        })
    }
})
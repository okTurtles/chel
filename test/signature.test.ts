'use strict'

import { assertRejects } from '../src/deps.ts'
import { verifySignature } from '../src/verifySignature.ts'
// import { CID, assertEquals, base58btc } from '../src/deps.ts'

Deno.test({
    name: "Verify signature tests",
    async fn (t) {
        await t.step('it should validate a valid signature', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature.x.manifest.json'
            await verifySignature([signingKeyFile, manifestFile], true)
        })

        await t.step('it should not validate a valid signature when using the wrong key file', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-jy3R1NPmA17o.pub.json'
            const manifestFile = './test/assets/valid-signature.x.manifest.json'
            await assertRejects(() => verifySignature([signingKeyFile, manifestFile], true), Error, 'key ID doesn\'t match the provided key file')
        })

        await t.step('it should not validate a valid signature if the public key isn\'t enumerated', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/invalid-signature-missing-pubkey.x.manifest.json'
            await assertRejects(() => verifySignature([signingKeyFile, manifestFile], true), Error, 'The signing key is not listed')
        })

        await t.step('it should not validate a valid signature missing its key ID', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature-missing-id.x.manifest.json'
            await assertRejects(() => verifySignature([signingKeyFile, manifestFile], true), Error, 'missing signature key ID')
        })

        await t.step('it should not validate a valid signature with a wrong key ID', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature-wrong-id.x.manifest.json'
            await assertRejects(() => verifySignature([signingKeyFile, manifestFile], true), Error, 'key ID doesn\'t match the provided key file')
        })

        await t.step('it should not validate a manifest file that\'s been tampered with', async () => {
            const signingKeyFile = './test/assets/edwards25519sha512batch-g6kUyhtL5bPd.pub.json'
            const manifestFile = './test/assets/valid-signature-tampered.x.manifest.json'
            await assertRejects(() => verifySignature([signingKeyFile, manifestFile], true), Error, 'Invalid signature')
        })
    }
})
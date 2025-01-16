'use strict'

import { CID, assertEquals, base58btc } from '../src/deps.ts'
import { hash } from '../src/hash.ts'
import { multicodes } from '../src/utils.ts'


Deno.test({
    name: "Hash command tests",
    async fn (t) {
        await t.step('it should create a raw CID for a plain text file', async () => {
            const filepath = './test/assets/hello.txt'
            const actual = await hash([filepath], multicodes.RAW, true)
            const expected = 'z9brRu3VJhbqksUHweXZHkdzQYJSBzg1K8FqwvSFqWgHqS7amWe4'
            assertEquals(actual, expected)

            const cid = CID.parse(actual, base58btc.decoder)
            assertEquals(cid.code, multicodes.RAW)
            assertEquals(cid.byteLength, 38)
            assertEquals(cid.multihash.code, 45600)
            assertEquals(cid.version, 1)
        })

        await t.step('it should create a raw CID for a json file', async () => {
            const filepath = './test/assets/hello.json'
            const actual = await hash([filepath], multicodes.RAW, true)
            const expected = 'z9brRu3VWh2crTt5nDjmu8dciMkHp1LR3wmDaqEqXHK46RbuTPy3'
            assertEquals(actual, expected)

            const cid = CID.parse(actual, base58btc.decoder)
            assertEquals(cid.code, multicodes.RAW)
            assertEquals(cid.byteLength, 38)
            assertEquals(cid.multihash.code, 45600)
            assertEquals(cid.version, 1)
        })
    }
})
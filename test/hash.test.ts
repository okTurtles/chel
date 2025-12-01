import { assertEquals } from 'jsr:@std/assert'
import { multicodes } from 'npm:@chelonia/lib/functions'
import { base58btc } from 'npm:multiformats/bases/base58'
import { CID } from 'npm:multiformats/cid'
import { hash } from '../src/hash.ts'

const argsHelper = (filename: string) => ({
    $0: '',
    _: [],
    filename
})

Deno.test({
    name: "Hash command tests",
    async fn (t) {
        await t.step('it should create a raw CID for a plain text file', async () => {
            const filepath = './test/assets/hello.txt'
            const actual = await hash(argsHelper(filepath), multicodes.RAW, true)
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
            const actual = await hash(argsHelper(filepath), multicodes.RAW, true)
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
import { hash } from '../src/hash.ts'
import { CID, assertEquals, base58btc } from '../src/deps.ts'


Deno.test({
    name: "Hash command tests",
    async fn (t) {
        await t.step('it should create a raw CID for a plain text file', async () => {
            const filepath = './test/assets/hello.txt'
            const actual = await(hash([filepath], true))
            const expected = 'zCT5htke28mL1LCgthoKDptxENznEFXdk1as6fAj31NroNyQVpyE'
            assertEquals(actual, expected)

            const cid = CID.parse(actual, base58btc.decoder)
            assertEquals(cid.code, 0x55)
            assertEquals(cid.byteLength, 38)
            assertEquals(cid.multihash.code, 45600)
            assertEquals(cid.version, 1)
        })

        await t.step('it should create a json CID for a json file', async () => {
            const filepath = './test/assets/hello.json'
            const actual = await(hash([filepath], true))
            const expected = 'zyop8PQypgycyyCEcQsEHoc9Z8S9bQt1CuHuRKnXrAXagVBGxQyvH'
            assertEquals(actual, expected)

            const cid = CID.parse(actual, base58btc.decoder)
            assertEquals(cid.code, 0x0200)
            assertEquals(cid.byteLength, 39)
            assertEquals(cid.multihash.code, 45600)
            assertEquals(cid.version, 1)
        })
    }
})
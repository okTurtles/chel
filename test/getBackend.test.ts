'use strict'

import { assert, assertRejects, path } from '../src/deps.ts'
import { getBackend } from '../src/utils.ts'

const exists = (path: string): Promise<boolean> => Deno.stat(path).then(() => true).catch(() => false)

const fakeDataFolder = './test/data/nonexistent'
const fakeDatabaseFilepath = './test/data/sqlite/nonexistent.db'
const realDatabaseFilepath = './test/data/sqlite/groupincome.db'
const realDataFolder = './test/data/fs'
const realFilepath = './test/assets/hello.txt'

Deno.test({
    name: 'Tests for getBackend()',
    async fn (t) {
        // === Error conditions === //

        await t.step('it should fail given a non-existing folder if option `create` was not `true`', async () => {
            const src = fakeDataFolder
            assert(!await exists(src))
            await assertRejects(() => getBackend(src))
            await assertRejects(() => getBackend(src, { type: 'fs', create: false }))
            await assertRejects(() => getBackend(src, { type: 'sqlite', create: false }))
            assert(!await exists(src), 'the folder should not have been created')
        })

        await t.step('FS - should fail given a file instead of a folder', async () => {
            const src = realFilepath
            assert(await exists(src))
            await assertRejects(() => getBackend(src, { type: 'fs', create: false }))
            await assertRejects(() => getBackend(src, { type: 'fs', create: true }))
            assert(await exists(src), 'the file should not have been deleted')
        })

        await t.step('SQLite - should fail given a folder instead of a file', async () => {
            const src = realDataFolder
            assert(await exists(src))
            await assertRejects(() => getBackend(src, { type: 'sqlite', create: false }))
            await assertRejects(() => getBackend(src, { type: 'sqlite', create: true }))
            assert(await exists(src), 'the folder should not have been deleted')
        })

        // === FS === //

        await t.step('FS - it should open an existing folder as `fs` by default', async () => {
            const src = realDataFolder
            assert(await exists(src))
            const fs = await getBackend(src)
            assert(!!fs)
            // It should also work with explicit options.
            assert(fs === await getBackend(src, { type: 'fs', create: false }))
            assert(fs === await getBackend(src, { type: 'fs', create: true }))
        })
        
        await t.step('FS - it should create the folder if missing and option `create` is `true`', async () => {
            const src = fakeDataFolder
            assert(!await exists(src))
            const fs = await getBackend(src, { type: 'fs', create: true })
            assert(fs.dataFolder === path.resolve(src))
            assert(await exists(src), 'the data folder should now exist')
        })
        await Deno.remove(fakeDataFolder).catch(() => {})
        
        // === SQLite === //

        await t.step('SQLite - it should open an existing .db file as `sqlite` by default', async () => {
            const src = realDatabaseFilepath
            assert(await exists(src))
            const sqlite = await getBackend(src)
            assert(!!sqlite)
            // It should also work with explicit options.
            assert(sqlite === await getBackend(src, { type: 'sqlite', create: false }))
            assert(sqlite === await getBackend(src, { type: 'sqlite', create: true }))
        })

        await t.step('SQLite - it should create the .db file if missing and option `create` is `true`', async () => {
            const src = fakeDatabaseFilepath
            assert(!await exists(src))
            const sqlite = await getBackend(src, { type: 'sqlite', create: true })
            assert(!!sqlite)
            assert(await exists(src), 'the .db file should now exist')
        })
        await Deno.remove(fakeDatabaseFilepath).catch(() => {})
    },
    sanitizeResources: false,
})
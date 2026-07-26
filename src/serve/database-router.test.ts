// import { assert } from 'jsr:@std/assert' // TODO: Add tests using assert
// 'jsr:@db/sqlite' loaded to prevent memory leak checker from failing test
// (otherwise, it'll complain that the sqlite dynamic library wasn't unloaded)
import 'jsr:@db/sqlite'
import { assertThrows } from 'jsr:@std/assert'
import { cloneDeep, omit } from 'npm:turtledash'
import RouterBackend from './database-router.ts'
import { RouterOptionsSchema } from './backend-schemas.ts'

// CID for shelter-contract-text.
const CID = '\x51\x1e\x01'

const randomKeyWithPrefix = (prefix: string): string => `${prefix}${globalThis.crypto.randomUUID().replaceAll('-', '')}`

const validConfig = {
  [CID]: {
    name: 'sqlite',
    options: {
      filepath: './test/temp/sqlite.db'
    }
  },
  '*': {
    name: 'fs',
    options: {
      dirname: './test/temp',
      skipFsCaseSensitivityCheck: true,
    }
  }
}

const db = new RouterBackend(validConfig)

Deno.test({
  name: 'RouterOptionsSchema validation',
  async fn (t: Deno.TestContext) {
    await t.step('should accept a valid config', () => {
      const result = RouterOptionsSchema.safeParse(validConfig)
      if (!result.success) throw new Error(`Expected success but got ${result.error.issues.length} errors`)
    })

    await t.step('should reject configs missing a * key', () => {
      const config = omit(validConfig, ['*'])
      const result = RouterOptionsSchema.safeParse(config)
      if (result.success || result.error.issues.length !== 1) throw new Error(`Expected 1 error but got ${result.success ? 0 : result.error.issues.length}`)
    })

    await t.step('should reject config entries missing a name', () => {
      const config = cloneDeep(validConfig)
      delete config['*'].name
      const result = RouterOptionsSchema.safeParse(config)
      if (result.success || result.error.issues.length !== 1) throw new Error(`Expected 1 error but got ${result.success ? 0 : result.error.issues.length}`)
    })
  }
})

Deno.test({
  name: 'RouterBackend::constructor',
  async fn (t: Deno.TestContext) {
    await t.step('rejects a config missing the "*" fallback', () => {
      assertThrows(
        () => new RouterBackend({ 'gi.contracts/': { name: 'fs', options: {} } }),
        Error
      )
    })

    await t.step('rejects a config whose entry options are not an object', () => {
      assertThrows(
        // @ts-expect-error: intentionally invalid, options must be an object
        () => new RouterBackend({ '*': { name: 'fs', options: 'not-an-object' } }),
        Error
      )
    })

    await t.step('rejects a config with an unknown backend name', () => {
      assertThrows(
        () => new RouterBackend({ '*': { name: 'mongodb', options: {} } }),
        Error
      )
    })
  }
})

Deno.test({
  name: 'RouterBackend::lookupBackend',
  async fn (t: Deno.TestContext) {
    // Setup
    await db.init()

    try {
      await t.step('should find the right backend for keys starting with configured prefixes', () => {
        for (const keyPrefix of Object.keys(db.config)) {
          if (keyPrefix === '*') continue
          const key = randomKeyWithPrefix (keyPrefix)
          const actual = db.lookupBackend(key)
          const expected = db.backends[keyPrefix]
          if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`)
        }
      })

      await t.step('should find the right backend for keys equal to configured prefixes', () => {
        for (const keyPrefix of Object.keys(db.config)) {
          const key = keyPrefix
          const actual = db.lookupBackend(key)
          const expected = db.backends[keyPrefix]
          if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`)
        }
      })

      await t.step('should return the fallback backend for keys not matching any configured prefix', () => {
        const key = 'foo'

        const actual = db.lookupBackend(key)
        const expected = db.backends['*']
        if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`)
      })
    } finally {
      // Teardown
      await db.clear()
    }
  }
})

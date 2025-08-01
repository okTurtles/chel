import { assert } from '~/deps.ts'
import RouterBackend from './database-router.ts'
import { cloneDeep, omit } from '~/deps.ts'

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
      dirname: './test/temp'
    }
  }
}

const db = new RouterBackend({ config: validConfig })

Deno.test({
  name: 'DatabaseRouter::validateConfig',
  async fn (t: Deno.TestContext) {
    await t.step('should accept a valid config', () => {
      const errors = db.validateConfig(validConfig)
      if (errors.length !== 0) throw new Error(`Expected 0 errors but got ${errors.length}`)
    })

    await t.step('should reject configs missing a * key', () => {
      const config = omit(validConfig, ['*'])
      const errors = db.validateConfig(config)
      if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`)
    })

    await t.step('should reject config entries missing a name', () => {
      const config = cloneDeep(validConfig)
      delete config['*'].name
      const errors = db.validateConfig(config)
      if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`)
    })
  }
})

Deno.test({
  name: 'DatabaseRouter::lookupBackend',
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

import { assertEquals } from 'jsr:@std/assert'
import { validateTomlConfig } from './validateConfig.ts'

Deno.test({
  name: 'chel.toml validation',
  async fn (t) {
    await t.step('accepts a complete, valid config with no warnings or errors', () => {
      const result = validateTomlConfig({
        appManifest: './chelonia.json',
        server: {
          appDir: '.',
          host: '0.0.0.0',
          port: 8000,
          dashboardPort: 8888,
          fileUploadMaxBytes: 1024,
          logLevel: 'debug',
          messages: [{ type: 'info', text: 'hi' }],
          maxEventsBatchSize: 500,
          archiveMode: false,
          signup: {
            disabled: false,
            limit: { disabled: false, minute: 2, hour: 10, day: 50 },
            vapid: { email: 'a@b.c' }
          },
          vapid: { email: 'a@b.c' }
        },
        database: {
          backend: 'redis',
          lruNumItems: 1000,
          backendOptions: {
            fs: { dirname: 'data', depth: 2, keyChunkLength: 2 },
            sqlite: { filepath: 'data/db.sqlite' },
            redis: { url: 'redis://localhost:6379' },
            router: { '*': { name: 'fs', options: {} } }
          }
        }
      })
      assertEquals(result.warnings, [])
      assertEquals(result.errors, [])
    })

    await t.step('accepts an empty config (nothing is mandatory)', () => {
      const result = validateTomlConfig({})
      assertEquals(result.warnings, [])
      assertEquals(result.errors, [])
    })

    await t.step('warns on an unknown top-level key without erroring', () => {
      const result = validateTomlConfig({ frobnicate: true })
      assertEquals(result.errors, [])
      assertEquals(result.warnings.length, 1)
      assertEquals(result.warnings[0], 'unknown key frobnicate')
    })

    await t.step('warns on an unknown nested key and suggests the intended key', () => {
      const result = validateTomlConfig({ server: { signup: { xdisabled: true } } })
      assertEquals(result.errors, [])
      assertEquals(result.warnings.length, 1)
      assertEquals(result.warnings[0], 'unknown key server.signup.xdisabled (did you mean disabled?)')
    })

    await t.step('reports multiple unknown keys at once', () => {
      const result = validateTomlConfig({ server: { foo: 1, bar: 2 } })
      assertEquals(result.errors, [])
      assertEquals(result.warnings.sort(), [
        'unknown key server.bar',
        'unknown key server.foo'
      ])
    })

    await t.step('errors on an invalid database backend value', () => {
      const result = validateTomlConfig({ database: { backend: 'mongodb' } })
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
      assertEquals(
        result.errors[0],
        'database.backend: "backend" must be one of: mem, fs, sqlite, redis, router'
      )
    })

    await t.step('errors on an out-of-range port', () => {
      const result = validateTomlConfig({ server: { port: 70000 } })
      assertEquals(result.errors.length, 1)
      assertEquals(
        result.errors[0],
        'server.port: must be an integer between 1 and 65535'
      )
    })

    await t.step('errors on a non-positive integer where a positive int is required', () => {
      const result = validateTomlConfig({ database: { lruNumItems: -5 } })
      assertEquals(result.errors.length, 1)
      assertEquals(
        result.errors[0],
        'database.lruNumItems: must be a positive integer'
      )
    })

    await t.step('errors on a value of the wrong type', () => {
      const result = validateTomlConfig({ server: { port: '8000' } })
      assertEquals(result.errors.length, 1)
    })

    await t.step('errors on a redis url that is not a redis(s):// or unix:// url', () => {
      const result = validateTomlConfig({
        database: { backend: 'redis', backendOptions: { redis: { url: 'localhost:6379' } } }
      })
      assertEquals(result.errors.length, 1)
      assertEquals(
        result.errors[0],
        'database.backendOptions.redis.url: "url" must begin with redis://, rediss://, or unix://'
      )
    })

    await t.step('accepts rediss:// and unix:// redis urls', () => {
      for (const url of ['rediss://example.com:6379', 'unix:///var/run/redis.sock']) {
        const result = validateTomlConfig({
          database: { backend: 'redis', backendOptions: { redis: { url } } }
        })
        assertEquals(result.errors, [], `expected no errors for ${url}`)
      }
    })

    await t.step('validates inactive backend options (regression for surprise errors)', () => {
      // backend is 'redis', but a malformed fs option should still be caught.
      const result = validateTomlConfig({
        database: {
          backend: 'redis',
          backendOptions: { fs: { depth: 'not-a-number' } }
        }
      })
      assertEquals(result.errors.length, 1)
      assertEquals(result.warnings, [])
    })

    await t.step('warns on unknown keys inside backend options', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { sqlite: { bogus: true } } }
      })
      assertEquals(result.errors, [])
      assertEquals(result.warnings.length, 1)
      assertEquals(result.warnings[0], 'unknown key database.backendOptions.sqlite.bogus')
    })

    await t.step('errors when the top-level value is not an object', () => {
      const result = validateTomlConfig('not an object')
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
    })

    await t.step('reports both warnings and errors together', () => {
      const result = validateTomlConfig({
        server: { typoKey: 1, port: 999999 }
      })
      assertEquals(result.warnings, ['unknown key server.typoKey'])
      assertEquals(result.errors.length, 1)
    })
  }
})

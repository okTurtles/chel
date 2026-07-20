import { assertEquals, assertRejects } from 'jsr:@std/assert'
import { validateTomlConfig, ConfigSchema, knownKeysFor, validateConfigFile } from './validateConfig.ts'
import { RouterConfigEntrySchema } from './serve/backend-schemas.ts'
import { nconfDefaults } from './config-defaults.ts'

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
            limit: { disabled: false, minute: 2, hour: 10, day: 50 }
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

    await t.step('errors on a zero signup rate limit (runtime treats 0 as a default)', () => {
      const result = validateTomlConfig({ server: { signup: { limit: { minute: 0 } } } })
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
      assertEquals(
        result.errors[0],
        'server.signup.limit.minute: must be a positive integer'
      )
    })

    await t.step('errors on non-integer fs depth and keyChunkLength', () => {
      for (const key of ['depth', 'keyChunkLength'] as const) {
        const result = validateTomlConfig({
          database: { backendOptions: { fs: { [key]: 2.5 } } }
        })
        assertEquals(result.warnings, [], `expected no warnings for ${key}`)
        assertEquals(result.errors.length, 1, `expected one error for ${key}`)
        if (!result.errors[0].startsWith(`database.backendOptions.fs.${key}:`)) {
          throw new Error(`Unexpected error for ${key}: ${result.errors[0]}`)
        }
      }
    })

    await t.step('accepts an fs depth of 0 (explicitly disables sharding)', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { fs: { depth: 0 } } }
      })
      assertEquals(result.warnings, [])
      assertEquals(result.errors, [])
    })

    await t.step('rejects a negative fs depth', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { fs: { depth: -1 } } }
      })
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
    })

    await t.step('rejects an fs keyChunkLength of 0', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { fs: { keyChunkLength: 0 } } }
      })
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
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

    await t.step('suggests the intended key for a typo inside backend options', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { sqlite: { filepat: 'data/db.sqlite' } } }
      })
      assertEquals(result.errors, [])
      assertEquals(result.warnings.length, 1)
      assertEquals(
        result.warnings[0],
        'unknown key database.backendOptions.sqlite.filepat (did you mean filepath?)'
      )
    })

    await t.step('errors when a router config is missing the "*" fallback', () => {
      const result = validateTomlConfig({
        database: {
          backendOptions: {
            router: { 'gi.contracts/': { name: 'fs', options: {} } }
          }
        }
      })
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
      assertEquals(
        result.errors[0],
        'database.backendOptions.router: router backend requires a "*" (fallback) entry'
      )
    })

    await t.step('suggests the intended key for a typo inside a router entry', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { router: { '*': { name: 'fs', options: {}, naem: 'x' } } } }
      })
      assertEquals(result.errors, [])
      assertEquals(result.warnings.length, 1)
      assertEquals(
        result.warnings[0],
        'unknown key database.backendOptions.router.*.naem (did you mean name?)'
      )
    })

    await t.step('errors on a router entry with an unknown backend name', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { router: { '*': { name: 'mongodb', options: {} } } } }
      })
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
      assertEquals(
        result.errors[0],
        'database.backendOptions.router.*.name: "name" must be one of: fs, sqlite, redis (router backends cannot be nested)'
      )
    })

    await t.step('errors on a nested router backend name', () => {
      const result = validateTomlConfig({
        database: { backendOptions: { router: { '*': { name: 'router', options: {} } } } }
      })
      assertEquals(result.warnings, [])
      assertEquals(result.errors.length, 1)
    })

    await t.step('warns that server.signup.vapid is not a recognised key', () => {
      const result = validateTomlConfig({
        server: { signup: { vapid: { email: 'a@b.c' } } }
      })
      assertEquals(result.errors, [])
      assertEquals(result.warnings.length, 1)
      assertEquals(result.warnings[0], 'unknown key server.signup.vapid')
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

    await t.step('nconf defaults conform to ConfigSchema', () => {
      const result = ConfigSchema.safeParse(nconfDefaults)
      if (!result.success) {
        throw new Error(`nconfDefaults do not conform to ConfigSchema: ${JSON.stringify(result.error.issues)}`)
      }
    })

    await t.step('knownKeysFor stays in sync with ConfigSchema', () => {
      // NOTE: this walk introspects Zod internals (`ZodOptional.unwrap()` and
      // `ZodObject.shape`) that are coupled to the current Zod major version
      // (v4). A Zod upgrade that renames or removes them would make the walk
      // visit fewer nodes; the size assertion below turns that silent skip into
      // a loud failure.
      interface SchemaNode {
        unwrap?: () => SchemaNode
        shape?: Record<string, SchemaNode>
      }
      const schemaKeys = new Map<string, string[]>()
      const walk = (node: SchemaNode, segments: string[]) => {
        const unwrapped = typeof node.unwrap === 'function' ? node.unwrap() : node
        const shape = unwrapped?.shape
        // Record-typed nodes (e.g. `database.backendOptions.router`) have no
        // `.shape`: they accept arbitrary keys, so there is no fixed known-key
        // list to keep in sync and they are intentionally excluded here.
        if (!shape) return
        schemaKeys.set(segments.join('.'), Object.keys(shape))
        for (const [key, child] of Object.entries(shape)) {
          walk(child, [...segments, key])
        }
      }
      walk(ConfigSchema as SchemaNode, [])

      // Fail loudly if a Zod change makes the walk silently visit fewer (or
      // more) strictObject paths, which would otherwise hide real drift.
      assertEquals(
        schemaKeys.size,
        10,
        'schema walk visited an unexpected number of strictObject paths; ' +
          'update this count if ConfigSchema changed intentionally'
      )

      for (const [path, keys] of schemaKeys) {
        const segments = path ? path.split('.') : []
        assertEquals(
          knownKeysFor(segments).sort(),
          keys.sort(),
          `knownKeysFor drift at "${path || '(root)'}"`
        )
      }

      assertEquals(
        knownKeysFor(['database', 'backendOptions', 'router', '*']).sort(),
        Object.keys(RouterConfigEntrySchema.shape).sort(),
        'knownKeysFor drift at router entry'
      )
    })
  }
})

Deno.test({
  name: 'validateConfigFile',
  async fn (t) {
    await Deno.mkdir('./test/temp', { recursive: true })
    const tmpDir = await Deno.makeTempDir({ dir: './test/temp', prefix: 'validateConfig-' })
    const write = async (name: string, contents: string): Promise<string> => {
      const filePath = `${tmpDir}/${name}`
      await Deno.writeTextFile(filePath, contents)
      return filePath
    }
    try {
      await t.step('ignores a missing config file (ENOENT)', async () => {
        // Mirrors nconf: a missing chel.toml is the common case, not an error.
        await validateConfigFile(`${tmpDir}/does-not-exist.toml`)
      })

      await t.step('throws a friendly error on a TOML syntax error', async () => {
        const filePath = await write('bad-syntax.toml', '[server\nport = 8000\n')
        const err = await assertRejects(
          () => validateConfigFile(filePath),
          Error,
          'Could not parse'
        )
        if (!err.message.includes(filePath)) {
          throw new Error(`Expected the error to mention the file path, got: ${err.message}`)
        }
      })

      await t.step('aggregates all value-shape errors into a single thrown error', async () => {
        const filePath = await write(
          'bad-values.toml',
          '[server]\nport = 999999\n\n[database]\nlruNumItems = -5\n'
        )
        const err = await assertRejects(
          () => validateConfigFile(filePath),
          Error,
          `Invalid ${filePath}:`
        )
        if (!err.message.includes('server.port')) {
          throw new Error(`Expected a server.port error, got: ${err.message}`)
        }
        if (!err.message.includes('database.lruNumItems')) {
          throw new Error(`Expected a database.lruNumItems error, got: ${err.message}`)
        }
      })

      await t.step('resolves without throwing for a valid config file', async () => {
        const filePath = await write('valid.toml', '[server]\nport = 8000\n')
        await validateConfigFile(filePath)
      })
    } finally {
      await Deno.remove(tmpDir, { recursive: true })
    }
  }
})

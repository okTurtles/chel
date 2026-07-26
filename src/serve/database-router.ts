import type { Buffer } from 'node:buffer'
import { RouterOptionsSchema as ConfigSchema } from './backend-schemas.ts'
import DatabaseBackend from './DatabaseBackend.ts'
import { tagBackendError } from './db-errors.ts'

type ConfigEntry = { name: string; options: Record<string, unknown> }
type Config = {
  [key: string]: ConfigEntry
}

export default class RouterBackend extends DatabaseBackend {
  backends!: { [key: string]: DatabaseBackend }
  config!: Config

  constructor (config: Config = {}) {
    super()
    ConfigSchema.parse(config)
    this.config = Object.fromEntries(
      Object.entries(config).sort((a, b) => b[0].length - a[0].length)
    ) as Config
  }

  lookupBackend (key: string): DatabaseBackend {
    const { backends, config } = this
    const keyPrefixes = Object.keys(config)
    for (let i = 0; i < keyPrefixes.length; i++) {
      if (key.startsWith(keyPrefixes[i])) {
        return backends[keyPrefixes[i]]
      }
    }
    return backends['*']
  }

  validateConfig (config: Config): Array<{ msg: string }> {
    // Validates a config without throwing, returning an array of error objects.
    // The constructor already validates via ConfigSchema.parse(); this method
    // exists for callers (e.g. tests) that need a non-throwing check.
    const result = ConfigSchema.safeParse(config)
    if (result.success) return []
    return result.error.issues.map((issue) => ({
      msg: issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message
    }))
  }

  async init (): Promise<void> {
    // Init backends
    this.backends = Object.create(null) as { [key: string]: DatabaseBackend }
    const entries = Object.entries(this.config)
    await Promise.all(entries.map(async entry => {
      const [keyPrefix, { name, options }] = entry
      let Ctor
      try {
        Ctor = (await import(`./database-${name}.ts`)).default
      } catch (e) {
        throw tagBackendError(name, e)
      }
      const backend = new Ctor(options)
      try {
        await backend.init()
      } catch (e) {
        throw tagBackendError(name, e)
      }
      this.backends[keyPrefix] = backend
    }))
  }

  async readData (key: string): Promise<Buffer | string | void> {
    return await this.lookupBackend(key).readData(key)
  }

  async writeData (key: string, value: Buffer | string): Promise<void> {
    return await this.lookupBackend(key).writeData(key, value)
  }

  async deleteData (key: string): Promise<void> {
    return await this.lookupBackend(key).deleteData(key)
  }

  async clear (): Promise<void> {
    for (const backend of new Set(Object.values(this.backends))) {
      try {
        await backend.clear()
      } catch (e) {
        const prefix = Object.entries(this.backends).find(([, b]) => b === backend)![0]
        console.error(e, `Error clearing DB for prefix ${prefix}`)
      }
    }
  }

  async close () {
    for (const backend of new Set(Object.values(this.backends))) {
      try {
        await backend.close()
      } catch (e) {
        const prefix = Object.entries(this.backends).find(([, b]) => b === backend)![0]
        console.error(e, `Error closing DB for prefix ${prefix}`)
      }
    }
  }

  async * iterKeys () {
    for (const backend of new Set(Object.values(this.backends))) {
      yield * backend.iterKeys()
    }
  }

  async keyCount () {
    let count = 0
    for (const backend of new Set(Object.values(this.backends))) {
      count += await backend.keyCount()
    }
    return count
  }
}

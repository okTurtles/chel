import type { Buffer } from 'node:buffer'
import * as z from 'npm:zod'
import DatabaseBackend from './DatabaseBackend.ts'
import { errorMessage } from '~/utils.ts'

const ConfigEntrySchema = z.strictObject({
  name: z.string(),
  options: z.object()
})
const ConfigSchema = z.intersection(
  z.object({ '*': ConfigEntrySchema }),
  z.record(z.string(), ConfigEntrySchema)
)

type ConfigEntry = { name: string; options: Record<string, unknown> }
type Config = {
  [key: string]: ConfigEntry
}

export default class RouterBackend extends DatabaseBackend {
  backends!: { [key: string]: DatabaseBackend }
  config!: Config

  constructor (config: Config = {}) {
    super()
    // Return a sorted copy where entries with longer keys come first.
    ConfigSchema.parse(config)
    const configCopy = Object.fromEntries(Object.entries(config).sort((a, b) => b[0].length - a[0].length)) as Config
    const errors = this.validateConfig(configCopy)
    if (errors.length) {
      throw new Error(`[${this.constructor.name}] ${errors.length} error(s) found in your config.`, { cause: errors })
    }
    this.config = configCopy
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

  validateConfig (config: Config): Array<{ msg: string; entry?: [string, ConfigEntry] }> {
    const errors = []
    if (!config['*']) {
      errors.push({ msg: 'Missing key: "*" (fallback storage is required)' })
    }
    for (const entry of Object.entries(config)) {
      const value = entry[1]
      if (typeof value?.name !== 'string' || typeof value?.options !== 'object') {
        errors.push({ msg: 'entry value must be of type { name: string, options: Object }', entry })
        continue
      }
      if (value.name === 'router') {
        errors.push({ msg: 'Router backends cannot be nested.', entry })
        continue
      }
    }
    return errors
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
        throw new Error(
          `sub-backend "${name}" module failed to load: ${errorMessage(e)}`,
          { cause: e }
        )
      }
      const backend = new Ctor(options)
      try {
        await backend.init()
      } catch (e) {
        // Wrap the failure with the sub-backend name so that callers can
        // produce a clear, backend-specific error message, without mutating
        // the original thrown error.
        const wrapped = new Error(errorMessage(e), { cause: e })
        ;(wrapped as { backendName?: string }).backendName = name
        throw wrapped
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

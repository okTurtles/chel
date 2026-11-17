import type { Buffer } from 'node:buffer'
import { RouterOptionsSchema as ConfigSchema } from './backend-schemas.ts'
import DatabaseBackend from './DatabaseBackend.ts'
import { tagBackendError } from './db-errors.ts'
import { sqliteFilepath } from './sqlite-filepath.ts'

type ConfigEntry = { name: string; options: Record<string, unknown> }
type Config = {
  [key: string]: ConfigEntry
}

// Which database an entry opens. SQLite files are compared by their real
// path, so two spellings of one file match. Other backends match when their
// options do.
const databaseOf = ({ name, options }: ConfigEntry): string =>
  name === 'sqlite'
    ? `sqlite:${sqliteFilepath(options as { filepath?: string })}`
    : `${name}:${JSON.stringify(options, Object.keys(options).sort())}`

async function openBackend ({ name, options }: ConfigEntry): Promise<DatabaseBackend> {
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
  return backend
}

export default class RouterBackend extends DatabaseBackend {
  backends!: { [key: string]: DatabaseBackend }
  config!: Config

  constructor (config: Config = {}) {
    super()
    const parsed = ConfigSchema.parse(config)
    this.config = Object.fromEntries(
      Object.entries(parsed).sort((a, b) => b[0].length - a[0].length)
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

  async init (): Promise<void> {
    this.backends = Object.create(null) as { [key: string]: DatabaseBackend }
    // Prefixes that point at the same database share one backend. With one
    // each, iterKeys and keyCount would go through that database once per
    // prefix, and `chel migrate` would copy its keys more than once.
    const opened = new Map<string, DatabaseBackend>()
    // One at a time, so a file an earlier entry created has a real path by
    // the time a later entry is compared with it
    for (const [keyPrefix, entry] of Object.entries(this.config)) {
      let backend = opened.get(databaseOf(entry))
      if (!backend) {
        backend = await openBackend(entry)
        opened.set(databaseOf(entry), backend)
      }
      this.backends[keyPrefix] = backend
    }
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

import { Buffer } from 'node:buffer'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import DatabaseBackend from './DatabaseBackend.ts'
import type { IDatabaseBackend } from './DatabaseBackend.ts'

type ConfigEntry = { name: string; options: Record<string, unknown> }
type Config = {
  [key: string]: ConfigEntry
}

const {
  // Tried first by the config lookup.
  // Define this if your config JSON comes as a string from an envar's contents.
  GI_PERSIST_ROUTER_CONFIG,
  // Tried next.
  // Define this if your config comes from a JSON file.
  GI_PERSIST_ROUTER_CONFIG_PATH = './database-router-config.json'
} = process.env

export default class RouterBackend extends DatabaseBackend implements IDatabaseBackend {
  backends!: { [key: string]: IDatabaseBackend }
  config!: Config

  constructor (options: { config?: Config } = {}) {
    super()
    if (options.config) this.config = options.config
  }

  lookupBackend (key: string): IDatabaseBackend {
    const { backends, config } = this
    const keyPrefixes = Object.keys(config)
    for (let i = 0; i < keyPrefixes.length; i++) {
      if (key.startsWith(keyPrefixes[i])) {
        return backends[keyPrefixes[i]]
      }
    }
    return backends['*']
  }

  async readConfig (): Promise<Config> {
    if (GI_PERSIST_ROUTER_CONFIG) {
      console.info('[database-router] Reading config from envar GI_PERSIST_ROUTER_CONFIG')
    } else {
      console.info('[database-router] Reading config from path', GI_PERSIST_ROUTER_CONFIG_PATH)
    }
    const configString = GI_PERSIST_ROUTER_CONFIG || await readFile(resolve(GI_PERSIST_ROUTER_CONFIG_PATH), 'utf8')
    const config = JSON.parse(configString)
    // Return a sorted copy where entries with longer keys come first.
    return Object.fromEntries(Object.entries(config).sort((a, b) => b[0].length - a[0].length)) as Config
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
    // Init config if not done yet.
    if (!this.config) this.config = await this.readConfig()
    const errors = this.validateConfig(this.config)
    if (errors.length) {
      throw new Error(`[${this.constructor.name}] ${errors.length} error(s) found in your config.`, { cause: errors })
    }
    // Init backends
    this.backends = Object.create(null) as { [key: string]: IDatabaseBackend }
    const entries = Object.entries(this.config)
    await Promise.all(entries.map(async entry => {
      const [keyPrefix, { name, options }] = entry
      const Ctor = (await import(`./database-${name}.ts`)).default
      const backend = new Ctor(options)
      await backend.init()
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
      await backend.clear()
    }
  }
}

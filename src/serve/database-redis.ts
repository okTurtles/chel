import { Buffer } from 'node:buffer'
import { RESP_TYPES, createClient, type RedisClientType } from 'npm:redis'
import DatabaseBackend from './DatabaseBackend.ts'

export default class RedisBackend extends DatabaseBackend {
  db: RedisClientType | null = null
  url: string | undefined

  constructor (options: { url?: string } = {}) {
    super()
    this.url = url
  }

  async init () {
    this.db = createClient({
      RESP: 3,
      url: this.url
    }).withTypeMapping({
      [RESP_TYPES.BLOB_STRING]: Buffer
    })
    await this.db!.connect()
  }

  // Useful in test hooks.
  async clear (): Promise<void> {
    await this.db!.flushAll()
  }

  // deno-lint-ignore require-await
  async readData (key: string): Promise<Buffer | string | void> {
    return await this.db!.get(key) ?? undefined
  }

  async writeData (key: string, value: Buffer | string): Promise<void> {
    await this.db!.set(key, value)
  }

  async deleteData (key: string): Promise<void> {
    await this.db!.del(key)
  }

  close () {
    this.db!.destroy()
  }
}

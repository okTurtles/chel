import { Buffer } from 'node:buffer'
import { RESP_TYPES, createClient, type RedisClientType } from 'npm:redis'
import DatabaseBackend from './DatabaseBackend.ts'

export default class RedisBackend extends DatabaseBackend {
  db: RedisClientType | null = null
  url: string | undefined

  constructor (options: { url?: string } = {}) {
    super()
    this.url = options.url
  }

  async init () {
    const db = createClient({
      RESP: 3,
      url: this.url
    }).withTypeMapping({
      [RESP_TYPES.BLOB_STRING]: Buffer
    })
    await db.connect()
    this.db = db as unknown as RedisClientType
  }

  // Useful in test hooks.
  async clear (): Promise<void> {
    await this.db!.flushAll()
  }

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

  async * iterKeys () {
    const keys = await this.db!.keys('*')
    for (const key of keys) {
      yield key
    }
  }
}

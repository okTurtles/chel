import { Buffer } from 'node:buffer'
import { basename, dirname, resolve } from 'node:path'
import { createClient, type RedisClientType } from 'npm:redis'
import DatabaseBackend from './DatabaseBackend.ts'

export default class RedisBackend extends DatabaseBackend {
  dataFolder: string = ''
  db: RedisClientType | null = null
  filename: string = ''
  readStatement: { get: (key: string) => { value?: Buffer | string } | undefined } | null = null
  writeStatement: { run: (key: string, value: Buffer | string) => unknown } | null = null
  deleteStatement: { run: (key: string) => unknown } | null = null

  constructor (options: { filepath?: string } = {}) {
    super()
    const { filepath } = options
    const resolvedPath = resolve(filepath!)
    this.dataFolder = dirname(resolvedPath)
    this.filename = basename(resolvedPath)
  }

  async init () {
    this.db = createClient()
    await this.db.connect()
    /* const { dataFolder, filename } = this

    await mkdir(dataFolder, { mode: 0o750, recursive: true })

    if (this.db) {
      throw new Error(`The ${filename} SQLite database is already open.`)
    }
    this.db = new sqlite.Database(join(dataFolder, filename))
    this.run('CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)')
    console.info(`Connected to the ${filename} SQLite database.`)
    this.readStatement = this.db.prepare('SELECT value FROM Data WHERE key = ?')
    this.writeStatement = this.db.prepare('REPLACE INTO Data(key, value) VALUES(?, ?)')
    this.deleteStatement = this.db.prepare('DELETE FROM Data WHERE key = ?')
    */
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

// @deno-types="npm:@types/better-sqlite3"
import Database from 'npm:better-sqlite3'
import type { Database as SQLiteDB, Statement } from 'npm:@types/better-sqlite3'
import { Buffer } from 'node:buffer'
import { mkdir } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { SqliteOptionsSchema as ConfigSchema, type SqliteOptions } from './backend-schemas.ts'
import DatabaseBackend from './DatabaseBackend.ts'

// Shapes of the rows the prepared statements below return. Spelled out so the
// type checker sees the real driver API: this backend is only ever reached
// through a dynamic import, so a misspelled method (`iter()` for `iterate()`,
// say) would otherwise only surface once someone selected the sqlite backend at
// runtime.
type DataRow = { value?: Buffer | string }
type KeyRow = { key: string }
type CountRow = { count: number }

export default class SqliteBackend extends DatabaseBackend {
  dataFolder: string = 'data'
  db: SQLiteDB | null = null
  filename: string = 'chelonia.db'
  readStatement: Statement<[string], DataRow> | null = null
  writeStatement: Statement<[string, Buffer | string]> | null = null
  deleteStatement: Statement<[string]> | null = null
  iterKeysStatement: Statement<[], KeyRow> | null = null
  keyCountStatement: Statement<[], CountRow> | null = null

  constructor (options: SqliteOptions = {}) {
    super()
    ConfigSchema.parse(options)
    const { filepath } = options
    if (!filepath) return
    const resolvedPath = resolve(filepath)
    this.dataFolder = dirname(resolvedPath)
    this.filename = basename(resolvedPath)
  }

  run (sql: string) {
    this.db!.prepare(sql).run()
  }

  async init () {
    const { dataFolder, filename } = this

    await mkdir(dataFolder, { mode: 0o750, recursive: true })

    if (this.db) {
      throw new Error(`The ${filename} SQLite database is already open.`)
    }
    this.db = new Database(join(dataFolder, filename))
    this.run('CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)')
    console.info(`Connected to the ${filename} SQLite database.`)
    // Cast to BLOB so that values are always read back as raw bytes. Without
    // it, values stored as TEXT come back as JS strings, which is lossy for
    // the binary payloads Chelonia stores.
    this.readStatement = this.db.prepare<[string], DataRow>(
      'SELECT CAST(value AS BLOB) value FROM Data WHERE key = ?'
    )
    this.writeStatement = this.db.prepare<[string, Buffer | string]>(
      'REPLACE INTO Data(key, value) VALUES(?, ?)'
    )
    this.deleteStatement = this.db.prepare<[string]>('DELETE FROM Data WHERE key = ?')
    this.iterKeysStatement = this.db.prepare<[], KeyRow>('SELECT key FROM Data')
    this.keyCountStatement = this.db.prepare<[], CountRow>('SELECT COUNT(*) count FROM Data')
  }

  // Useful in test hooks.
  // deno-lint-ignore require-await
  async clear (): Promise<void> {
    this.run('DELETE FROM Data')
  }

  // deno-lint-ignore require-await
  async readData (key: string): Promise<Buffer | string | void> {
    const row = this.readStatement!.get(key)
    // 'row' will be undefined if the key was not found.
    // Note: the CAST in the statement above makes every hit come back as raw
    // bytes, whatever type it was stored as.
    const value = row?.value
    if (ArrayBuffer.isView(value) && !Buffer.isBuffer(value)) {
      return Buffer.from(value)
    } else {
      return value
    }
  }

  async writeData (key: string, value: Buffer | string): Promise<void> {
    await this.writeStatement!.run(key, value)
  }

  async deleteData (key: string): Promise<void> {
    await this.deleteStatement!.run(key)
  }

  close () {
    this.db!.close()
  }

  async * iterKeys () {
    for (const row of this.iterKeysStatement!.iterate()) {
      yield row.key
    }
  }

  async keyCount () {
    const result = await this.keyCountStatement!.get()
    return result?.count ?? 0
  }
}

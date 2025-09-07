import { Buffer } from 'node:buffer'
import { mkdir } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { sqlite, SQLiteDB } from '~/deps.ts'
import DatabaseBackend from './DatabaseBackend.ts'

export default class SqliteBackend extends DatabaseBackend {
  dataFolder: string = ''
  db: SQLiteDB | null = null
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

  run (sql: string) {
    this.db!.prepare(sql).run()
  }

  async init () {
    const { dataFolder, filename } = this

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
    // Note: sqlite remembers the type of every stored value, therefore we
    // can return the value as-is.
    return row?.value
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
}

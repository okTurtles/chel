// @deno-types="npm:@types/better-sqlite3"
import Database from 'npm:better-sqlite3'
import type { Database as SQLiteDB, Statement } from 'npm:@types/better-sqlite3'
import { Buffer } from 'node:buffer'
import { mkdir } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import {
  SQLITE_DEFAULT_FILEPATH,
  SqliteOptionsSchema as ConfigSchema,
  type SqliteOptions
} from './backend-schemas.ts'
import DatabaseBackend from './DatabaseBackend.ts'

// Shapes of the rows the prepared statements below return. Spelled out so the
// type checker sees the real driver API: a misspelled method (`iter()` for
// `iterate()`, say) would otherwise only surface once someone selected the
// sqlite backend at runtime, since `src/migrate.ts` and `database.ts` both
// reach this module through a dynamic import.
//
// Two limits on how much that buys, so the next reader does not over-trust it:
//   - The bundle does not preserve the dynamic import: `deno task build`
//     hoists this module's `npm:better-sqlite3` import to the top of
//     `build/main.js`, so a released binary loads the driver eagerly.
//   - `@types/better-sqlite3` is pinned at 9.6.0 (the newest published typing;
//     DefinitelyTyped has no v10-v13 release) against a v13 runtime, so the
//     checker only knows the v9-era API. Anything v13 added or changed is
//     invisible to it, which is why `database-sqlite.test.ts` exercises the
//     real driver. Re-pin once DefinitelyTyped catches up.
type DataRow = { value?: Buffer | string }
type KeyRow = { key: string }
type CountRow = { count: number }

// Distinguishes "the native addon could not be loaded" from every other reason
// opening a database can fail (missing directory, bad permissions, corrupt
// file). Only the former is worth rewording: better-sqlite3 resolves its
// prebuilt binary lazily, inside the Database constructor, and when no
// matching `.node` file is present it falls through to the node-gyp build
// locations and reports a missing `build/Release/better_sqlite3.node` — a path
// that means nothing to someone running a released binary.
//
// The case that reaches this in practice is musl: the releases embed the
// glibc prebuild for their platform, so on Alpine and friends the lookup finds
// nothing. Returns null when the failure is unrelated, so the original error
// keeps propagating untouched.
//
// Recognized by message alone, not by error code: a MODULE_NOT_FOUND that does
// not name the addon's file is some other module missing and must keep its own
// message, while every shape the addon resolver produces (Node's
// 'Cannot find module ...better_sqlite3.node', or a prebuilds/ path reported
// without a standard code) does name it.
export function rewordedAddonLoadError (cause: unknown): Error | null {
  const message = cause instanceof Error ? cause.message : ''
  if (!/better_sqlite3\.node|prebuilds[\\/]/.test(message)) return null
  return new Error(
    'Could not load the SQLite native addon. The pre-built binaries chel ships ' +
    'are linked against glibc, so musl-based distributions (Alpine, for ' +
    'example) are not covered; run chel from source with Deno there, or pick a ' +
    'different database backend.',
    { cause }
  )
}

export default class SqliteBackend extends DatabaseBackend {
  // Derived from the shared default rather than restating it, because
  // `chel migrate`'s same-file guard compares against the same constant.
  dataFolder: string = dirname(SQLITE_DEFAULT_FILEPATH)
  db: SQLiteDB | null = null
  filename: string = basename(SQLITE_DEFAULT_FILEPATH)
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

  // Every method below reaches the connection and the prepared statements
  // through these two, so that using the backend after close() reports what
  // actually happened instead of throwing from inside the driver (or, worse,
  // dereferencing null).
  private openDb (): SQLiteDB {
    if (!this.db) throw new Error(`The ${this.filename} SQLite database is not open.`)
    return this.db
  }

  private stmt<T> (statement: T | null): T {
    if (!statement) throw new Error(`The ${this.filename} SQLite database is not open.`)
    return statement
  }

  run (sql: string) {
    this.openDb().prepare(sql).run()
  }

  async init () {
    const { dataFolder, filename } = this

    await mkdir(dataFolder, { mode: 0o750, recursive: true })

    if (this.db) {
      throw new Error(`The ${filename} SQLite database is already open.`)
    }
    try {
      this.db = new Database(join(dataFolder, filename))
    } catch (e) {
      // The addon is resolved lazily by the constructor, so this is where a
      // missing prebuilt binary surfaces. Anything else is rethrown as-is.
      const addonError = rewordedAddonLoadError(e)
      if (addonError) throw addonError
      throw e
    }
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
    // 'row' will be undefined if the key was not found. The CAST in the
    // statement above makes every hit come back as raw bytes whatever type it
    // was stored as, and better-sqlite3 hands BLOB columns over as a Buffer,
    // so no conversion is needed here.
    return this.stmt(this.readStatement).get(key)?.value
  }

  async writeData (key: string, value: Buffer | string): Promise<void> {
    await this.stmt(this.writeStatement).run(key, value)
  }

  async deleteData (key: string): Promise<void> {
    await this.stmt(this.deleteStatement).run(key)
  }

  // Idempotent, and leaves the instance genuinely closed rather than half
  // open: without clearing the statements too, a later read would throw from
  // inside the driver, and init() would refuse to reopen with 'already open'.
  close () {
    if (!this.db) return
    this.db.close()
    this.db = null
    this.readStatement = null
    this.writeStatement = null
    this.deleteStatement = null
    this.iterKeysStatement = null
    this.keyCountStatement = null
  }

  // The cursor holds a read transaction open on this connection for as long as
  // it is alive, and better-sqlite3 rejects any write issued on a connection
  // that is mid-query ('This database connection is busy executing a query').
  // Callers must therefore drain this iterator before writing through the same
  // backend; see the note on DatabaseBackend.iterKeys.
  async * iterKeys () {
    for (const row of this.stmt(this.iterKeysStatement).iterate()) {
      yield row.key
    }
  }

  async keyCount () {
    const result = await this.stmt(this.keyCountStatement).get()
    return result?.count ?? 0
  }
}

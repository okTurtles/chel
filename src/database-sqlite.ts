import { path, sqlite, type PreparedQuery, type SQLiteDB } from './deps.ts'
import { checkKey } from './utils.ts'

const { DB } = sqlite

let db: SQLiteDB
let dbPath: string
let iterKeysStatement: PreparedQuery<[string]>
let readStatement: PreparedQuery<[string]>
let writeOnceStatement: PreparedQuery
let writeStatement: PreparedQuery

// deno-lint-ignore require-await
export async function initStorage (options: Record<string, unknown> = {}): Promise<void> {
  const { dirname, filename } = options
  const dataFolder = path.resolve(dirname as string)
  const filepath = path.join(dataFolder, filename as string)

  if (db !== undefined) {
    // If we already have an open DB for the given path, then return.
    if (filepath === dbPath) {
      return
    }
    // Close the old DB object since we're going to open a new one.
    db.close()
  }
  db = new DB(filepath)
  // Important: keep this in sync with the schema used in GroupIncome.
  db.execute('CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)')
  dbPath = filepath
  console.log('Connected to the %s SQLite database.', filepath)
  iterKeysStatement = db.prepareQuery<[string]>('SELECT key FROM Data')
  readStatement = db.prepareQuery<[string]>('SELECT value FROM Data WHERE key = ?')
  // Use "upsert" syntax to store an entry only if the key is not already in the DB.
  // https://www.sqlite.org/lang_upsert.html
  writeOnceStatement = db.prepareQuery('INSERT INTO Data(key, value) VALUES(?, ?) ON CONFLICT (key) DO NOTHING')
  writeStatement = db.prepareQuery('REPLACE INTO Data(key, value) VALUES(?, ?)')
}

export function count (): number {
  return db.query<[number]>('SELECT COUNT(*) FROM Data')[0][0]
}

// deno-lint-ignore require-await
export async function readData (key: string): Promise<Uint8Array | string | void> {
  // For some reason `[null]` is returned when the value is an empty Uint8Array.
  const maybeRow = readStatement.first([key])
  return maybeRow === undefined ? undefined : maybeRow[0] ?? new Uint8Array()
}

export async function* iterKeys (): AsyncGenerator<string> {
  for (const row of iterKeysStatement.iter()) {
    yield row[0]
  }
}

// deno-lint-ignore require-await
export async function writeData (key: string, value: Uint8Array | string): Promise<void> {
  checkKey(key)
  writeStatement.execute([key, value])
}

// deno-lint-ignore require-await
export async function writeDataOnce (key: string, value: Uint8Array | string): Promise<void> {
  checkKey(key)
  writeOnceStatement.execute([key, value])
}

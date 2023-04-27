import { path, sqlite } from './deps.ts'
import { checkKey } from './utils.ts'

const { DB } = sqlite

let db
let dbPath
let readStatement
let writeOnceStatement
let writeStatement

export function initStorage (options: Object = {}): Promise<void> {
  const { dirname, filename } = options
  const dataFolder = path.resolve(dirname)
  const filepath = path.join(dataFolder, filename)

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
  readStatement = db.prepareQuery('SELECT value FROM Data WHERE key = ?')
  // Use "upsert" syntax to store an entry only if the key is not already in the DB.
  // https://www.sqlite.org/lang_upsert.html
  writeOnceStatement = db.prepareQuery('INSERT INTO Data(key, value) VALUES(?, ?) ON CONFLICT (key) DO NOTHING')
  writeStatement = db.prepareQuery('REPLACE INTO Data(key, value) VALUES(?, ?)')
}

export function readData (key: string): Promise<Buffer | string> {
  // For some reason `[null]` is returned when the value is an empty Uint8Array.
  return readStatement.first([key])[0] ?? new Uint8Array()
}

export async function readKeys (): Promise<strings[]> {
  return Promise.resolve(db.query('SELECT key FROM Data').map(row => row[0]))
}

export async function writeData (key: string, value: Buffer | string): Promise<void> {
  checkKey(key)
  writeStatement.execute([key, value])
}


export async function writeDataOnce (key: string, value: Buffer | string): Promise<void> {
  checkKey(key)
  writeOnceStatement.execute([key, value])
}

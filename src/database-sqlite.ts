import { path, sqlite } from './deps.ts'

const { DB } = sqlite

let db
let dbPath
let writeStatement

export function checkKey (key: string): void {
  // Disallow unprintable characters, slashes, and TAB.
  if (/[\x00-\x1f\x7f\t\\/]/.test(key)) { // eslint-disable-line no-control-regex
    throw new Error(`bad key: ${JSON.stringify(key)}`)
  }
}

export function initStorage (sqlitedb: string): Promise<void> {
  const filepath = path.resolve(sqlitedb)

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
  // Use "upsert" syntax to store an entry only if the key is not already in the DB.
  // https://www.sqlite.org/lang_upsert.html
  writeStatement = db.prepareQuery('INSERT INTO Data(key, value) VALUES(?, ?) ON CONFLICT (key) DO NOTHING')
}

export function writeData (key: string, value: Buffer | string): Promise<void> {
  checkKey(key)
  writeStatement.execute([key, value])
}

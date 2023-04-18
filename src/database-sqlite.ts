import { path, sqlite } from './deps.ts'

const { DB } = sqlite

let db = null
let databaseFilename
let writeStatement

export function checkKey (key: string): void {
  if (/[/\\]/.test(key)) {
    throw new Error(`bad key: ${key}`)
  }
}

export function initStorage (filename: string): Promise<void> {
  if (db !== null && filename === databaseFilename) {
    return
  }
  if (db !== null && filename !== databaseFilename) {
    db.close()
  }
  db = new DB(path.resolve(filename), { mode: "write" })
  databaseFilename = filename
  console.log('Connected to the %s SQLite database.', filename)
  // Use "upsert" syntax to store an entry only if the key is not already in the DB.
  // https://www.sqlite.org/lang_upsert.html
  writeStatement = db.prepareQuery('INSERT INTO Data(key, value) VALUES(?, ?) ON CONFLICT (key) DO NOTHING')
}

export function writeData (key: string, value: Buffer | string): Promise<void> {
  checkKey(key)
  writeStatement.execute([key, value])
}

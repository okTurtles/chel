import { path, sqlite } from './deps.ts'

const { DB } = sqlite

let db = null
let databaseFilename
// let readStatement
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

  // readStatement = db.prepareQuery('SELECT value FROM Data WHERE key = ?')
  writeStatement = db.prepareQuery('REPLACE INTO Data(key, value) VALUES(?, ?)')
}

export function writeData (key: string, value: Buffer | string): Promise<void> {
  checkKey(key)
  writeStatement.execute([key, value])
}

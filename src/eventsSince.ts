'use strict'
// chel eventsSince [--limit N] <url-or-localpath> <contractID> <hash>

import { flags, path } from './deps.ts'
import { exit, isDir, isFile } from './utils.ts'

const headPrefix = 'head='

function isURL (arg: string): boolean {
  return URL.canParse(arg) && Boolean(new URL(arg).host)
}

const backends = {
  fs: await import('./database-fs.ts'),
  sqlite: await import('./database-sqlite.ts')
}

let backendFrom: typeof backends.sqlite | typeof backends.fs

export async function eventsSince (args: string[]): Promise<string[]> {
  const parsedArgs = flags.parse(args)

  const limit = Number.parseInt(parsedArgs.limit ?? 50)
  const [urlOrLocalPath, contractID, hash] = parsedArgs._
  const src = urlOrLocalPath

  let from
  if (isDir(src)) {
    from = 'fs'
  } else if (isFile(src)) {
    from = 'sqlite'
  } else if (isURL(src)) {
    from = 'remote'
  } else {
    exit(`invalid argument: "${src}"`)
  }

  backendFrom = backends[from as keyof typeof backends]
  try {
    await backendFrom.initStorage(from === 'fs' ? {dirname: src} : {dirname: path.dirname(src), filename: path.basename(src)})
  } catch (error) {
    exit(`could not init storage backend at "${src}" to fetch events from: ${error.message}`)
  }
  const messages = await getMessagesSince(contractID, hash, limit)
  console.log(Deno.inspect(messages.map(s => JSON.parse(s)), { colors: true, strAbbreviateSize: Infinity }))
}

const getMessage = async function (hash: string): Promise<string> {
  const value = await readString(hash)
  if (!value) throw new Error(`no entry for ${hash}!`)
  return JSON.parse(value).message
}

async function readString (key: string): Promise<string|void> {
  const rv = await backendFrom.readData(key)
  if (rv === undefined) return undefined
  return typeof rv === 'string' ? rv : new TextDecoder().decode(rv)
}

export async function getMessagesSince (contractID: string, since: string, limit = 50): Promise<string[]> {
  let currentHEAD: string|void = await readString(`${headPrefix}${contractID}`)

  const entries = []
  try {
    while (true) {
      if (currentHEAD === undefined) {
        throw new Deno.errors.NotFound(`entry ${contractID} doesn't exist!`)
      }
      const entry = await getMessage(currentHEAD)
      if (!entry) {
        console.error(`[chel] entry ${currentHEAD} no longer exists.`)
        break
      }
      entries.push(entry)
      if (currentHEAD === since || (since === contractID && entries.length === limit)) {
        break
      } else {
        currentHEAD = JSON.parse(entry).previousHEAD
      }
    }
  } catch (error) {
    console.error(`[chel] ${error.message}:`, error)
  }
  return entries
}
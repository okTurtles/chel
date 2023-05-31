'use strict'
// chel eventsSince [--limit N] <url-or-localpath> <contractID> <hash>

import { base64, flags, path } from './deps.ts'
import { exit, isArrayLength, isDir, isFile } from './utils.ts'

const defaultLimit = 50
const headPrefix = 'head='

function isURL (arg: string): boolean {
  return URL.canParse(arg) && Boolean(new URL(arg).host)
}

const backends = {
  fs: await import('./database-fs.ts'),
  sqlite: await import('./database-sqlite.ts')
}

let backendFrom: typeof backends.sqlite | typeof backends.fs

export async function eventsSince (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args)

  const limit = Number(parsedArgs.limit ?? defaultLimit)
  if (!isArrayLength(limit)) exit('argument --limit must be a valid array length')
  const [urlOrLocalPath, contractID, hash] = parsedArgs._.map(String)
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

  if (from === 'remote') {
    const messages = await getRemoteMessagesSince(src, contractID, hash, limit)
    console.log(JSON.stringify(messages.reverse().map(s => JSON.parse(s)), null, 2))
    return
  }
  backendFrom = backends[from as keyof typeof backends]
  try {
    const options = { internal: true, ...(from === 'fs' ? { dirname: src } : { dirname: path.dirname(src), filename: path.basename(src) }) }
    await backendFrom.initStorage(options)
  } catch (error) {
    exit(`could not init storage backend at "${src}" to fetch events from: ${error.message}`)
  }
  const messages = await getMessagesSince(contractID, hash, limit)
  console.log(JSON.stringify(messages.reverse().map(s => JSON.parse(s)), null, 2))
}

async function getMessage (hash: string): Promise<string> {
  const value = await readString(hash)
  if (!value) throw new Error(`no entry for ${hash}!`)
  return JSON.parse(value).message
}

async function getMessagesSince (contractID: string, since: string, limit: number): Promise<string[]> {
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

async function getRemoteMessagesSince (src: string, contractID: string, since: string, limit: number): Promise<string[]> {
  const b64messages: string[] = await fetch(`${src}/eventsSince/${contractID}/${since}`)
    .then(r => r.json())
    .catch(err => exit(err.message))
  if (b64messages.length > limit) {
    b64messages.length = limit
  }
  return b64messages.map(b64str => JSON.parse(new TextDecoder().decode(base64.decode(b64str))).message)
}

async function readString (key: string): Promise<string|void> {
  const rv = await backendFrom.readData(key)
  if (rv === undefined) return undefined
  return typeof rv === 'string' ? rv : new TextDecoder().decode(rv)
}
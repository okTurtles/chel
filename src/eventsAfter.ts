// chel eventsAfter [--limit N] <url-or-localpath> <contractID> <hash>

import * as base64 from 'jsr:@std/encoding/base64'
import * as flags from 'jsr:@std/flags/'
import { type Backend, exit, isArrayLength, getBackend, isURL } from './utils.ts'

let backend: Backend

const defaultLimit = 50
const headPrefix = 'head='

export async function eventsAfter (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args)

  const limit = Number(parsedArgs.limit ?? defaultLimit)
  if (!isArrayLength(limit)) exit('argument --limit must be a valid array length')
  const [urlOrLocalPath, contractID] = parsedArgs._.map(String)
  const height = Number(parsedArgs._[2])
  const src = urlOrLocalPath

  try {
    let messages

    if (isURL(src)) {
      messages = await getRemoteMessagesSince(src, contractID, height, limit)
    } else {
      messages = await getMessagesSince(src, contractID, height, limit)
    }
    console.log(JSON.stringify(messages, null, 2))
  } catch (error) {
    exit(error)
  }
}

async function getMessage (hash: string): Promise<ReturnType<typeof JSON.parse>> {
  const value = await readString(hash)
  if (!value) throw new Error(`no entry for ${hash}!`)
  return JSON.parse(value)
}

async function getMessagesSince (src: string, contractID: string, sinceHeight: number, limit: number): Promise<string[]> {
  backend = await getBackend(src)

  const contractHEAD: string | undefined = await readString(`${headPrefix}${contractID}`)
  if (contractHEAD === undefined) {
    throw new Deno.errors.NotFound(`contract ${contractID} doesn't exist!`)
  }
  const entries = []
  let currentHEAD = JSON.parse(contractHEAD).HEAD
  let currentHeight: number
  while (true) {
    const entry = await getMessage(currentHEAD)
    if (!entry) {
      throw new Deno.errors.NotFound(`entry ${currentHEAD} no longer exists.`)
    }
    const head = JSON.parse(entry.head)
    currentHeight = head.height
    entries.push(entry)
    if (currentHeight === sinceHeight) {
      break
    }
    currentHEAD = head.previousHEAD
  }
  return entries.reverse().slice(0, limit)
}

async function getRemoteMessagesSince (src: string, contractID: string, sinceHeight: number, limit: number): Promise<string[]> {
  const response = await fetch(`${src}/eventsAfter/${contractID}/${sinceHeight}`)
  if (!response.ok) {
    // The response body may contain some useful error info if we got a Boom error response.
    const bodyText = await response.text().catch(() => '') || ''
    throw new Error(`failed network request to ${src}: ${response.status} - ${response.statusText} - '${bodyText}'`)
  }
  const b64messages: string[] = await response.json()
  if (b64messages.length > limit) {
    b64messages.length = limit
  }
  return b64messages.map(b64str => JSON.parse(new TextDecoder().decode(base64.decodeBase64(b64str))))
}

async function readString (key: string): Promise<string | undefined> {
  const rv = await backend.readData(key)
  if (rv === undefined) return undefined
  return typeof rv === 'string' ? rv : new TextDecoder().decode(rv)
}

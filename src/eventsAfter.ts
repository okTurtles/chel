'use strict'
// chel eventsAfter [--limit N] <url-or-localpath> <contractID> <hash>

import { base64, flags } from './deps.ts'
import { type Backend, exit, isArrayLength, getBackend, isURL } from './utils.ts'

let backend: Backend

const defaultLimit = 50
const headPrefix = 'head='

export async function eventsAfter (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args)

  const limit = Number(parsedArgs.limit ?? defaultLimit)
  if (!isArrayLength(limit)) exit('argument --limit must be a valid array length')
  const [urlOrLocalPath, contractID, hash] = parsedArgs._.map(String)
  const src = urlOrLocalPath

  try {
    let messages

    if (isURL(src)) {
      messages = await getRemoteMessagesSince(src, contractID, hash, limit)
    } else {
      messages = await getMessagesSince(src, contractID, hash, limit)
    }
    console.log(JSON.stringify(messages.map(s => JSON.parse(s)), null, 2))
  } catch (error) {
    exit(error.message)
  }
}

async function getMessage (hash: string): Promise<string> {
  const value = await readString(hash)
  if (!value) throw new Error(`no entry for ${hash}!`)
  return JSON.parse(value).message
}

async function getMessagesSince (src: string, contractID: string, since: string, limit: number): Promise<string[]> {
  backend = await getBackend(src)

  const contractHEAD: string | void = await readString(`${headPrefix}${contractID}`)
  if (contractHEAD === undefined) {
    throw new Deno.errors.NotFound(`contract ${contractID} doesn't exist!`)
  }
  const entries = []
  let currentHEAD = contractHEAD
  while (true) {
    const entry = await getMessage(currentHEAD)
    if (!entry) {
      throw new Deno.errors.NotFound(`entry ${currentHEAD} no longer exists.`)
    }
    entries.push(entry)
    if (currentHEAD === since) {
      break
    } else {
      currentHEAD = JSON.parse(entry).previousHEAD
      if (currentHEAD === null) {
        throw new Deno.errors.NotFound(`entry ${since} was not found in contract ${contractID}.`)
      }
    }
  }
  return entries.reverse().slice(0, limit)
}

async function getRemoteMessagesSince (src: string, contractID: string, since: string, limit: number): Promise<string[]> {
  const response = await fetch(`${src}/eventsAfter/${contractID}/${since}`)
  if (!response.ok) {
    // The response body may contain some useful error info if we got a Boom error response.
    const bodyText = await response.text().catch(_ => '') || ``
    throw new Error(`failed network request to ${src}: ${response.status} - ${response.statusText} - '${bodyText}'`)
  }
  const b64messages: string[] = (await response.json()).reverse()
  if (b64messages.length > limit) {
    b64messages.length = limit
  }
  return b64messages.map(b64str => JSON.parse(new TextDecoder().decode(base64.decode(b64str))).message)
}

async function readString (key: string): Promise<string|void> {
  const rv = await backend.readData(key)
  if (rv === undefined) return undefined
  return typeof rv === 'string' ? rv : new TextDecoder().decode(rv)
}
// chel eventsAfter [--limit N] [--url url] <contractID> <height>

import * as base64 from 'jsr:@std/encoding/base64'
import * as flags from 'jsr:@std/flags/'
import sbp from 'npm:@sbp/sbp'
import { initDB } from './serve/database.ts'
import { exit, isArrayLength } from './utils.ts'

const defaultLimit = 50

export async function eventsAfter (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args)

  const limit = Number(parsedArgs.limit ?? defaultLimit)
  if (!isArrayLength(limit)) exit('argument --limit must be a valid array length')
  const [contractID] = parsedArgs._.map(String)
  const height = Number(parsedArgs._[2])

  try {
    let messages

    if (parsedArgs.url) {
      messages = await getRemoteMessagesSince(parsedArgs.url, contractID, height, limit)
    } else {
      await initDB({ skipDbPreloading: true })
      messages = await getMessagesSince(contractID, height, limit)
    }
    console.log(JSON.stringify(messages, null, 2))
  } catch (error) {
    exit(error)
  }
}

async function getMessagesSince (contractID: string, sinceHeight: number, limit: number): Promise<string[]> {
  const readable = await sbp('backend/db/streamEntriesAfter', contractID, sinceHeight, limit)

  return new Promise((resolve, reject) => {
    const data: string[] = []
    readable.on('readable', () => {
      let chunk
      while (null !== (chunk = readable.read())) {
        data.push(chunk)
      }
    })

    readable.on('error', reject)

    readable.on('end', () => {
      const events = JSON.parse(data.join('')).map((s: string) => {
        return JSON.parse(new TextDecoder().decode(base64.decodeBase64(s)))
      })
      resolve(events)
    })
  })
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

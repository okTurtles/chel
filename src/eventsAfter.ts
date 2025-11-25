// chel eventsAfter [--limit N] [--url url] <contractID> <height>

import * as base64 from 'jsr:@std/encoding/base64'
import sbp from 'npm:@sbp/sbp'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { initDB } from './serve/database.ts'
import { exit } from './utils.ts'

type Params = { limit: number, url: string | undefined, contractID: string, height: number }

export async function eventsAfter ({ limit, url, contractID, height }: ArgumentsCamelCase<Params>): Promise<void> {
  try {
    let messages

    if (url) {
      messages = await getRemoteMessagesSince(url, contractID, height, limit)
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

export const module = {
  builder: (yargs) => {
    return yargs
      .option('limit', {
        describe: 'Limit',
        default: 50,
        number: true,
        requiresArg: true,
        coerce (v: number) {
          if (!Number.isSafeInteger(v) || v < 0) {
            throw new Error('--limit must be a valid non-negative integer')
          }
          return v
        }
      })
      .option('url', {
        describe: 'URL of a remote server',
        string: true
      })
      .positional('contractID', {
        describe: 'Contract ID',
        demandOption: true,
        type: 'string'
      })
      .positional('height', {
        describe: 'Height',
        demandOption: true,
        type: 'number'
      })
  },
  command: 'eventsAfter <contractID> <height>',
  describe: 'Displays a JSON array of the first LIMIT events that happened in a given contract, since a given entry identified by its hash.\n\n' +
  '- Older events are displayed first.\n' +
  '- The output is parseable with tools such as \'jq\'.\n' +
  '- If --url is given, then its /eventsAfter REST endpoint will be called.\n',
  postHandler: (argv) => {
    return eventsAfter(argv)
  }
} as CommandModule<object, Params>

import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path/'
import { Buffer } from 'node:buffer'
import sbp from 'npm:@sbp/sbp'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { initDB } from './serve/database.ts'
import { createEntryFromFile, multicodes, type Entry } from './utils.ts'

type Params = { url?: string, files: string[] }

export async function upload (args: ArgumentsCamelCase<Params>, internal = false): Promise<[string, string][]> {
  const { url, files } = args
  if (!url) {
    await initDB({ skipDbPreloading: true })
  }
  const uploaded: Array<[string, string]> = []
  const uploaderFn = url
    ? uploadEntryToURL
    : uploadEntryToDB
  for (const filepath_ of files) {
    let type = multicodes.RAW
    let filepath = filepath_
    if (internal) {
      // The `{type}|` prefix is used to determine which kind of CID is needed
      if (filepath_[1] !== '|') throw new Error('Invalid path format')
      switch (filepath_[0]) {
        case 'r':
        // raw file type
          break
        case 'm':
          type = multicodes.SHELTER_CONTRACT_MANIFEST
          break
        case 't':
          type = multicodes.SHELTER_CONTRACT_TEXT
          break
        default:
          throw new Error('Unknown file type: ' + filepath_[0])
      }
      filepath = filepath_.slice(2)
    }
    const entry = await createEntryFromFile(filepath, type)
    const destination = await uploaderFn(entry, url!)
    if (!internal) {
      console.log(colors.green('uploaded:'), destination)
    } else {
      console.log(colors.green(`${path.relative('.', filepath)}:`), destination)
    }
    uploaded.push([filepath, destination])
  }
  return uploaded
}

async function uploadEntryToURL ([cid, buffer]: Entry, url: string): Promise<string> {
  const form = new FormData()
  form.append('hash', cid)
  form.append('data', new Blob([buffer]))
  return await fetch(`${url}/dev-file`, { method: 'POST', body: form })
    .then(handleFetchResult('text'))
    .then(r => {
      if (r !== `/file/${cid}`) {
        throw new Error(`server returned bad URL: ${r}`)
      }
      return `${url}${r}`
    })
}

function uploadEntryToDB ([cid, buffer]: Entry): Promise<string> {
  return sbp('chelonia.db/set', cid, Buffer.from(buffer)).then(() => cid)
}

type ResponseTypeFn = 'arrayBuffer' | 'blob' | 'clone' | 'formData' | 'json' | 'text'

export function handleFetchResult (type: ResponseTypeFn): ((r: Response) => unknown) {
  return async function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return await r[type]()
  }
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('url', {
        describe: 'URL of a remote server',
        requiresArg: true,
        string: true
      })
      .positional('files', {
        describe: 'Files to upload',
        demandOption: true,
        array: true,
        type: 'string'
      })
  },
  command: 'upload [--url REMOTE_URL] <files..>',
  describe: 'Requires read and write access to the destination.',
  postHandler: (argv) => {
    return void upload(argv)
  }
} as CommandModule<object, Params>

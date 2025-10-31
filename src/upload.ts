import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path/'
import sbp from 'npm:@sbp/sbp'
import { initDB } from './serve/database.ts'
import { createEntryFromFile, multicodes, type Entry } from './utils.ts'

void sbp, initDB

// chel upload [<url>] <file1> [<file2> [<file3> ...]]

export async function upload (files: string[], internal = false): Promise<[string, string][]> {
  const url = URL.canParse(files[0]) ? files[0] : null
  if (url) {
    files.shift()
  } else {
    await initDB({ skipDbPreloading: true })
  }
  if (files.length === 0) throw new Error('missing files!')
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
  return sbp('chelonia.db/set', cid, buffer).then(() => cid)
}

type ResponseTypeFn = 'arrayBuffer' | 'blob' | 'clone' | 'formData' | 'json' | 'text'

export function handleFetchResult (type: ResponseTypeFn): ((r: Response) => unknown) {
  return async function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return await r[type]()
  }
}

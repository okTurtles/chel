'use strict'

import { path, colors } from './deps.ts'
import { blake32Hash, isDir } from './utils.ts'

// chel upload <url-or-dir> <file1> [<file2> [<file3> ...]]

// TODO: use Deno.permissions.request(...) to request permissions to the specific URL
//       https://deno.land/manual/runtime/permission_apis
//       and use this everywhere so that we protect against malicious contracts

export async function upload (args: string[], internal = false) {
  const [urlOrDir, ...files] = args
  if (files.length === 0) throw new Error(`missing files!`)
  const uploaded = []
  const uploaderFn = isDir(urlOrDir) ? uploadToDir : uploadToURL
  for (const filepath of files) {
    const destination = await uploaderFn(filepath, urlOrDir)
    if (!internal) {
      console.log(colors.green('uploaded:'), destination)
    } else {
      console.log(colors.green(`${path.relative('.', filepath)}:`), destination)
    }
    uploaded.push([filepath, destination])
  }
  return uploaded
}

function uploadToURL (filepath: string, url: string): Promise<string> {
  const buffer = Deno.readFileSync(filepath)
  const hash = blake32Hash(buffer)
  const form = new FormData()
  form.append('hash', hash)
  form.append('data', new Blob([buffer]), path.basename(filepath))
  return fetch(`${url}/file`, { method: 'POST', body: form })
    .then(handleFetchResult('text'))
    .then(r => {
      if (r !== `/file/${hash}`) {
        throw new Error(`server returned bad URL: ${r}`)
      }
      return `${url}${r}`
    })
}

async function uploadToDir (filepath: string, dir: string) {
  const buffer = Deno.readFileSync(filepath)
  const hash = blake32Hash(buffer)
  const destination = path.join(dir, hash)
  await Deno.writeFile(destination, buffer)
  return destination
}

type ResponseTypeFn = 'arrayBuffer' | 'blob' | 'clone' | 'formData' | 'json' | 'text'
export function handleFetchResult (type: ResponseTypeFn): ((r: Response) => unknown) {
  return function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return r[type]()
  }
}

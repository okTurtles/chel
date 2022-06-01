'use strict'

import { path, colors } from './deps.ts'
import { blake32Hash } from './utils.ts'

// chel upload <url> <file1> [<file2> [<file3> ...]]

export async function upload (args: string[], internal = false) {
  const [url, ...files] = args
  if (files.length === 0) throw new Error(`missing files!`)
  const uploaded = []
  for (const filepath of files) {
    const form = new FormData()
    const buffer = Deno.readFileSync(filepath)
    const hash = blake32Hash(buffer)
    form.append('hash', hash)
    form.append('data', new Blob([buffer]), path.basename(filepath))
    const uploadURL = await fetch(`${url}/file`, { method: 'POST', body: form })
      .then(handleFetchResult('text'))
      .then(r => {
        if (r !== `/file/${hash}`) {
          throw new Error(`server returned bad URL: ${r}`)
        }
        const uploadURL = `${url}${r}`
        if (!internal) {
          console.log(colors.green('uploaded:'), uploadURL)
        } else {
          console.log(colors.green(`${path.relative('.', filepath)}:`), uploadURL)
        }
        return uploadURL
      })
    uploaded.push([filepath, uploadURL])
  }
  return uploaded
}

type ResponseTypeFn = 'arrayBuffer' | 'blob' | 'clone' | 'formData' | 'json' | 'text'
export function handleFetchResult (type: ResponseTypeFn): ((r: Response) => unknown) {
  return function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return r[type]()
  }
}

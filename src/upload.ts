'use strict'

import { path, colors } from './deps.ts'
import { blake32Hash } from './utils.ts'

// chel upload <url> <file1> [<file2> [<file3> ...]]

export async function upload (args: string[]) {
  const [url, ...files] = args
  if (files.length === 0) throw new Error(`missing files!`)
  for (const filepath of files) {
    const form = new FormData()
    const buffer = Deno.readFileSync(filepath)
    const hash = blake32Hash(buffer)
    form.append('hash', hash)
    form.append('data', new Blob([buffer]), path.basename(filepath))
    await fetch(`${url}/file`, { method: 'POST', body: form })
      .then(handleFetchResult('text'))
      .then(r => {
        if (r !== `/file/${hash}`) {
          throw new Error(`server returned bad URL: ${r}`)
        }
        console.log(colors.green('uploaded:'), `${url}${r}`)
      })
    }
}

type ResponseTypeFn = 'arrayBuffer' | 'blob' | 'clone' | 'formData' | 'json' | 'text'
export function handleFetchResult (type: ResponseTypeFn): ((r: Response) => unknown) {
  return function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return r[type]()
  }
}

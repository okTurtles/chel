'use strict'

import { path, colors } from './deps.ts'
import { blake32Hash, isDir, revokeNet } from './utils.ts'

// chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]

export async function upload (args: string[], internal = false) {
  await revokeNet()
  const [urlOrDirOrSqliteFile, ...files] = args
  if (files.length === 0) throw new Error(`missing files!`)
  const uploaded = []
  const uploaderFn = isDir(urlOrDirOrSqliteFile)
    ? uploadToDir
    : urlOrDirOrSqliteFile.endsWith('.db')
      ? uploadToSQLite
      : uploadToURL
  for (const filepath of files) {
    const destination = await uploaderFn(filepath, urlOrDirOrSqliteFile)
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

async function uploadToSQLite (filepath: string, sqlitedb: string) {
  const { initStorage, writeData } = await import('./database-sqlite.ts')
  initStorage({dirname: path.dirname(sqlitedb), filename: path.basename(sqlitedb)})
  const buffer = await Deno.readFile(filepath)
  const hash = blake32Hash(buffer)
  writeData(hash, buffer)
  return hash
}

type ResponseTypeFn = 'arrayBuffer' | 'blob' | 'clone' | 'formData' | 'json' | 'text'
export function handleFetchResult (type: ResponseTypeFn): ((r: Response) => unknown) {
  return function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return r[type]()
  }
}


'use strict'

import { path, colors } from './deps.ts'
import { type Entry, createEntryFromFile, isDir, revokeNet } from './utils.ts'

// chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]

export async function upload (args: string[], internal = false) {
  const [urlOrDirOrSqliteFile, ...files] = args
  if (files.length === 0) throw new Error(`missing files!`)
  const uploaded = []
  const uploaderFn = await isDir(urlOrDirOrSqliteFile)
    ? uploadEntryToDir
    : urlOrDirOrSqliteFile.endsWith('.db')
      ? uploadEntryToSQLite
      : uploadEntryToURL
  for (const filepath of files) {
    const entry = await createEntryFromFile(filepath)
    const destination = await uploaderFn(entry, urlOrDirOrSqliteFile)
    if (!internal) {
      console.log(colors.green('uploaded:'), destination)
    } else {
      console.log(colors.green(`${path.relative('.', filepath)}:`), destination)
    }
    uploaded.push([filepath, destination])
  }
  return uploaded
}

function uploadEntryToURL ([cid, buffer]: Entry, url: string): Promise<string> {
  const form = new FormData()
  form.append('hash', cid)
  form.append('data', new Blob([buffer]))
  return fetch(`${url}/file`, { method: 'POST', body: form })
    .then(handleFetchResult('text'))
    .then(r => {
      if (r !== `/file/${cid}`) {
        throw new Error(`server returned bad URL: ${r}`)
      }
      return `${url}${r}`
    })
}

async function uploadEntryToDir ([cid, buffer]: Entry, dir: string): Promise<string> {
  await revokeNet()
  const destination = path.join(dir, cid)
  await Deno.writeFile(destination, buffer)
  return destination
}

async function uploadEntryToSQLite ([cid, buffer]: Entry, sqlitedb: string): Promise<string> {
  await revokeNet()
  const { initStorage, writeData } = await import('./database-sqlite.ts')
  initStorage({dirname: path.dirname(sqlitedb), filename: path.basename(sqlitedb)})
  writeData(cid, buffer)
  return cid
}

type ResponseTypeFn = 'arrayBuffer' | 'blob' | 'clone' | 'formData' | 'json' | 'text'

export function handleFetchResult (type: ResponseTypeFn): ((r: Response) => unknown) {
  return function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return r[type]()
  }
}

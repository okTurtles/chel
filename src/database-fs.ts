'use strict'

import { path } from './deps.ts'
import { checkKey } from './utils.ts'

// Initialized in `initStorage()`.
let dataFolder = ''

export async function initStorage (options: Object = {}): Promise<void> {
  dataFolder = path.resolve(options.dirname)
  await Deno.mkdir(dataFolder, { mode: 0o750, recursive: true })
}

// Useful in test hooks.
export function clear (): Promise<void> {
  return readKeys()
    .then(keys => Promise.all(keys.map(key => Deno.remove(path.join(dataFolder, key)))))
}

export async function readData (key: string): Promise<Buffer | string | void> {
  // Necessary here to thwart path traversal attacks.
  checkKey(key)
  return Deno.readFile(path.join(dataFolder, key))
    .catch(err => undefined) // eslint-disable-line node/handle-callback-err
}

export async function readKeys (): Promise<strings[]> {
  const keys = []
  for await (const entry of Deno.readDir(dataFolder)) {
    if (entry.isFile) {
      keys.push(entry.name)
    }
  }
  return keys
}

export async function writeData (key: string, value: Buffer | string): Promise<void> {
  return (typeof value === 'string' ? Deno.writeTextFile : Deno.writeFile)(path.join(dataFolder, key), value)
}

'use strict'

import { path } from './deps.ts'
import { checkKey } from './utils.ts'

// Initialized in `initStorage()`.
export let dataFolder = ''

export async function initStorage(options: Record<string, unknown> = {}): Promise<void> {
  dataFolder = path.resolve(options.dirname as string)
  await Deno.mkdir(dataFolder, { mode: 0o750, recursive: true })
}

// Useful in test hooks.
export async function clear(): Promise<void> {
  for await (const key of iterKeys()) {
    await Deno.remove(path.join(dataFolder, key))
  }
}

export async function count(): Promise<number> {
  let n = 0
  for await (const _entry of Deno.readDir(dataFolder)) {
    n++
  }
  return n
}

export async function* iterKeys(): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dataFolder)) {
    // Skip subfolders and symlinks.
    if (entry.isFile) {
      yield entry.name
    }
  }
}

export async function readData(key: string): Promise<Uint8Array | string | void> {
  // Necessary here to thwart path traversal attacks.
  checkKey(key)
  return await Deno.readFile(path.join(dataFolder, key))
    .catch(_err => undefined)
}

export async function writeData(key: string, value: Uint8Array | string): Promise<void> {
  if (typeof value === 'string') {
    await Deno.writeTextFile(path.join(dataFolder, key), value)
  } else {
    await Deno.writeFile(path.join(dataFolder, key), value)
  }
}

export async function writeDataOnce(key: string, value: Uint8Array | string): Promise<void> {
  // Ensure an 'AlreadyExists' error is thrown if the file already exists.
  const options = { createNew: true }
  try {
    if (typeof value === 'string') {
      await Deno.writeTextFile(path.join(dataFolder, key), value, options)
    } else {
      await Deno.writeFile(path.join(dataFolder, key), value, options)
    }
  } catch (err) {
    if ((err as Error).name !== 'AlreadyExists') throw err
  }
}

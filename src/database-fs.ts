'use strict'

import { path } from './deps.ts'
import { checkKey } from './utils.ts'

// Initialized in `initStorage()`.
export let dataFolder = ''

export async function initStorage (options: Record<string, unknown> = {}): Promise<void> {
  dataFolder = path.resolve(options.dirname as string)
  await Deno.mkdir(dataFolder, { mode: 0o750, recursive: true })
}

// Useful in test hooks.
export async function clear (): Promise<void> {
  for await (const key of iterKeys()) {
    await Deno.remove(path.join(dataFolder, key))
  }
}

export async function count (): Promise<number> {
  let n = 0
  for await (const entry of Deno.readDir(dataFolder)) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (entry.isFile) {
      n++
    }
  }
  return n
}

export async function * iterKeys (): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dataFolder)) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (entry.isFile) {
      yield entry.name
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function readData (key: string) {
  checkKey(key)
  return Deno.readFile(path.join(dataFolder, key)).catch(() => undefined)
}

export async function writeData (key: string, value: Uint8Array | string): Promise<void> {
  if (typeof value === 'string') {
    await Deno.writeTextFile(path.join(dataFolder, key), value)
  } else {
    await Deno.writeFile(path.join(dataFolder, key), value)
  }
}

export async function writeDataOnce (key: string, value: Uint8Array | string): Promise<void> {
  // Ensure an 'AlreadyExists' error is thrown if the file already exists.
  const options = { createNew: true }
  try {
    if (typeof value === 'string') {
      await Deno.writeTextFile(path.join(dataFolder, key), value, options)
    } else {
      await Deno.writeFile(path.join(dataFolder, key), value, options)
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AlreadyExists') throw err
  }
}

'use strict'

import { blake, colors, multihash } from './deps.ts'

// TODO: implement a streaming hashing function for large files
export function blake32Hash (data: string | Uint8Array): string {
  // TODO: for node/electron, switch to: https://github.com/ludios/node-blake2
  const uint8array = blake.blake2b(data, undefined, 32)
  // if you need Buffer: https://doc.deno.land/https://deno.land/std@0.141.0/io/mod.ts/~/Buffer
  // const buf = Buffer.from(uint8array.buffer)
  return multihash.toB58String(multihash.encode(uint8array, 'blake2b-32', 32))
}

export function checkKey (key: string): void {
  if (!isValidKey(key)) {
    throw new Error(`bad key: ${JSON.stringify(key)}`)
  }
}

export function exit (message: string): never {
  console.error('[chel]', colors.red('Error:'), message)
  Deno.exit(1)
}

// Checks whether a path points to a directory, following symlinks if any.
export function isDir (path: string | URL): boolean {
  try {
    const info = Deno.statSync(path)
    return info.isDirectory
  } catch (_e) {
    return false
  }
}

// Checks whether a path points to a file, following symlinks if any.
export function isFile (path: string | URL): boolean {
  try {
    const info = Deno.statSync(path)
    return info.isFile
  } catch (_e) {
    return false
  }
}

export function isNotHashKey (key: string): boolean {
  return key.startsWith('head=') || key.startsWith('name=')
}

export function isValidKey (key: string): boolean {
  // Disallow unprintable characters, slashes, and TAB.
  // deno-lint-ignore no-control-regex
  return !/[\x00-\x1f\x7f\t\\/]/.test(key)
}

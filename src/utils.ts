'use strict'

import { base58btc, blake, colors } from './deps.ts'
import { type Multibase } from './deps.ts'

// TODO: implement a streaming hashing function for large files
export function blake32Hash (data: string | Uint8Array): Multibase<'z'> {
  // TODO: for node/electron, switch to: https://github.com/ludios/node-blake2
  // Note: Could also use `@multiformats/blake2`:
  // import blake from "https://esm.sh/@multiformats/blake2"
  // const uint8array = blake.blake2b.blake2b256.encode(data)
  // Output is 32 byte long.
  const uint8array = blake.blake2b(data, undefined, 32)
  // Previously we had to pass this 32 byte array to `multihash.encode()` to prepend
  // four bytes of metadata before base-encoding to base58.
  return base58btc.encode(uint8array)
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

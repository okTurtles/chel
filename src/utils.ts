'use strict'

import { base58btc, blake, colors } from './deps.ts'
import { type Multibase } from './deps.ts'

// TODO: implement a streaming hashing function for large files
export function blake32Hash (data: string | Uint8Array): Multibase<'z'> {
  // TODO: for node/electron, switch to: https://github.com/ludios/node-blake2
  const uint8array = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const digest = blake.blake2b.blake2b256.digest(uint8array)
  // While `digest.digest` is only 32 bytes long in this case,
  // `digest.bytes` is 36 bytes because it includes a multiformat prefix.
  return base58btc.encode(digest.bytes)
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

export function isArrayLength (arg: number): boolean {
  return Number.isInteger(arg) && arg >= 0 && arg <= 2 ** 32 - 1
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

export function isURL (arg: string): boolean {
  return URL.canParse(arg) && Boolean(new URL(arg).host)
}

export function isValidKey (key: string): boolean {
  // Disallow unprintable characters, slashes, and TAB.
  // deno-lint-ignore no-control-regex
  return !/[\x00-\x1f\x7f\t\\/]/.test(key)
}

export async function revokeNet () {
  await Deno.permissions.revoke({ name: 'net' })
}
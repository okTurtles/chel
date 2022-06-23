'use strict'

import { multihash, blake } from './deps.ts'

// TODO: implement a streaming hashing function for large files
export function blake32Hash (data: string | Uint8Array): string {
  // TODO: for node/electron, switch to: https://github.com/ludios/node-blake2
  const uint8array = blake.blake2b(data, undefined, 32)
  // if you need Buffer: https://doc.deno.land/https://deno.land/std@0.141.0/io/mod.ts/~/Buffer
  // const buf = Buffer.from(uint8array.buffer)
  return multihash.toB58String(multihash.encode(uint8array, 'blake2b-32', 32))
}

export function isDir (path: string | URL): boolean {
  try {
    const info = Deno.lstatSync(path)
    return info.isDirectory
  } catch (e) {
    return false
  }
}

'use strict'

import multihash from 'https://esm.sh/multihashes@4.0.3?bundle'
import blake from 'https://esm.sh/blakejs@1.2.1'



export function blake32Hash (data: string | Uint8Array): string {
  // TODO: for node/electron, switch to: https://github.com/ludios/node-blake2
  const uint8array = blake.blake2b(data, undefined, 32)
  // if you need Buffer: https://doc.deno.land/https://deno.land/std@0.141.0/io/mod.ts/~/Buffer
  // const buf = Buffer.from(uint8array.buffer)
  return multihash.toB58String(multihash.encode(uint8array, 'blake2b-32', 32))
}
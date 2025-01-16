'use strict'

import { createEntryFromFile, multicodes } from './utils.ts'

// TODO: use https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/iterateReader instead to read in large files, and then use blake2b[Init,Update,Final] to iteratively calculate the hash
//       Verify that it returns the same hash as when we use readAll https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/readAll

export async function hash (args: string[], multicode: number = multicodes.RAW, internal = false) {
  const [filename] = args
  if (!filename) {
    console.error('please pass in a file')
    Deno.exit(1)
  }
  const [cid] = await createEntryFromFile(filename, multicode)
  if (!internal) {
    console.log(`CID(${filename}):`, cid)
  }
  return cid
}

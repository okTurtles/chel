'use strict'

import { streams } from './deps.ts'
import { blake32Hash } from './utils.ts'

// TODO: use https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/iterateReader instead to read in large files, and then use blake2b[Init,Update,Final] to iteratively calculate the hash
//       Verify that it returns the same hash as when we use readAll https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/readAll

export async function hash (args: string[], internal = false) {
  const [filename] = args
  if (!filename) {
    console.error('please pass in a file')
    Deno.exit(1)
  }
  const file = await Deno.open(filename, {read: true})
  const myFileContent = await streams.readAll(file)
  Deno.close(file.rid)
  const hash = blake32Hash(myFileContent)
  if (!internal) {
    console.log(`blake32Hash(${filename}):`, hash)
  }
  return hash
}

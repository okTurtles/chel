import { createEntryFromFile, multicodes } from './utils.ts'

// TODO: use https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/iterateReader instead to read in large files, and then use blake2b[Init,Update,Final] to iteratively calculate the hash
//       Verify that it returns the same hash as when we use readAll https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/readAll

// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase } from 'npm:yargs'

export async function hash ({ filename }: ArgumentsCamelCase<{ filename: string }>, multicode: number = multicodes.RAW, internal = false): Promise<string> {
  const [cid] = await createEntryFromFile(filename, multicode)
  if (!internal) {
    console.log(`CID(${filename}):`, cid)
  }
  return cid
}

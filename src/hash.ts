import { createEntryFromFile, multicodes } from './utils.ts'

// TODO: use https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/iterateReader instead to read in large files, and then use blake2b[Init,Update,Final] to iteratively calculate the hash
//       Verify that it returns the same hash as when we use readAll https://doc.deno.land/https://deno.land/std@0.140.0/streams/mod.ts/~/readAll

// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase, CommandModule } from 'npm:yargs'

type Params = { filename: string }

export async function hash ({ filename }: ArgumentsCamelCase<Params>, multicode: number = multicodes.RAW, internal = false): Promise<string> {
  const [cid] = await createEntryFromFile(filename, multicode)
  if (!internal) {
    console.log(`CID(${filename}):`, cid)
  }
  return cid
}

export const module = {
  builder: (yargs) => {
    return yargs
      .positional('filename', {
        describe: 'File name',
        demandOption: true,
        type: 'string'
      })
  },
  command: 'hash <filename>',
  describe: 'Computes and logs the content identifier (CID) for the given file.\n\' + \'File contents will be interpreted as raw binary data, unless the file extension is \'.json\'.',
  handler: (argv) => {
    return void hash(argv)
  }
} as CommandModule<object, Params>

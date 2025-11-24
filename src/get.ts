// chel get [<url>] <key>
/*
When using a URL, this queries the GET /file/<key> route.

If it's a binary file, for example an image, the command will be used like this:

chel get https://url.com mygreatlongkey > file.png
*/

import { writeAll } from 'jsr:@std/io/'
import sbp from 'npm:@sbp/sbp'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { initDB } from './serve/database.ts'
import { exit, readRemoteData } from './utils.ts'

type Params = { url?: string, key: string }

export async function get ({ key, url }: ArgumentsCamelCase<Params>): Promise<void> {
  if (!url) {
    await initDB({ skipDbPreloading: true })
  }

  try {
    const data = url
      ? await readRemoteData(url, key)
      : await sbp('chelonia.db/get', key)

    if (data === undefined) exit(`no entry found for ${key as string}`)

    if (typeof data === 'string') {
      console.log(data)
    } else {
      // In this case there is no trailing newline.
      await writeAll(Deno.stdout, data)
    }
  } catch (error) {
    exit(error)
  }
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('url', {
        describe: 'URL of a remote server',
        string: true
      })
      .positional('key', {
        describe: 'Database key',
        demandOption: true,
        type: 'string'
      })
  },
  command: 'get <key>',
  describe: 'Retrieves the entry associated with a given <hash> key, from a given database or server.\n\n' +
  '- The output can be piped to a file, like this:' +
  '  chel get https://url.com mygreatlongkey > file.png',
  postHandler: (argv) => {
    return get(argv)
  }
} as CommandModule<object, Params>

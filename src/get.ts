// chel get [<url>] <key>
/*
When using a URL, this queries the GET /file/<key> route.

If it's a binary file, for example an image, the command will be used like this:

chel get https://url.com mygreatlongkey > file.png
*/

import { writeAll } from 'jsr:@std/io/'
import sbp from 'npm:@sbp/sbp'
import { initDB } from './serve/database.ts'
import { exit, readRemoteData } from './utils.ts'

export async function get (args: string[]): Promise<void> {
  const url = URL.canParse(args[0]) ? args[0] : null
  if (url) {
    args.shift()
  } else {
    await initDB({ skipDbPreloading: true })
  }

  const [key] = args

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

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
// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase } from 'npm:yargs'

export async function get ({ key, url }: ArgumentsCamelCase<{ url: string | undefined, key: string }>): Promise<void> {
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

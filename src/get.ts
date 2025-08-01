// chel get <url-or-dir-or-sqlitedb> <key>
/*
When using a URL, this queries the GET /file/<key> route.

If it's a binary file, for example an image, the command will be used like this:

chel get https://url.com mygreatlongkey > file.png
*/

import { flags, writeAll } from './deps.ts'
import { exit, getBackend, isURL, readRemoteData } from './utils.ts'

export async function get (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args)

  const [urlOrLocalPath, key] = parsedArgs._.map(String)
  const src = urlOrLocalPath

  try {
    const data = isURL(src)
      ? await readRemoteData(src, key)
      : await (await getBackend(src)).readData(key)

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

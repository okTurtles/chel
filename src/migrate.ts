// chel migrate --from fs --to sqlite --out ./database.db ./data

import { colors, flags, path } from './deps.ts'
import { exit, getBackend, isNotHashKey, isValidKey, revokeNet } from './utils.ts'

export async function migrate (args: string[]): Promise<void> {
  await revokeNet()
  const parsedArgs = flags.parse(args)

  const { from, to, out } = parsedArgs
  const src = path.resolve(String(parsedArgs._[0]) ?? '.')

  if (!from) exit('missing argument: --from')
  if (!to) exit('missing argument: --to')
  if (!out) exit('missing argument: --out')
  if (from === to) exit('arguments --from and --to must be different')

  let backendFrom
  let backendTo
  try {
    backendFrom = await getBackend(src, { type: from, create: false })
    backendTo = await getBackend(out, { type: to, create: true })
  } catch (error) {
    exit(error)
  }

  const numKeys = await backendFrom.count()

  let numVisitedKeys = 0

  for await (const key of backendFrom.iterKeys()) {
    if (!isValidKey(key)) continue
    const value = await backendFrom.readData(key)
    // Make `deno check` happy.
    if (value === undefined) continue
    if (isNotHashKey(key)) {
      await backendTo.writeData(key, value)
    } else {
      await backendTo.writeDataOnce(key, value)
    }
    ++numVisitedKeys
    // Prints a message roughly every 10% of progress.
    // FIXME: wrong output sometimes.
    if (numVisitedKeys % (numKeys / 10) < 1) {
      console.log(`[chel] Migrating... ${Math.round(numVisitedKeys / (numKeys / 10))}0% done`)
    }
  }
  numKeys && console.log(`[chel] ${colors.green('Migrated:')} ${numKeys} entries`)
}

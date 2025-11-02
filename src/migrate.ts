// chel migrate --from fs --to <backend>

import * as flags from 'jsr:@std/flags/'
import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path/'
import sbp from 'npm:@sbp/sbp'
import type DatabaseBackend from './serve/DatabaseBackend.ts'
import { initDB } from './serve/database.ts'
import { exit, isValidKey } from './utils.ts'

export async function migrate (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args)

  const { to } = parsedArgs
  const src = path.resolve(parsedArgs._[0] ? String(parsedArgs._[0]) : '.')

  await initDB({ skipDbPreloading: true })

  if (!to) exit('missing argument: --to')

  let backendTo: DatabaseBackend
  try {
    const Ctor = (await import(`./serve/database-${to}.ts`)).default
    backendTo = new Ctor()
    await backendTo.init()
  } catch (error) {
    exit(error)
  }

  // const numKeys = await backendFrom.count()
  //
  let numVisitedKeys = 0

  for await (const key of sbp('chelonia.db/iterKeys')) {
    if (!isValidKey(key)) continue
    const value = await sbp('chelonia.db/get', key)
    // Make `deno check` happy.
    if (value === undefined) continue
    await backendTo.writeData(key, value)
    ++numVisitedKeys
    // Prints a message roughly every 10% of progress.
    // FIXME: wrong output sometimes.
    /*
    if (numVisitedKeys % (numKeys / 10) < 1) {
      console.log(`[chel] Migrating... ${Math.round(numVisitedKeys / (numKeys / 10))}0% done`)
    }
    */
   // Prints a message every 1000 messages
   if (numVisitedKeys % 1000 === 0) {
    console.log(`[chel] Migrating... ${numVisitedKeys} entries done`)
   }
  }
  numVisitedKeys && console.log(`[chel] ${colors.green('Migrated:')} ${numVisitedKeys} entries`)
}

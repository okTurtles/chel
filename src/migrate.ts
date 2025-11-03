// chel migrate --to <backend>

import * as flags from 'jsr:@std/flags/'
import * as colors from 'jsr:@std/fmt/colors'
import sbp from 'npm:@sbp/sbp'
import type DatabaseBackend from './serve/DatabaseBackend.ts'
import { initDB } from './serve/database.ts'
import { exit, isValidKey } from './utils.ts'
import process from 'node:process'

export async function migrate (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args)

  const { to } = parsedArgs

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

  const numKeys = await sbp('chelonia.db/keyCount')
  let numVisitedKeys = 0
  let shouldExit = 0

  const handleSignal = (signal: string, code: number) => {
    process.on(signal, () => {
      console.error(`Received signal ${signal} (${code}). Finishing current operation.`)
      // Exit codes follow the 128 + signal code convention.
      // See <https://tldp.org/LDP/abs/html/exitcodes.html>
      shouldExit = 128 + code
    })
  }

  // Codes from <signal.h>
  ;([
    ['SIGHUP', 1],
    ['SIGINT', 2],
    ['SIGQUIT', 3],
    ['SIGTERM', 15],
    ['SIGUSR1', 10],
    ['SIGUSR2', 11]
  ] as [string, number][]).forEach(([signal, code]) => handleSignal(signal, code))

  for await (const key of sbp('chelonia.db/iterKeys')) {
    if (!isValidKey(key)) continue
    const value = await sbp('chelonia.db/get', key)
    if (shouldExit) {
      exit(shouldExit)
    }
    // Make `deno check` happy.
    if (value === undefined) {
      ++numVisitedKeys
      continue
    }
    await backendTo.writeData(key, value)
    if (shouldExit) {
      exit(shouldExit)
    }
    ++numVisitedKeys
    // Prints a message roughly every 10% of progress.
    // FIXME: wrong output sometimes.
    if (numVisitedKeys % (numKeys / 10) < 1) {
      console.log(`[chel] Migrating... ${Math.round(numVisitedKeys / (numKeys / 10))}0% done`)
    }
  }
  numVisitedKeys && console.log(`[chel] ${colors.green('Migrated:')} ${numVisitedKeys} entries`)
}

// chel migrate --to <backend>

import * as colors from 'jsr:@std/fmt/colors'
import process from 'node:process'
import sbp from 'npm:@sbp/sbp'
import type DatabaseBackend from './serve/DatabaseBackend.ts'
import { initDB } from './serve/database.ts'
import { exit, isValidKey } from './utils.ts'
// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase, CommandModule } from 'npm:yargs'

type Params = { to: string }

export async function migrate (args: ArgumentsCamelCase<Params>): Promise<void> {
  const { to } = args

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

  let lastReportedPercentage = 0
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
    const percentage = Math.floor((numVisitedKeys / numKeys) * 100)
    if (percentage - lastReportedPercentage >= 10) {
      lastReportedPercentage = percentage
      console.log(`[chel] Migrating... ${percentage}% done`)
    }
  }
  numVisitedKeys && console.log(`[chel] ${colors.green('Migrated:')} ${numVisitedKeys} entries`)
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('to', {
        describe: 'Destination backend',
        demandOption: true,
        requiresArg: true,
        string: true
      })
  },
  command: 'migrate [--to backend]',
  describe: 'Reads all key-value pairs from a given database and creates or updates another database accordingly.\n\n' +
  '- The output database will be created if necessary.\n' +
  '- The source database won\'t be modified nor deleted.\n' +
  '- Invalid key-value pairs entries will be skipped.\n' +
  '- Requires read and write access to the source.\n' +
  '- Requires read and write access to --out.\n',
  handler: (argv) => {
    return migrate(argv)
  }
} as CommandModule<object, Params>

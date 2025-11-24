// chel migrate --to <backend>

import * as colors from 'jsr:@std/fmt/colors'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import sbp from 'npm:@sbp/sbp'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import type DatabaseBackend from './serve/DatabaseBackend.ts'
import { initDB } from './serve/database.ts'
import { exit, isValidKey } from './utils.ts'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse } from 'npm:smol-toml'

type Params = { from?: string, fromConfig?: string, to: string, toConfig?: string }

export async function migrate (args: ArgumentsCamelCase<Params>): Promise<void> {
  const { to } = args

  if (args.fromConfig) {
    const fromConfig = parse(await readFile(args.fromConfig, { encoding: 'utf-8', flag: 'r' }))
    const backend = nconf.get('database:backend')
    nconf.overrides({ database: { backendOptions: { [backend]: fromConfig } } })
  }

  await initDB({ skipDbPreloading: true })

  if (!to) exit('missing argument: --to')

  let backendTo: DatabaseBackend
  try {
    let toConfig = {}
    if (args.toConfig) {
      toConfig = parse(await readFile(args.toConfig, { encoding: 'utf-8', flag: 'r' }))
    }

    const Ctor = (await import(`./serve/database-${to}.ts`)).default
    backendTo = new Ctor(toConfig)
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
      .option('from', {
        describe: 'Source backend',
        requiresArg: true,
        string: true
      })
      .alias('database:backend', 'from')
      .option('from-config', {
        describe: 'Source backend configuration',
        requiresArg: true,
        string: true
      })
      .option('to', {
        describe: 'Destination backend',
        demandOption: true,
        requiresArg: true,
        string: true
      })
      .option('to-config', {
        describe: 'Destination backend configuration',
        requiresArg: true,
        string: true
      })
      .strict(false)
      .strictCommands(true)
  },
  command: 'migrate [--from <backend>] [--to <backend>]',
  describe: 'Reads all key-value pairs from a given database and creates or updates another database accordingly.\n\n' +
  '- The output database will be created if necessary.\n' +
  '- The source database won\'t be modified nor deleted.\n' +
  '- Invalid key-value pairs entries will be skipped.\n' +
  '- Requires read and write access to the source.\n',
  postHandler: (argv) => {
    return migrate(argv)
  }
} as CommandModule<object, Params>

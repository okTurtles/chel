// chel migrate --to <backend>

import * as colors from 'jsr:@std/fmt/colors'
import type { Buffer } from 'node:buffer'
import { realpathSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import sbp from 'npm:@sbp/sbp'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import type DatabaseBackend from './serve/DatabaseBackend.ts'
import { SQLITE_DEFAULT_FILEPATH } from './serve/backend-schemas.ts'
import { closeDB, initDB } from './serve/database.ts'
import { exit, isValidKey } from './utils.ts'
import { validateParsedConfig } from './validateConfig.ts'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse, type TomlTable } from 'npm:smol-toml'

type Params = { from: string; fromConfig?: string; to: string; toConfig?: string }

// Shapes the same-file guard needs out of a backend's options: a sqlite
// backend's own `filepath`, or a router's map of key prefixes to backend
// entries. Spelled structurally rather than reusing the schemas' inferred
// types, because these values arrive from nconf and from a freshly parsed TOML
// file, neither of which has been narrowed by the time the guard runs.
type SqliteOptionsLike = { filepath?: string }
type RouterEntryLike = { name?: string; options?: SqliteOptionsLike }
type BackendOptionsLike = SqliteOptionsLike | Record<string, RouterEntryLike> | undefined

// Canonicalizes a filepath for same-file comparison. resolve() alone is
// lexical, which is not enough on two counts: on case-insensitive
// filesystems (the macOS and Windows defaults) two spellings can name one
// file, and a symlink can name the source file from somewhere else.
// realpathSync.native answers both, returning the path the filesystem itself
// recognizes (including the on-disk case). A path that does not exist yet has
// no real path to ask for; it cannot be the already-opened source file in
// that case, so the lexical form stands in.
function canonicalFilepath (filepath: string): string {
  const resolved = resolve(filepath)
  try {
    return realpathSync.native(resolved)
  } catch {
    return resolved
  }
}

// An omitted filepath resolves the way SqliteBackend itself resolves it, via
// the constant the backend derives its own defaults from.
function filepathOf (options: SqliteOptionsLike | undefined): string {
  return canonicalFilepath(options?.filepath || SQLITE_DEFAULT_FILEPATH)
}

// Every SQLite file `backend` would open, deduplicated. A router counts: it
// delegates reads and writes (including the `iterKeys` cursor the guard below
// is about) to whichever nested backend a key's prefix selects, so a `sqlite`
// entry anywhere in its map is a SQLite file this migration touches. Prefixed
// entries count as much as the mandatory `*` fallback does.
//
// Depth 1 is the whole tree: RouterConfigEntrySchema rejects a nested router,
// so a router's entries are always leaf backends.
function sqliteFilepaths (backend: string | undefined, options: BackendOptionsLike): string[] {
  if (backend === 'sqlite') return [filepathOf(options as SqliteOptionsLike | undefined)]
  if (backend !== 'router') return []
  const entries = Object.values((options ?? {}) as Record<string, RouterEntryLike>)
  return [
    ...new Set(
      entries.filter((entry) => entry?.name === 'sqlite').map((entry) => filepathOf(entry.options))
    )
  ]
}

// The first SQLite file a migration would both read from and write to, or null
// when there is none. Nothing else rejects that combination, and it cannot
// work: the source is walked with a cursor that holds a read transaction open
// for the whole migration, and better-sqlite3 refuses a write issued on a
// connection that is mid-query ('This database connection is busy executing a
// query'); a second connection to the same file fares no better, blocking
// until the busy timeout expires and then failing with SQLITE_BUSY.
//
// Returns the path rather than a boolean so the error can name the file, which
// matters once the collision can be buried in a router config. Split out from
// migrate() so it can be tested without a database.
export function sharedSqliteFilepath (
  fromBackend: string | undefined,
  toBackend: string | undefined,
  fromOptions: BackendOptionsLike,
  toOptions: BackendOptionsLike
): string | null {
  const targets = new Set(sqliteFilepaths(toBackend, toOptions))
  return sqliteFilepaths(fromBackend, fromOptions).find((path) => targets.has(path)) ?? null
}

export function isSameSqliteFile (
  fromBackend: string | undefined,
  toBackend: string | undefined,
  fromOptions: BackendOptionsLike,
  toOptions: BackendOptionsLike
): boolean {
  return sharedSqliteFilepath(fromBackend, toBackend, fromOptions, toOptions) !== null
}

export async function migrate (args: ArgumentsCamelCase<Params>): Promise<void> {
  const { to } = args

  if (args.fromConfig) {
    const fromConfig = parse(await readFile(args.fromConfig, { encoding: 'utf-8', flag: 'r' }))
    validateParsedConfig(fromConfig, args.fromConfig)
    const backend = nconf.get('database:backend')
    const fromBackend = (fromConfig?.database as TomlTable)?.backend
    if (fromBackend !== backend) {
      console.warn(`--from-config has backend ${fromBackend} but --from is ${backend}`)
    }
    const fromConfigOpts =
      ((fromConfig?.database as TomlTable)?.backendOptions as TomlTable)?.[backend] || {}
    nconf.set(`database:backendOptions:${backend}`, fromConfigOpts)
  }

  try {
    await initDB({ skipDbPreloading: true })
  } catch (e) {
    console.error('Error setting up database')
    throw e
  }

  let backendTo: DatabaseBackend | undefined
  try {
    let toConfigOpts: BackendOptionsLike
    if (args.toConfig) {
      const toConfig = parse(await readFile(args.toConfig, { encoding: 'utf-8', flag: 'r' }))
      validateParsedConfig(toConfig, args.toConfig)
      const toBackend = (toConfig?.database as TomlTable)?.backend as string
      if (toBackend !== to) {
        console.warn(`--to-config has backend ${toBackend} but --to is ${to}`)
      }
      // validateParsedConfig has already rejected anything that is not a valid
      // option table for the backend, so this only trades smol-toml's generic
      // TomlTable for the shape the guard below reads.
      toConfigOpts = (((toConfig?.database as TomlTable)?.backendOptions as TomlTable)?.[to] ||
        {}) as BackendOptionsLike
    } else {
      toConfigOpts = nconf.get(`database:backendOptions:${to}`) || {}
    }

    const fromBackend = nconf.get('database:backend')
    const sharedFile = sharedSqliteFilepath(
      fromBackend,
      to,
      nconf.get(`database:backendOptions:${fromBackend}`),
      toConfigOpts
    )
    if (sharedFile) {
      // Both sides are inspected, so either side can be the one that has to
      // move: naming only --to-config would hide the fix when the collision
      // comes from a router entry on the source, and "a different filepath"
      // would understate the case where the target simply inherited the
      // filepath from chel.toml.
      exit(
        `Source and target both use the SQLite database file ${sharedFile}. ` +
        'Migrating a database onto itself cannot work: the source is read ' +
        'through a cursor that keeps its connection busy for the whole run, so ' +
        'writes are rejected rather than applied. Point the source or the ' +
        'target at a different file (for example with --from-config or ' +
        '--to-config).'
      )
    }

    const Ctor = (await import(`./serve/database-${to}.ts`)).default
    backendTo = new Ctor(toConfigOpts)
    await backendTo!.init()

    const numKeys = await sbp('chelonia.db/keyCount')
    let numMigratedKeys = 0
    let numVisitedKeys = 0

    const reportStatus = () => {
      console.log(`${colors.green('Migrated:')} ${numMigratedKeys} entries`)
    }

    const checkAndExit = (() => {
      let interruptCount = 0
      let shouldExit = 0

      const handleSignal = (signal: string, code: number) => {
        process.on(signal, () => {
          // Exit codes follow the 128 + signal code convention.
          // See <https://tldp.org/LDP/abs/html/exitcodes.html>
          shouldExit = 128 + code

          if (++interruptCount < 3) {
            console.error(`Received signal ${signal} (${code}). Finishing current operation.`)
          } else {
            console.error(`Received signal ${signal} (${code}). Force quitting.`)
            reportStatus()
            exit(shouldExit)
          }
        })
      }

      const checkAndExit = async () => {
        if (shouldExit) {
          await backendTo!.close()
          reportStatus()
          exit(shouldExit)
        }
      }

      // Codes from <signal.h>
      ;(
        [
          ['SIGHUP', 1],
          ['SIGINT', 2],
          ['SIGQUIT', 3],
          ['SIGTERM', 15],
          ['SIGUSR1', 10],
          ['SIGUSR2', 11]
        ] as [string, number][]
      ).forEach(([signal, code]) => handleSignal(signal, code))

      return checkAndExit
    })()

    let lastReportedPercentage = 0
    for await (const key of sbp('chelonia.db/iterKeys')) {
      numVisitedKeys++
      if (!isValidKey(key)) {
        console.debug('Skipping invalid key', key)
        continue
      }
      // `any:` prefix needed to get the raw value, else the default is getting
      // a string, which will be encoded as UTF-8. This can cause data loss.
      let value: Buffer | string | undefined
      try {
        value = await sbp('chelonia.db/get', `any:${key}`)
      } catch (e) {
        reportStatus()
        console.error(`Error reading from source database key '${key}'`, e)
        throw e
      }
      await checkAndExit()
      // Make `deno check` happy.
      if (value === undefined) {
        console.debug('Skipping empty key', key)
        continue
      }
      try {
        await backendTo!.writeData(key, value)
      } catch (e) {
        reportStatus()
        console.error(`Error writing to target database key '${key}'`, e)
        throw e
      }
      await checkAndExit()
      ++numMigratedKeys
      // Prints a message roughly every 10% of progress.
      const percentage = Math.floor((numVisitedKeys / numKeys) * 100)
      if (percentage - lastReportedPercentage >= 10) {
        lastReportedPercentage = percentage
        console.log(`Migrating... ${percentage}% done`)
      }
    }
    reportStatus()
  } finally {
    await Promise.all([backendTo?.close(), closeDB()])
  }
}

export const module = {
  validatesConfig: true,
  builder: (yargs) => {
    return (
      yargs
        .option('from', {
          describe: 'Source backend',
          demandOption: true,
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
        // strict(false) to support non-enumerated flags, which can be used for
        // configuring backend settings. However, `from-config` should be preferred.
        .strict(false)
        .strictCommands(true)
    )
  },
  command: 'migrate',
  describe:
    'Reads all key-value pairs from a given database and creates or updates another database accordingly.\n\n' +
    '- The output database will be created if necessary.\n' +
    '- The source database won\'t be modified nor deleted.\n' +
    '- Invalid key-value pairs entries will be skipped.\n' +
    '- Requires read and write access to the source.\n',
  postHandler: (argv) => {
    return migrate(argv)
  }
} as CommandModule<object, Params>

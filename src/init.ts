import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { SERVER_DEFAULTS } from './parseConfig.ts'

type Params = { force?: boolean }

const DEFAULT_CONFIG_PATH = 'chel.toml'

// Template written by `chel init`. Every default value is interpolated from
// `SERVER_DEFAULTS` (single source of truth in `src/config-defaults.ts`) so the
// generated `chel.toml` cannot silently drift from the runtime defaults.
const tomlValue = (v: unknown): string => {
  if (typeof v === 'string') return `"${v}"`
  if (typeof v === 'boolean' || typeof v === 'number') return String(v)
  throw new Error(`Cannot render default value into TOML template: ${String(v)}`)
}

const buildTemplate = (serverId: string): string => {
  const d = SERVER_DEFAULTS
  return `# Chel server configuration.
# See https://github.com/okTurtles/chelonia for documentation.

# Unique identity for this server instance. Do NOT reuse this value across
# environments (prod / staging / dev) that share a database, or push
# notifications may be delivered to clients registered against a different
# instance. The server refuses to start when this is unset. Do NOT change
# this value on an existing database: mismatched push subscriptions are
# skipped by default and only reclaimed when 'server.reclaimForeignSubscriptions'
# is enabled.
server_id = "${serverId}"

[server]
# appDir = ${tomlValue(d.server.appDir)}
host = ${tomlValue(d.server.host)}
port = ${tomlValue(d.server.port)}
dashboardPort = ${tomlValue(d.server.dashboardPort)}
# fileUploadMaxBytes = ${tomlValue(d.server.fileUploadMaxBytes)}
# maxEventsBatchSize = ${tomlValue(d.server.maxEventsBatchSize)}
# archiveMode = ${tomlValue(d.server.archiveMode)}
# reclaimForeignSubscriptions = ${tomlValue(d.server.reclaimForeignSubscriptions)}

[server.signup]
# disabled = ${tomlValue(d.server.signup.disabled)}

[server.signup.limit]
# disabled = ${tomlValue(d.server.signup.limit.disabled)}
# minute = ${tomlValue(d.server.signup.limit.minute)}
# hour = ${tomlValue(d.server.signup.limit.hour)}
# day = ${tomlValue(d.server.signup.limit.day)}

[server.vapid]
# email = "you@example.com"

[database]
backend = ${tomlValue(d.database.backend)}
# lruNumItems = ${tomlValue(d.database.lruNumItems)}

[database.backendOptions]
`
}

export const init = async (args: ArgumentsCamelCase<Params>): Promise<void> => {
  const configPath = path.resolve(DEFAULT_CONFIG_PATH)
  const serverId = crypto.randomUUID()
  const contents = buildTemplate(serverId)
  if (args.force) {
    await Deno.writeTextFile(configPath, contents)
  } else {
    try {
      await Deno.writeTextFile(configPath, contents, { createNew: true })
    } catch (err: unknown) {
      if (err instanceof Deno.errors.AlreadyExists) {
        throw new Error(
          `Refusing to overwrite existing '${DEFAULT_CONFIG_PATH}'. Re-run with --force to overwrite.`
        )
      }
      // `createNew: true` above created the file before the write failed;
      // remove the partial/empty result so the next run isn't blocked by a
      // file the user never intentionally created.
      await Deno.remove(configPath).catch(() => {})
      throw err
    }
  }
  console.log(colors.green('wrote:'), DEFAULT_CONFIG_PATH)
  console.log(
    colors.blue('server_id:'),
    serverId,
    colors.yellow('keep this stable; do not reuse across environments, and do not rotate it on an existing DB.')
  )
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('force', {
        boolean: true,
        default: false,
        describe: 'Overwrite an existing chel.toml'
      })
  },
  command: 'init',
  describe: 'generate a template chel.toml (including a fresh server_id)',
  postHandler: (argv) => {
    return init(argv)
  }
} as CommandModule<object, Params>

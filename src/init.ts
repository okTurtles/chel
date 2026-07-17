import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'

type Params = { force?: boolean }

const DEFAULT_CONFIG_PATH = 'chel.toml'

// Template written by `chel init`. Mirrors the defaults from
// `src/parseConfig.ts` and adds a freshly-generated `server_id`. Comments
// explain the meaning of each section so first-time operators have guidance.
const buildTemplate = (serverId: string): string => {
  return `# Chel server configuration.
# See https://github.com/okTurtles/chelonia for documentation.

# Unique identity for this server instance. Do NOT reuse this value across
# environments (prod / staging / dev) that share a database, or push
# notifications may be delivered to clients registered against a different
# instance. The server refuses to start when this is unset. Do NOT change
# this value on an existing database: push subscriptions tagged with the
# previous id will be reclaimed on next boot.
server_id = "${serverId}"

[server]
# appDir = "."
host = "0.0.0.0"
port = 8000
dashboardPort = 8888
# fileUploadMaxBytes = 31457280
# logLevel = "debug"
# maxEventsBatchSize = 500
# archiveMode = false

[server.signup]
# disabled = false

[server.signup.limit]
# disabled = false
# minute = 2
# hour = 10
# day = 50

[server.signup.vapid]
# email = "you@example.com"

[database]
backend = "mem"

[database.backendOptions]
# lruNumItems = 10000
`
}

export const init = async (args: ArgumentsCamelCase<Params>): Promise<void> => {
  const configPath = path.resolve(DEFAULT_CONFIG_PATH)
  const exists = await Deno.stat(configPath).then(
    () => true,
    (err: unknown) => {
      if (err instanceof Deno.errors.NotFound) return false
      throw err
    }
  )
  if (exists && !args.force) {
    throw new Error(
      `Refusing to overwrite existing '${DEFAULT_CONFIG_PATH}'. Re-run with --force to overwrite.`
    )
  }
  const serverId = crypto.randomUUID()
  const contents = buildTemplate(serverId)
  await Deno.writeTextFile(configPath, contents)
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

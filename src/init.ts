import * as colors from 'jsr:@std/fmt/colors'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'

type Params = { out?: string, force?: boolean }

const TEMPLATE_CHEL_TOML = `# Chel configuration file
# See https://github.com/okTurtles/chel for documentation

[server]
# Application directory
appDir = "."

# Server host and port
host = "0.0.0.0"
port = 8000

# Dashboard port
dashboardPort = 8888

# Maximum file upload size in bytes (default: 30MB)
fileUploadMaxBytes = 31457280

# Server ID - used to identify this server instance when sharing a database
# between multiple environments (e.g., production and staging).
# Push notification clients are tagged with this ID and only loaded if it matches.
# Uncomment and set a unique value for each server environment.
# serverId = "production"

# Log level: "trace", "debug", "info", "warn", "error", "fatal"
logLevel = "debug"

# Archive mode (read-only)
archiveMode = false

[server.signup]
disabled = false

[server.signup.limit]
disabled = false
minute = 2
hour = 10
day = 50

[server.signup.vapid]
# Email for VAPID (required for web push notifications)
# email = "admin@example.com"

[database]
# LRU cache size
lruNumItems = 10000

# Backend type: "mem", "sqlite", "fs", "redis"
backend = "mem"

[database.backendOptions.sqlite]
# filepath = "./data/chel.db"

[database.backendOptions.fs]
# dirname = "./data"
# depth = 2
# keyChunkLength = 2

[database.backendOptions.redis]
# url = "redis://localhost:6379"
`

export const init = async (args: ArgumentsCamelCase<Params>): Promise<void> => {
  const outFile = args.out || 'chel.toml'

  try {
    await Deno.stat(outFile)
    if (!args.force) {
      console.error(colors.red('Error:'), `File '${outFile}' already exists. Use --force to overwrite.`)
      Deno.exit(1)
    }
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e
    }
  }

  await Deno.writeTextFile(outFile, TEMPLATE_CHEL_TOML)
  console.log(colors.green('Created:'), outFile)
  console.log(colors.blue('Tip:'), 'Edit the file to configure your server settings.')
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('out', {
        alias: 'o',
        describe: 'Output file name (default: chel.toml)',
        requiresArg: true,
        string: true
      })
      .option('force', {
        alias: 'f',
        describe: 'Overwrite existing file',
        boolean: true,
        default: false
      })
  },
  command: 'init',
  describe: 'Generate a template chel.toml configuration file',
  postHandler: (argv) => {
    return init(argv)
  }
} as CommandModule<object, Params>

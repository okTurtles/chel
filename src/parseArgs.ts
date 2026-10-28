import process from 'node:process'
import * as commands from './commands.ts'
// @deno-types="npm:@types/nconf"
// @deno-types="npm:@types/yargs"
import yargs, { type ArgumentsCamelCase, type CommandModule as YCommandModule } from 'npm:yargs'
import { hideBin } from 'npm:yargs/helpers'
import { DEFAULT_CONFIG_FILE } from './config-defaults.ts'

// Use an object to hold the handler to ensure live binding works
const handlerState: {
  postHandler: () => void | Promise<void>
  validatesConfig: boolean
  // The `--config` path, or undefined when the flag wasn't given
  configFile: string | undefined
} = {
  postHandler: () => {},
  validatesConfig: false,
  configFile: undefined
}

const parseArgs = () => {
  const handlerWrapper = <T, U>(
    commandModule: commands.CommandModule<T, U>
  ): YCommandModule<T, U> => {
    return {
      ...commandModule,
      handler: (argv: ArgumentsCamelCase<U>) => {
        handlerState.postHandler = () => commandModule.postHandler(argv)
        handlerState.validatesConfig = commandModule.validatesConfig === true
        handlerState.configFile = (argv as { config?: string }).config
        if (commandModule.handler) {
          return commandModule.handler(argv)
        }
      }
    }
  }

  // Typecasting seems to be required
  const commandModules = Object.values(commands).map((c) =>
    handlerWrapper(c as commands.CommandModule<object, object>)
  )

  const yargsInstance = yargs(hideBin(process.argv))
    .version(import.meta.VERSION)
    .strict()
    // Every command takes it: each one loads the config, and `chel init`
    // writes it. No `default`, so that `parseConfig` can tell a path that was
    // asked for, and must exist, from the default one.
    .option('config', {
      describe: 'Path to the config file',
      defaultDescription: DEFAULT_CONFIG_FILE,
      requiresArg: true,
      string: true,
      global: true
    })
    .command(commandModules)
    .demandCommand()
    .help()

  return yargsInstance
}

export default parseArgs
export { handlerState }

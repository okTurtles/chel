import process from 'node:process'
import * as commands from './commands.ts'
// @deno-types="npm:@types/nconf"
// @deno-types="npm:@types/yargs"
import yargs, { type ArgumentsCamelCase, type CommandModule as YCommandModule } from 'npm:yargs'
import { hideBin } from 'npm:yargs/helpers'

// Use an object to hold the handler to ensure live binding works
const handlerState: { postHandler: () => void | Promise<void> } = {
  postHandler: () => {}
}

const parseArgs = () => {
  const handlerWrapper = <T, U>(
    commandModule: commands.CommandModule<T, U>
  ): YCommandModule<T, U> => {
    return {
      ...commandModule,
      handler: (argv: ArgumentsCamelCase<U>) => {
        handlerState.postHandler = () => commandModule.postHandler(argv)
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
    .command(commandModules)
    .demandCommand()
    .help()

  return yargsInstance
}

export default parseArgs
export { handlerState }

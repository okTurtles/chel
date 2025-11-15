#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env

// Deno APIs:
// https://doc.deno.land/deno/stable
// https://doc.deno.land/https://deno.land/std/
// Deno examples:
// https://doc.deno.land/https://deno.land/std@0.141.0/examples
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

import process from 'node:process'
import * as commands from './commands.ts'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse, stringify } from 'npm:smol-toml'
// @deno-types="npm:@types/yargs"
import yargs, { type ArgumentsCamelCase, type CommandModule as YCommandModule } from 'npm:yargs'
import { hideBin } from 'npm:yargs/helpers'

let postHandler: () => void | Promise<void> = () => {}

const handlerWrapper = <T, U>(commandModule: commands.CommandModule<T, U>): YCommandModule<T, U> => {
  return {
    ...commandModule,
    handler: (argv: ArgumentsCamelCase<U>) => {
      postHandler = () => commandModule.postHandler(argv)
      if (commandModule.handler) {
        return commandModule.handler(argv)
      }
    }
  }
}

// Typecasting seems to be required
const commandModules = Object.values(commands).map(
  (c) => handlerWrapper(c as commands.CommandModule<object, object>)
)

nconf
  .env({
    separator: '__',
    lowerCase: true,
    parseValues: true
  })
  .argv(yargs(hideBin(process.argv))
    .version(import.meta.VERSION)
    .strict()
    .command(commandModules)
    .demandCommand()
    .help()
  )
  .file({ file: 'chel.toml', format: { parse, stringify } })
  .defaults({
    'server': {
      'appDir': '.',
      'port': 8000,
      'dashboardPort': 8888,
      'fileUploadMaxBytes': 31457280,
      'signup': {
        'disabled': false,
        'limit': {
          'disabled': false,
          'minute': 2,
          'hour': 10,
          'day': 50
        },
        'vapid': {
          'email': undefined
        }
      },
      'logLevel': 'debug',
      'messages': [],
      'maxEventsBatchSize': 500
    },
    'chelonia': {
      'registrationDisabled': false,
      'archiveMode': false
    },
    'database': {
      'lruNumItems': 10000,
      'backend': 'mem',
      'backendOptions': {
        'fs': {
          'depth': 0,
          'keyChunkLength': 2,
          'dirname': './data',
          'skipFsCaseSensitivityCheck': false
        },
        'sqlite': {
          'filepath': './data/chelonia.db'
        }
      }
    }
  })

await postHandler()

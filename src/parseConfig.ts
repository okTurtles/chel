// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse, stringify } from 'npm:smol-toml'
import parseArgs from './parseArgs.ts'

const parseConfig = () => {
  nconf
    .env({
      separator: '__',
      lowerCase: true,
      parseValues: true
    })
    .argv(parseArgs())
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
}

export default parseConfig
export { postHandler } from './parseArgs.ts'

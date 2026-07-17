// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse, stringify } from 'npm:smol-toml'
import parseArgs, { handlerState } from './parseArgs.ts'

// Single source of truth for server defaults. Consumed by `parseConfig()`
// below and by `chel init` (via `src/init.ts`) so the generated `chel.toml`
// template cannot silently drift from the runtime defaults. Exported as a
// plain (mutable-shape) object because nconf's `.defaults()` expects a
// record; nothing should mutate it.
export const SERVER_DEFAULTS = {
  // Unique identity for this server instance. Must not be reused across
  // environments (prod / staging / dev) that share a database, otherwise
  // push notifications may be delivered to clients registered against a
  // different instance. `chel serve` refuses to start when this is unset.
  server_id: undefined,
  server: {
    appDir: '.',
    host: '0.0.0.0',
    port: 8000,
    dashboardPort: 8888,
    fileUploadMaxBytes: 31457280,
    signup: {
      disabled: false,
      limit: {
        disabled: false,
        minute: 2,
        hour: 10,
        day: 50
      },
      vapid: {
        email: undefined
      }
    },
    logLevel: 'debug',
    messages: [],
    maxEventsBatchSize: 500,
    archiveMode: false,
    reclaimForeignSubscriptions: false
  },
  database: {
    lruNumItems: 10000,
    backend: 'mem',
    backendOptions: {}
  }
}

const parseConfig = () => {
  nconf
    .env({
      separator: '__',
      parseValues: true
    })
    .argv(parseArgs())
    .file({ file: 'chel.toml', format: { parse, stringify } })
    .defaults(SERVER_DEFAULTS)
}

export default parseConfig
export { handlerState }

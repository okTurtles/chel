// Scaffolding for tests that need to start the real server with a specific
// configuration, as opposed to the shared, refcounted test server in
// `routes-test-helpers.ts`.
//
// nconf is process-global and its `defaults` store is read-only, so overriding
// settings for one test means writing to a writable store and clearing the keys
// again afterwards. Deriving the cleanup list from the config that was applied
// keeps the two from drifting apart, which is easy to get wrong when the list is
// maintained by hand: a key that is set but never cleared leaks into every test
// that runs afterwards in the same process.
//
// This is deliberately not a `*.test.ts` file, so that the test runner does not
// pick it up as a suite of its own.

// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { startServer, stopServer } from './index.ts'

export type IsolatedServer = {
  uri: string
  // Stops the server and removes every key this call added
  stop: () => Promise<void>
}

// `config` is keyed by nconf path (e.g. `'server:archiveMode'`), because
// `nconf.set` with a nested object would replace whole subtrees rather than
// individual settings.
export const startIsolatedServer = async (
  config: Record<string, unknown>
): Promise<IsolatedServer> => {
  nconf.use('memory')
  for (const [key, value] of Object.entries(config)) nconf.set(key, value)

  try {
    const { uri } = await startServer({ installSignalHandlers: false })
    return {
      uri,
      stop: async () => {
        await stopServer()
        for (const key of Object.keys(config)) nconf.clear(key)
      }
    }
  } catch (e) {
    // A server that failed to start still has to give its configuration back
    for (const key of Object.keys(config)) nconf.clear(key)
    throw e
  }
}

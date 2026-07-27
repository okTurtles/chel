// Tests for the `server_id` behavior introduced across `parseConfig.ts`,
// `serve/push.ts`, `serve/server.ts` and `serve.ts`:
//   1. `saveSubscription` tags every persisted push subscription with the
//      configured `server_id`.
//   2. The push-subscription restore loop in `serve/server.ts` skips stored
//      subscriptions whose `serverId` doesn't match the configured one,
//      including legacy entries written before `server_id` existed.
//   3. `serve()` in `serve.ts` refuses to start when `server_id` is missing.
//
// `jsr:@db/sqlite` is loaded purely to keep the Deno memory-leak checker
// happy (see other *.test.ts files in this directory).
import 'jsr:@db/sqlite'
import { assert, assertEquals, assertRejects } from 'jsr:@std/assert'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import sbp from 'npm:@sbp/sbp'
import process from 'node:process'
import { addChannelToSubscription } from './push.ts'
import { closeDB, initDB } from './database.ts'
import { PUBSUB_INSTANCE } from './instance-keys.ts'
import { startServer, stopServer } from './index.ts'
import { serve } from '../serve.ts'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Save and restore the `server_id` nconf value around each test so that
// global nconf state never leaks across tests (nconf is process-global).
// We deliberately use `nconf.defaults()` because `server_id` is read via
// `nconf.get('server_id')` whose lowest-precedence layer is `defaults`.
const withServerId = async <T>(value: string | undefined, fn: () => Promise<T>): Promise<T> => {
  const previousDefault = nconf.get('server_id')
  const previousEnv = process.env.server_id
  delete process.env.server_id
  nconf.defaults({ server_id: value })
  try {
    return await fn()
  } finally {
    nconf.defaults({ server_id: previousDefault })
    if (previousEnv !== undefined) process.env.server_id = previousEnv
    else delete process.env.server_id
  }
}

// Save and restore the listed `process.env` entries around each test so that
// global env state never leaks across tests (process.env is process-global).
// An override value of `undefined` means "delete the key for the duration of
// the callback, then restore whatever was there before."
const withEnv = async <T>(
  overrides: Record<string, string | undefined>,
  fn: () => Promise<T>
): Promise<T> => {
  const snapshot: Record<string, string | undefined> = {}
  for (const k of Object.keys(overrides)) {
    snapshot[k] = process.env[k]
  }
  try {
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
    return await fn()
  } finally {
    for (const [k, v] of Object.entries(snapshot)) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
  }
}

// Minimum nconf defaults required for `startServer()` to boot. Mirrors the
// subset of `routes-test-helpers.ts::startTestServer` that we care about,
// plus an explicit `server_id`. We set `archiveMode: true` so that
// `startServer()` does not spin up the size/credits workers — those create
// `MessagePort` instances that the Deno leak detector flags. The
// `bugfix-messageport-leak` branch addresses that separately; we don't want
// to depend on it here.
const applyServerDefaults = (serverId: string, opts?: { reclaim?: boolean }): void => {
  nconf.defaults({
    server_id: serverId,
    server: {
      host: '127.0.0.1',
      port: 0, // ephemeral port
      appDir: '.',
      fileUploadMaxBytes: 31457280,
      signup: {
        disabled: false,
        limit: { disabled: false, minute: 100, hour: 1000, day: 10000 }
      },
      messages: [],
      maxEventsBatchSize: 500,
      archiveMode: true,
      reclaimForeignSubscriptions: !!opts?.reclaim
    },
    database: {
      lruNumItems: 100,
      backend: 'mem',
      backendOptions: {}
    }
  })
}

const writeSubscription = async (
  subscriptionId: string,
  serverId: string | undefined,
  endpoint: string
): Promise<void> => {
  // Intentionally omit `serverId` from the payload when it's undefined so we
  // exercise the legacy-entry path (JSON.stringify drops undefined values).
  const payload: Record<string, unknown> = {
    settings: {},
    subscriptionInfo: {
      endpoint,
      keys: { auth: 'auth', p256dh: 'p256dh' }
    },
    channelIDs: []
  }
  if (serverId !== undefined) payload.serverId = serverId
  await sbp('chelonia.db/set', `_private_webpush_${subscriptionId}`, JSON.stringify(payload))
}

const WEBPUSH_INDEX = '_private_webpush_index'

// ---------------------------------------------------------------------------
// saveSubscription persists server_id
// ---------------------------------------------------------------------------

Deno.test({
  name: 'push.saveSubscription persists the configured server_id',
  async fn (t: Deno.TestContext) {
    await withServerId('save-sub-test-id', async () => {
      await initDB()
      try {
        await t.step('addChannelToSubscription writes serverId from nconf into the stored payload', async () => {
          const subscriptionId = 'sub-save-1'
          // Minimal fake `WSS` — `addChannelToSubscription` only touches
          // `server.pushSubscriptions[id].subscriptions` (a Set) and reads
          // `.settings` + the whole object as `subscriptionInfo` for
          // `JSON.stringify`. We don't need the real pubsub machinery here.
          const fakeServer = {
            pushSubscriptions: {
              [subscriptionId]: {
                endpoint: 'https://example.com/push/1',
                keys: { auth: 'a', p256dh: 'b' },
                settings: { heartbeatInterval: 30 },
                subscriptions: new Set(['chan-existing'])
              }
            }
          }
          await addChannelToSubscription(fakeServer as never, subscriptionId, 'chan-new')

          const stored = await sbp('chelonia.db/get', `_private_webpush_${subscriptionId}`)
          assert(typeof stored === 'string', 'subscription should have been persisted')
          const parsed = JSON.parse(stored as string)
          assertEquals(parsed.serverId, 'save-sub-test-id')
          // Sanity: the rest of the payload is still intact.
          assertEquals(parsed.channelIDs, ['chan-existing', 'chan-new'])
          assertEquals(parsed.settings.heartbeatInterval, 30)
        })
      } finally {
        await closeDB()
      }
    })
  }
})

// ---------------------------------------------------------------------------
// load loop skips subscriptions whose serverId doesn't match
// ---------------------------------------------------------------------------

Deno.test({
  name: 'server startServer() adopts legacy, skips mismatched, and loads matching push subscriptions (default)',
  async fn (): Promise<void> {
    const configuredId = 'configured-instance-id'
    const otherId = 'some-other-instance-id'

    // Ensure NODE_ENV is set so the dev-only request logging middleware
    // doesn't trip over `process.env.CI`.
    await withEnv({ NODE_ENV: 'development', CI: 'true' }, async () => {
      // Pre-populate the in-memory DB with three subscriptions before the
      // server boots. The mem backend lives in `okTurtles.data` (module-level),
      // so it survives our `closeDB()` here and is read by the load loop when
      // `startServer()` re-initialises the DB below.
      applyServerDefaults(configuredId)
      await initDB()
      try {
        await writeSubscription('sub-matching', configuredId, 'https://example.com/push/matching')
        await writeSubscription('sub-mismatched', otherId, 'https://example.com/push/mismatched')
        await writeSubscription('sub-legacy', undefined, 'https://example.com/push/legacy')
        await sbp('chelonia.db/set', WEBPUSH_INDEX, 'sub-matching\x00sub-mismatched\x00sub-legacy')
      } finally {
        await closeDB()
      }

      try {
        await startServer({ installSignalHandlers: false })

        const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as
          | { pushSubscriptions: Record<string, unknown> }
          | undefined
        assert(pubsub, 'PUBSUB_INSTANCE should be populated after startServer()')

        // Matching + legacy (adopted) are loaded; mismatched is skipped (not
        // loaded into memory).
        const loaded = Object.keys(pubsub.pushSubscriptions).sort()
        assertEquals(loaded, ['sub-legacy', 'sub-matching'])
      } finally {
        await stopServer()
        // Clean up the in-mem DB so the next test doesn't see these entries.
        await initDB()
        try {
          // After the load loop (default): `sub-mismatched` should have been
          // skipped (key + index retained, not loaded) and `sub-legacy`
          // re-tagged with the configured id. Verify those DB-level effects.
          const index = await sbp('chelonia.db/get', WEBPUSH_INDEX) as string | undefined
          const mismatchedKey = await sbp('chelonia.db/get', '_private_webpush_sub-mismatched')
          const legacyKey = await sbp('chelonia.db/get', '_private_webpush_sub-legacy') as string | undefined

          // Skipped: key retained on disk and in the index (not loaded).
          assert(mismatchedKey, 'mismatched subscription key should be retained on disk by default')
          assert(index && index.split('\x00').includes('sub-mismatched'),
            'mismatched subscription id should remain in the index by default')

          // Adopted: key still present and now tagged with the configured id.
          assert(legacyKey, 'legacy subscription key should still exist (adopted, not deleted)')
          assertEquals(JSON.parse(legacyKey).serverId, configuredId,
            'legacy subscription should have been re-tagged with the configured server_id')

          await Promise.all([
            sbp('chelonia.db/delete', '_private_webpush_sub-matching'),
            sbp('chelonia.db/delete', '_private_webpush_sub-mismatched'),
            sbp('chelonia.db/delete', '_private_webpush_sub-legacy'),
            sbp('chelonia.db/delete', WEBPUSH_INDEX)
          ])
        } finally {
          await closeDB()
        }
      }
    })
  }
})

// ---------------------------------------------------------------------------
// reclaimForeignSubscriptions opt-in reclaims mismatched entries
// ---------------------------------------------------------------------------

Deno.test({
  name: 'server startServer() reclaims mismatched push subscriptions when reclaimForeignSubscriptions is set',
  async fn (): Promise<void> {
    const configuredId = 'reclaim-opt-in-id'
    const otherId = 'some-other-instance-id'

    await withEnv({ NODE_ENV: 'development', CI: 'true' }, async () => {
      applyServerDefaults(configuredId, { reclaim: true })
      await initDB()
      try {
        await writeSubscription('sub-matching', configuredId, 'https://example.com/push/matching')
        await writeSubscription('sub-mismatched', otherId, 'https://example.com/push/mismatched')
        await writeSubscription('sub-legacy', undefined, 'https://example.com/push/legacy')
        await sbp('chelonia.db/set', WEBPUSH_INDEX, 'sub-matching\x00sub-mismatched\x00sub-legacy')
      } finally {
        await closeDB()
      }

      try {
        await startServer({ installSignalHandlers: false })

        const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as
          | { pushSubscriptions: Record<string, unknown> }
          | undefined
        assert(pubsub, 'PUBSUB_INSTANCE should be populated after startServer()')

        // Matching + legacy (adopted) are loaded; mismatched is reclaimed.
        const loaded = Object.keys(pubsub.pushSubscriptions).sort()
        assertEquals(loaded, ['sub-legacy', 'sub-matching'])
      } finally {
        await stopServer()
        await initDB()
        try {
          const index = await sbp('chelonia.db/get', WEBPUSH_INDEX) as string | undefined
          const mismatchedKey = await sbp('chelonia.db/get', '_private_webpush_sub-mismatched')
          const legacyKey = await sbp('chelonia.db/get', '_private_webpush_sub-legacy') as string | undefined

          assert(!mismatchedKey, 'mismatched subscription key should have been deleted under opt-in reclaim')
          assert(!index || !index.split('\x00').includes('sub-mismatched'),
            'mismatched subscription id should have been removed from the index under opt-in reclaim')

          assert(legacyKey, 'legacy subscription key should still exist (adopted, not deleted)')
          assertEquals(JSON.parse(legacyKey).serverId, configuredId,
            'legacy subscription should have been re-tagged with the configured server_id')

          await Promise.all([
            sbp('chelonia.db/delete', '_private_webpush_sub-matching'),
            sbp('chelonia.db/delete', '_private_webpush_sub-mismatched'),
            sbp('chelonia.db/delete', '_private_webpush_sub-legacy'),
            sbp('chelonia.db/delete', WEBPUSH_INDEX)
          ])
        } finally {
          await closeDB()
        }
      }
    })
  }
})

// ---------------------------------------------------------------------------
// missing payload is de-indexed (resolves the former TODO)
// ---------------------------------------------------------------------------

Deno.test({
  name: 'server startServer() de-indexes push subscriptions whose payload is missing',
  async fn (): Promise<void> {
    const configuredId = 'missing-payload-test-id'

    await withEnv({ NODE_ENV: 'development', CI: 'true' }, async () => {
      applyServerDefaults(configuredId)
      await initDB()
      try {
        // Write a valid subscription plus an index entry that points at a
        // subscription id whose payload was never written.
        await writeSubscription('sub-present', configuredId, 'https://example.com/push/present')
        await sbp('chelonia.db/set', WEBPUSH_INDEX, 'sub-present\x00sub-ghost')
      } finally {
        await closeDB()
      }

      try {
        await startServer({ installSignalHandlers: false })

        const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as
          | { pushSubscriptions: Record<string, unknown> }
          | undefined
        assert(pubsub, 'PUBSUB_INSTANCE should be populated after startServer()')
        assertEquals(Object.keys(pubsub.pushSubscriptions).sort(), ['sub-present'])
      } finally {
        await stopServer()
        await initDB()
        try {
          // The ghost id should have been removed from the index.
          const index = await sbp('chelonia.db/get', WEBPUSH_INDEX) as string | undefined
          assert(!index || !index.split('\x00').includes('sub-ghost'),
            'ghost subscription id should have been removed from the index')
          await Promise.all([
            sbp('chelonia.db/delete', '_private_webpush_sub-present'),
            sbp('chelonia.db/delete', WEBPUSH_INDEX)
          ])
        } finally {
          await closeDB()
        }
      }
    })
  }
})

// ---------------------------------------------------------------------------
// serve() throws when server_id is unset
// ---------------------------------------------------------------------------

Deno.test({
  name: 'serve.serve() refuses to start without a configured server_id',
  async fn (): Promise<void> {
    await withServerId(undefined, async () => {
      // We can't pass a real ArgumentsCamelCap<Params> here, but the very
      // first thing `serve()` does is the `server_id` guard — before any
      // arg is touched — so a minimal stand-in is enough.
      await assertRejects(
        () => serve({} as never),
        Error,
        'server_id'
      )
    })
  }
})

// ---------------------------------------------------------------------------
// startServer() (the library entry point) refuses to boot without server_id
// ---------------------------------------------------------------------------
// Defense in depth: this exercises the guard inside `startServerImpl()`
// directly, bypassing `serve()`. It protects any future caller that reaches
// the server via `startServer()` without going through the `chel serve`
// command wrapper.

Deno.test({
  name: 'startServer() refuses to boot without a configured server_id',
  async fn (): Promise<void> {
    await withServerId(undefined, async () => {
      await assertRejects(
        () => startServer({ installSignalHandlers: false }),
        Error,
        'server_id'
      )
    })
  }
})

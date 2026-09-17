// Tests for `signup-rate-limit.ts`.
//
// The limiters are inactive outside production (see `signupRateLimitDisabled`),
// so the 429 path cannot be reached through an HTTP request from this suite:
// flipping `NODE_ENV` for a request would also change how the database and the
// development-only routes are set up, which other test files depend on. These
// tests therefore exercise the limiters directly.
//
// `jsr:@db/sqlite` is loaded purely to keep the Deno memory-leak checker happy
// (see other *.test.ts files in this directory).
import 'jsr:@db/sqlite'
import { assert, assertEquals, assertThrows } from 'jsr:@std/assert'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import process from 'node:process'
import {
  consumeSignupToken,
  createSignupLimiters,
  disposeSignupLimiters,
  limiterKey,
  signupRateLimitDisabled
} from './signup-rate-limit.ts'

const LIMIT_DISABLED_KEY = 'server:signup:limit:disabled'

const withEnv = async (nodeEnv: string | undefined, fn: () => unknown | Promise<unknown>) => {
  const previous = process.env.NODE_ENV
  if (nodeEnv === undefined) delete process.env.NODE_ENV
  else process.env.NODE_ENV = nodeEnv
  try {
    await fn()
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV
    else process.env.NODE_ENV = previous
  }
}

Deno.test({
  name: 'signup rate limiting: per-IP key derivation',
  async fn (t: Deno.TestContext) {
    await t.step('IPv4 addresses are used in full', () => {
      assertEquals(limiterKey('203.0.113.7'), '203.0.113.7')
    })

    await t.step('IPv6 addresses are reduced to their /64 subnet', () => {
      // Spammers can easily get a whole /64, so the host bits are discarded
      assertEquals(limiterKey('2001:db8:1:2:3:4:5:6'), '2001:db8:1:2::')
      assertEquals(
        limiterKey('2001:0db8:0001:0002:0003:0004:0005:0006'),
        limiterKey('2001:db8:1:2:ffff:ffff:ffff:ffff')
      )
    })

    await t.step('compressed and expanded forms of one address share a key', () => {
      assertEquals(limiterKey('2001:db8::1'), limiterKey('2001:db8:0:0:0:0:0:1'))
      assertEquals(limiterKey('::1'), limiterKey('0:0:0:0:0:0:0:1'))
    })

    await t.step('IPv4-mapped IPv6 addresses collapse to the IPv4 key', () => {
      assertEquals(limiterKey('::ffff:203.0.113.7'), '203.0.113.7')
    })

    await t.step('link-local addresses keep their zone and full address', () => {
      // Otherwise every interface on a link would share one bucket
      assertEquals(limiterKey('fe80::1%eth0'), 'fe80:0:0:0:0:0:0:1%eth0')
      assert(limiterKey('fe80::1%eth0') !== limiterKey('fe80::1%eth1'))
    })

    await t.step('an unparseable address is an error rather than a shared key', () => {
      // Falling back to a constant key would let one bad value throttle everyone
      assertThrows(() => limiterKey('not-an-ip'))
      assertThrows(() => limiterKey(''))
    })
  }
})

Deno.test({
  name: 'signup rate limiting: token accounting',
  async fn (t: Deno.TestContext) {
    const limiters = createSignupLimiters({ minute: 2, hour: 3, day: 4 })

    try {
      await t.step('requests are allowed until the smallest window is exhausted', async () => {
        assertEquals(await consumeSignupToken(limiters, '198.51.100.1'), true)
        assertEquals(await consumeSignupToken(limiters, '198.51.100.1'), true)
        assertEquals(await consumeSignupToken(limiters, '198.51.100.1'), false)
      })

      await t.step('each IP has its own allowance', async () => {
        assertEquals(await consumeSignupToken(limiters, '198.51.100.2'), true)
      })

      await t.step('addresses in the same IPv6 /64 share an allowance', async () => {
        assertEquals(await consumeSignupToken(limiters, '2001:db8:aaaa:bbbb::1'), true)
        assertEquals(await consumeSignupToken(limiters, '2001:db8:aaaa:bbbb::2'), true)
        assertEquals(await consumeSignupToken(limiters, '2001:db8:aaaa:bbbb::3'), false)
      })

      await t.step('an unusable address is rejected rather than allowed through', async () => {
        assertEquals(await consumeSignupToken(limiters, 'not-an-ip'), false)
      })
    } finally {
      await disposeSignupLimiters(limiters)
    }
  }
})

Deno.test({
  name: 'signup rate limiting: when the limits apply',
  async fn (t: Deno.TestContext) {
    // nconf is process-global; this file only ever sets the one key
    nconf.use('memory')

    try {
      await t.step('limits are enforced in production by default', async () => {
        await withEnv('production', () => {
          nconf.clear(LIMIT_DISABLED_KEY)
          assertEquals(signupRateLimitDisabled(), false)
        })
      })

      await t.step('limits are off outside production, whatever is configured', async () => {
        for (const nodeEnv of [undefined, 'development', 'test']) {
          await withEnv(nodeEnv, () => {
            nconf.set(LIMIT_DISABLED_KEY, false)
            assertEquals(signupRateLimitDisabled(), true)
          })
        }
      })

      await t.step('production limits can be turned off explicitly', async () => {
        await withEnv('production', () => {
          nconf.set(LIMIT_DISABLED_KEY, true)
          assertEquals(signupRateLimitDisabled(), true)
          // Environment variables arrive as strings; 'off' must not read as
          // truthy, which would silently disable the limits
          nconf.set(LIMIT_DISABLED_KEY, 'true')
          assertEquals(signupRateLimitDisabled(), true)
          nconf.set(LIMIT_DISABLED_KEY, 'off')
          assertEquals(signupRateLimitDisabled(), false)
          nconf.set(LIMIT_DISABLED_KEY, '')
          assertEquals(signupRateLimitDisabled(), false)
        })
      })
    } finally {
      nconf.clear(LIMIT_DISABLED_KEY)
    }
  }
})

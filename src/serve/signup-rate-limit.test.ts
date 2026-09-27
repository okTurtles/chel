// Tests for `signup-rate-limit.ts`.
//
// The limiters are inactive outside production (see `signupRateLimitDisabled`),
// so the 429 path cannot be reached through an HTTP request from this suite:
// flipping `NODE_ENV` for a request would also change how the database and the
// development-only routes are set up, which other test files depend on. These
// tests therefore exercise the limiters directly.
import { assert, assertEquals, assertThrows } from 'jsr:@std/assert'
import { FakeTime } from 'jsr:@std/testing/time'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import process from 'node:process'
import {
  consumeSignupToken,
  createSignupLimiters,
  disposeSignupLimiters,
  limiterKey,
  signupRateLimitDisabled,
  signupRateLimitDisabledReason,
  type SignupLimiters
} from './signup-rate-limit.ts'

const LIMIT_DISABLED_KEY = 'server:signup:limit:disabled'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

type Limits = { minute: number, hour: number, day: number }

type Clock = {
  time: FakeTime
  // Waits for `promise`, running the zero-delay timers it depends on
  settle: <T>(promise: Promise<T>) => Promise<T>
  // Lets work that timers have started run to completion
  flush: () => Promise<void>
  // Moves time forward, firing every timer due on the way, then flushes
  advance: (ms: number) => Promise<void>
  consume: (ip: string) => Promise<boolean>
}

// Runs `fn` against limiters created under fake time. Bottleneck reads the
// time with `Date.now()`, refills reservoirs from a per-key `setInterval`
// heartbeat and forgets idle keys from a per-group `setInterval`, so all of
// these have to be faked to move through an hour or a day instantly, and the
// limiters have to be created after time is faked for their timers to be.
//
// FakeTime also fakes `setTimeout`, which Bottleneck awaits (with a zero
// delay) before every datastore operation, so under fake time nothing it does
// completes on its own. `tickAsync(0)` runs pending microtasks and then the
// timers due now, i.e. moves Bottleneck along by one such step without moving
// the clock; `settle` and `flush` repeat it.
const withFakeTime = async (limits: Limits, fn: (limiters: SignupLimiters, clock: Clock) => Promise<void>) => {
  const time = new FakeTime(Date.UTC(2026, 0, 1))
  const settle = async <T>(promise: Promise<T>): Promise<T> => {
    let settled = false
    promise.then(() => { settled = true }, () => { settled = true })
    for (let steps = 0; !settled; steps++) {
      if (steps === 1000) throw new Error('Bottleneck did not settle under fake time')
      await time.tickAsync(0)
    }
    return promise
  }
  // A fixed number of steps: there is no way to ask FakeTime whether a
  // zero-delay timer is pending without firing it. The longest chain here
  // (group cleanup deleting a key, which disconnects its limiter) takes a few.
  const flush = async () => {
    for (let i = 0; i < 20; i++) await time.tickAsync(0)
  }
  const limiters = createSignupLimiters(limits)
  const clock: Clock = {
    time,
    settle,
    flush,
    advance: async (ms) => {
      time.tick(ms)
      await flush()
    },
    consume: (ip) => settle(consumeSignupToken(limiters, ip))
  }
  try {
    await fn(limiters, clock)
  } finally {
    // Still under fake time: disposal waits on Bottleneck's timers too
    try {
      await settle(disposeSignupLimiters(limiters))
    } finally {
      time.restore()
    }
  }
}

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
      // Uncompressed: the dotted tail stands in for two hextets, so there are
      // only seven segments. This used to be rejected (i.e. a permanent 429).
      assertEquals(limiterKey('0:0:0:0:0:ffff:203.0.113.7'), '203.0.113.7')
      assertEquals(limiterKey('64:ff9b::203.0.113.7'), '203.0.113.7')
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
    // Real time: the steps below all happen well within a minute
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
  name: 'signup rate limiting: every window is enforced for its full length',
  async fn (t: Deno.TestContext) {
    const IP = '198.51.100.7'
    // Each case makes a different window the binding one, so that a window
    // that is never consulted cannot hide behind the others
    const cases: Array<{ binding: string, limits: Limits, length: number }> = [
      { binding: 'minute', limits: { minute: 2, hour: 10, day: 10 }, length: MINUTE },
      { binding: 'hour', limits: { minute: 10, hour: 2, day: 10 }, length: HOUR },
      { binding: 'day', limits: { minute: 10, hour: 10, day: 2 }, length: DAY }
    ]
    for (const { binding, limits, length } of cases) {
      await t.step(`the ${binding} window, when it is the smallest`, async () => {
        await withFakeTime(limits, async (_limiters, clock) => {
          assertEquals(await clock.consume(IP), true)
          assertEquals(await clock.consume(IP), true)
          assertEquals(await clock.consume(IP), false)

          // Regression test: with Bottleneck's default Group `timeout` (five
          // minutes), an idle address was forgotten and got a full allowance
          // back, so the hourly and daily limits never took effect
          await clock.advance(length - 1)
          assertEquals(await clock.consume(IP), false, 'allowance 1 ms before the window ends')
          await clock.advance(1)
          assertEquals(await clock.consume(IP), true, 'allowance once the window has ended')
        })
      })
    }
  }
})

Deno.test({
  name: 'signup rate limiting: idle addresses are forgotten once their window has passed',
  async fn () {
    // Otherwise the limiters, each with its own heartbeat timer, would pile up
    // for every address that ever registered
    const IP = '198.51.100.7'
    await withFakeTime({ minute: 1, hour: 1, day: 1 }, async (limiters, clock) => {
      assertEquals(await clock.consume(IP), true)
      assertEquals(await clock.consume(IP), false)

      // Each group keeps an address for at least a whole window after its last
      // registration, and checks for idle ones every half window
      await clock.advance(DAY)
      assertEquals(limiters.perMinute.keys(), [])
      assertEquals(limiters.perHour.keys(), [])
      assertEquals(limiters.perDay.keys(), [IP])
      await clock.advance(DAY / 2)
      assertEquals(limiters.perDay.keys(), [])
    })
  }
})

Deno.test({
  name: 'signup rate limiting: disposal stops every timer',
  async fn () {
    // Every address gets a limiter per window, each with a heartbeat timer of
    // its own, so leaving them running would keep the old limiters alive
    // after `registerRoutes` re-runs or the server stops
    await withFakeTime({ minute: 2, hour: 10, day: 50 }, async (limiters, clock) => {
      for (const ip of ['198.51.100.1', '198.51.100.2', '2001:db8::1']) {
        assertEquals(await clock.consume(ip), true)
      }
      await clock.settle(disposeSignupLimiters(limiters))
      await clock.flush()
      // `next()` fires the next pending timer and reports whether there was one
      assertEquals(clock.time.next(), false, 'a timer is still pending after disposal')
    })
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
          assertEquals(signupRateLimitDisabledReason(), undefined)
        })
      })

      await t.step('limits are off outside production, whatever is configured', async () => {
        for (const nodeEnv of [undefined, 'development', 'test']) {
          await withEnv(nodeEnv, () => {
            nconf.set(LIMIT_DISABLED_KEY, false)
            assertEquals(signupRateLimitDisabled(), true)
            // The startup warning names the reason, since the setting reads
            // as though the limits were active
            assertEquals(signupRateLimitDisabledReason(), 'NODE_ENV is not "production"')
          })
        }
      })

      await t.step('production limits can be turned off explicitly', async () => {
        await withEnv('production', () => {
          nconf.set(LIMIT_DISABLED_KEY, true)
          assertEquals(signupRateLimitDisabled(), true)
          assertEquals(signupRateLimitDisabledReason(), 'server.signup.limit.disabled')
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

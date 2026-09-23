// Per-IP rate limiting for ownerless (unattributed) first messages, i.e. new
// registrations. Kept out of `routes.ts` so that the address normalisation and
// the token accounting can be tested directly: the limiters are deliberately
// inactive outside production (see `signupRateLimitDisabled`), which makes them
// unreachable through an HTTP request in the test suite.

import { isIP } from 'node:net'
import process from 'node:process'
import Bottleneck from 'npm:bottleneck'
import { booleanConfig } from './config-utils.ts'

const SECOND = 1000

// `0db8` and `db8` are the same hextet, and `0000` is `0`.
const normalizeHextet = (segment: string): string => segment.replace(/^0+(?=[0-9a-fA-F])/, '')

export type SignupLimiters = {
  perMinute: Bottleneck.Group
  perHour: Bottleneck.Group
  perDay: Bottleneck.Group
}

// Given an IPv4 or IPv6, extract a suitable key to be used for rate limiting.
// For IPv4 addresses (including IPv4 addresses embedded in IPv6 addresses),
// just use the full IPv4 address as is.
// For IPv6 addresses, discard the least significant 64 bits. This makes DoS
// harder and because of subnetting the discarded bits likely all represent
// addresses belonging to the same individual.
// Note: link-local IPv6 addresses aren't transformed and used in full.
// See: <https://github.com/okTurtles/group-income/issues/2832>
export const limiterKey = (ip: string): string => {
  const ipVersion = isIP(ip)
  if (ipVersion === 4) {
    return ip
  } else if (ipVersion === 6) {
    // Likely IPv6
    const [address, zoneIdx] = ip.split('%')
    const segments = address.split(':')

    // Is this a compressed form IPv6 address?
    let isCompressed = false
    for (let i = 0; i < segments.length - 1; i++) {
      // Compressed form address
      if (!isCompressed && segments[i] === '') {
        const requiredSegments = 8 - (segments.length - 1)
        if (requiredSegments < 0) {
          throw new Error('Invalid IPv6 address: too many segments')
        }
        if ((i === 0 || i === segments.length - 2) && segments[i + 1] === '') {
          segments[i + 1] = '0'
        }
        if (i === 0 && segments.length === 3 && segments[i + 2] === '') {
          segments[i + 2] = '0'
        }
        segments.splice(i, 1, ...new Array(requiredSegments).fill('0'))
        isCompressed = true
        continue
      }
      // Remove leading zeroes, so that every textual form of one address
      // (`2001:0db8:...` and `2001:db8:...`) ends up in the same bucket. The
      // previous form of this collapsed leading zeroes onto a single `0`
      // instead of dropping them, which gave `0db8` and `db8` distinct keys.
      segments[i] = normalizeHextet(segments[i])
    }

    if (segments.length === 8 && isIP(segments[7]) === 4) {
      // IPv4-embedded, IPv4-mapped and IPv4-translated addresses are returned
      // as IPv4
      return segments[7]
    } else if (segments.length === 8) {
      if (zoneIdx) {
        segments[7] = normalizeHextet(segments[7])
        // Use tagged (link-local) addresses in full
        return segments.join(':').toLowerCase() + '%' + zoneIdx
      } else {
        // If an IPv6 address, return the first 64 bits. This is because that's
        // the smallest possible subnet, and spammers can easily get an entire
        // /64
        return segments.slice(0, 4).join(':').toLowerCase() + '::'
      }
    } else {
      throw new Error('Invalid IPv6 address')
    }
  }

  throw new Error('Invalid address format')
}

const group = (reservoir: number, intervalMs: number): Bottleneck.Group => {
  return new Bottleneck.Group({
    strategy: Bottleneck.strategy.LEAK,
    highWater: 0,
    reservoir,
    reservoirRefreshInterval: intervalMs,
    reservoirRefreshAmount: reservoir
  })
}

export const createSignupLimiters = (
  { minute, hour, day }: { minute: number, hour: number, day: number }
): SignupLimiters => {
  return {
    perMinute: group(minute, 60 * SECOND),
    perHour: group(hour, 60 * 60 * SECOND),
    perDay: group(day, 24 * 60 * 60 * SECOND)
  }
}

// Consumes one token from each window for `ip`. Returns `false` when any of
// them is exhausted, i.e. when the request should be rejected with a 429.
export const consumeSignupToken = async (limiters: SignupLimiters, ip: string): Promise<boolean> => {
  try {
    // See discussion: https://github.com/okTurtles/group-income/pull/2280#pullrequestreview-2219347378
    const keyedIp = limiterKey(ip)
    await limiters.perMinute.key(keyedIp).schedule(() => Promise.resolve())
    await limiters.perHour.key(keyedIp).schedule(() => Promise.resolve())
    await limiters.perDay.key(keyedIp).schedule(() => Promise.resolve())
    return true
  } catch {
    return false
  }
}

export const disposeSignupLimiters = async (limiters: SignupLimiters | undefined): Promise<void> => {
  if (!limiters) return
  const groups = [limiters.perMinute, limiters.perHour, limiters.perDay]
  await Promise.allSettled(groups.map(g => g.disconnect()))
  // Bottleneck v2 Group.disconnect() only disconnects the Redis connection (if any).
  // The internal `setInterval` from `_startAutoCleanup()` is not cleaned up, causing
  // async leaks on shutdown. We must clear it via the private `interval` property.
  for (const g of groups) {
    clearInterval((g as unknown as { interval: ReturnType<typeof setInterval> }).interval)
  }
}

// The limits exist to slow down mass registration on a public server, and would
// only get in the way locally, so they are enforced in production only.
// `server.signup.limit.disabled` can therefore turn them further off, never on.
// This is easy to misread as "configured, so active" when testing against a dev
// server, hence the startup warning in `routes.ts`.
export const signupRateLimitDisabled = (): boolean => {
  return process.env.NODE_ENV !== 'production' || booleanConfig('server:signup:limit:disabled')
}

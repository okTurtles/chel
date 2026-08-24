// Tests for the numeric configuration readers in `config-utils.ts`.
//
// Values coming from the environment or the command line bypass
// `validateConfig.ts` (which only checks `chel.toml`) and nconf leaves anything
// that isn't valid JSON as a string, so these readers have to coerce and
// range-check rather than hand a string to a `>` comparison.
import { assertEquals, assertThrows } from 'jsr:@std/assert'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { nonNegativeIntConfig, positiveIntConfig } from './config-utils.ts'

const KEY = 'server:signup:maxFirstMessageBytes'
const ALLOWANCE_KEY = 'server:billing:freeAllowanceBytes'
const DEFAULT_MAX_FIRST_MESSAGE_BYTES = 5 * 1024
const DEFAULT_FREE_ALLOWANCE_BYTES = 10 * 1024 * 1024

const withValue = <T>(key: string, value: unknown, fn: () => T): T => {
  nconf.use('memory')
  const previous = nconf.get(key)
  if (value === undefined) nconf.clear(key)
  else nconf.set(key, value)
  try {
    return fn()
  } finally {
    if (previous === undefined) nconf.clear(key)
    else nconf.set(key, previous)
  }
}

Deno.test({
  name: 'numeric configuration readers',
  async fn (t: Deno.TestContext) {
    await t.step('an unset value falls back to the documented default', () => {
      withValue(KEY, undefined, () => {
        assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES)
      })
      withValue(ALLOWANCE_KEY, undefined, () => {
        assertEquals(nonNegativeIntConfig(ALLOWANCE_KEY), DEFAULT_FREE_ALLOWANCE_BYTES)
      })
    })

    await t.step('a valid value is used as-is, including numeric strings', () => {
      withValue(KEY, 1234, () => assertEquals(positiveIntConfig(KEY), 1234))
      // Env and CLI values arrive as strings when they are not valid JSON
      withValue(KEY, '1234', () => assertEquals(positiveIntConfig(KEY), 1234))
    })

    await t.step('a non-numeric value falls back instead of disabling the limit', () => {
      // The hazard being guarded against: `1e9 > 'abc'` is false, so an
      // unparsable value would let everything through
      withValue(KEY, 'abc', () => {
        assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES)
      })
    })

    await t.step('fractional and out-of-range values fall back', () => {
      withValue(KEY, 10.5, () => assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES))
      withValue(KEY, -1, () => assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES))
      // Beyond Number.MAX_SAFE_INTEGER, where integer arithmetic stops being exact
      withValue(KEY, 1e21, () => assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES))
      withValue(KEY, '1e+21', () => assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES))
    })

    await t.step('zero is rejected for caps but accepted where it is meaningful', () => {
      // A cap of 0 would reject every request; `disabled = true` is the
      // supported way to block signups
      withValue(KEY, 0, () => assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES))
      // A free allowance of 0 charges from the first byte
      withValue(ALLOWANCE_KEY, 0, () => assertEquals(nonNegativeIntConfig(ALLOWANCE_KEY), 0))
    })

    await t.step('a key with no default is a programming error', () => {
      assertThrows(
        () => positiveIntConfig('server:signup:noSuchSetting'),
        Error,
        'No numeric default'
      )
    })
  }
})

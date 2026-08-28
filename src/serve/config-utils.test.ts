// Tests for the configuration readers in `config-utils.ts`.
//
// Values coming from the environment or the command line bypass
// `validateConfig.ts` (which only checks `chel.toml`) and nconf leaves anything
// that isn't valid JSON as a string, so these readers have to coerce and
// range-check rather than hand a string to a `>` comparison.
import { assert, assertEquals, assertThrows } from 'jsr:@std/assert'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { booleanConfig, nonNegativeIntConfig, positiveIntConfig } from './config-utils.ts'

const KEY = 'server:signup:maxFirstMessageBytes'
const ALLOWANCE_KEY = 'server:billing:freeAllowanceBytes'
const FLAG_KEY = 'server:signup:limit:disabled'
// Deliberately hardcoded rather than imported from `config-defaults.ts`: these
// readers fall back to that module themselves, so importing it here would make
// the assertions tautological. Update them when the documented defaults change.
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

// A rejected value must say so: silently falling back would leave an operator
// believing a limit is in force when it is not.
const warningsFrom = (fn: () => unknown): string[] => {
  const warnings: string[] = []
  const original = console.warn
  console.warn = (...args: unknown[]) => warnings.push(args.join(' '))
  try {
    fn()
  } finally {
    console.warn = original
  }
  return warnings
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

    await t.step('values that only look numeric fall back', () => {
      // `Number()` maps all of these onto valid-looking integers: an empty
      // environment variable (`FOO=`) would otherwise read as 0, disabling the
      // free tier for the whole server, and nconf parses `FOO=true` into a
      // boolean, which would read as a 1 byte cap. Both would pass a plain
      // range check without complaint.
      for (const raw of ['', '   ', true, false, [], {}, [5]]) {
        withValue(KEY, raw, () => assertEquals(positiveIntConfig(KEY), DEFAULT_MAX_FIRST_MESSAGE_BYTES))
        withValue(ALLOWANCE_KEY, raw, () => {
          assertEquals(nonNegativeIntConfig(ALLOWANCE_KEY), DEFAULT_FREE_ALLOWANCE_BYTES)
        })
      }
    })

    await t.step('every rejected value is reported', () => {
      for (const raw of ['', true, 'abc', -1, 0, 10.5]) {
        const warnings = withValue(KEY, raw, () => warningsFrom(() => positiveIntConfig(KEY)))
        assertEquals(warnings.length, 1, `expected one warning for ${JSON.stringify(raw)}`)
        assert(warnings[0].includes(KEY), `warning should name the setting: ${warnings[0]}`)
      }
      // ...and an accepted value is not reported
      assertEquals(withValue(KEY, 1234, () => warningsFrom(() => positiveIntConfig(KEY))), [])
    })

    await t.step('a value above the maximum is clamped to it', () => {
      // Used for `maxFirstMessageBytes`, which cannot exceed the body limit the
      // `/event` route enforces; clamping keeps the largest usable value rather
      // than dropping back to the (smaller) default
      withValue(KEY, 4096, () => assertEquals(positiveIntConfig(KEY, 4096), 4096))
      const warnings = withValue(KEY, 4097, () => warningsFrom(() => positiveIntConfig(KEY, 4096)))
      assertEquals(withValue(KEY, 4097, () => positiveIntConfig(KEY, 4096)), 4096)
      assertEquals(warnings.length, 1)
      assert(warnings[0].includes('4096'), `warning should name the maximum: ${warnings[0]}`)
    })

    await t.step('a key with no default is a programming error', () => {
      assertThrows(
        () => positiveIntConfig('server:signup:noSuchSetting'),
        Error,
        'No number default'
      )
    })
  }
})

Deno.test({
  name: 'boolean configuration reader',
  async fn (t: Deno.TestContext) {
    await t.step('an unset value falls back to the documented default', () => {
      withValue(FLAG_KEY, undefined, () => assertEquals(booleanConfig(FLAG_KEY), false))
    })

    await t.step('booleans and 0/1 are used as-is', () => {
      withValue(FLAG_KEY, true, () => assertEquals(booleanConfig(FLAG_KEY), true))
      withValue(FLAG_KEY, false, () => assertEquals(booleanConfig(FLAG_KEY), false))
      withValue(FLAG_KEY, 1, () => assertEquals(booleanConfig(FLAG_KEY), true))
      withValue(FLAG_KEY, 0, () => assertEquals(booleanConfig(FLAG_KEY), false))
    })

    await t.step('the spellings an operator is likely to write are understood', () => {
      // The hazard being guarded against: every non-empty string is truthy, so
      // reading these settings directly would turn 'off' or 'false' into
      // 'enabled' — and for the signup rate limits, that fails open
      for (const raw of ['true', 'TRUE', ' yes ', 'on', '1']) {
        withValue(FLAG_KEY, raw, () => assertEquals(booleanConfig(FLAG_KEY), true))
      }
      for (const raw of ['false', 'FALSE', ' no ', 'off', '0', '']) {
        withValue(FLAG_KEY, raw, () => assertEquals(booleanConfig(FLAG_KEY), false))
      }
    })

    await t.step('anything else falls back and is reported', () => {
      for (const raw of ['maybe', 2, [], {}]) {
        withValue(FLAG_KEY, raw, () => {
          const warnings = warningsFrom(() => assertEquals(booleanConfig(FLAG_KEY), false))
          assertEquals(warnings.length, 1, `expected one warning for ${JSON.stringify(raw)}`)
          assert(warnings[0].includes(FLAG_KEY), `warning should name the setting: ${warnings[0]}`)
        })
      }
    })

    await t.step('a key with no boolean default is a programming error', () => {
      assertThrows(() => booleanConfig('server:signup:maxFirstMessageBytes'), Error, 'No boolean default')
    })
  }
})

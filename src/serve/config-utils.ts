// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { nconfDefaults } from '../config-defaults.ts'

// `validateConfig.ts` only checks `chel.toml`, so values coming from the
// environment or the command line are unvalidated, and nconf's
// `parseValues: true` leaves anything that isn't valid JSON as a string. Reading
// a numeric setting straight out of nconf therefore risks comparisons such as
// `size > 'abc'`, which are always false and would silently disable a limit
// (rather than failing loudly). These helpers coerce the value, range-check it
// and fall back to the documented default with a warning instead.

const defaultFor = (key: string): unknown => {
  return key.split(':').reduce<unknown>((acc, part) => {
    return (acc as Record<string, unknown> | undefined)?.[part]
  }, nconfDefaults)
}

const readIntConfig = (key: string, allowZero: boolean): number => {
  const fallback = defaultFor(key)
  if (typeof fallback !== 'number') {
    // A typo in `key` or a setting missing from `config-defaults.ts`; loud
    // because these helpers are called while the server starts up.
    throw new Error(`No numeric default defined for configuration key '${key}'`)
  }
  const raw = nconf.get(key)
  if (raw == null) return fallback
  const value = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isSafeInteger(value) || value < 0 || (value === 0 && !allowZero)) {
    console.warn(`[config] Invalid value for '${key}': ${JSON.stringify(raw)}. Using ${fallback}.`)
    return fallback
  }
  return value
}

// Reads a setting that must be a positive integer (e.g. a size cap, where 0
// would mean 'reject everything').
export const positiveIntConfig = (key: string): number => readIntConfig(key, false)

// Reads a setting where 0 is meaningful (e.g. `server:billing:freeAllowanceBytes`,
// where it disables the free tier).
export const nonNegativeIntConfig = (key: string): number => readIntConfig(key, true)

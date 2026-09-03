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

const requireDefault = <T>(key: string, type: 'number' | 'boolean'): T => {
  const fallback = defaultFor(key)
  if (typeof fallback !== type) {
    // A typo in `key` or a setting missing from `config-defaults.ts`; loud
    // because these helpers are called while the server starts up.
    throw new Error(`No ${type} default defined for configuration key '${key}'`)
  }
  return fallback as T
}

const warn = (key: string, raw: unknown, reason: string, using: unknown): void => {
  console.warn(`[config] Ignoring '${key}' (${JSON.stringify(raw)}): ${reason}. Using ${using}.`)
}

// `Number()` maps several non-numeric values onto valid-looking integers, and
// nconf hands us exactly those: `parseValues: true` turns `FOO=true` into a
// boolean (`Number(true) === 1`, i.e. a 1 byte cap) and leaves an empty `FOO=`
// as `''` (`Number('') === 0`, i.e. a disabled free tier). Both would pass the
// range check below without a warning, so only numbers and non-blank strings
// are treated as candidates.
const toNumber = (raw: unknown): number => {
  if (typeof raw === 'number') return raw
  if (typeof raw === 'string' && raw.trim() !== '') return Number(raw)
  return NaN
}

type IntBounds = { allowZero?: boolean, max?: number }

const readIntConfig = (key: string, { allowZero = false, max }: IntBounds): number => {
  const fallback = requireDefault<number>(key, 'number')
  const raw = nconf.get(key)
  if (raw == null) return fallback
  const value = toNumber(raw)
  if (!Number.isSafeInteger(value) || value < 0) {
    warn(key, raw, 'not a non-negative integer', fallback)
    return fallback
  }
  if (value === 0 && !allowZero) {
    warn(key, raw, 'zero is not supported for this setting', fallback)
    return fallback
  }
  if (max != null && value > max) {
    // Clamped rather than replaced by the default: the operator asked for a
    // larger value, so the largest usable one is closer to their intent than
    // the (smaller) default would be.
    warn(key, raw, `above the maximum of ${max}`, max)
    return max
  }
  return value
}

// Reads a setting that must be a positive integer (e.g. a size cap, where 0
// would mean 'reject everything'). Values above `max`, where given, are clamped
// to it with a warning.
export const positiveIntConfig = (key: string, max?: number): number => {
  return readIntConfig(key, { max })
}

// Reads a setting where 0 is meaningful (e.g. `server:billing:freeAllowanceBytes`,
// where it disables the free tier).
export const nonNegativeIntConfig = (key: string, max?: number): number => {
  return readIntConfig(key, { allowZero: true, max })
}

// Truthiness is the mirror image of the numeric hazard above, and fails open
// for the settings read here: every non-empty string is truthy, so
// `server__signup__limit__disabled=off` would *disable* the signup rate limits.
const TRUE_STRINGS = new Set(['true', '1', 'yes', 'on'])
const FALSE_STRINGS = new Set(['false', '0', 'no', 'off', ''])

// Reads a boolean setting, accepting the spellings an operator is likely to
// write in the environment (`on`/`off`, `yes`/`no`, `1`/`0`) and warning on
// anything else rather than interpreting it as `true`.
export const booleanConfig = (key: string): boolean => {
  const fallback = requireDefault<boolean>(key, 'boolean')
  const raw = nconf.get(key)
  if (raw == null) return fallback
  if (typeof raw === 'boolean') return raw
  if (raw === 0 || raw === 1) return raw === 1
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase()
    if (TRUE_STRINGS.has(normalized)) return true
    if (FALSE_STRINGS.has(normalized)) return false
  }
  warn(key, raw, 'not a boolean', fallback)
  return fallback
}

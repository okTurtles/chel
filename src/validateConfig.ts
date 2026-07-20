// Validates the contents of `chel.toml` against a whitelist of known options.
//
// The schema is intentionally strict: every recognised key is optional (nothing
// is mandatory), but the *shape* of each value is enforced so that typos and
// misconfigured values are caught early with a helpful message. Keys that are
// not part of the whitelist are reported as warnings (they usually indicate a
// typo), while values of the wrong type or shape are reported as errors.
//
// Backend option schemas are shared with each `database-*.ts` module via
// `backend-schemas.ts` (a single source of truth), so that *inactive* backends
// are also validated here (e.g. a malformed `backendOptions.redis` is caught
// even when `backend = "fs"`).

import { readFile } from 'node:fs/promises'
import * as z from 'npm:zod'
import { parse } from 'npm:smol-toml'
import {
  FsOptionsSchema,
  SqliteOptionsSchema,
  RedisOptionsSchema,
  RouterOptionsSchema,
  RouterConfigEntrySchema
} from './serve/backend-schemas.ts'

const port = z.number().int().min(1, 'must be an integer between 1 and 65535').max(65535, 'must be an integer between 1 and 65535')
const positiveInt = z.number().int().positive('must be a positive integer')

const BackendOptionsSchema = z.strictObject({
  fs: z.optional(FsOptionsSchema),
  sqlite: z.optional(SqliteOptionsSchema),
  redis: z.optional(RedisOptionsSchema),
  router: z.optional(RouterOptionsSchema)
})

export const ConfigSchema = z.strictObject({
  // Set via the `--app-manifest` CLI flag; allowed in TOML for completeness.
  appManifest: z.optional(z.string()),
  server: z.optional(z.strictObject({
    appDir: z.optional(z.string()),
    host: z.optional(z.string().min(1, 'must be a non-empty string')),
    port: z.optional(port),
    dashboardPort: z.optional(port),
    fileUploadMaxBytes: z.optional(positiveInt),
    // NOTE: validated for shape only; the logger currently reads `LOG_LEVEL`
    // from the environment directly (see `src/serve/logger.ts`), so this key
    // has no runtime effect yet.
    logLevel: z.optional(z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])),
    // Deliberately loose: server messages are app-defined and passed verbatim
    // to clients (see `routes.ts /serverMessages`), so only the array-of-objects
    // shape is enforced, not the fields within each message.
    messages: z.optional(z.array(z.record(z.string(), z.unknown()))),
    maxEventsBatchSize: z.optional(positiveInt),
    archiveMode: z.optional(z.boolean()),
    signup: z.optional(z.strictObject({
      disabled: z.optional(z.boolean()),
      limit: z.optional(z.strictObject({
        disabled: z.optional(z.boolean()),
        // Positive (not merely non-negative) to match the runtime, which falls
        // back to a default when these are falsy (see `routes.ts`), so `0`
        // would be silently ignored rather than meaning "no signups".
        minute: z.optional(positiveInt),
        hour: z.optional(positiveInt),
        day: z.optional(positiveInt)
      }))
    })),
    // The VAPID email is read from `server:vapid:email` at runtime
    // (see `src/serve/vapid.ts`).
    vapid: z.optional(z.strictObject({
      email: z.optional(z.string())
    }))
  })),
  database: z.optional(z.strictObject({
    backend: z.optional(z.enum(['mem', 'fs', 'sqlite', 'redis', 'router'], {
      error: '"backend" must be one of: mem, fs, sqlite, redis, router'
    })),
    lruNumItems: z.optional(positiveInt),
    backendOptions: z.optional(BackendOptionsSchema)
  }))
})

// Optimal String Alignment (restricted edit) distance with adjacent
// transpositions, used to suggest the intended key name when an unknown key
// looks like a typo of a known one.
function editDistance (a: string, b: string): number {
  const m = a.length
  const n = b.length
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) d[i][0] = i
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      )
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[m][n]
}

function suggest (key: string, candidates: string[]): string | undefined {
  let best: string | undefined
  let bestDist = Infinity
  for (const c of candidates) {
    const dist = editDistance(key, c)
    // Only suggest when the candidate is plausibly close: the distance must be
    // small in absolute terms and relative to the key length.
    if (dist < bestDist && dist <= Math.max(1, Math.floor(key.length / 2))) {
      best = c
      bestDist = dist
    }
  }
  return best
}

export interface ValidationResult {
  warnings: string[]
  errors: string[]
}

function formatPath (path: PropertyKey[]): string {
  return path.map(String).join('.')
}

// Runs the whitelist + shape validation against an already-parsed TOML object.
// Returns `{ warnings, errors }` as human-readable strings; never throws so that
// callers (and tests) can decide how to surface the results.
export function validateTomlConfig (parsed: unknown): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []

  const result = ConfigSchema.safeParse(parsed)
  if (result.success) return { warnings, errors }

  // Known keys per object, used to offer "did you mean …?" suggestions for
  // unrecognised keys. We re-derive these from the same schema definition.
  for (const issue of result.error.issues) {
    if (issue.code === 'unrecognized_keys') {
      const parentPath = formatPath(issue.path)
      const known = knownKeysFor(issue.path)
      for (const key of issue.keys) {
        const fullPath = parentPath ? `${parentPath}.${key}` : key
        const hint = suggest(key, known)
        warnings.push(
          hint
            ? `unknown key ${fullPath} (did you mean ${hint}?)`
            : `unknown key ${fullPath}`
        )
      }
    } else {
      const path = formatPath(issue.path)
      errors.push(path ? `${path}: ${issue.message}` : issue.message)
    }
  }

  return { warnings, errors }
}

// Returns the set of valid immediate child keys for a given path in the config
// tree, used to generate typo suggestions. Keep in sync with `ConfigSchema`
// above.
export function knownKeysFor (path: PropertyKey[]): string[] {
  // Keys *within* a router entry (`database.backendOptions.router.<prefix>`) are
  // described by `RouterConfigEntrySchema`, which has a fixed shape even though
  // the surrounding `z.record()` accepts arbitrary prefix keys. The prefix is
  // the 4th path segment and may itself contain dots (e.g. `gi.contracts/`), so
  // match on the path array rather than the joined string.
  if (
    path.length === 4 &&
    path[0] === 'database' &&
    path[1] === 'backendOptions' &&
    path[2] === 'router'
  ) {
    return Object.keys(RouterConfigEntrySchema.shape)
  }
  const joined = formatPath(path)
  switch (joined) {
    case '': return ['appManifest', 'server', 'database']
    case 'server':
      return ['appDir', 'host', 'port', 'dashboardPort', 'fileUploadMaxBytes', 'logLevel', 'messages', 'maxEventsBatchSize', 'archiveMode', 'signup', 'vapid']
    case 'server.signup':
      return ['disabled', 'limit']
    case 'server.signup.limit':
      return ['disabled', 'minute', 'hour', 'day']
    case 'server.vapid':
      return ['email']
    case 'database':
      return ['backend', 'lruNumItems', 'backendOptions']
    case 'database.backendOptions':
      return ['fs', 'sqlite', 'redis', 'router']
    case 'database.backendOptions.fs':
      return ['dirname', 'depth', 'keyChunkLength', 'skipFsCaseSensitivityCheck']
    case 'database.backendOptions.sqlite':
      return ['filepath']
    case 'database.backendOptions.redis':
      return ['url']
    // No case for `database.backendOptions.router` itself: it is a `z.record()`
    // accepting arbitrary prefix keys, so the prefix level never produces
    // unrecognized-key suggestions (its mandatory `*` fallback is enforced by a
    // refine in `backend-schemas.ts`). Keys within each entry are handled by the
    // guard at the top of this function.
    default:
      return []
  }
}

// Reads, parses, and validates a TOML config file against `ConfigSchema`.
// Prints warnings for unknown keys and throws an `Error` (listing every
// value-shape problem) on invalid values. A missing file is ignored, mirroring
// nconf's behaviour. Exported so the file-level behaviour (ENOENT handling,
// TOML parse errors and error aggregation) can be tested directly.
export async function validateConfigFile (filePath: string): Promise<void> {
  let raw: string
  try {
    raw = await readFile(filePath, { encoding: 'utf-8', flag: 'r' })
  } catch (e: unknown) {
    // No config file is the common case (e.g. for non-server commands); mirror
    // nconf's behaviour and skip validation.
    if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') return
    throw e
  }

  let parsed: unknown
  try {
    parsed = parse(raw)
  } catch (e: unknown) {
    throw new Error(`Could not parse ${filePath}: ${(e as Error).message}`)
  }

  const { warnings, errors } = validateTomlConfig(parsed)
  for (const warning of warnings) {
    console.warn(`[chel] ${filePath}: ${warning}`)
  }
  if (errors.length) {
    const listing = errors.map((e) => `  - ${e}`).join('\n')
    throw new Error(`Invalid ${filePath}:\n${listing}`)
  }
}

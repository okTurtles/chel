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

import * as z from 'npm:zod'
import {
  FsOptionsSchema,
  SqliteOptionsSchema,
  RedisOptionsSchema,
  RouterOptionsSchema
} from './serve/backend-schemas.ts'

const port = z.number().int().min(1, 'must be an integer between 1 and 65535').max(65535, 'must be an integer between 1 and 65535')
const positiveInt = z.number().int().positive('must be a positive integer')
const nonNegativeInt = z.number().int().min(0, 'must be a non-negative integer')

const BackendOptionsSchema = z.strictObject({
  fs: z.optional(FsOptionsSchema),
  sqlite: z.optional(SqliteOptionsSchema),
  redis: z.optional(RedisOptionsSchema),
  router: z.optional(RouterOptionsSchema)
})

const ConfigSchema = z.strictObject({
  // Set via the `--app-manifest` CLI flag; allowed in TOML for completeness.
  appManifest: z.optional(z.string()),
  server: z.optional(z.strictObject({
    appDir: z.optional(z.string()),
    host: z.optional(z.string().min(1, 'must be a non-empty string')),
    port: z.optional(port),
    dashboardPort: z.optional(port),
    fileUploadMaxBytes: z.optional(positiveInt),
    logLevel: z.optional(z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])),
    messages: z.optional(z.array(z.record(z.string(), z.unknown()))),
    maxEventsBatchSize: z.optional(positiveInt),
    archiveMode: z.optional(z.boolean()),
    signup: z.optional(z.strictObject({
      disabled: z.optional(z.boolean()),
      limit: z.optional(z.strictObject({
        disabled: z.optional(z.boolean()),
        minute: z.optional(nonNegativeInt),
        hour: z.optional(nonNegativeInt),
        day: z.optional(nonNegativeInt)
      })),
      vapid: z.optional(z.strictObject({
        email: z.optional(z.string())
      }))
    })),
    // `vapid` may also appear directly under `server` (see `src/serve/vapid.ts`,
    // which reads `server:vapid:email`). Both locations are accepted.
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

export type ChelConfig = z.infer<typeof ConfigSchema>

// Damerau-Levenshtein distance, used to suggest the intended key name when an
// unknown key looks like a typo of a known one.
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
function knownKeysFor (path: PropertyKey[]): string[] {
  const joined = formatPath(path)
  switch (joined) {
    case '': return ['appManifest', 'server', 'database']
    case 'server':
      return ['appDir', 'host', 'port', 'dashboardPort', 'fileUploadMaxBytes', 'logLevel', 'messages', 'maxEventsBatchSize', 'archiveMode', 'signup', 'vapid']
    case 'server.signup':
      return ['disabled', 'limit', 'vapid']
    case 'server.signup.limit':
      return ['disabled', 'minute', 'hour', 'day']
    case 'server.vapid':
    case 'server.signup.vapid':
      return ['email']
    case 'database':
      return ['backend', 'lruNumItems', 'backendOptions']
    case 'database.backendOptions':
      return ['fs', 'sqlite', 'redis', 'router']
    default:
      return []
  }
}

export default validateTomlConfig

// Zod schemas describing the options accepted by each database backend.
//
// These live in a dedicated, lightweight module so that `validateConfig.ts`
// can compose them without pulling in the backends' heavy native/runtime imports
// (e.g. the SQLite FFI or the Redis client). The backend modules import the same
// schemas as their single source of truth and call `.parse()` at construction
// time.

import * as z from 'npm:zod'

// Where the sqlite backend puts its database when no `filepath` is configured.
// Lives here rather than in the backend so the two places that need it cannot
// drift apart: `SqliteBackend`'s `dataFolder`/`filename` field defaults derive
// from it, and `chel migrate`'s same-file guard resolves an omitted `filepath`
// through it to compare paths the way the backend would. A guard comparing
// against a stale copy of this string would silently stop firing.
export const SQLITE_DEFAULT_FILEPATH = 'data/chelonia.db'

export const FsOptionsSchema = z.strictObject({
  dirname: z.optional(z.string()),
  depth: z.optional(z.number().int().min(0)),
  keyChunkLength: z.optional(z.number().int().positive()),
  skipFsCaseSensitivityCheck: z.optional(z.boolean())
})

export const SqliteOptionsSchema = z.strictObject({
  filepath: z.optional(z.string())
})

export const RedisOptionsSchema = z.strictObject({
  url: z.optional(z.url({
    protocol: /^rediss?$/,
    error: '"url" must begin with redis:// or rediss://'
  }))
})

export const RouterConfigEntrySchema = z.discriminatedUnion('name', [
  z.strictObject({ name: z.literal('fs'), options: FsOptionsSchema }),
  z.strictObject({ name: z.literal('sqlite'), options: SqliteOptionsSchema }),
  z.strictObject({ name: z.literal('redis'), options: RedisOptionsSchema }),
  z.strictObject({ name: z.literal('router'), options: z.record(z.string(), z.unknown()) })
    .refine(() => false, { error: 'router backends cannot be nested', path: ['name'] })
], {
  error: '"name" must be one of: fs, sqlite, redis'
})

// A router config maps key prefixes (including the mandatory `*` fallback) to
// `{ name, options }` entries. The refine check gives a clearer message than the
// intersection alternative when `*` is missing.
export const RouterOptionsSchema = z
  .record(z.string(), RouterConfigEntrySchema)
  .refine(
    (v) => '*' in v,
    { error: 'router backend requires a "*" (fallback) entry' }
  )

// Inferred option types, exported so each backend's constructor signature stays
// in sync with its schema automatically instead of hand-writing the same shape.
export type FsOptions = z.infer<typeof FsOptionsSchema>
export type SqliteOptions = z.infer<typeof SqliteOptionsSchema>
export type RedisOptions = z.infer<typeof RedisOptionsSchema>

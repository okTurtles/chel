// Zod schemas describing the options accepted by each database backend.
//
// These live in a dedicated, lightweight module so that `validateConfig.ts`
// can compose them without pulling in the backends' heavy native/runtime imports
// (e.g. the SQLite FFI or the Redis client). The backend modules import the same
// schemas as their single source of truth and call `.parse()` at construction
// time.

import * as z from 'npm:zod'

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
    protocol: /^(rediss?|unix)$/,
    error: '"url" must begin with redis://, rediss://, or unix://'
  }))
})

export const RouterConfigEntrySchema = z.discriminatedUnion('name', [
  z.strictObject({ name: z.literal('fs'), options: FsOptionsSchema }),
  z.strictObject({ name: z.literal('sqlite'), options: SqliteOptionsSchema }),
  z.strictObject({ name: z.literal('redis'), options: RedisOptionsSchema })
])

// A router config maps key prefixes (including the mandatory `*` fallback) to
// `{ name, options }` entries. The refine check gives a clearer message than the
// intersection alternative when `*` is missing.
export const RouterOptionsSchema = z
  .record(z.string(), RouterConfigEntrySchema)
  .refine(
    (v) => '*' in v,
    { error: 'router backend requires a "*" (fallback) entry' }
  )

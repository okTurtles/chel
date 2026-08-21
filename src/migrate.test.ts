// The same-file guard in `chel migrate`. Split out from the command itself so
// it can be checked without standing up two database backends.
import { assertEquals } from 'jsr:@std/assert'
import { isSameSqliteFile, sharedSqliteFilepath } from './migrate.ts'

// A router's options are a map of key prefixes to `{ name, options }` entries,
// with `*` as the mandatory fallback.
const router = (entries: Record<string, { name: string; options?: { filepath?: string } }>) =>
  entries

Deno.test('isSameSqliteFile', async (t) => {
  await t.step('true when both sides resolve to one file', () => {
    // Migrating a SQLite database onto itself cannot work: the source is
    // walked with a cursor that keeps its connection busy for the whole run,
    // so writes to the "target" are rejected rather than applied.
    assertEquals(
      isSameSqliteFile('sqlite', 'sqlite', { filepath: 'data/db.sqlite' }, {
        filepath: './data/db.sqlite'
      }),
      true
    )
  })

  await t.step('applies the backend defaults to an omitted filepath', () => {
    assertEquals(isSameSqliteFile('sqlite', 'sqlite', {}, {}), true)
    assertEquals(
      isSameSqliteFile('sqlite', 'sqlite', undefined, { filepath: 'data/chelonia.db' }),
      true
    )
  })

  await t.step('false for two different files', () => {
    assertEquals(
      isSameSqliteFile('sqlite', 'sqlite', { filepath: 'a.db' }, { filepath: 'b.db' }),
      false
    )
  })

  await t.step('false whenever either side is another backend', () => {
    // fs-to-sqlite and sqlite-to-fs are the normal cases and must stay allowed.
    const opts = { filepath: 'data/chelonia.db' }
    assertEquals(isSameSqliteFile('fs', 'sqlite', opts, opts), false)
    assertEquals(isSameSqliteFile('sqlite', 'fs', opts, opts), false)
    assertEquals(isSameSqliteFile(undefined, 'sqlite', opts, opts), false)
  })
})

// A router delegates every read and write, the `iterKeys` cursor included, to
// whichever nested backend a key's prefix selects, so a `sqlite` entry in its
// map is a file this migration opens just as much as a direct `sqlite` backend
// would be. Without these cases the guard is bypassed by wrapping either side
// in a router.
Deno.test('isSameSqliteFile through a router', async (t) => {
  const file = { filepath: 'data/chelonia.db' }
  const other = { filepath: 'data/other.db' }
  const sqliteAt = (options: { filepath?: string }) => ({ name: 'sqlite', options })
  const fsFallback = { '*': { name: 'fs', options: {} } }

  await t.step('router source colliding with a sqlite target', () => {
    assertEquals(isSameSqliteFile('router', 'sqlite', router({ '*': sqliteAt(file) }), file), true)
  })

  await t.step('sqlite source colliding with a router target', () => {
    assertEquals(isSameSqliteFile('sqlite', 'router', file, router({ '*': sqliteAt(file) })), true)
  })

  await t.step('two routers sharing one file', () => {
    assertEquals(
      isSameSqliteFile(
        'router',
        'router',
        router({ ...fsFallback, 'x/': sqliteAt(file) }),
        router({ '*': sqliteAt(file) })
      ),
      true
    )
  })

  await t.step('a collision on a prefixed entry counts as much as one on "*"', () => {
    // Only `*` is mandatory; a prefixed entry opens its file just the same.
    assertEquals(
      isSameSqliteFile(
        'router',
        'router',
        router({ ...fsFallback, 'attachment/': sqliteAt(file) }),
        router({ ...fsFallback, 'other/': sqliteAt(file) })
      ),
      true
    )
  })

  await t.step('the backend defaults apply inside router entries too', () => {
    assertEquals(
      isSameSqliteFile(
        'router',
        'sqlite',
        router({ '*': { name: 'sqlite' } }),
        { filepath: 'data/chelonia.db' }
      ),
      true
    )
  })

  await t.step('false when the router holds no sqlite entry', () => {
    assertEquals(
      isSameSqliteFile(
        'router',
        'sqlite',
        router({ ...fsFallback, 'kv/': { name: 'redis', options: {} } }),
        file
      ),
      false
    )
  })

  await t.step('false when the router\'s sqlite entry names another file', () => {
    assertEquals(
      isSameSqliteFile('router', 'sqlite', router({ '*': sqliteAt(other) }), file),
      false
    )
  })
})

Deno.test('sharedSqliteFilepath names the colliding file', async (t) => {
  await t.step('so the operator can find it in a router config', () => {
    // The boolean alone is not actionable once the collision can be buried in
    // a router's map, hence the path in the error message.
    const shared = sharedSqliteFilepath(
      'router',
      'sqlite',
      router({ '*': { name: 'sqlite', options: { filepath: 'data/chelonia.db' } } }),
      { filepath: './data/chelonia.db' }
    )
    assertEquals(shared?.endsWith('chelonia.db'), true)
    assertEquals(shared, sharedSqliteFilepath('sqlite', 'sqlite', {}, {}))
  })

  await t.step('null when nothing collides', () => {
    assertEquals(sharedSqliteFilepath('fs', 'sqlite', {}, {}), null)
  })
})

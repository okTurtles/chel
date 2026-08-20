// The same-file guard in `chel migrate`. Split out from the command itself so
// it can be checked without standing up two database backends.
import { assertEquals } from 'jsr:@std/assert'
import { isSameSqliteFile } from './migrate.ts'

Deno.test('isSameSqliteFile', async (t) => {
  await t.step('true when both sides resolve to one file', () => {
    // Migrating a SQLite database onto itself cannot work: the source is
    // walked with a cursor that holds a read transaction for the whole run, so
    // writes to the "target" block until the busy timeout expires.
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

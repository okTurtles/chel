// The filesystem half of the same-file guard in `chel migrate`, kept apart
// from migrate.test.ts for the same reason scripts/binaries-symlinks.test.ts
// is kept apart from binaries.test.ts: creating a symlink needs Deno's
// unscoped `--allow-write`, which the main test run deliberately does not
// grant. Runs under `deno task test:symlinks`, and skips itself anywhere the
// permission is missing.
//
// What it protects against cannot be seen by lexical comparison: on
// case-insensitive filesystems (the macOS and Windows defaults) two
// spellings can name one file, and a symlink can name the source database
// from somewhere else. isSameSqliteFile must recognize both as the same
// file, or the migration's writes are refused by the connection its own read
// cursor is keeping busy.
//
// The `test:symlinks` task also grants `--allow-env` scoped to a handful of
// variables for this file's sake: importing migrate.ts loads @chelonia/lib,
// which reads those variables at module scope.
import { assertEquals } from 'jsr:@std/assert'
import { isSameSqliteFile } from './migrate.ts'
import { exists, symlinkSupported, withTempDir } from '../test/test-helpers.ts'

const canSymlink = await symlinkSupported()

// Only the paths matter to the guard; the files are never opened as
// databases, so an empty stand-in is enough.
const touch = (path: string) => Deno.writeTextFile(path, '')

const opts = (filepath: string) => ({ filepath })

Deno.test({
  name: 'isSameSqliteFile against the real filesystem',
  ignore: !canSymlink,
  async fn (t: Deno.TestContext) {
    await t.step('recognizes a symlink to the source file as the same file', async () => {
      await withTempDir(async (dir) => {
        const source = `${dir}/data/chelonia.db`
        await Deno.mkdir(`${dir}/data`, { recursive: true })
        await touch(source)
        const link = `${dir}/elsewhere/link.db`
        await Deno.mkdir(`${dir}/elsewhere`, { recursive: true })
        await Deno.symlink(source, link)
        assertEquals(isSameSqliteFile('sqlite', 'sqlite', opts(source), opts(link)), true)
        assertEquals(isSameSqliteFile('sqlite', 'sqlite', opts(link), opts(source)), true)
      })
    })

    await t.step('recognizes two links to one file as the same file', async () => {
      await withTempDir(async (dir) => {
        const real = `${dir}/real/chelonia.db`
        await Deno.mkdir(`${dir}/real`, { recursive: true })
        await touch(real)
        await Deno.symlink(real, `${dir}/from.db`)
        await Deno.symlink(real, `${dir}/to.db`)
        assertEquals(
          isSameSqliteFile('sqlite', 'sqlite', opts(`${dir}/from.db`), opts(`${dir}/to.db`)),
          true
        )
      })
    })

    await t.step('still allows a genuinely different target file', async () => {
      await withTempDir(async (dir) => {
        const source = `${dir}/data/chelonia.db`
        await Deno.mkdir(`${dir}/data`, { recursive: true })
        await touch(source)
        const other = `${dir}/data/other.db`
        await touch(other)
        await Deno.symlink(other, `${dir}/link.db`)
        assertEquals(
          isSameSqliteFile('sqlite', 'sqlite', opts(source), opts(`${dir}/link.db`)),
          false
        )
        assertEquals(isSameSqliteFile('sqlite', 'sqlite', opts(source), opts(other)), false)
      })
    })

    await t.step('recognizes case-differing spellings wherever the filesystem does', async () => {
      await withTempDir(async (dir) => {
        const source = `${dir}/data/chelonia.db`
        await Deno.mkdir(`${dir}/data`, { recursive: true })
        await touch(source)
        // On a case-insensitive filesystem this spelling names the file
        // above; on a case-sensitive one it names nothing, and the guard
        // must stay out of the way. The expectation follows the filesystem
        // rather than hardcoding either, so the step holds on both.
        const otherSpelling = `${dir}/DATA/Chelonia.DB`
        const sameFile = await exists(otherSpelling)
        assertEquals(
          isSameSqliteFile('sqlite', 'sqlite', opts(source), opts(otherSpelling)),
          sameFile
        )
      })
    })
  }
})

// Exercises the `sqlite` database backend end to end against a real database
// file. Nothing else in the suite touches it (the HTTP tests all run on the
// in-memory backend), so without this the native SQLite addon and the byte
// fidelity of what it stores would go entirely unverified.
import { assert, assertEquals, assertRejects, assertStringIncludes } from 'jsr:@std/assert'
import * as path from 'jsr:@std/path'
import { Buffer } from 'node:buffer'
import SqliteBackend, { rewordedAddonLoadError } from './database-sqlite.ts'
import { SQLITE_DEFAULT_FILEPATH } from './backend-schemas.ts'

// Databases are created under `./test/temp/` (the project's scratch space,
// already covered by `deno task test`'s `--allow-write=.`) rather than the OS
// temp dir, which is outside the allowed write scope.
let tempCounter = 0
async function withBackend (
  fn: (backend: SqliteBackend, filepath: string) => Promise<void>
): Promise<void> {
  const dir = path.join(path.resolve('test/temp'), `sqlite-backend-${Date.now()}-${tempCounter++}`)
  await Deno.mkdir(dir, { recursive: true })
  const filepath = path.join(dir, 'chelonia.db')
  const backend = new SqliteBackend({ filepath })
  try {
    await backend.init()
    await fn(backend, filepath)
  } finally {
    try {
      backend.close()
    } catch { /* already closed, or never opened */ }
    await Deno.remove(dir, { recursive: true }).catch(() => {})
  }
}

Deno.test({
  name: 'sqlite database backend',
  async fn (t: Deno.TestContext) {
    await t.step('creates the database file under the configured filepath', async () => {
      await withBackend(async (_backend, filepath) => {
        assert((await Deno.stat(filepath)).isFile, `${filepath} should be a regular file`)
      })
    })

    await t.step('round-trips text, including embedded NUL bytes', async () => {
      await withBackend(async (backend) => {
        // A plain `TEXT` read would truncate at the NUL on some drivers, which
        // is why the backend reads values back as raw bytes.
        await backend.writeData('text', 'before\x00after')
        assertEquals(await backend.readData('text'), Buffer.from('before\x00after'))
      })
    })

    await t.step('round-trips binary values byte for byte', async () => {
      await withBackend(async (backend) => {
        const value = Buffer.from([0x00, 0x01, 0xfe, 0xff, 0x00])
        await backend.writeData('binary', value)
        assertEquals(await backend.readData('binary'), value)
      })
    })

    await t.step('resolves missing keys to undefined', async () => {
      await withBackend(async (backend) => {
        assertEquals(await backend.readData('absent'), undefined)
      })
    })

    await t.step('overwrites an existing key instead of failing', async () => {
      await withBackend(async (backend) => {
        await backend.writeData('key', 'first')
        await backend.writeData('key', 'second')
        assertEquals(await backend.readData('key'), Buffer.from('second'))
        assertEquals(await backend.keyCount(), 1)
      })
    })

    await t.step('enumerates keys and counts them', async () => {
      await withBackend(async (backend) => {
        await backend.writeData('a', '1')
        await backend.writeData('b', '2')
        await backend.writeData('c', '3')
        const keys: string[] = []
        for await (const key of backend.iterKeys()) keys.push(key)
        assertEquals(keys.sort(), ['a', 'b', 'c'])
        assertEquals(await backend.keyCount(), 3)
      })
    })

    await t.step('deletes keys', async () => {
      await withBackend(async (backend) => {
        await backend.writeData('gone', 'value')
        await backend.deleteData('gone')
        assertEquals(await backend.readData('gone'), undefined)
        assertEquals(await backend.keyCount(), 0)
      })
    })

    await t.step('clear() empties the database', async () => {
      await withBackend(async (backend) => {
        await backend.writeData('a', '1')
        await backend.writeData('b', '2')
        await backend.clear()
        assertEquals(await backend.keyCount(), 0)
      })
    })

    await t.step('persists data across close and reopen', async () => {
      await withBackend(async (backend, filepath) => {
        await backend.writeData('persisted', 'value')
        backend.close()

        const reopened = new SqliteBackend({ filepath })
        try {
          await reopened.init()
          assertEquals(await reopened.readData('persisted'), Buffer.from('value'))
        } finally {
          reopened.close()
        }
      })
    })

    await t.step('refuses to initialize the same instance twice', async () => {
      await withBackend(async (backend) => {
        await assertRejects(() => backend.init(), Error, 'already open')
      })
    })

    await t.step('rejects writes issued while a key cursor is open', async () => {
      // Part of this backend's contract rather than an accident:
      // better-sqlite3 keeps a read transaction open for the lifetime of the
      // cursor and refuses any write on the same connection until it is
      // drained. Pinned here so the constraint cannot change silently, in
      // either direction.
      await withBackend(async (backend) => {
        await backend.writeData('a', '1')
        await backend.writeData('b', '2')
        await assertRejects(
          async () => {
            for await (const key of backend.iterKeys()) {
              await backend.writeData(`added-while-visiting-${key}`, 'x')
            }
          },
          Error,
          'busy'
        )
      })
    })

    await t.step('close() is idempotent and leaves the instance reopenable', async () => {
      await withBackend(async (backend, filepath) => {
        await backend.writeData('key', 'value')
        backend.close()
        // A second close must not throw: migrate.ts closes on its signal path
        // as well as on the normal one.
        backend.close()
        await backend.init()
        assertEquals(await backend.readData('key'), Buffer.from('value'))
        assertEquals(filepath.endsWith('chelonia.db'), true)
      })
    })

    await t.step('reports use after close instead of throwing from the driver', async () => {
      await withBackend(async (backend) => {
        backend.close()
        await assertRejects(() => backend.readData('key'), Error, 'is not open')
        await assertRejects(() => backend.writeData('key', 'value'), Error, 'is not open')
        await assertRejects(() => backend.keyCount(), Error, 'is not open')
      })
    })

    await t.step('defaults an omitted filepath to the shared constant', () => {
      // Drift sentinel for `chel migrate`'s same-file guard, which resolves an
      // omitted filepath through SQLITE_DEFAULT_FILEPATH to compare paths the
      // way this backend would. Nothing opens a database here: only the
      // agreement between the two is under test, and losing it would silently
      // stop the guard from firing.
      const backend = new SqliteBackend({})
      assertEquals(backend.dataFolder, path.dirname(SQLITE_DEFAULT_FILEPATH))
      assertEquals(backend.filename, path.basename(SQLITE_DEFAULT_FILEPATH))
    })
  }
})

Deno.test('rewordedAddonLoadError', async (t) => {
  await t.step('rewords a missing native addon into an actionable message', () => {
    const cause = Object.assign(
      new Error('Cannot find module \'build/Release/better_sqlite3.node\''),
      { code: 'MODULE_NOT_FOUND' }
    )
    const error = rewordedAddonLoadError(cause)
    assert(error, 'a missing addon must be recognized')
    assertStringIncludes(error.message, 'musl')
    assertEquals(error.cause, cause)
  })

  await t.step('recognizes the failure by message when no code is set', () => {
    assert(rewordedAddonLoadError(new Error('No such file: /x/prebuilds/linux-x64.node')))
  })

  await t.step('does not claim unrelated missing modules', () => {
    // A MODULE_NOT_FOUND that never names the addon is some other module
    // missing; blaming the platform's libc for it would send the user chasing
    // the wrong problem.
    assertEquals(
      rewordedAddonLoadError(Object.assign(new Error('Cannot find module left-pad'), {
        code: 'MODULE_NOT_FOUND'
      })),
      null
    )
  })

  await t.step('leaves unrelated failures alone', () => {
    // Permission problems, corrupt files and SQLITE_CANTOPEN must keep their
    // own message rather than being blamed on the platform's libc.
    assertEquals(rewordedAddonLoadError(new Error('unable to open database file')), null)
    assertEquals(
      rewordedAddonLoadError(Object.assign(new Error('permission denied'), { code: 'EACCES' })),
      null
    )
  })
})

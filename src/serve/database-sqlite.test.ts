// Exercises the `sqlite` database backend end to end against a real database
// file. Nothing else in the suite touches it (the HTTP tests all run on the
// in-memory backend), so without this the native SQLite addon and the byte
// fidelity of what it stores would go entirely unverified.
import { assert, assertEquals, assertRejects, assertStringIncludes } from 'jsr:@std/assert'
import * as path from 'jsr:@std/path'
import { Buffer } from 'node:buffer'
import SqliteBackend, { rewordedAddonLoadError } from './database-sqlite.ts'
import { SQLITE_DEFAULT_FILEPATH } from './backend-schemas.ts'
import { withTempDir } from '../../test/test-helpers.ts'

// Databases are created under the shared scratch space (`./test/temp/`, already
// covered by `deno task test`'s `--allow-write=.`) rather than the OS temp dir,
// which is outside the allowed write scope.
//
// The inner try/finally closes the backend before withTempDir removes the
// directory: unlinking an open database file is not something to rely on.
async function withBackend (
  fn: (backend: SqliteBackend, filepath: string) => Promise<void>
): Promise<void> {
  await withTempDir(async (dir) => {
    const filepath = path.join(dir, 'chelonia.db')
    const backend = new SqliteBackend({ filepath })
    try {
      await backend.init()
      await fn(backend, filepath)
    } finally {
      try {
        backend.close()
      } catch { /* already closed, or never opened */ }
    }
  })
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
  // The platform is passed explicitly throughout, so that the suite checks both
  // branches wherever it runs rather than only the one the host happens to be.
  await t.step('blames glibc on Linux, where the shipped addon is glibc-linked', () => {
    const cause = Object.assign(
      new Error('Cannot find module \'build/Release/better_sqlite3.node\''),
      { code: 'MODULE_NOT_FOUND' }
    )
    const error = rewordedAddonLoadError(cause, 'linux')
    assert(error, 'a missing addon must be recognized')
    assertStringIncludes(error.message, 'musl')
    assertEquals(error.cause, cause)
  })

  await t.step('does not blame libc off Linux, where no binary is glibc-linked', () => {
    // A Windows or macOS binary whose embedded addon has gone missing is a
    // damaged install, not a libc mismatch: the advice has to be reinstalling.
    for (const os of ['windows', 'darwin'] as const) {
      const cause = new Error('Cannot find module \'prebuilds/win32-x64.node\'')
      const error = rewordedAddonLoadError(cause, os)
      assert(error, `a missing addon must still be recognized on ${os}`)
      assertEquals(error.message.includes('musl'), false, `${os} must not mention musl`)
      assertEquals(error.message.includes('glibc'), false, `${os} must not mention glibc`)
      assertStringIncludes(error.message, 'reinstall')
      assertEquals(error.cause, cause)
    }
  })

  await t.step('recognizes the failure by message when no code is set', () => {
    assert(rewordedAddonLoadError(new Error('No such file: /x/prebuilds/linux-x64.node')))
  })

  await t.step('recognizes what the dynamic loader actually reports', () => {
    // Verbatim shapes, because this branch is the easiest one to get wrong by
    // reasoning about it instead of observing it: on musl the addon is found
    // and then rejected by the loader, so the message is neither a
    // MODULE_NOT_FOUND nor necessarily one that names the addon at all.
    const loaderErrors = [
      // musl loading a glibc-linked addon (denoland/deno#33948).
      'Error loading shared library ld-linux-x86-64.so.2: No such file or directory ' +
        '(needed by /app/node_modules/better-sqlite3/prebuilds/linux-x64.node)',
      // The same failure when the loader names only the missing library.
      'libc.so.6: cannot open shared object file: No such file or directory',
      // Deno's dlopen wrapper, which prefixes the offending path.
      '/tmp/deno-compile-chel/better_sqlite3.node: invalid ELF header'
    ]
    for (const message of loaderErrors) {
      assert(rewordedAddonLoadError(new Error(message)), `unrecognized: ${message}`)
    }
  })

  await t.step('points musl users at a Deno new enough to work', () => {
    // Someone already running from source reads this too, so "run from
    // source" on its own would echo back what they are doing.
    const error = rewordedAddonLoadError(new Error('prebuilds/linux-x64.node'), 'linux')
    assert(error)
    assertStringIncludes(error.message, '2.8.0')
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
    // Unrelated on every platform, not just the host's.
    assertEquals(rewordedAddonLoadError(new Error('unable to open database file'), 'windows'), null)
  })
})

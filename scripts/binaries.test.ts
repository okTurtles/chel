import { assertEquals, assertStringIncludes } from 'jsr:@std/assert'
import {
  binaryPath,
  computeFingerprint,
  ensureArtifact,
  isFresh,
  normalizeMtimes,
  stampPath,
  writeStamp
} from './binaries.ts'
import { BIN_DIR, STAMP_DIR } from './paths.ts'
import type { Target } from './targets.ts'

// Ensure the temp dir exists on a fresh checkout; makeTempDir with dir does
// not create intermediate directories. recursive: true makes this a no-op when
// it already exists.
await Deno.mkdir('./test/temp', { recursive: true })

// test/temp is inside the project so deno task test's --allow-write=. covers it.
const withTempDir = async (fn: (dir: string) => Promise<void>): Promise<void> => {
  const dir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    await fn(dir)
  } finally {
    await Deno.remove(dir, { recursive: true })
  }
}

const TARGET: Target = {
  denoTarget: 'x86_64-unknown-linux-gnu',
  os: 'linux',
  cpu: 'x64',
  binary: 'chel'
}

// Runs `fn` with CHEL_FORCE_COMPILE set to `value`, restoring whatever the
// surrounding environment had (including it being unset) afterwards.
const withForceCompile = async (value: string, fn: () => Promise<void>): Promise<void> => {
  const previous = Deno.env.get('CHEL_FORCE_COMPILE')
  Deno.env.set('CHEL_FORCE_COMPILE', value)
  try {
    await fn()
  } finally {
    if (previous === undefined) {
      Deno.env.delete('CHEL_FORCE_COMPILE')
    } else {
      Deno.env.set('CHEL_FORCE_COMPILE', previous)
    }
  }
}

Deno.test('artifact paths', async (t) => {
  await t.step('binaries are laid out as <bin dir>/<target>/<binary>', () => {
    assertEquals(binaryPath(TARGET), `${BIN_DIR}/x86_64-unknown-linux-gnu/chel`)
  })

  await t.step('stamps live outside the binary dir so tarballs cannot pick them up', () => {
    // The release archive is created from `BIN_DIR/<target>`; a stamp stored
    // in there would be shipped to users.
    const stamp = stampPath('bin', TARGET)
    assertEquals(stamp.startsWith(`${STAMP_DIR}/`), true)
    assertEquals(stamp.startsWith(`${BIN_DIR}/`), false)
  })

  await t.step('each artifact kind gets its own stamp per target', () => {
    assertEquals(stampPath('bin', TARGET) === stampPath('tar', TARGET), false)
  })
})

Deno.test('computeFingerprint', async (t) => {
  await t.step('is stable across runs for identical contents', async () => {
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      await Deno.mkdir(`${dir}/serve`)
      await Deno.writeTextFile(`${dir}/serve/worker.js`, 'worker')
      assertEquals(await computeFingerprint(dir), await computeFingerprint(dir))
    })
  })

  await t.step('ignores mtimes', async () => {
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      const before = await computeFingerprint(dir)
      await normalizeMtimes(dir, 0)
      assertEquals(await computeFingerprint(dir), before)
    })
  })

  await t.step('changes when a bundled file changes', async () => {
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      const before = await computeFingerprint(dir)
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(2)')
      assertEquals(await computeFingerprint(dir) === before, false)
    })
  })

  await t.step('changes when a nested file is added', async () => {
    await withTempDir(async (dir) => {
      await Deno.mkdir(`${dir}/dist-dashboard`)
      await Deno.writeTextFile(`${dir}/dist-dashboard/index.html`, '<html></html>')
      const before = await computeFingerprint(dir)
      await Deno.writeTextFile(`${dir}/dist-dashboard/app.js`, 'app')
      assertEquals(await computeFingerprint(dir) === before, false)
    })
  })

  await t.step('distinguishes identical contents at different paths', async () => {
    // Renaming a file changes what the binary embeds, so it must invalidate.
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/a.js`, 'same')
      const before = await computeFingerprint(dir)
      await Deno.rename(`${dir}/a.js`, `${dir}/b.js`)
      assertEquals(await computeFingerprint(dir) === before, false)
    })
  })
})

Deno.test('isFresh', async (t) => {
  await t.step('true only when both the stamp and the artifact match', async () => {
    await withTempDir(async (dir) => {
      const artifact = `${dir}/chel`
      const stamp = `${dir}/stamp.json`
      await Deno.writeTextFile(artifact, 'binary')
      await writeStamp(stamp, 'abc')
      assertEquals(await isFresh(stamp, 'abc', artifact), true)
    })
  })

  await t.step('false when the inputs changed', async () => {
    await withTempDir(async (dir) => {
      const artifact = `${dir}/chel`
      const stamp = `${dir}/stamp.json`
      await Deno.writeTextFile(artifact, 'binary')
      await writeStamp(stamp, 'abc')
      assertEquals(await isFresh(stamp, 'def', artifact), false)
    })
  })

  await t.step('false when the artifact was deleted', async () => {
    // A stamp on its own must never vouch for a missing artifact.
    await withTempDir(async (dir) => {
      const stamp = `${dir}/stamp.json`
      await writeStamp(stamp, 'abc')
      assertEquals(await isFresh(stamp, 'abc', `${dir}/chel`), false)
    })
  })

  await t.step('false when there is no stamp', async () => {
    await withTempDir(async (dir) => {
      const artifact = `${dir}/chel`
      await Deno.writeTextFile(artifact, 'binary')
      assertEquals(await isFresh(`${dir}/stamp.json`, 'abc', artifact), false)
    })
  })

  await t.step('false when the stamp is corrupt', async () => {
    await withTempDir(async (dir) => {
      const artifact = `${dir}/chel`
      const stamp = `${dir}/stamp.json`
      await Deno.writeTextFile(artifact, 'binary')
      await Deno.writeTextFile(stamp, 'not json')
      assertEquals(await isFresh(stamp, 'abc', artifact), false)
    })
  })

  await t.step('writeStamp creates missing parent directories', async () => {
    await withTempDir(async (dir) => {
      const stamp = `${dir}/nested/deeper/stamp.json`
      await writeStamp(stamp, 'abc')
      assertStringIncludes(await Deno.readTextFile(stamp), 'abc')
    })
  })

  // CHEL_FORCE_COMPILE is the only environment input the build scripts read,
  // and it is why they need `--allow-env`.
  await t.step('CHEL_FORCE_COMPILE overrides an otherwise fresh cache', async () => {
    await withTempDir(async (dir) => {
      const artifact = `${dir}/chel`
      const stamp = `${dir}/stamp.json`
      await Deno.writeTextFile(artifact, 'binary')
      await writeStamp(stamp, 'abc')
      await withForceCompile('1', async () => {
        assertEquals(await isFresh(stamp, 'abc', artifact), false)
      })
    })
  })

  await t.step('falsy CHEL_FORCE_COMPILE values leave the cache in use', async () => {
    await withTempDir(async (dir) => {
      const artifact = `${dir}/chel`
      const stamp = `${dir}/stamp.json`
      await Deno.writeTextFile(artifact, 'binary')
      await writeStamp(stamp, 'abc')
      for (const value of ['', '0', 'false', 'False', 'FALSE']) {
        await withForceCompile(value, async () => {
          assertEquals(await isFresh(stamp, 'abc', artifact), true)
        })
      }
    })
  })
})

Deno.test('ensureArtifact', async (t) => {
  // ensureArtifact derives its stamp path from the target, so use a fake
  // target whose name cannot collide with a real one, and clean up after.
  const fakeTarget = (name: string): Target => ({
    denoTarget: `test-${name}`,
    os: 'linux',
    cpu: 'x64',
    binary: 'chel'
  })

  const cleanup = async (target: Target): Promise<void> => {
    for (const kind of ['bin', 'tar'] as const) {
      await Deno.remove(stampPath(kind, target)).catch(() => {})
    }
  }

  await t.step('skips work when a previous run used the same inputs', async () => {
    const target = fakeTarget('reuse')
    await withTempDir(async (dir) => {
      const artifact = `${dir}/artifact`
      let runs = 0
      const build = async () => {
        runs++
        await Deno.writeTextFile(artifact, 'built')
      }
      assertEquals(await ensureArtifact('tar', target, artifact, 'fp1', build), true)
      assertEquals(await ensureArtifact('tar', target, artifact, 'fp1', build), false)
      assertEquals(runs, 1)
    })
    await cleanup(target)
  })

  await t.step('redoes the work when the inputs changed', async () => {
    const target = fakeTarget('stale')
    await withTempDir(async (dir) => {
      const artifact = `${dir}/artifact`
      let runs = 0
      const build = async () => {
        runs++
        await Deno.writeTextFile(artifact, `built ${runs}`)
      }
      await ensureArtifact('tar', target, artifact, 'fp1', build)
      assertEquals(await ensureArtifact('tar', target, artifact, 'fp2', build), true)
      assertEquals(runs, 2)
      assertEquals(await Deno.readTextFile(artifact), 'built 2')
    })
    await cleanup(target)
  })

  await t.step('a failed run leaves the artifact marked stale', async () => {
    // Otherwise a half-written binary from an interrupted release would be
    // reused, and shipped.
    const target = fakeTarget('failure')
    await withTempDir(async (dir) => {
      const artifact = `${dir}/artifact`
      await Deno.writeTextFile(artifact, 'stale leftovers')
      await writeStamp(stampPath('tar', target), 'fp1')

      let failed = false
      try {
        await ensureArtifact('tar', target, artifact, 'fp2', () => {
          throw new Error('compile blew up')
        })
      } catch {
        failed = true
      }
      assertEquals(failed, true)
      assertEquals(await isFresh(stampPath('tar', target), 'fp1', artifact), false)
      assertEquals(await isFresh(stampPath('tar', target), 'fp2', artifact), false)
    })
    await cleanup(target)
  })
})

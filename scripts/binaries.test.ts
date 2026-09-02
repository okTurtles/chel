import { assertEquals, assertRejects, assertStringIncludes } from 'jsr:@std/assert'
import {
  assertNativeAddonsPresent,
  binaryPath,
  computeFingerprint,
  ensureArtifact,
  isFresh,
  normalizeMtimes,
  stampPath,
  targetFingerprint,
  writeStamp
} from './binaries.ts'
import { BIN_DIR, STAMP_DIR } from './paths.ts'
import { TARGETS, nativeAddonPaths, type Target } from './targets.ts'
import { FAKE_COMPILE_FLAGS as FLAGS, withTempDir } from '../test/test-helpers.ts'

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

// The addon paths default to the real `node_modules` entries, which would make
// these steps depend on what happens to be installed. Every call below passes
// an explicit list so the fingerprint stays a function of the temp dirs alone.
Deno.test('computeFingerprint', async (t) => {
  await t.step('is stable across runs for identical contents', async () => {
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      await Deno.mkdir(`${dir}/serve`)
      await Deno.writeTextFile(`${dir}/serve/worker.js`, 'worker')
      assertEquals(
        await computeFingerprint(dir, [], FLAGS),
        await computeFingerprint(dir, [], FLAGS)
      )
    })
  })

  await t.step('ignores mtimes', async () => {
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      const before = await computeFingerprint(dir, [], FLAGS)
      await normalizeMtimes(dir, 0)
      assertEquals(await computeFingerprint(dir, [], FLAGS), before)
    })
  })

  await t.step('changes when a bundled file changes', async () => {
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      const before = await computeFingerprint(dir, [], FLAGS)
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(2)')
      assertEquals(await computeFingerprint(dir, [], FLAGS) === before, false)
    })
  })

  await t.step('changes when a nested file is added', async () => {
    await withTempDir(async (dir) => {
      await Deno.mkdir(`${dir}/dist-dashboard`)
      await Deno.writeTextFile(`${dir}/dist-dashboard/index.html`, '<html></html>')
      const before = await computeFingerprint(dir, [], FLAGS)
      await Deno.writeTextFile(`${dir}/dist-dashboard/app.js`, 'app')
      assertEquals(await computeFingerprint(dir, [], FLAGS) === before, false)
    })
  })

  await t.step('distinguishes identical contents at different paths', async () => {
    // Renaming a file changes what the binary embeds, so it must invalidate.
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/a.js`, 'same')
      const before = await computeFingerprint(dir, [], FLAGS)
      await Deno.rename(`${dir}/a.js`, `${dir}/b.js`)
      assertEquals(await computeFingerprint(dir, [], FLAGS) === before, false)
    })
  })

  // The native addon is embedded straight out of node_modules through a
  // version-less symlink, so neither the bundle nor the compile flags change
  // when the package is upgraded: hashing its files is the only thing that
  // stops a release from shipping the previous version's `.node` binaries.
  await t.step('changes when an embedded addon file changes', async () => {
    await withTempDir(async (dir) => {
      await withTempDir(async (addon) => {
        await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
        await Deno.mkdir(`${addon}/prebuilds`)
        await Deno.writeTextFile(`${addon}/prebuilds/linux-x64.node`, 'v1')
        const before = await computeFingerprint(dir, [addon], FLAGS)
        await Deno.writeTextFile(`${addon}/prebuilds/linux-x64.node`, 'v2')
        assertEquals(await computeFingerprint(dir, [addon], FLAGS) === before, false)
      })
    })
  })

  await t.step('accepts a single file as an addon path', async () => {
    await withTempDir(async (dir) => {
      await withTempDir(async (addon) => {
        const file = `${addon}/package.json`
        await Deno.writeTextFile(file, '{"version":"1.0.0"}')
        const before = await computeFingerprint(dir, [file], FLAGS)
        await Deno.writeTextFile(file, '{"version":"1.0.1"}')
        assertEquals(await computeFingerprint(dir, [file], FLAGS) === before, false)
      })
    })
  })

  await t.step('is independent of the order the addon paths are given in', async () => {
    // The digests of both the bundle and the addons are sorted before they are
    // hashed, because they are collected in `readDir` order and that order is
    // filesystem-dependent. Only the addon side is reachable from out here (a
    // directory has one read order per run), so this is what pins the
    // invariant: an unsorted key would recompile every target on any machine
    // whose order differs from the one the stamp was written on.
    await withTempDir(async (dir) => {
      await withTempDir(async (addons) => {
        await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
        const first = `${addons}/first.node`
        const second = `${addons}/second.node`
        await Deno.writeTextFile(first, 'one')
        await Deno.writeTextFile(second, 'two')
        assertEquals(
          await computeFingerprint(dir, [first, second], FLAGS),
          await computeFingerprint(dir, [second, first], FLAGS)
        )
      })
    })
  })

  await t.step('ignores addon paths that do not exist', async () => {
    // Fingerprinting stays usable over arbitrary trees; a genuinely missing
    // addon is caught by assertNativeAddonsPresent, not here.
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      assertEquals(
        await computeFingerprint(dir, [`${dir}/never-installed`], FLAGS),
        await computeFingerprint(dir, [], FLAGS)
      )
    })
  })

  // Symlink handling is covered in binaries-symlinks.test.ts: creating a
  // symlink needs unscoped --allow-write, which this suite deliberately does
  // not have.

  await t.step('tolerates a directory that is not there', async () => {
    // The walk has to survive an entry disappearing under it: the release
    // fingerprints node_modules, where a concurrent install can move files
    // mid-walk, and aborting the release over that is worse than hashing the
    // tree as it was found. Missing directories are the deterministic form of
    // the same condition, and normalizeMtimes has always treated them this way.
    await withTempDir(async (dir) => {
      assertEquals(typeof await computeFingerprint(`${dir}/absent`, [], FLAGS), 'string')
      assertEquals(
        await computeFingerprint(`${dir}/absent`, [`${dir}/absent-too`], FLAGS),
        await computeFingerprint(`${dir}/absent`, [], FLAGS)
      )
    })
  })

  await t.step('separates addon contents from bundle contents', async () => {
    // Identical bytes reached through an addon path and through the bundle are
    // embedded at different places, so they must not fingerprint alike.
    await withTempDir(async (bundleOnly) => {
      await withTempDir(async (addonOnly) => {
        await Deno.writeTextFile(`${bundleOnly}/x.js`, 'same')
        await Deno.writeTextFile(`${addonOnly}/x.js`, 'same')
        const asBundle = await computeFingerprint(bundleOnly, [], FLAGS)
        await withTempDir(async (empty) => {
          const asAddon = await computeFingerprint(empty, [addonOnly], FLAGS)
          assertEquals(asBundle === asAddon, false)
        })
      })
    })
  })

  await t.step('distinguishes the addon root a file lives under', async () => {
    // Digests are prefixed with their root, so moving a file between two addon
    // roots invalidates even though the set of bytes is unchanged.
    await withTempDir(async (dir) => {
      await withTempDir(async (first) => {
        await withTempDir(async (second) => {
          await Deno.writeTextFile(`${first}/binding.js`, 'shared')
          const before = await computeFingerprint(dir, [first, second], FLAGS)
          await Deno.rename(`${first}/binding.js`, `${second}/binding.js`)
          assertEquals(await computeFingerprint(dir, [first, second], FLAGS) === before, false)
        })
      })
    })
  })

  await t.step('changes when the compile flags change', async () => {
    // Each target now compiles with its own flag set, so the flags are what
    // keeps two targets built from the same bundle from sharing a cache entry.
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
      assertEquals(
        await computeFingerprint(dir, [], '--include ./a.node') ===
          await computeFingerprint(dir, [], '--include ./b.node'),
        false
      )
    })
  })

  await t.step('isolates one target\'s addon from another target\'s key', async () => {
    // The cross-target isolation property that makes per-target embedding
    // worthwhile: mutating a prebuilt addon no target of ours embeds must not
    // invalidate anything, while mutating its own must.
    await withTempDir(async (dir) => {
      await withTempDir(async (prebuilds) => {
        await Deno.writeTextFile(`${dir}/main.js`, 'console.log(1)')
        const mine = `${prebuilds}/linux-x64.node`
        const theirs = `${prebuilds}/win32-x64.node`
        await Deno.writeTextFile(mine, 'v1')
        await Deno.writeTextFile(theirs, 'v1')
        const before = await computeFingerprint(dir, [mine], FLAGS)
        await Deno.writeTextFile(theirs, 'v2')
        assertEquals(await computeFingerprint(dir, [mine], FLAGS), before)
        await Deno.writeTextFile(mine, 'v2')
        assertEquals(await computeFingerprint(dir, [mine], FLAGS) === before, false)
      })
    })
  })
})

Deno.test('targetFingerprint', async (t) => {
  await t.step('is stable across calls', async () => {
    // Memoization must not be observable: a second call has to answer exactly
    // what the first one did.
    for (const target of TARGETS) {
      assertEquals(await targetFingerprint(target), await targetFingerprint(target))
    }
  })

  await t.step('differs between every pair of targets', async () => {
    // Binaries are no longer interchangeable (each embeds only its own
    // platform's addon), so neither are their cache keys. A single shared key
    // would let one target's binary be reused for another.
    const fingerprints = await Promise.all(TARGETS.map(targetFingerprint))
    assertEquals(new Set(fingerprints).size, TARGETS.length)
  })

  await t.step('hashes only the addon files its own target embeds', async () => {
    // The inputs behind the isolation property above: no target's path list
    // may contain another target's prebuilt addon.
    for (const target of TARGETS) {
      const paths = nativeAddonPaths(target)
      for (const other of TARGETS) {
        if (other.denoTarget === target.denoTarget) continue
        for (const path of nativeAddonPaths(other)) {
          if (!path.includes('/prebuilds/')) continue
          assertEquals(
            paths.includes(path),
            false,
            `${target.denoTarget} must not fingerprint ${path}`
          )
        }
      }
    }
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

  // The stamps live in the real STAMP_DIR, so remove them even when an
  // assertion throws; otherwise a failing run would leak the fake stamps
  // into the cache directory.
  const withCleanup = async (target: Target, fn: () => Promise<void>): Promise<void> => {
    try {
      await fn()
    } finally {
      await cleanup(target)
    }
  }

  await t.step('skips work when a previous run used the same inputs', async () => {
    const target = fakeTarget('reuse')
    await withCleanup(target, () => withTempDir(async (dir) => {
      const artifact = `${dir}/artifact`
      let runs = 0
      const build = async () => {
        runs++
        await Deno.writeTextFile(artifact, 'built')
      }
      assertEquals(await ensureArtifact('tar', target, artifact, 'fp1', build), true)
      assertEquals(await ensureArtifact('tar', target, artifact, 'fp1', build), false)
      assertEquals(runs, 1)
    }))
  })

  await t.step('redoes the work when the inputs changed', async () => {
    const target = fakeTarget('stale')
    await withCleanup(target, () => withTempDir(async (dir) => {
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
    }))
  })

  await t.step('a failed run leaves the artifact marked stale', async () => {
    // Otherwise a half-written binary from an interrupted release would be
    // reused, and shipped.
    const target = fakeTarget('failure')
    await withCleanup(target, () => withTempDir(async (dir) => {
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
    }))
  })
})

Deno.test('assertNativeAddonsPresent', async (t) => {
  await t.step('accepts a fully installed set of paths', async () => {
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/package.json`, '{}')
      await Deno.mkdir(`${dir}/lib`)
      await assertNativeAddonsPresent([`${dir}/package.json`, `${dir}/lib`])
    })
  })

  await t.step('names the missing path and how to get it', async () => {
    // `deno compile` does refuse to include a path that is not there, but its
    // message ("No such file or directory") gives no hint that the native
    // package simply was never installed.
    await withTempDir(async (dir) => {
      await Deno.writeTextFile(`${dir}/package.json`, '{}')
      const error = await assertRejects(
        () => assertNativeAddonsPresent([`${dir}/package.json`, `${dir}/prebuilds/x.node`]),
        Error
      )
      assertStringIncludes(error.message, `${dir}/prebuilds/x.node`)
      assertStringIncludes(error.message, 'deno task build')
    })
  })
})

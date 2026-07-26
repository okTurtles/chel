import { assertEquals, assertRejects } from 'jsr:@std/assert'
import { TARGETS, subPackageName, type Target } from './targets.ts'
import { expectedOptionalDeps, reconcileOptionalDeps } from './sync-versions.ts'

const VERSION = '3.3.2'

// Ensure the temp dir exists on a fresh checkout; makeTempFile with dir does
// not create intermediate directories. recursive: true makes this a no-op when
// it already exists.
await Deno.mkdir('./test/temp', { recursive: true })

const TMP_TARGETS: readonly Target[] = [
  { denoTarget: 'x86_64-unknown-linux-gnu', os: 'linux', cpu: 'x64', binary: 'chel' },
  { denoTarget: 'aarch64-apple-darwin', os: 'darwin', cpu: 'arm64', binary: 'chel' }
]

async function writeTmpPkg (pkg: Record<string, unknown>): Promise<string> {
  // test/temp is inside the project so deno task test's --allow-write=. covers it.
  const path = await Deno.makeTempFile({ dir: './test/temp', suffix: '.json' })
  await Deno.writeTextFile(path, JSON.stringify(pkg))
  return path
}

Deno.test('expectedOptionalDeps', async (t) => {
  await t.step('maps every target to subPackageName -> version', () => {
    const deps = expectedOptionalDeps(VERSION, TMP_TARGETS)
    assertEquals(deps, {
      '@chelonia/cli-x64-linux': VERSION,
      '@chelonia/cli-arm64-darwin': VERSION
    })
  })

  await t.step('empty targets -> empty record', () => {
    assertEquals(expectedOptionalDeps(VERSION, []), {})
  })

  await t.step('matches TARGETS exported from targets.ts', () => {
    const deps = expectedOptionalDeps(VERSION, TARGETS)
    for (const target of TARGETS) {
      assertEquals(deps[subPackageName(target)], VERSION)
    }
    assertEquals(Object.keys(deps).length, TARGETS.length)
  })
})

Deno.test('reconcileOptionalDeps', async (t) => {
  await t.step('adds missing cli deps and returns true', async () => {
    const path = await writeTmpPkg({ version: VERSION })
    try {
      const changed = await reconcileOptionalDeps(path, VERSION, TMP_TARGETS)
      assertEquals(changed, true)
      const result = JSON.parse(await Deno.readTextFile(path))
      assertEquals(result.optionalDependencies, {
        '@chelonia/cli-arm64-darwin': VERSION,
        '@chelonia/cli-x64-linux': VERSION
      })
      // Non-deps fields are preserved.
      assertEquals(result.version, VERSION)
    } finally {
      await Deno.remove(path)
    }
  })

  await t.step('preserves unrelated optionalDependencies', async () => {
    const path = await writeTmpPkg({
      version: VERSION,
      optionalDependencies: { 'some-other-pkg': '^1.0.0' }
    })
    try {
      const changed = await reconcileOptionalDeps(path, VERSION, TMP_TARGETS)
      assertEquals(changed, true)
      const result = JSON.parse(await Deno.readTextFile(path))
      assertEquals(result.optionalDependencies['some-other-pkg'], '^1.0.0')
      assertEquals(result.optionalDependencies['@chelonia/cli-x64-linux'], VERSION)
    } finally {
      await Deno.remove(path)
    }
  })

  await t.step('removes stale cli deps no longer in targets', async () => {
    const path = await writeTmpPkg({
      version: VERSION,
      optionalDependencies: {
        '@chelonia/cli-x64-win32': VERSION,
        '@chelonia/cli-arm64-linux': '3.3.1'
      }
    })
    try {
      const changed = await reconcileOptionalDeps(path, VERSION, TMP_TARGETS)
      assertEquals(changed, true)
      const result = JSON.parse(await Deno.readTextFile(path))
      const keys = Object.keys(result.optionalDependencies)
      assertEquals(keys.includes('@chelonia/cli-x64-win32'), false)
      assertEquals(keys.includes('@chelonia/cli-arm64-linux'), false)
      assertEquals(keys.includes('@chelonia/cli-x64-linux'), true)
    } finally {
      await Deno.remove(path)
    }
  })

  await t.step('updates stale versions in place', async () => {
    const path = await writeTmpPkg({
      version: VERSION,
      optionalDependencies: { '@chelonia/cli-x64-linux': '3.3.0' }
    })
    try {
      const changed = await reconcileOptionalDeps(path, VERSION, TMP_TARGETS)
      assertEquals(changed, true)
      const result = JSON.parse(await Deno.readTextFile(path))
      assertEquals(result.optionalDependencies['@chelonia/cli-x64-linux'], VERSION)
    } finally {
      await Deno.remove(path)
    }
  })

  await t.step('returns false when already in sync (no write needed)', async () => {
    const path = await writeTmpPkg({
      version: VERSION,
      optionalDependencies: {
        '@chelonia/cli-arm64-darwin': VERSION,
        '@chelonia/cli-x64-linux': VERSION
      }
    })
    const mtimeBefore = (await Deno.stat(path)).mtime
    try {
      // Sleep briefly so a write would produce a different mtime.
      await new Promise((r) => setTimeout(r, 50))
      const changed = await reconcileOptionalDeps(path, VERSION, TMP_TARGETS)
      assertEquals(changed, false)
      const mtimeAfter = (await Deno.stat(path)).mtime
      assertEquals(mtimeAfter, mtimeBefore)
    } finally {
      await Deno.remove(path)
    }
  })

  await t.step('treats a key-ordering difference as a change (deterministic sort)', async () => {
    // Reverse order — reconcileOptionalDeps sorts keys alphabetically.
    const reverseJson =
      '{"version":"' + VERSION + '",' +
      '"optionalDependencies":{' +
      '"@chelonia/cli-x64-linux":"' + VERSION + '",' +
      '"@chelonia/cli-arm64-darwin":"' + VERSION + '"}}'
    const path = await Deno.makeTempFile({ dir: './test/temp', suffix: '.json' })
    await Deno.writeTextFile(path, reverseJson)
    try {
      const changed = await reconcileOptionalDeps(path, VERSION, TMP_TARGETS)
      assertEquals(changed, true)
      const raw = await Deno.readTextFile(path)
      const armIdx = raw.indexOf('@chelonia/cli-arm64-darwin')
      const x64Idx = raw.indexOf('@chelonia/cli-x64-linux')
      assertEquals(armIdx < x64Idx && armIdx !== -1, true)
    } finally {
      await Deno.remove(path)
    }
  })

  await t.step('throws on unreadable path', async () => {
    await assertRejects(
      () => reconcileOptionalDeps('/nonexistent/path/package.json', VERSION, TMP_TARGETS)
    )
  })
})

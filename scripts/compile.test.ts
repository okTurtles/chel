import { assertEquals, assertRejects, assertStringIncludes } from 'jsr:@std/assert'
import { stampPath, targetFingerprint, writeStamp } from './binaries.ts'
import { assertTarballsMatchBuild, tarFingerprint, tarballPath } from './compile.ts'
import { DIST_DIR } from './paths.ts'
import type { Target } from './targets.ts'
import { withForceCompile } from '../test/test-helpers.ts'

const LINUX: Target = {
  denoTarget: 'x86_64-unknown-linux-gnu',
  os: 'linux',
  cpu: 'x64',
  binary: 'chel'
}

const WINDOWS: Target = {
  denoTarget: 'x86_64-pc-windows-msvc',
  os: 'win32',
  cpu: 'x64',
  binary: 'chel.exe'
}

Deno.test('tarFingerprint', async (t) => {
  await t.step('is stable for the same inputs', () => {
    assertEquals(tarFingerprint('abc', LINUX), tarFingerprint('abc', LINUX))
  })

  await t.step('changes when the binary fingerprint changes', () => {
    assertEquals(tarFingerprint('abc', LINUX) === tarFingerprint('def', LINUX), false)
  })

  await t.step('keeps the binary fingerprint recoverable for debugging', () => {
    assertStringIncludes(tarFingerprint('abc', LINUX), 'abc')
  })

  await t.step('differs from the binary cache key for the same target', () => {
    // Binaries and tarballs share a stamp directory but not their inputs: a
    // tarball also depends on how it was packed, so reusing the binary
    // fingerprint verbatim would make a change to the tar flags invisible.
    assertEquals(tarFingerprint('abc', LINUX) === 'abc', false)
  })

  await t.step('differs for targets whose binaries are named differently', () => {
    // The archive path only carries the target triple, so a renamed binary
    // would otherwise let a stale archive (holding the old filename) be
    // reused as if it were current.
    assertEquals(tarFingerprint('abc', LINUX) === tarFingerprint('abc', WINDOWS), false)
  })
})

Deno.test('assertTarballsMatchBuild', async (t) => {
  // The tarball and its stamp live in the real DIST_DIR and STAMP_DIR, so use a
  // fake target whose name cannot collide with a real one, and clean up after.
  const target: Target = { ...LINUX, denoTarget: 'test-tarball-check' }
  const archive = tarballPath(target)
  const stamp = stampPath('tar', target)

  const withCleanup = async (fn: () => Promise<void>): Promise<void> => {
    try {
      await fn()
    } finally {
      for (const path of [archive, stamp]) {
        await Deno.remove(path).catch(() => {})
      }
    }
  }
  const pack = async (): Promise<void> => {
    await Deno.mkdir(DIST_DIR, { recursive: true })
    await Deno.writeTextFile(archive, 'tarball')
  }

  await t.step('passes when no tarball of this version exists', () => withCleanup(async () => {
    // Publishing without `deno task dist`; a stamp left by an older run is not a tarball.
    await writeStamp(stamp, 'another build')
    await assertTarballsMatchBuild([target])
  }))

  await t.step('passes for a tarball packed from this build', () => withCleanup(async () => {
    await pack()
    await writeStamp(stamp, tarFingerprint(await targetFingerprint(target), target))
    await assertTarballsMatchBuild([target])
    // Forcing a recompile must not make the tarball look like another build.
    await withForceCompile('1', () => assertTarballsMatchBuild([target]))
  }))

  await t.step('fails for a tarball packed from another build', () => withCleanup(async () => {
    await pack()
    await writeStamp(stamp, 'another build')
    await assertRejects(() => assertTarballsMatchBuild([target]), Error, archive)
  }))

  await t.step('fails when the tarball has no stamp', () => withCleanup(async () => {
    await pack()
    await assertRejects(() => assertTarballsMatchBuild([target]), Error, archive)
  }))
})

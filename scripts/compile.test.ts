import { assertEquals, assertStringIncludes } from 'jsr:@std/assert'
import { tarFingerprint } from './compile.ts'
import type { Target } from './targets.ts'

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

import { assertEquals } from 'jsr:@std/assert'
import {
  TARGETS,
  subPackageName,
  subPackageDir,
  isCliSubPackage,
  type Target
} from './targets.ts'

Deno.test('subPackageName', async (t) => {
  await t.step('formats as <prefix><cpu>-<os>', () => {
    const target: Target = {
      denoTarget: 'x86_64-unknown-linux-gnu',
      os: 'linux',
      cpu: 'x64',
      binary: 'chel'
    }
    assertEquals(subPackageName(target), '@chelonia/cli-x64-linux')
  })

  await t.step('matches the bin/chel.js runtime convention for every TARGETS entry', () => {
    // bin/chel.js constructs the sub-package name at runtime as
    // `@chelonia/cli-${process.arch}-${process.platform}`. This test is a
    // drift sentinel: if the ordering or prefix in subPackageName changes,
    // the launcher shim would silently break. cpu <-> process.arch,
    // os <-> process.platform.
    for (const target of TARGETS) {
      const runtime = `@chelonia/cli-${target.cpu}-${target.os}`
      assertEquals(subPackageName(target), runtime)
    }
  })

  await t.step('arm64 darwin target', () => {
    const target: Target = {
      denoTarget: 'aarch64-apple-darwin',
      os: 'darwin',
      cpu: 'arm64',
      binary: 'chel'
    }
    assertEquals(subPackageName(target), '@chelonia/cli-arm64-darwin')
  })
})

Deno.test('bin/chel.js naming convention matches subPackageName', () => {
  // bin/chel.js is CommonJS executed at install time and cannot import this
  // module, so the sub-package naming convention is duplicated there. This
  // test pins the duplication: any drift in the shim's template literal fails
  // here rather than silently breaking installs.
  const src = Deno.readTextFileSync(new URL('../bin/chel.js', import.meta.url))

  const m = src.match(/const\s+subPkgName\s*=\s*`([^`]+)`/)
  assertEquals(m !== null, true, 'bin/chel.js must define subPkgName via a template literal')
  assertEquals(
    m![1],
    '@chelonia/cli-${process.arch}-${process.platform}',
    'bin/chel.js template literal drifted from the expected convention'
  )

  for (const target of TARGETS) {
    const runtime = `@chelonia/cli-${target.cpu}-${target.os}`
    assertEquals(subPackageName(target), runtime)
  }
})

Deno.test('subPackageDir', async (t) => {
  await t.step('formats as dist/cli-<cpu>-<os>', () => {
    const target: Target = {
      denoTarget: 'x86_64-pc-windows-msvc',
      os: 'win32',
      cpu: 'x64',
      binary: 'chel.exe'
    }
    assertEquals(subPackageDir(target), 'dist/cli-x64-win32')
  })
})

Deno.test('isCliSubPackage', async (t) => {
  await t.step('true for any @chelonia/cli-* name', () => {
    assertEquals(isCliSubPackage('@chelonia/cli-x64-linux'), true)
    assertEquals(isCliSubPackage('@chelonia/cli-arm64-darwin'), true)
    assertEquals(isCliSubPackage('@chelonia/cli-x64-win32'), true)
  })

  await t.step('false for unrelated scopes', () => {
    assertEquals(isCliSubPackage('@chelonia/lib'), false)
    assertEquals(isCliSubPackage('@chelonia/serdes'), false)
  })

  await t.step('false for look-alikes under other scopes', () => {
    assertEquals(isCliSubPackage('@evil/cli-x64-linux'), false)
    assertEquals(isCliSubPackage('cli-x64-linux'), false)
  })

  await t.step('false for empty string', () => {
    assertEquals(isCliSubPackage(''), false)
  })
})

Deno.test('TARGETS', async (t) => {
  await t.step('every target produces a unique sub-package name', () => {
    const names = TARGETS.map(subPackageName)
    assertEquals(new Set(names).size, names.length)
  })

  await t.step('binary ends with .exe only for win32', () => {
    for (const target of TARGETS) {
      assertEquals(target.binary.endsWith('.exe'), target.os === 'win32')
    }
  })
})

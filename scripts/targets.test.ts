import { assertEquals } from 'jsr:@std/assert'
import {
  TARGETS,
  BINARY_FIELD,
  COMPILE_FLAGS,
  NATIVE_ADDON_PATHS,
  subPackageName,
  subPackageDir,
  subPackageManifest,
  isCliSubPackage,
  type Target
} from './targets.ts'
import { BUNDLE_PATH, NATIVE_ADDON_PACKAGES } from './paths.ts'

const ROOT_PKG = {
  version: '9.9.9',
  description: 'Chelonia Command-line Interface',
  repository: { type: 'git', url: 'git+https://example.com/chel.git' },
  author: 'Someone <someone@example.com>',
  license: 'AGPL-3.0'
}

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

Deno.test('bin/chel.js reads the binary field the sub-packages publish', () => {
  // The shim cannot import this module (it is CommonJS run by npm at install
  // time), so the field name is duplicated there. Pin the duplication: a
  // mismatch would make every install look for the wrong path.
  const src = Deno.readTextFileSync(new URL('../bin/chel.js', import.meta.url))
  assertEquals(
    src.includes(`subPkg.${BINARY_FIELD}`),
    true,
    `bin/chel.js must read subPkg.${BINARY_FIELD}`
  )

  // The filenames the shim falls back to must match what the compiler actually
  // produces for each platform.
  for (const target of TARGETS) {
    assertEquals(
      src.includes(`'${target.binary}'`),
      true,
      `bin/chel.js fallback is missing the '${target.binary}' filename`
    )
  }
})

Deno.test('subPackageManifest', async (t) => {
  await t.step('never declares a bin field', () => {
    // A `bin` entry named `chel` in a sub-package competes with the root
    // package for the same `node_modules/.bin/chel` link and clobbers the
    // launcher, which is what broke installs under npm 10.
    for (const target of TARGETS) {
      const manifest = subPackageManifest(target, ROOT_PKG)
      assertEquals('bin' in manifest, false, `${subPackageName(target)} must not declare bin`)
      // npm expands `directories.bin` into bin entries, so it is banned too.
      assertEquals('directories' in manifest, false)
    }
  })

  await t.step('advertises the binary under the custom field', () => {
    for (const target of TARGETS) {
      const manifest = subPackageManifest(target, ROOT_PKG)
      assertEquals(manifest[BINARY_FIELD], target.binary)
    }
  })

  await t.step('ships the binary and the license', () => {
    for (const target of TARGETS) {
      const manifest = subPackageManifest(target, ROOT_PKG)
      assertEquals(manifest.files, [target.binary, 'LICENSE'])
    }
  })

  await t.step('asks Yarn PnP to keep the package unzipped', () => {
    // The launcher spawns a real file; a zipped package would have none.
    for (const target of TARGETS) {
      assertEquals(subPackageManifest(target, ROOT_PKG).preferUnplugged, true)
    }
  })

  await t.step('inherits root metadata and restricts the platform', () => {
    const target = TARGETS[0]
    const manifest = subPackageManifest(target, ROOT_PKG)
    assertEquals(manifest.name, subPackageName(target))
    assertEquals(manifest.version, ROOT_PKG.version)
    assertEquals(manifest.os, [target.os])
    assertEquals(manifest.cpu, [target.cpu])
    assertEquals(manifest.license, ROOT_PKG.license)
    assertEquals(manifest.author, ROOT_PKG.author)
    assertEquals(manifest.repository, ROOT_PKG.repository)
    assertEquals(
      manifest.description,
      `${ROOT_PKG.description} (${target.os}/${target.cpu})`
    )
  })
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

Deno.test('native addon packages', async (t) => {
  await t.step('every declared subpath is embedded into the binaries', () => {
    // A package left out here still gets imported by the bundle but is absent
    // from the compiled binary, which only fails at runtime, on the machine of
    // whoever enabled the backend that needs it.
    for (const { name, paths } of NATIVE_ADDON_PACKAGES) {
      for (const subpath of paths) {
        const flag = `--include ./node_modules/${name}/${subpath}`
        assertEquals(
          COMPILE_FLAGS.includes(flag),
          true,
          `COMPILE_FLAGS is missing '${flag}'`
        )
        assertEquals(NATIVE_ADDON_PATHS.includes(`node_modules/${name}/${subpath}`), true)
      }
    }
  })

  await t.step('the node_modules exclusion comes before the includes', () => {
    // `deno compile` applies the exclusion to the npm snapshot it would
    // otherwise embed wholesale, and the later, deeper --include paths add back
    // only what is listed. Reversing the order drops the addons again.
    const exclude = COMPILE_FLAGS.indexOf('--exclude node_modules')
    assertEquals(exclude === -1, false, 'COMPILE_FLAGS must exclude node_modules')
    for (const path of NATIVE_ADDON_PATHS) {
      const include = COMPILE_FLAGS.indexOf(`--include ./${path}`)
      assertEquals(include > exclude, true, `--include ./${path} must follow the exclusion`)
    }
  })

  await t.step('the committed bundle still imports each package externally', () => {
    // The counterpart of the above: the bundler must have kept the bare `npm:`
    // specifier instead of inlining the package. Checked against the committed
    // bundle so a lost external marking cannot reach a release unnoticed.
    const bundle = Deno.readTextFileSync(new URL(`../${BUNDLE_PATH}`, import.meta.url))
    for (const { name } of NATIVE_ADDON_PACKAGES) {
      assertEquals(
        bundle.includes(`"npm:${name}"`) || bundle.includes(`'npm:${name}'`),
        true,
        `${BUNDLE_PATH} must import npm:${name} rather than inline it`
      )
    }
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

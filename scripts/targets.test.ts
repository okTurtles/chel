import { assertEquals, assertStringIncludes } from 'jsr:@std/assert'
import {
  TARGETS,
  BINARY_FIELD,
  ALL_NATIVE_ADDON_PATHS,
  compileFlags,
  nativeAddonPaths,
  subPackageName,
  subPackageDir,
  subPackageManifest,
  isCliSubPackage,
  type Target
} from './targets.ts'
import { BUNDLE_PATH, NATIVE_ADDON_PACKAGES } from './paths.ts'
import { existsSync as exists } from '../test/test-helpers.ts'

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
  await t.step('every target embeds the shared subpaths and its own prebuild', () => {
    // A path left out here still gets imported by the bundle but is absent
    // from the compiled binary, which only fails at runtime, on the machine of
    // whoever enabled the backend that needs it.
    for (const target of TARGETS) {
      const flags = compileFlags(target)
      for (const { name, sharedPaths, prebuild } of NATIVE_ADDON_PACKAGES) {
        for (const subpath of [...sharedPaths, prebuild(target.os, target.cpu)]) {
          const flag = `--include ./node_modules/${name}/${subpath}`
          assertEquals(
            flags.includes(flag),
            true,
            `${target.denoTarget} flags are missing '${flag}'`
          )
          assertEquals(nativeAddonPaths(target).includes(`node_modules/${name}/${subpath}`), true)
        }
      }
    }
  })

  await t.step('no target embeds another platform\'s prebuilt addon', () => {
    // The point of compiling per target: a binary can only ever load the addon
    // built for the platform it runs on, so shipping the other seven wastes
    // ~14 MB per binary.
    for (const target of TARGETS) {
      const flags = compileFlags(target)
      for (const other of TARGETS) {
        if (other.denoTarget === target.denoTarget) continue
        for (const { prebuild } of NATIVE_ADDON_PACKAGES) {
          const foreign = prebuild(other.os, other.cpu)
          if (foreign === prebuild(target.os, target.cpu)) continue
          assertEquals(
            flags.includes(foreign),
            false,
            `${target.denoTarget} must not embed ${foreign}`
          )
        }
      }
    }
  })

  await t.step('embeds exactly one prebuild, never the directory', () => {
    // `--include ./node_modules/<name>/prebuilds` would pull the whole
    // directory back in, silently undoing the narrowing above.
    for (const target of TARGETS) {
      const includes = nativeAddonPaths(target).filter((p) => p.includes('/prebuilds'))
      assertEquals(includes.length, NATIVE_ADDON_PACKAGES.length)
      for (const path of includes) {
        assertEquals(path.endsWith('.node'), true, `${path} must be a single addon file`)
      }
    }
  })

  await t.step('ALL_NATIVE_ADDON_PATHS is the de-duplicated union', () => {
    // What the mtime pinning in scripts/binaries.ts walks: missing an entry
    // would let a fresh `npm install` change the released bytes.
    const union = [...new Set(TARGETS.flatMap((t) => nativeAddonPaths(t)))]
    assertEquals([...ALL_NATIVE_ADDON_PATHS].sort(), union.sort())
    assertEquals(new Set(ALL_NATIVE_ADDON_PATHS).size, ALL_NATIVE_ADDON_PATHS.length)
  })

  await t.step('the node_modules exclusion comes before the includes', () => {
    // `deno compile` applies the exclusion to the npm snapshot it would
    // otherwise embed wholesale, and the later, deeper --include paths add back
    // only what is listed. Reversing the order drops the addons again.
    for (const target of TARGETS) {
      const flags = compileFlags(target)
      const exclude = flags.indexOf('--exclude node_modules')
      assertEquals(exclude === -1, false, `${target.denoTarget} flags must exclude node_modules`)
      for (const path of nativeAddonPaths(target)) {
        const include = flags.indexOf(`--include ./${path}`)
        assertEquals(include > exclude, true, `--include ./${path} must follow the exclusion`)
      }
    }
  })

  await t.step('every embedded path exists in node_modules', () => {
    // Upstream drift sentinel. The prebuild filenames follow better-sqlite3's
    // `${process.platform}-${process.arch}.node` convention; if a release ever
    // renames them, the mapping goes stale and the binary loses its addon with
    // no build-time error. Catch that here instead of at a user's runtime.
    //
    // Detection is per package, not global: with a single shared flag, one
    // uninstalled package would silently disable the check for the installed
    // ones too, and the list is explicitly designed to grow.
    const present = NATIVE_ADDON_PACKAGES.filter(({ name }) => exists(`node_modules/${name}`))
    // Skipped entirely on a checkout that has not installed anything; but once
    // node_modules exists, at least one package must have been checked, or a
    // wholesale rename would turn this sentinel into a silent no-op.
    if (!exists('node_modules')) return
    assertEquals(
      present.length > 0,
      true,
      'node_modules exists but no package in NATIVE_ADDON_PACKAGES was found there'
    )
    for (const { name } of present) {
      const paths = ALL_NATIVE_ADDON_PATHS.filter((p) => p.startsWith(`node_modules/${name}/`))
      assertEquals(paths.length > 0, true, `no embedded paths derived for ${name}`)
      for (const path of paths) {
        assertEquals(exists(path), true, `${path} is missing; the upstream layout may have changed`)
      }
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

  await t.step('the baked-in sys permissions stay as narrow as they are', () => {
    // Permissions compiled into a published binary are hard to walk back, so
    // any widening has to be a deliberate edit here rather than a side effect
    // of a dependency's runtime probe. `cpus` and `networkInterfaces` are
    // currently required by better-sqlite3's glibc-vs-musl detection, which
    // reads process.report; see the TODO on BASE_COMPILE_FLAGS for how to drop
    // them again.
    for (const target of TARGETS) {
      assertStringIncludes(compileFlags(target), '--allow-sys=hostname,cpus,networkInterfaces')
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

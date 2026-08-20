#!/usr/bin/env -S deno run --allow-run --allow-read --allow-env --allow-write=./build --allow-net

import * as esbuild from 'npm:esbuild@0.25.6'
import * as colors from 'jsr:@std/fmt/colors'
import { builtinModules } from 'node:module'
import { dirname } from 'jsr:@std/path/'
import { NATIVE_ADDON_PACKAGES, VERSION_STAMP_PATH } from './paths.ts'

const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

const nodeBuiltins = new Set(builtinModules.filter((m: string) => !m.startsWith('_')))

// Specifiers of the packages that ship a native addon, and therefore cannot be
// inlined into a JavaScript bundle: the `.node` binary has to stay a real file
// that the runtime loads at startup. They are left as bare `npm:` specifiers in
// the bundle, so `deno run` resolves them from the npm cache and `deno compile`
// embeds the package (prebuilt binaries included) into the executable.
//
// Derived from the shared list so this cannot disagree with the paths the
// compiler embeds (see NATIVE_ADDON_PACKAGES).
const nativeAddonSpecifiers = new Set(NATIVE_ADDON_PACKAGES.map(({ name }) => `npm:${name}`))

const options: esbuild.BuildOptions = {
  entryPoints: [
    './src/main.ts',
    './src/serve/ownerSizeTotalWorker.ts',
    './src/serve/creditsWorker.ts'
  ],
  bundle: true,
  define: {
    'import.meta.VERSION': JSON.stringify(version),
    'import.meta.ownerSizeTotalWorker': '"./serve/ownerSizeTotalWorker.js"',
    'import.meta.creditsWorker': '"./serve/creditsWorker.js"',
    // Lock DB after init, preventing overwriting
    'import.meta.lockDbSelectors': 'true'
  },
  format: 'esm',
  platform: 'node',
  outdir: 'build',
  splitting: false,
  write: false,
  plugins: [
    {
      name: 'native-addons',
      setup (build) {
        build.onResolve({ filter: /^npm:/, namespace: 'file' }, ({ path }) => {
          return nativeAddonSpecifiers.has(path) ? { path, external: true } : null
        })
      }
    },
    {
      name: 'npm',
      setup (build) {
        build.onResolve({ filter: /^npm:/, namespace: 'file' }, ({ path, ...args }) => build.resolve(path.slice(4), args))
      }
    },
    {
      name: 'node-builtins',
      setup (build) {
        build.onResolve({ filter: /^[0-9a-zA-Z_/]+$/, namespace: 'file' }, ({ path }) => {
          if (nodeBuiltins.has(path)) {
            return { path: `node:${path}`, external: true }
          }
          return null
        })
      }
    },
    {
      name: 'skip',
      setup (build) {
        build.onResolve({ filter: /^[\w\d]+:/, namespace: 'file' }, () => ({
          external: true
        }))
      }
    }
  ]
}
const result = await esbuild.build(options)
if (result.errors.length) {
  console.error(colors.red('build error:'), result.errors)
  esbuild.stop()
  Deno.exit(1)
} else if (result.warnings.length) {
  console.warn(colors.yellow('build warnings:'), result.warnings)
}
console.log(colors.green('built:'), options.outdir)

for (const outfile of result.outputFiles!) {
  const tmpFile = outfile.path + '-tmp'
  try {
    // esbuild runs with `write: false`, so output directories are never
    // created; without this the build fails on a tree with no `build/` yet.
    await Deno.mkdir(dirname(outfile.path), { recursive: true })
    Deno.writeFileSync(tmpFile, outfile.contents)
    try {
      Deno.removeSync(outfile.path)
    } catch (e) {
      if (e instanceof Error && e.name !== 'NotFound') throw e
    }
    const output = await new Deno.Command(Deno.execPath(), {
      args: [
        'bundle',
        ...[...nativeAddonSpecifiers].flatMap((pkg) => ['--external', pkg]),
        '-o', outfile.path,
        tmpFile
      ]
    }).output()
    if (!output.success) {
      Deno.stdout.writeSync(output.stdout)
      Deno.stderr.writeSync(output.stderr)
      throw new Error('Failed to call \'deno bundle\'')
    }
  } finally {
    // Best-effort: the tmp file may legitimately be gone (e.g. the write above
    // failed), and in that case the original error must not be masked.
    try {
      Deno.removeSync(tmpFile)
    } catch { /* already gone */ }
  }
}

// Stamp the bundle with the version it was built from. The npm `version` hook
// commits this file together with the bundle, and `scripts/publish.ts` refuses
// to publish unless the stamp matches package.json, so what gets published is
// always exactly what the version commit and tag contain.
await Deno.writeTextFile(
  VERSION_STAMP_PATH,
  JSON.stringify({ version }, null, 2) + '\n'
)

esbuild.stop()

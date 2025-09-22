#!/usr/bin/env -S deno run --allow-run --allow-read --allow-env --allow-write=./build --allow-net

import { colors, esbuild } from '../src/deps.ts'

const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

const options: esbuild.BuildOptions = {
  entryPoints: [
    './src/main.ts',
    './src/serve/ownerSizeTotalWorker.ts',
    './src/serve/creditsWorker.ts'
  ],
  bundle: true,
  define: {
    '__build__.VERSION': JSON.stringify(version)
  },
  format: 'esm',
  platform: 'node',
  outdir: 'build',
  splitting: false,
  plugins: [
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

esbuild.stop()

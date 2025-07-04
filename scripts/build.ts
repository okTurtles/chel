#!/usr/bin/env -S deno run --allow-run --allow-read --allow-env --allow-write=./build --allow-net

'use strict'

import { colors, esbuild } from '../src/deps.ts'

const { default: { version } } = await import('../package.json', { with: { type: "json" } })

const options = {
  entryPoints: ['./src/main.ts'],
  bundle: true,
  define: {
    'process.env.VERSION': `'${version}'`
  },
  external: ['node:process'],
  format: 'esm',
  outdir: 'build',
  splitting: false,
  watch: false // Not using esbuild's own watch mode since it involves polling.
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

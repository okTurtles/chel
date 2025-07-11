#!/usr/bin/env -S deno run --allow-run --allow-read --allow-env --allow-write=./build --allow-net

'use strict'

import { colors, esbuild } from '../src/deps.ts'

const { default: { version } } = await import('../package.json', { with: { type: "json" } })

const options = {
  entryPoints: ['./src/main.ts'],
  bundle: true,
  define: {
    "globalThis.VERSION": JSON.stringify(version),
  },
  external: [
    'node:process',
    'jsr:@std/assert',
    'jsr:@std/encoding/base64',
    'jsr:@std/flags/',
    'jsr:@std/fmt/colors',
    'jsr:@std/fs/',
    'jsr:@std/path/',
    'jsr:@std/streams/',
    'jsr:@std/io',
    'jsr:@db/sqlite',
  ],
  format: 'esm',
  outdir: 'build',
  splitting: false
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

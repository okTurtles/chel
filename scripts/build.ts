#!/usr/bin/env -S deno run --allow-run --allow-read --allow-env --allow-write=./build --allow-net

'use strict'

import { colors, esbuild } from '../src/deps.ts'

const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

const options = {
  entryPoints: ['./src/main.ts'],
  bundle: true,
  define: {
    '__build__.VERSION': JSON.stringify(version)
  },
  external: [
    'node:process',
    'jsr:@std/assert@1.0.13',
    'jsr:@std/encoding@1.0.10/base64',
    'jsr:@std/flags@0.224.0',
    'jsr:@std/fmt@1.0.8/colors',
    'jsr:@std/fs@1.0.19',
    'jsr:@std/path@1.1.1',
    'jsr:@std/streams@1.0.10',
    'jsr:@std/io@0.225.2',
    'jsr:@db/sqlite@0.12.0',
    'npm:esbuild@0.25.6',
    'npm:tweetnacl@1.0.3',
    'npm:multiformats@11.0.2/cid',
    'npm:multiformats@11.0.2/bases/base58',
    'npm:multiformats@11.0.2',
    'npm:@multiformats/blake2@1.0.13'
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

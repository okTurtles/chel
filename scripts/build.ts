#!/usr/bin/env -S deno run --allow-run --allow-read --allow-env --allow-write=./build --allow-net

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
    // JSR dependencies
    'jsr:@std/assert@1.0.13',
    'jsr:@std/encoding@1.0.10/base64',
    'jsr:@std/flags@0.224.0',
    'jsr:@std/fmt@1.0.8/colors',
    'jsr:@std/fs@1.0.19',
    'jsr:@std/path@1.1.1',
    'jsr:@std/streams@1.0.10',
    'jsr:@std/io@0.225.2',
    'jsr:@db/sqlite@0.12.0',
    // Core npm dependencies
    'npm:esbuild@0.25.6',
    'npm:zod@4.0.5',
    'npm:tweetnacl@1.0.3',
    'npm:multiformats@11.0.2/cid',
    'npm:multiformats@11.0.2/bases/base58',
    'npm:multiformats@11.0.2',
    'npm:@multiformats/blake2@1.0.13',
    // Serve command dependencies
    'npm:@sbp/sbp@2.4.1',
    'npm:@hapi/hapi@20.1.2',
    'npm:@hapi/boom@9.1.0',
    'npm:@hapi/joi@17.1.1',
    'npm:@hapi/inert@6.0.3',
    'npm:@hapi/validate@1.1.3',
    'npm:@hapi/hoek@9.2.1',
    '@hapi/inert',
    '@hapi/validate',
    '@hapi/hoek',
    '@hapi/hapi',
    '@hapi/boom',
    '@hapi/joi',
    '@hapi/*',
    'npm:chalk@4.1.0',
    'npm:pino@8.19.0',
    'npm:lru-cache@7.14.0',
    'npm:three@0.151.3',
    'npm:ws@8.5.0',
    'npm:vue@2.7.16',
    'npm:vuex@3.6.0',
    'npm:dompurify@2.2.7',
    'npm:uuid@9.0.0',
    'npm:turtledash@1.0.3',
    'npm:buffer@6.0.3',
    'npm:bottleneck@2.19.5',
    'npm:scrypt-async@2.0.1',
    // RFC8188 encryption dependencies
    'npm:@apeleghq/rfc8188@1.0.7/encodings',
    'npm:@apeleghq/rfc8188@1.0.7/encrypt',
    // Chelonia dependencies
    'npm:@chelonia/lib@1.2.2/functions',
    'npm:@chelonia/lib@1.2.2/db',
    'npm:@chelonia/lib@1.2.2/SPMessage',
    'npm:@chelonia/lib@1.2.2/presets',
    'npm:@chelonia/lib@1.2.2/errors',
    'npm:@chelonia/lib@1.2.2',
    'npm:@chelonia/lib@1.2.2/pubsub',
    'npm:@chelonia/lib@1.2.2/utils',
    'npm:@chelonia/lib@1.2.2/zkpp',
    'npm:@chelonia/lib@1.2.2/zkppConstants',
    'npm:@chelonia/lib@1.2.2/persistent-actions',
    '@chelonia/lib',
    '@chelonia/lib/persistent-actions',
    'npm:@chelonia/crypto@1.0.1',
    // SBP dependencies
    'npm:@sbp/okturtles.data@0.1.5',
    'npm:@sbp/okturtles.eventqueue@1.2.0',
    'npm:@sbp/okturtles.events@1.0.0',
    // Vue validation dependencies
    'npm:vuelidate@0.7.6',
    'npm:vue-clickaway@2.2.2',
    'npm:vue-router@3.6.5',
    'npm:pug@3.0.2'
  ],
  format: 'esm',
  platform: 'node',
  outdir: 'build',
  splitting: false,
  alias: {
    'buffer': 'node:buffer'
  }
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

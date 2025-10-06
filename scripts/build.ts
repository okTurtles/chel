#!/usr/bin/env -S deno run --allow-run --allow-read --allow-env --allow-write=./build --allow-net

import * as esbuild from 'npm:esbuild@0.25.6'
import { colors } from '../src/deps.ts'

const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

const options: esbuild.BuildOptions = {
  entryPoints: [
    './src/main.ts',
    './src/serve/ownerSizeTotalWorker.ts',
    './src/serve/creditsWorker.ts'
  ],
  bundle: true,
  define: {
    'import.meta.VERSION': JSON.stringify(version)
  },
  format: 'esm',
  platform: 'node',
  outdir: 'build',
  splitting: false,
  write: false,
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

for (const outfile of result.outputFiles!) {
  const tmpFile = outfile.path + '-tmp'
  try {
    Deno.writeFileSync(tmpFile, outfile.contents)
    Deno.removeSync(outfile.path)
    const output = await new Deno.Command(Deno.execPath(), {
      args: ['bundle', '-o', outfile.path, tmpFile]
    }).output()
    if (!output.success) {
      Deno.stdout.writeSync(output.stdout)
      Deno.stderr.writeSync(output.stderr)
      throw new Error('Failed to call \'deno bundle\'')
    }
  } finally {
    Deno.removeSync(tmpFile)
  }
}

esbuild.stop()

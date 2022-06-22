#!/usr/bin/env -S deno run --allow-run --allow-read=. --allow-write=./dist

import { sh } from '../src/deps.ts'

function $ (command: string) {
  return sh(command, { printOutput: true })
}

const { default: { version } } = await import('../package.json', { assert: { type: "json" } })

async function compile () {
  // NOTE: Apple ARM is slower than x86 on M1!
  // https://github.com/denoland/deno/issues/14935
  const archs = ['x86_64-unknown-linux-gnu', 'x86_64-pc-windows-msvc', 'x86_64-apple-darwin' /*, 'aarch64-apple-darwin'*/]
  for (const arch of archs) {
    const dir = `./dist/tmp/${arch}`
    const bin = arch.includes('windows') ? 'chel.exe' : 'chel'
    // note: could also use https://examples.deno.land/temporary-files
    await $(`mkdir -vp ${dir}`)
    await $(`deno compile --allow-read --allow-write=./  --allow-net --no-remote --import-map=vendor/import_map.json -o ${dir}/${bin} --target ${arch} ./src/main.ts`)
    await $(`tar -C ./dist/tmp -czvf ./dist/chel-v${version}-${arch}.tar.gz ${arch}`)
    await $('sha256sum dist/*.tar.gz')
  }
}

try {
  await compile()
} catch (e) {
  console.error('caught:', e.message)
} finally {
  await sh(`rm -rf ./dist/tmp`)
}

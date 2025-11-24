#!/usr/bin/env -S deno run --allow-run --allow-read=. --allow-write=./dist

import { shell } from '~/utils.ts'

function $ (command: string) {
  return shell(command, { printOutput: true })
}

const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

export async function compile (): Promise<void> {
  const archs = ['x86_64-unknown-linux-gnu', 'aarch64-unknown-linux-gnu', 'x86_64-pc-windows-msvc', 'x86_64-apple-darwin', 'aarch64-apple-darwin']
  for (const arch of archs) {
    const dir = `./dist/tmp/${arch}`
    const bin = arch.includes('windows') ? 'chel.exe' : 'chel'
    // note: could also use https://examples.deno.land/temporary-files
    await $(`mkdir -vp ${dir}`)
    // --allow-read instead of --allow-read=. needed because Deno might try to
    // load things from the Deno cache, and the location of the cache isn't
    // known at the time the binary is generated.
    // TODO: This should either be fixed in Deno or by programmatically dropping
    // permissions at runtime.
    await $(`deno compile --allow-env --allow-ffi --allow-sys=hostname --allow-read --allow-write=./ --allow-net -o ${dir}/${bin} --target ${arch} --exclude node_modules --include ./build/serve --include ./build/dist-dashboard ./build/main.js`)
    await $(`tar -C ./dist/tmp -czvf ./dist/chel-v${version}-${arch}.tar.gz ${arch}`)
  }
  await $(`sha256sum dist/chel-v${version}-*`)
  // TODO: sign the sha256sum! pipe this to gpg and include a link to your GPG key in the release notes!
}

try {
  await compile()
} catch (e) {
  console.error('caught:', e)
} finally {
  await shell('rm -rf ./dist/tmp')
}

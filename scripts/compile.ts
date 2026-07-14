#!/usr/bin/env -S deno run --allow-run --allow-read=. --allow-write=./dist

import { shell, $ } from '~/utils.ts'
import { TARGETS, compileBinary } from './targets.ts'

// Static import for TS JSON-import-attribute type inference. The path also
// lives in `rootPackagePath()` from `./sync-versions.ts`; keep both in sync.
const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

export async function compile (): Promise<void> {
  for (const target of TARGETS) {
    const { denoTarget: arch, binary } = target
    const dir = `./dist/tmp/${arch}`
    // note: could also use https://examples.deno.land/temporary-files
    await $(`mkdir -vp ${dir}`)
    await compileBinary(`${dir}/${binary}`, target)
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

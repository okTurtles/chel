'use strict'

// chel deploy <url-or-dir> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]

import { path } from './deps.ts'
import { upload } from './upload.ts'

export async function deploy (args: string[]) {
  const [urlOrDir, ...manifests] = args
  if (manifests.length === 0) throw new Error('missing url or manifests!')
  const toUpload = []
  for (const manifest of manifests) {
    const manifestPath = path.join(Deno.cwd(), manifest)
    const { default: json } = await import(manifestPath, { assert: { type: "json" } })
    const body = JSON.parse(json.body)
    const dirname = path.dirname(manifestPath)
    toUpload.push(path.join(dirname, body.contract.file))
    if (body.contractSlim) {
      toUpload.push(path.join(dirname, body.contractSlim.file))
    }
    toUpload.push(manifestPath)
  }
  await upload([urlOrDir, ...toUpload], true)
}

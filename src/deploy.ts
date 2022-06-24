'use strict'

// chel deploy <url-or-dir> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]

import { path } from './deps.ts'
import { upload } from './upload.ts'

export async function deploy (args: string[]) {
  const [urlOrDir, ...manifests] = args
  if (manifests.length === 0) throw new Error('missing url or manifests!')
  const toUpload = []
  for (const manifestPath of manifests) {
    const json = JSON.parse(Deno.readTextFileSync(manifestPath))
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

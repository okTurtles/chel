'use strict'

// chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]

import { path } from './deps.ts'
import { upload } from './upload.ts'

// Prefixes to use to select the correct CID to use
const CONTRACT_TEXT_PREFIX = 't|'
const CONTRACT_MANIFEST_PREFIX = 'm|'

export async function deploy (args: string[]): Promise<void> {
  const [urlOrDirOrSqliteFile, ...manifests] = args
  if (manifests.length === 0) throw new Error('missing url or manifests!')
  const toUpload = []
  for (const manifestPath of manifests) {
    interface ContractBody {
      contract: { file: string }
      contractSlim?: { file: string }
    }
    const json = JSON.parse(Deno.readTextFileSync(manifestPath)) as { body: string }
    const body = JSON.parse(json.body) as ContractBody
    const dirname = path.dirname(manifestPath)
    toUpload.push(CONTRACT_TEXT_PREFIX + String(path.join(dirname, body.contract.file)))
    if (body.contractSlim !== undefined && body.contractSlim !== null) {
      toUpload.push(CONTRACT_TEXT_PREFIX + String(path.join(dirname, body.contractSlim.file)))
    }
    toUpload.push(CONTRACT_MANIFEST_PREFIX + manifestPath)
  }
  await upload([urlOrDirOrSqliteFile, ...toUpload], true)
}

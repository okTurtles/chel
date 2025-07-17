'use strict'

// chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]

import { path } from './deps.ts'
import { upload } from './upload.ts'

// Prefixes to use to select the correct CID to use
const CONTRACT_TEXT_PREFIX = 't|'
const CONTRACT_MANIFEST_PREFIX = 'm|'

interface ContractBody {
  contract: { file: string }
  contractSlim?: { file: string }
}

export async function deploy (args: string[]): Promise<void> {
  const [urlOrDirOrSqliteFile, ...manifests] = args
  if (manifests.length === 0) throw new Error('missing url or manifests!')
  const toUpload = []
  for (const manifestPath of manifests) {
    const json = JSON.parse(Deno.readTextFileSync(manifestPath)) as { body: string }
    const body = JSON.parse(json.body) as ContractBody
    const dirname = path.dirname(manifestPath)
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname, body.contract.file))
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (body.contractSlim) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname, body.contractSlim.file))
    }
    toUpload.push(CONTRACT_MANIFEST_PREFIX + manifestPath)
  }
  await upload([urlOrDirOrSqliteFile, ...toUpload], true)
}

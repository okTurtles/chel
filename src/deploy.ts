// chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]

import * as path from 'jsr:@std/path/'
import * as z from 'npm:zod'
import { upload } from './upload.ts'

// Prefixes to use to select the correct CID to use
const CONTRACT_TEXT_PREFIX = 't|'
const CONTRACT_MANIFEST_PREFIX = 'm|'

const ContractBodySchema = z.object({
  contract: z.object({ file: z.string() }),
  contractSlim: z.object({ file: z.string() }).optional(),
})

export async function deploy (args: string[]): Promise<void> {
  const [urlOrDirOrSqliteFile, ...manifests] = args
  if (manifests.length === 0) throw new Error('missing url or manifests!')
  const toUpload = []
  for (const manifestPath of manifests) {
    const json = JSON.parse(Deno.readTextFileSync(manifestPath)) as { body: string }
    const body = ContractBodySchema.parse(JSON.parse(json.body))
    const dirname = path.dirname(manifestPath)
    toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname, body.contract.file))
    if (body.contractSlim) {
      toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname, body.contractSlim.file))
    }
    toUpload.push(CONTRACT_MANIFEST_PREFIX + manifestPath)
  }
  await upload([urlOrDirOrSqliteFile, ...toUpload], true)
}

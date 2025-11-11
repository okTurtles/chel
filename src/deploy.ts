// chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]

import * as path from 'jsr:@std/path/'
import * as z from 'npm:zod'
import { upload } from './upload.ts'
// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase, CommandModule } from 'npm:yargs'

// Prefixes to use to select the correct CID to use
const CONTRACT_TEXT_PREFIX = 't|'
const CONTRACT_MANIFEST_PREFIX = 'm|'

const ContractBodySchema = z.object({
  contract: z.object({ file: z.string() }),
  contractSlim: z.object({ file: z.string() }).optional(),
})

type Params = { manifests: string[], url: string }

export async function deploy (args: ArgumentsCamelCase<Params>): Promise<void> {
  const { manifests } = args
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
  await upload({ ...args, files: toUpload }, true)
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('url', {
        describe: 'URL of a remote server',
        requiresArg: true,
        string: true
      })
      .positional('manifests', {
        describe: 'Manifest files to deploy',
        demandOption: true,
        array: true,
        type: 'string'
      })
  },
  command: 'deploy [--url REMOTE_URL] <manifests..>',
  describe: '',
  handler: (argv) => {
    return deploy(argv)
  }
} as CommandModule<object, Params>

// chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]

import * as path from 'jsr:@std/path/'
import * as z from 'npm:zod'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { upload } from './upload.ts'
import { findManifestFiles } from './utils.ts'

// Prefixes to use to select the correct CID to use
const CONTRACT_TEXT_PREFIX = 't|'
const CONTRACT_MANIFEST_PREFIX = 'm|'

const ContractBodySchema = z.object({
  contract: z.object({ file: z.string() }),
  contractSlim: z.object({ file: z.string() }).optional(),
})

type Params = { manifests: string[], url?: string }

export async function deploy (args: ArgumentsCamelCase<Params>): Promise<void> {
  const { manifests } = args
  const toUpload = []
  const manifestSet = new Set<string>()

  for (const manifestPath of manifests) {
    try {
      const realPath = await Deno.realPath(manifestPath)
      const info = await Deno.lstat(realPath)
      if (info.isDirectory) {
        const items = await findManifestFiles(realPath)
        for (const item of items) {
          manifestSet.add(item)
        }
      } else {
        manifestSet.add(realPath)
      }
    } catch {
      console.warn(`Skipping invalid path: ${manifestPath}`)
      continue
    }
  }

  for (const manifestPath of manifestSet) {
    const manifestText = await Deno.readTextFile(manifestPath)
    const json = JSON.parse(manifestText) as { body: string }
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
        describe: 'Manifest files to deploy (if a directory is passed in, all manifests in that directory, and sub-directories, will be added)',
        demandOption: true,
        array: true,
        type: 'string'
      })
  },
  command: 'deploy <manifests..>',
  describe: '',
  postHandler: (argv) => {
    return deploy(argv)
  }
} as CommandModule<object, Params>

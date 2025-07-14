'use strict'

// chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>

// TODO: consider a --copy-files option that works with --out which copies version-stamped
//       contracts to the same folder as --out.

import { flags, path, colors } from './deps.ts'
import { hash } from './hash.ts'
import { exit, multicodes, readJsonFile, revokeNet } from './utils.ts'
import { EDWARDS25519SHA512BATCH, deserializeKey, keyId, serializeKey, sign } from './lib/crypto.ts'

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

export async function manifest (args: string[]) {
  await revokeNet()
  const parsedArgs = flags.parse(args, { collect: ['key'], alias: { key: 'k' } })
  const [keyFile, contractFile] = parsedArgs._
  const parsedFilepath = path.parse(contractFile as string)
  const { name: contractFileName, base: contractBasename, dir: contractDir } = parsedFilepath
  const name = parsedArgs.name || parsedArgs.n || contractFileName
  const version = parsedArgs.version || parsedArgs.v || 'x'
  const slim: string | undefined = (parsedArgs.slim || parsedArgs.s) as string | undefined
  const outFile: string = (parsedArgs.out as string) || path.join(contractDir, `${contractFileName}.${version}.manifest.json`)
  if (!keyFile) exit('Missing signing key file')

  const signingKeyDescriptor = await readJsonFile(keyFile)
  const signingKey = deserializeKey(signingKeyDescriptor.privkey)

  // Add all additional public keys in addition to the signing key
  const publicKeys = Array.from(new Set(
    [serializeKey(signingKey, false)]
      .concat(...await Promise.all(parsedArgs.key?.map(
        async (kf: unknown) => {
          if (typeof kf !== 'string' && typeof kf !== 'number') {
            exit(`Invalid key file reference: ${String(kf)}`)
          }
          const descriptor = await readJsonFile(String(kf))
          const key = deserializeKey(descriptor.pubkey)
          if (key.type !== EDWARDS25519SHA512BATCH) {
            exit(`Invalid key type ${key.type}; only ${EDWARDS25519SHA512BATCH} keys are supported.`)
          }
          return serializeKey(key, false)
        }
      ) || []))
  ))
  const body: { [key: string]: unknown } = {
    name,
    version,
    contract: {
      hash: await hash([contractFile as string], multicodes.SHELTER_CONTRACT_TEXT, true),
      file: contractBasename
    },
    signingKeys: publicKeys
  }
  if (slim) {
    body.contractSlim = {
      file: path.basename(slim),
      hash: await hash([slim], multicodes.SHELTER_CONTRACT_TEXT, true)
    }
  }
  const serializedBody = JSON.stringify(body)
  const head = { manifestVersion: '1.0.0' }
  const serializedHead = JSON.stringify(head)
  const manifest = JSON.stringify({
    head: serializedHead,
    body: serializedBody,
    signature: {
      keyId: keyId(signingKey),
      value: sign(signingKey, serializedBody + serializedHead)
    }
  })
  if (parsedArgs.out === '-') {
    console.log(manifest)
  } else {
    Deno.writeTextFileSync(outFile, manifest)
    console.log(colors.green('wrote:'), outFile)
  }
}

'use strict'

// chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>

// TODO: consider a --copy-files option that works with --out which copies version-stamped
//       contracts to the same folder as --out.

import { flags, path, colors, EDWARDS25519SHA512BATCH, deserializeKey, keyId, serializeKey, sign } from './deps.ts'
import { hash } from './hash.ts'
import { exit, multicodes, readJsonFile, revokeNet } from './utils.ts'

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

export async function manifest (args: string[]): Promise<void> {
  await revokeNet()
  const parsedArgs = flags.parse(args, { collect: ['key'], alias: { key: 'k' } })
  const [keyFileRaw, contractFileRaw] = parsedArgs._
  if (typeof keyFileRaw !== 'string' || typeof contractFileRaw !== 'string') {
    exit('Missing or invalid key or contract file')
  }
  const keyFile = keyFileRaw
  const contractFile = contractFileRaw
  const parsedFilepath = path.parse(contractFile)
  const { name: contractFileName, base: contractBasename, dir: contractDir } = parsedFilepath
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const name = parsedArgs.name || parsedArgs.n || contractFileName
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const version = parsedArgs.version || parsedArgs.v || 'x'
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const slim: string | undefined = (parsedArgs.slim || parsedArgs.s) as string | undefined
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/restrict-template-expressions
  const outFile: string = (parsedArgs.out as string) || path.join(contractDir, `${contractFileName}.${version}.manifest.json`)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!keyFile) exit('Missing signing key file')

  const signingKeyDescriptor = await readJsonFile(keyFile) as { privkey: string }
  const signingKey = deserializeKey(signingKeyDescriptor.privkey)

  // Add all additional public keys in addition to the signing key
  const publicKeys = Array.from(new Set(
    [serializeKey(signingKey, false)]
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      .concat(...await Promise.all(parsedArgs.key?.map(
        async (kf: unknown) => {
          if (typeof kf !== 'string' && typeof kf !== 'number') {
            exit(`Invalid key file reference: ${String(kf)}`)
          }
          const descriptor = await readJsonFile(String(kf))
          // @ts-expect-error: descriptor is unknown, ignoring type error
          const key = deserializeKey(descriptor.pubkey)
          if (key.type !== EDWARDS25519SHA512BATCH) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
      hash: await hash([contractFile], multicodes.SHELTER_CONTRACT_TEXT, true),
      file: contractBasename
    },
    signingKeys: publicKeys
  }
  if (typeof slim === 'string' && slim !== '') {
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

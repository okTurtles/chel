'use strict'

// chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>

// TODO: consider a --copy-files option that works with --out which copies version-stamped
//       contracts to the same folder as --out.

import { flags, path, colors, EDWARDS25519SHA512BATCH, deserializeKey, keyId, serializeKey, sign } from './deps.ts'
import { hash } from './hash.ts'
import { exit, multicodes, readJsonFile, revokeNet } from './utils.ts'

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

interface SigningKeyDescriptor {
  privkey: string
}

function isSigningKeyDescriptor (obj: unknown): obj is SigningKeyDescriptor {
  return obj !== null && typeof obj === 'object' && typeof (obj as Record<string, unknown>).privkey === 'string'
}

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
  const name = parsedArgs.name || parsedArgs.n || contractFileName
  const version = parsedArgs.version || parsedArgs.v || 'x'
  const slim: string | undefined = (parsedArgs.slim || parsedArgs.s) as string | undefined
  const outFile: string = (parsedArgs.out as string) || path.join(contractDir, `${contractFileName}.${version}.manifest.json`)
  if (!keyFile) exit('Missing signing key file')

  const signingKeyDescriptorRaw = await readJsonFile(keyFile)
  if (!isSigningKeyDescriptor(signingKeyDescriptorRaw)) {
    exit('Invalid signing key file: missing or invalid privkey', true)
  }
  const signingKeyDescriptor = signingKeyDescriptorRaw
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
          // @ts-expect-error: descriptor is unknown, ignoring type error
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

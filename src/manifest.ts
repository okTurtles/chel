// chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>

// TODO: consider a --copy-files option that works with --out which copies version-stamped
//       contracts to the same folder as --out.

import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path/'
import { EDWARDS25519SHA512BATCH, deserializeKey, keyId, serializeKey, sign } from 'npm:@chelonia/crypto'
import { hash } from './hash.ts'
import { exit, multicodes, readJsonFile, revokeNet } from './utils.ts'
// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase } from 'npm:yargs'

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

interface SigningKeyDescriptor {
  privkey: string
}

function isSigningKeyDescriptor (obj: unknown): obj is SigningKeyDescriptor {
  return obj !== null && typeof obj === 'object' && typeof (obj as Record<string, unknown>).privkey === 'string'
}

export async function manifest (args: ArgumentsCamelCase<{
  key: string[] | undefined;
  out: string | undefined;
  slim: string | undefined;
  name: string | undefined;
  version: string | undefined;
  signingKey: string;
  contractBundle: string;
}>): Promise<void> {
  await revokeNet()
  const { signingKey: keyFileRaw, contractBundle: contractFileRaw } = args
  if (typeof keyFileRaw !== 'string' || typeof contractFileRaw !== 'string') {
    exit('Missing or invalid key or contract file')
  }
  const keyFile = keyFileRaw
  const contractFile = contractFileRaw
  const parsedFilepath = path.parse(contractFile)
  const { name: contractFileName, base: contractBasename, dir: contractDir } = parsedFilepath
  const name = args.name || contractFileName
  const version = args.version || 'x'
  const slim = args.slim
  const outFile: string = args.out || path.join(contractDir, `${contractFileName}.${version}.manifest.json`)
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
      .concat(...await Promise.all(args.key?.map(
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
      hash: await hash({ ...args, filename: contractFile }, multicodes.SHELTER_CONTRACT_TEXT, true),
      file: contractBasename
    },
    signingKeys: publicKeys
  }
  if (typeof slim === 'string' && slim !== '') {
    body.contractSlim = {
      file: path.basename(slim),
      hash: await hash({ ...args, filename: slim }, multicodes.SHELTER_CONTRACT_TEXT, true)
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
  if (args.out === '-') {
    console.log(manifest)
  } else {
    Deno.writeTextFileSync(outFile, manifest)
    console.log(colors.green('wrote:'), outFile)
  }
}

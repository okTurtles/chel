'use strict'

// chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>

// TODO: consider a --copy-files option that works with --out which copies version-stamped
//       contracts to the same folder as --out.

import { flags, path, colors } from './deps.ts'
import { hash } from './hash.ts'
import { exit, multicodes, readJsonFile, revokeNet } from './utils.ts'
import { EDWARDS25519SHA512BATCH, deserializeKey, keyId, serializeKey, sign } from './lib/crypto.ts'

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
  const name = (parsedArgs.name ?? parsedArgs.n ?? contractFileName) as string
  const version = (parsedArgs.version ?? parsedArgs.v ?? 'x') as string
  let slim: string | undefined
  if (typeof parsedArgs.slim === 'string') {
    slim = parsedArgs.slim
  } else if (typeof parsedArgs.s === 'string') {
    slim = parsedArgs.s
  }
  const outFile: string =
  typeof parsedArgs.out === 'string'
    ? parsedArgs.out
    : path.join(contractDir, `${String(contractFileName)}.${String(version)}.manifest.json`)
  if (typeof keyFileRaw !== 'string' || typeof contractFileRaw !== 'string') {
    exit('Missing or invalid key or contract file')
  }

  const signingKeyDescriptor = await readJsonFile(keyFile) as { privkey: string }
  const signingKey = deserializeKey(signingKeyDescriptor.privkey)

  // Add all additional public keys in addition to the signing key
  const additionalKeys = parsedArgs.key as Array<string | number> | undefined

  const publicKeys = Array.from(new Set(
    [serializeKey(signingKey, false)].concat(...await Promise.all(
      (additionalKeys ?? []).map(async (kf) => {
        if (typeof kf !== 'string' && typeof kf !== 'number') {
          exit(`Invalid key file reference: ${String(kf)}`)
        }
        const descriptor = await readJsonFile(String(kf)) as { pubkey: string }
        const key = deserializeKey(descriptor.pubkey)
        if (key.type !== EDWARDS25519SHA512BATCH) {
          exit(`Invalid key type ${key.type}; only ${EDWARDS25519SHA512BATCH} keys are supported.`)
        }
        return serializeKey(key, false)
      })
    ))
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

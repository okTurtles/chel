'use strict'

// chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>

// TODO: consider a --copy-files option that works with --out which copies version-stamped
//       contracts to the same folder as --out.

import { flags, path, colors } from './deps.ts'
import { hash } from './hash.ts'
import { importJsonFile, revokeNet } from './utils.ts'
import { EDWARDS25519SHA512BATCH, deserializeKey, keyId, serializeKey, sign } from './lib/crypto.ts'

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

export async function manifest (args: string[]) {
  await revokeNet()
  const parsedArgs = flags.parse(args, { collect: ['key'], alias: { 'key': 'k' } })
  console.log(parsedArgs)
  const [keyFile, contractFile] = parsedArgs._
  const parsedFilepath = path.parse(contractFile as string)
  const { name: contractName, base: contractBasename, dir: contractDir } = parsedFilepath
  const version = parsedArgs.version || parsedArgs.v || 'x'
  const slim = parsedArgs.slim || parsedArgs.s
  const outFilepath = path.join(contractDir, `${contractName}.${version}.manifest.json`)
  if (!keyFile) throw new Error('Missing signing key file')

  const signingKeyDescriptor = await importJsonFile(keyFile)
  const signingKey = deserializeKey(signingKeyDescriptor.privkey)

  // Add all additional public keys in addition to the signing key
  const publicKeys = Array.from(new Set(
    [serializeKey(signingKey, false)]
      .concat(...await Promise.all(parsedArgs.key?.map(
        async (kf: number | string) => {
          const descriptor = await importJsonFile(kf)
          const key = deserializeKey(descriptor.pubkey)
          if (key.type !== EDWARDS25519SHA512BATCH) {
            throw new Error(`Invalid key type ${key.type}; only ${EDWARDS25519SHA512BATCH} keys are supported.`)
          }
          return serializeKey(key, false)
        }
      ) || []))
  ))
  const body: {[key: string]: unknown} = {
    version,
    contract: {
      hash: await hash([contractFile as string], true),
      file: contractBasename
    },
    signingKeys: publicKeys
  }
  if (slim) {
    body.contractSlim = {
      file: path.basename(slim),
      hash: await hash([slim], true)
    }
  }
  const serializedBody = JSON.stringify(body)
  const head = { manifestVersion: "1.0.0" }
  const manifest = JSON.stringify({
    head,
    body: serializedBody,
    signature: {
      keyId: keyId(signingKey),
      value: sign(signingKey, serializedBody + head.manifestVersion)
    }
  })
  if (parsedArgs.out === '-') {
    console.log(manifest)
  } else {
    const outFile = parsedArgs.out || outFilepath
    Deno.writeTextFileSync(outFile, manifest)
    console.log(colors.green('wrote:'), outFile)
  }
}

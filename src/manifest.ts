'use strict'

// chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>

// TODO: consider a --copy-files option that works with --out which copies version-stamped
//       contracts to the same folder as --out.

import { flags, path, colors } from './deps.ts'
import { hash } from './hash.ts'

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

export async function manifest (args: string[]) {
  const parsedArgs = flags.parse(args)
  // console.log(parsedArgs)
  const [_keyFile, contractFile] = parsedArgs._
  const parsedFilepath = path.parse(contractFile as string)
  const { name: contractName, base: contractBasename, dir: contractDir } = parsedFilepath
  const version = parsedArgs.version || parsedArgs.v || 'x'
  const slim = parsedArgs.slim || parsedArgs.s
  const outFilepath = path.join(contractDir, `${contractName}.${version}.manifest.json`)
  const body: {[key: string]: unknown} = {
    version,
    contract: {
      hash: await hash([contractFile as string], true),
      file: contractBasename
    },
    authors: [
      {cipher: "algo", key: "<pubkey from deploy-key.json>"},
      {cipher: "algo", key: "<pubkey from alex.json>"}
    ]
  }
  if (slim) {
    body.contractSlim = {
      file: path.basename(slim),
      hash: await hash([slim], true)
    }
  }
  const manifest = JSON.stringify({
    head: { manifestVersion: "1.0.0" },
    body: JSON.stringify(body),
    signature: {
      key: "<which of the 'authors' keys was used to sign 'body'>",
      signature: "<signature>"
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

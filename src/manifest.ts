'use strict'

// chel manifest [--add-key <pubkey1> [--add-key <pubkey2> ...]] [--out=<manifest.json>] [--slim <contract-slim.js>] <key.json> <contract-bundle.js>

import { flags, path, colors } from './deps.ts'
import { hash } from './hash.ts'

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

export async function manifest (args: string[]) {
  const parsedArgs = flags.parse(args)
  // console.log(parsedArgs)
  const [_keyFile, contractFile] = parsedArgs._
  const parsedFilepath = path.parse(contractFile as string)
  const { name: contractName, base: contractBasename } = parsedFilepath
  const outFilepath = `${contractName}.manifest.json`
  const body: {[key: string]: unknown} = {
    contract: {
      hash: await hash([contractFile as string], true),
      file: contractBasename
    },
    authors: [
      {cipher: "algo", key: "<pubkey from deploy-key.json>"},
      {cipher: "algo", key: "<pubkey from alex.json>"}
    ]
  }
  if (parsedArgs.slim) {
    body.contractSlim = {
      file: path.basename(parsedArgs.slim),
      hash: await hash([parsedArgs.slim], true)
    }
  }
  const manifest = JSON.stringify({
    head: { version: "1.0.0" },
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

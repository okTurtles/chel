'use strict'

// chel manifest [--add-key <pubkey1> [--add-key <pubkey2> ...]] [--out=<manifest.json>] [--slim <contract-slim.js>] <key.json> <contract-bundle.js>

import { parse } from 'https://deno.land/std@0.140.0/flags/mod.ts'
import { basename, parse as parsePath, join } from 'https://deno.land/std@0.141.0/path/mod.ts'
import { hash } from './hash.ts'
import { green } from "https://deno.land/std@0.141.0/fmt/colors.ts"

// import { writeAllSync } from "https://deno.land/std@0.141.0/streams/mod.ts"

export async function manifest (args: string[]) {
  const parsedArgs = parse(args)
  // console.log(parsedArgs)
  const [keyFile, contractFile] = parsedArgs._
  const parsedFilepath = parsePath(contractFile as string)
  const { name: contractName, base: contractBasename } = parsedFilepath
  const outFilepath = join(parsedFilepath.dir, `${contractName}.manifest.json`)
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
      file: basename(parsedArgs.slim),
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
    console.log(green('wrote:'), outFile)
  }
}

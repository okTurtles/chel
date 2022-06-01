'use strict'

export function help (args?: string[]) {
  if (!args) {
    console.log(`
      chel
      chel help [command]
      chel version
      chel keygen [--out <key.json>]
      chel manifest [--add-key <pubkey1> [--add-key <pubkey2> ...]] [--out <manifest.json>] [--slim <contract-slim.js>] <key.json> <contract-bundle.js>
      chel deploy <url> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
      chel upload <url> <file1> [<file2> [<file3> ...]]
      chel latestState <url> <contractID>
      chel eventsSince [--limit N] <url> <contractID> <hash>
      chel eventsBefore [--limit N] <url> <contractID> <hash>
      chel hash <file>
    `)
  } else if (helpDict[args[0]]) {
    console.log(helpDict[args[0]])
  } else {
    console.error(`Unknown command: ${args[0]}`)
  }
}

const helpDict: {[key:string]: string} = {
  help: `
    chel help [command]
  `
}

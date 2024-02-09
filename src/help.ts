'use strict'

export function help (args?: string[]) {
  if (!args || args.length === 0) {
    console.log(`
      chel
      chel help [command]
      chel version
      chel keygen [--out <key.json>] [--pubout <key.pub.json>]
      chel verifySignature [-k <pubkey.json>] <manifest.json>
      chel manifest [-k|--key <pubkey1.json> [-k|--key <pubkey2.json> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>
      chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
      chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]
      chel latestState <url> <contractID>
      chel eventsAfter [--limit N] <url-or-dir-or-sqlitedb> <contractID> <hash>
      chel eventsBefore [--limit N] <url> <contractID> <hash>
      chel get <url-or-dir-or-sqlitedb> <hash>
      chel hash <file>
      chel migrate --from <backend> --to <backend> --out <dir-or-sqlitedb> <dir-or-sqlitedb>
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
  `,
  version: `
    chel version
  `,
  hash: `
    chel hash <file>

    Computes and logs the content identifier (CID) for the given file.
    File contents will be interpreted as raw binary data, unless the file extension is '.json'.
  `,
  manifest: `
    chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]]
                  [--out=<manifest.json>]
                  [--slim <contract-slim.js>]
                  [-v|--version <version>]
                  <key.json> <contract-bundle.js>

    If unspecified, <version> is set to 'x'.
  `,
  migrate: `
    chel migrate --from (fs|sqlite) --to (fs|sqlite) --out <dir-or-sqlitedb> [<dir-or-sqlitedb>='.']

    Reads all key-value pairs from a given database and creates or updates another database accordingly.
    - The output database will be created if necessary.
    - The source database won't be modified nor deleted.
    - Invalid key-value pairs entries will be skipped.
    - Arguments --from and --to must be different.
    - The source and --out must resolve to distinct paths.
    - Requires read and write access to the source.
    - Requires read and write access to --out.
  `,
  upload: `
    chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]

    Requires read and write access to the destination.
  `,
  deploy: `
    chel deploy <url-or-dir> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
  `,
  eventsAfter: `
    chel eventsAfter [--limit N=50] <url-or-localpath> <contractID> <hash>

    Displays a JSON array of the N first events that happened in a given contract, since a given entry identified by its hash.
    - Older events are displayed first.
    - The output is parseable with tools such as 'jq'.
    - If <hash> is the same as <contractID>, then the oldest events will be returned.
    - If <url-or-localpath> is a URL, then its /eventsAfter REST endpoint will be called.
  `,
  get: `
    chel get <url-or-dir-or-sqlitedb> <hash>
    
    Retrieves the entry associated with a given <hash> key, from a given database or server.
    When the first argument is a URL, this queries the GET <url>/file/<hash> route.

    - The output can be piped to a file, like this:
      chel get https://url.com mygreatlongkey > file.png
  `
}

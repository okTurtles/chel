# Chel: Chelonia Command-line Interface

🚧 Under construction! 🚧

```
chel
chel help [command]
chel version
chel keygen [--out=<key.json>]
chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>
chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]
chel latestState <url> <contractID>
chel eventsAfter [--limit N] <url> <contractID> <hash>
chel eventsBefore [--limit N] <url> <contractID> <hash>
chel hash <file>
chel migrate --from <backend> --to <backend> --out <dir-or-sqlitedb>
```

Note: in many (if not all) instances, the `<url>` parameter can refer to a local folder path, in which case the command will operate without making a network connection, and will instead use the folder's contents to perform its operations.

### `chel keygen`

```
{
  "version": "1.0.0",
  "cipher": "algo",
  "pubkey": "...",
  "privkey": "...",
  "encrypted": "algo"
}
```

If `"encrypted"` doesn't exist - it means the `"privkey"` was saved in the clear.


### `chel manifest`

Let's say you have the following files:

- `contract-bundle.js`
- `contract-slim.js`

Running `chel manifest --add-key alex.json --slim contract-slim.js deploy-key.json contract-bundle.js` will generate the following `contract-bundle.manifest.json`:

```
{
  "head": {
    "manifestVersion": "1.0.0"
  },
  "body": JSON.stringify({
    "version": "<contract version string, 'x'> by default",
    "contract": { "hash": "<hash of contract-bundle.js>", "file": "contract-bundle.js" },
    "contractSlim": { "hash": "<hash of contract-slim.js>", "file": "contract-slim.js" },
    "authors": [
      {"cipher": "algo", "key": "<pubkey from deploy-key.json>"},
      {"cipher": "algo", "key": "<pubkey from alex.json>"}
    ]
  }),
  "signature": {
    "key": "<which of the 'authors' keys was used to sign 'body'>",
    "signature": "<signature>"
  }
}
```

It will upload both versions of the contracts, and this JSON.

This format makes it as efficient as possible for using the contract system from both in-app and from the commandline.

The CLI tool will always use the self-contained contract bundle, whereas apps can load less code by loading the slim version of the contract. You just need to make sure that none of the external dependencies that you're referencing ever change if you do this, as otherwise you will get different state between the two versions of the contracts.

Note also that Chelonia is fundamentally language agnostic. We started out using Chelonia to build JS apps, but you can use this protocol with any programming language that supports source evaluation at runtime.

Some commands of this CLI tool (like `latestState`), only support JavaScript, but that is a limitation of resources on our side, and not a fundamental limitation of the protocol.

### `chel deploy`

Deploys manifest(s) generated with `chel manifest`.

Automatically uploads any corresponding contract files.

Outputs the hash(es) corresponding to the manifest(s).

Useful command:

```
cp -r path/to/contracts/* test/assets/ && ls ./test/assets/*-slim.js | sed -En 's/.*\/(.*)-slim.js/\1/p' | xargs -I {} ./src/main.ts manifest --out=test/assets/{}.manifest.json --slim test/assets/{}-slim.js key.json test/assets/{}.js && ls ./test/assets/*.manifest.json | xargs ./src/main.ts deploy http://127.0.0.1:3000
```

### sha256sum

Current release hashes will always be listed here.

```
b2f8eae87c7f66313e99d488189958ce5ec750ba321acf7fc1aa738ed9cc7c81  dist/chel-v2.0.1-aarch64-apple-darwin.tar.gz
56d784f6cd9c642a0d4e539ff1fb460f07f521e708011432edf822627d2f29b1  dist/chel-v2.0.1-x86_64-apple-darwin.tar.gz
73cefef442ae36939c221ae172436ac22653814aa2328c301b1e9f49449ded74  dist/chel-v2.0.1-x86_64-pc-windows-msvc.tar.gz
cbc608d429057d369dccff3796939a085cb03e6c403afff8bff59f29231b2aa6  dist/chel-v2.0.1-x86_64-unknown-linux-gnu.tar.gz
```

## History

See [HISTORY.md](HISTORY.md)

## License

[AGPL-3.0](LICENSE)


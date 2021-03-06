# Chel: Chelonia Command-line Interface

🚧 Under construction! 🚧

```
chel
chel help [command]
chel version
chel keygen [--out=<key.json>]
chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>
chel deploy <url-or-dir> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
chel upload <url-or-dir> <file1> [<file2> [<file3> ...]]
chel latestState <url> <contractID>
chel eventsSince [--limit N] <url> <contractID> <hash>
chel eventsBefore [--limit N] <url> <contractID> <hash>
chel hash <file>
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
1bb24fe4632e3277d238dcc92c2cd5c2212fc3147bde84c08c90a9a024a287bf  dist/chel-v1.1.2-x86_64-apple-darwin.tar.gz
09258e8d0a29fe690d7e23f377975d91089bc605248dcaa1171885f04142394e  dist/chel-v1.1.2-x86_64-pc-windows-msvc.tar.gz
057d75a4cab55988fe9a7c503d6ab1780ad7eede10328675e01789b22dcb3c70  dist/chel-v1.1.2-x86_64-unknown-linux-gnu.tar.gz
```

## History

See [HISTORY.md](HISTORY.md)

## License

[AGPL-3.0](LICENSE)


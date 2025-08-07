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
chel serve [options] <directory>
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

### `chel serve`

Starts a local development server for Chelonia applications.

```
chel serve [options] <directory>

OPTIONS

--dp <port>        set dashboard port (default: 3000)
--port <port>      set application port (default: 8000)
--db-type <type>   one of: files, sqlite, mem (default: mem)
--db-location <loc>  for "files", a directory, for "sqlite", path to sqlite database
```

**Example:**
```bash
# Serve Group Income app from extracted directory
chel serve ./gi-v2.0.0

# Serve with custom ports and SQLite database
chel serve --dp 3000 --port 8000 --db-type sqlite --db-location ./app.db ./my-app
```

The serve command will:
- Start a dashboard server (default: http://localhost:3000)
- Start an application server (default: http://localhost:8000)
- Serve static assets and handle API routes
- Support different database backends (memory, filesystem, SQLite)

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
8a267d23405085ac4b01e55fca235b68f07875d1f7898f711c07da5b1d384b80  dist/chel-v3.0.0-aarch64-apple-darwin.tar.gz
e46f8b42bb8c2c1f0c0263ffa7b28d0b4030f0892f68e65541fe4e4dd7b2f7e4  dist/chel-v3.0.0-aarch64-unknown-linux-gnu.tar.gz
497468d57887e2a922045d5f82200c99336fd807762f200621a8dc8a761032c1  dist/chel-v3.0.0-x86_64-apple-darwin.tar.gz
f8fc1dba11045519d172868c54433a983de04248a1bb61edf206eacee6ad65fa  dist/chel-v3.0.0-x86_64-pc-windows-msvc.tar.gz
301e5fd7fc483f40520090f810d0d463f092b50855e0259aa2dec8b15ee67029  dist/chel-v3.0.0-x86_64-unknown-linux-gnu.tar.gz
```

## History

See [HISTORY.md](HISTORY.md)

## License

[AGPL-3.0](LICENSE)


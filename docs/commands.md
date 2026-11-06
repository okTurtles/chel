# Commands

`chel --help` lists the commands, and `chel <command> --help` shows the
options of one.

Every command also takes `--config <file>`, to use another config file than
`./chel.toml`. These commands read it: `deploy`, `eventsAfter`, `get`,
`migrate`, `pin`, `serve` and `upload`. See [configuration.md](configuration.md).

| command | what it does |
| --- | --- |
| [`chel init`](#chel-init) | writes a new `chel.toml` |
| [`chel serve`](#chel-serve) | runs the server |
| [`chel keygen`](#chel-keygen) | makes a key pair for signing contracts |
| [`chel manifest`](#chel-manifest) | signs a contract |
| [`chel pin`](#chel-pin) | pins a contract version into `contracts/` |
| [`chel verifySignature`](#chel-verifysignature) | checks a manifest |
| [`chel deploy`](#chel-deploy) | uploads contracts and their manifests |
| [`chel upload`](#chel-upload) | uploads files |
| [`chel get`](#chel-get) | prints the entry stored under a key |
| [`chel eventsAfter`](#chel-eventsafter) | prints a contract's events as JSON |
| [`chel hash`](#chel-hash) | prints the CID of a file |
| [`chel migrate`](#chel-migrate) | copies all data from one database backend to another |
| [`chel version`](#chel-version) | prints the version |

A contract usually goes through these steps:

1. `chel keygen` makes a key pair, once. Keep it for as long as the app lives:
   clients trust the signing keys of the first manifest they see for a
   contract name, and refuse later manifests signed with other keys.
2. `chel manifest` signs each version of each contract.
3. `chel pin` copies that version into `contracts/` and records it in
   `chelonia.json`.
4. `chel serve` uploads everything in `contracts/` when it starts.

## chel init

```
chel init [--force] [--config <file>]
```

Writes a template `chel.toml` in the current directory, or at the `--config`
path, with a freshly generated `server_id` and the default settings. The less
common ones are left as comments.

- `--force`: overwrite an existing file. Without it, `chel init` refuses to,
  as a safety against changing `server_id` by accident: push subscriptions are
  tagged with it, and the ones tagged with the old id would be orphaned.

Keep `server_id` the same for the life of the database, and do not reuse it
across environments (production, staging, development) that share a database.

```bash
$ chel init
wrote: chel.toml
server_id: 7b3f2c1a-... keep this stable; do not reuse across environments,
                        and do not rotate it on an existing DB.
```

## chel serve

```
chel serve [options] [directory]
```

Runs the server for the app in `directory` (`.` by default). See
[server.md](server.md) for what it does at startup, the dashboard and running
it in production.

| option | default | |
| --- | --- | --- |
| `-p`, `--port` | `8000` | port of the app and the API |
| `-a`, `--dashboard-port` | `8888` | port of the dashboard |
| `-d`, `--dev` | off | development mode: also watch the manifests folder and upload new versions as they appear |
| `-m`, `--manifests-dir` | `contracts` | where to find the contract manifests to upload |
| `-i`, `--app-manifest` | `chelonia.json` in the app directory | the app's [`chelonia.json`](configuration.md#cheloniajson) |

## chel keygen

```
chel keygen [--out <file>] [--pubout <file>]
```

Makes a key pair for signing contracts. `--out` is the file for the secret key
and `--pubout` the one for the public key. By default they are named after the
key, as `edwards25519sha512batch-<id>.json` and
`edwards25519sha512batch-<id>.pub.json`, where `<id>` is the last 12
characters of the key ID.

The secret key file looks like this, and the public one is the same without
`privkey`:

```json
{
  "version": "1.0.0",
  "pubkey": "...",
  "privkey": "..."
}
```

The private key is saved unencrypted, so keep the file out of version control
and off the server.

## chel manifest

```
chel manifest [options] <signingKey> <contractBundle>
```

Signs `contractBundle` with the secret key file `signingKey`, and writes its
manifest.

| option | default | |
| --- | --- | --- |
| `-n`, `--name <name>` | the file name, without extension | contract name |
| `-V`, `--contract-version <version>` | `x` | contract version |
| `--out <file>` | `<file name>.<version>.manifest.json`, next to the contract | where to write the manifest. `-` prints it |
| `-s`, `--slim <file>` | | a slim bundle of the same contract, hashed into the manifest |
| `-k`, `--key <file>` | | another public key file allowed to sign this contract. Can be repeated |

For example, with a key `deploy-key.json`, a second public key `alex.pub.json`,
and the two builds `contract-bundle.js` and `contract-slim.js`:

```bash
chel manifest --name my.app/list --contract-version 1.0.0 \
  -k alex.pub.json --slim contract-slim.js deploy-key.json contract-bundle.js
```

writes `contract-bundle.1.0.0.manifest.json`. Its `head` and `body` are JSON
strings, and the signature covers both:

```
{
  "head": "{\"manifestVersion\":\"1.0.0\"}",
  "body": JSON.stringify({
    "name": "my.app/list",
    "version": "1.0.0",
    "contract": { "hash": "<CID of contract-bundle.js>", "file": "contract-bundle.js" },
    "signingKeys": ["<public key from deploy-key.json>", "<public key from alex.pub.json>"],
    "contractSlim": { "file": "contract-slim.js", "hash": "<CID of contract-slim.js>" }
  }),
  "signature": {
    "keyId": "<ID of the key that signed>",
    "value": "<signature>"
  }
}
```

The manifest records each file by its name only, and `chel deploy` looks for
them next to the manifest, so keep them in the same folder.

The CLI always uses the self-contained bundle, but apps can load less code by
loading the slim version. That is only safe if the external code the slim
version relies on never changes, or the two versions would build different
state.

Chelonia is language agnostic. It started out for JavaScript apps, but the
protocol works with any language that can evaluate source at runtime.

## chel pin

```
chel pin [options] <manifest> [<manifest-version>]
```

Copies the contract files and the manifest into
`contracts/<contract name>/<version>/`, and records the version in
`chelonia.json`. A `/` in the contract name becomes `_` in the folder name.

| option | |
| --- | --- |
| `-o`, `--overwrite` | replace a version folder that is already there |
| `-d`, `--dir <folder>` | the project folder to pin into, instead of the current one |
| `-i`, `--app-manifest <file>` | the `chelonia.json` to update |

If you give `manifest-version`, it must match the version in the manifest. If
`chelonia.json` already pins that version, `chel pin` does nothing. If the
version's folder is there but `chelonia.json` pins another version, it stops
unless you pass `--overwrite`.

```bash
chel pin dist/contracts/chatroom.2.0.6.manifest.json 2.0.6
```

pins `gi.contracts/chatroom` like this, next to the versions pinned before:

```
contracts/
├── gi.contracts_chatroom/
│   ├── 2.0.5/
│   │   ├── chatroom.js
│   │   ├── chatroom-slim.js
│   │   └── chatroom.2.0.5.manifest.json
│   └── 2.0.6/
│       ├── chatroom.js
│       ├── chatroom-slim.js
│       └── chatroom.2.0.6.manifest.json
└── gi.contracts_group/
    └── 2.0.0/
        └── ...
```

## chel verifySignature

```
chel verifySignature [-k <public key file>] <manifestFile>
```

Checks a manifest: its signature, that the key it was signed with is listed in
its `signingKeys`, and that the contract files next to it match their hashes.
With `-k`, it also checks that the manifest was signed with that key.

## chel deploy

```
chel deploy [--url <url>] <manifests..>
```

Uploads each manifest and the contract files it points to, and prints where
each one went. A folder means every manifest in it and in its subfolders.

Without `--url` it writes into the database set in `chel.toml`. With `--url`
it sends them to that server, which only accepts them when it runs with
`NODE_ENV=development`.

## chel upload

```
chel upload [--url <url>] <files..>
```

Uploads files, to the database set in `chel.toml` or, with `--url`, to a server
running with `NODE_ENV=development`.

## chel get

```
chel get [--url <url>] <key>
```

Prints the entry stored under `key`, from the database set in `chel.toml` or,
with `--url`, from that server's `/file/<key>`. The output can go to a file:

```bash
chel get --url https://example.com <key> > file.png
```

## chel eventsAfter

```
chel eventsAfter [--limit <n>] [--url <url>] [--keys <keys.json>] <contractID> <height>
```

Prints a JSON array of up to `--limit` (default 50) events of a contract,
starting at `height`. Older events come first, and the output works with tools
like `jq`.

Without `--url` it reads the database set in `chel.toml`. With `--url` it calls
that server's `/eventsAfter` endpoint.

### Decrypting events with `--keys`

By default, encrypted events (`OP_ACTION_ENCRYPTED` and friends) are returned
as they are stored: useful for forensics, but unreadable. Pass `--keys` with a
JSON file of secret keys to decrypt them in place.

**Current limitation:** decryption only works when the returned list starts
with the contract's `OP_CONTRACT` event, for example by querying from height
`0`. From a later height there is no prior contract and key state, so
encrypted events come back as they are, with a `no prior contract state`
error.

**Warning:** this file holds secret keys, and can decrypt every event
encrypted to them. Do **not** commit it to version control, put it in logs or
share it. Store it with restrictive file permissions, use it only for local
debugging, and delete it when you are done.

The file maps each key ID to its serialized secret key:

```json
{
  "z9brR...sigKeyId": "<serializedSecretKey>",
  "z9brR...encKeyId": "<serializedSecretKey>"
}
```

This is the shape Chelonia keeps at `rootState.secretKeys` in any app built
with [`@chelonia/lib`](https://github.com/okTurtles/libcheloniajs). The easiest
way to get it is from the browser's developer console, with the app open:

```js
copy(JSON.stringify(await sbp('chelonia/rootState').secretKeys, null, 2))
// then paste it into keys.json
```

```bash
chel eventsAfter --keys ./keys.json <contractID> 0 --limit 10
```

With `--keys`, each event comes out like this:

```jsonc
{
  "height": 1,
  "hash": "z9brR...",
  "contractID": "z9brR...",
  "op": "ae",
  "signingKeyId": "z9brR...",
  "innerSigningKeyId": "z9brR...",
  "decryptedValue": { /* the inner contract action payload */ },
  "raw": {
    "serverMeta": {
      "date": "2025-06-09T20:35:43.305Z",
      "isKeyOp": true
    },
    "message": "{...}"
  }
}
```

An `OP_ATOMIC` event also has `ops`, with one entry per operation in it.

Decryption is best-effort: if a key is missing or a signature cannot be
verified, the event still comes out with the original message under `raw`, and
`decryptedValue` may be missing. Some failures also add an `error` to the event
or print a warning to `stderr`, but not every one does.

## chel hash

```
chel hash <filename>
```

Prints the content identifier (CID) of a file. The contents are read as raw
binary data, unless the file name ends in `.json`.

## chel migrate

```
chel migrate --from <backend> --to <backend> [--from-config <file>] [--to-config <file>]
```

Copies every key-value pair from one database backend (`--from`) to another
(`--to`), for example from `fs` to `sqlite`. The source is not changed or
deleted, the destination is created if needed, and invalid entries are
skipped. It needs read and write access to the source.

Both backends use the settings in `chel.toml`, unless `--from-config` or
`--to-config` gives another file. Those files have the same format as
`chel.toml`, so migrating to a new backend can start with writing a
`chel.toml` for it.

```sh
# From sqlite to redis, both with the settings in chel.toml
chel migrate --from sqlite --to redis

# sqlite with the settings in sqlite.toml, redis with those in chel.toml
chel migrate --from sqlite --from-config sqlite.toml --to redis

# sqlite with the settings in chel.toml, redis with those in redis.toml
chel migrate --from sqlite --to redis --to-config redis.toml

# Each with its own file
chel migrate --from sqlite --from-config sqlite.toml --to redis --to-config redis.toml
```

## chel version

```
chel version
```

Prints the version of chel.

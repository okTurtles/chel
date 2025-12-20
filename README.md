# Chel: Chelonia Command-line Interface

Modern CLI for Chelonia contract development, deployment, and management.

## All Available Commands

```
chel
chel help [command]
chel version
chel pin [--dir <output-directory>] [--overwrite] <manifest-file-path> <version>
chel test
chel keygen [--out=<key.json>]
chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>
chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]
chel serve [options] <directory>
chel latestState <url> <contractID>
chel eventsAfter [--limit N] <url> <contractID> <hash>
chel eventsBefore [--limit N] <url> <contractID> <hash>
chel hash <file>
chel migrate --from <backend> --to <backend> [--from-config <from-config.toml>] [--to-config <to-config.toml>]
```

Note: in many (if not all) instances, the `<url>` parameter can refer to a local folder path, in which case the command will operate without making a network connection, and will instead use the folder's contents to perform its operations.

### `chel pin` - Per-Contract Versioning System

🎯 Pin individual contracts to specific versions independently!

**Key Features:**
- ✅ **Per-contract versioning** using `chelonia.json` configuration
- ✅ **Individual contract pinning** by specifying manifest file path
- ✅ **New directory structure**: `contracts/<contract-name>/<version>/`
- ✅ **Manifest-based workflow** - requires existing manifest files
- ✅ **Ecosystem-agnostic** - no coupling to Node.js/npm

**Workflow:**
1. **Generate keys**: Use `chel keygen` to create cryptographic key files (required for production)
2. **Pin from manifest**: Use `chel pin` with the manifest file path
3. **Contract files copied**: Contract files (main/slim) and manifest are copied to new structure

**Usage Examples:**
```bash
# First, generate cryptographic keys (required for production)
chel keygen

# Then pin contracts with re-signing
chel pin <manifest-file-path> <version>

# Pin specific contract to a version using its manifest (from dist/contracts)
chel pin 2.0.5 dist/contracts/2.0.5/chatroom.2.0.5.manifest.json
chel pin 2.0.0 dist/contracts/2.0.0/group.2.0.0.manifest.json

# Note: Contracts are pinned to the contracts/ output directory
```

**Configuration (`chelonia.json`):**
```json
{
  "contracts": {
    "chatroom": {
      "version": "2.0.6",
      "path": "contracts/gi.contracts_chatroom/2.0.6/chatroom.2.0.6.manifest.json"
    },
    "group": {
      "version": "2.0.0",
      "path": "contracts/gi.contracts_group/2.0.0/group.2.0.0.manifest.json"
    }
  }
}
```

**Directory Structure Created:**
```
contracts/
├── gi.contracts_chatroom/
│   ├── 2.0.5/
│   │   ├── chatroom.js
│   │   └── chatroom-slim.js
│   └── 2.0.6/
│       ├── chatroom.js
│       └── chatroom-slim.js
└── gi.contracts_group/
    └── 2.0.0/
        ├── group.js
        └── group-slim.js
```

**Command Options:**
- **`--overwrite`**: Force overwrite existing versions
- **Default**: Create new version by copying from source

### `chel serve` - Development Server with Contract Preloading

```
chel serve [options] <directory>

OPTIONS

--dashboard-port <port>  set dashboard port (default: 8888)
--port           <port>  set application port (default: 8000)
--dev                    start in development mode (watch and redeploy contract manifests)
```

> [!IMPORTANT]  
> **Prerequisites:** Ensure your application directory contains a `contracts/` directory with the correct contract structure before running `chel serve`. The server automatically preloads all contract manifests found in `contracts/<contract-name>/<version>/` directories into the database on startup in development mode.

**Example Output:**
```bash
$ chel serve
🚀 Starting Chelonia app server...
📦 Step 1: Preloading contracts...
📋 Found 4 contract manifest(s) to deploy
contracts/gi.contracts_chatroom/2.0.6/chatroom.js: /data/zLAeVmpcc88g...
contracts/gi.contracts_group/2.0.0/group.js: /data/zLAeVmpcc88g...
✅ Successfully preloaded 4 contract(s) into database
🚀 Step 2: Starting dashboard server...
📊 Dashboard server running at: http://localhost:8888
🚀 Step 3: Starting application server...
```

**Usage Examples:**
```bash
# Start with automatic contract preloading
chel serve

# Serve Group Income app from extracted directory
chel serve ./gi-v2.0.0

# Serve with custom ports and SQLite database
chel serve --dashboard-port 8888 --port 8000 ./my-app
```

**What happens during startup:**
1. **Contract Discovery** - Scans `contracts/<name>/<version>/` directories
2. **Manifest Collection** - Finds all `.manifest.json` files
3. **Database Preloading** - Deploys all contracts with content-addressed storage
4. **Server Startup** - Starts dashboard and application servers
5. **Ready for Development** - All historical contracts available for message processing

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

--dashboard-port <port>    set dashboard port (default: 8888)
--port           <port>    set application port (default: 8000)
```

**Example:**
```bash
# Serve Group Income app from extracted directory
chel serve ./gi-v2.0.0

# Serve with custom ports and SQLite database
chel serve --dashboard-port 8888 --port 8000 ./my-app
```

The serve command will:
- Start a dashboard server (default: http://localhost:8888)
- Start an application server (default: http://localhost:8000)
- Serve static assets and handle API routes
- Support different database backends (memory, filesystem, SQLite, Redis)

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
cp -r path/to/contracts/* test/assets/ && ls ./test/assets/*-slim.js | sed -En 's/.*\/(.*)-slim.js/\1/p' | xargs -I {} ./src/main.ts manifest --out=test/assets/{}.manifest.json --slim test/assets/{}-slim.js key.json test/assets/{}.js && ls ./test/assets/*.manifest.json | xargs ./src/main.ts deploy http://127.0.0.1:8888
```

### `chel migrate`

Performs a non-destructive migration from one backend (`--from`) to another
one (`--to`). For example, this can be used to migrate from the `fs` backend to
the `sqlite` backend.

Since some backends may require additional configuration, `chel migrate` allows
for specifying additional options for these backends with the `--from-config`
and `--to-config` options.

By default, the general `chel` configuration will be used both for the `--from`
and `--to` backends (such as the values given in `chel.toml`). However, if
`--from-config` or `--to-config` are specified, those will take precedence.

The configuration files for `--from-config` and `--to-config` follow the same
syntax and structure as `chel.toml`. This makes it easy to migrate to a new
backend by writing a new `chel.toml` for that backend.

#### Examples

```sh
# Migrate from sqlite to redis using default values (possibly overridden in chel.toml)
chel migrate --from sqlite --to redis
```

```sh
# Migrate from sqlite to redis using default values (possibly overridden in chel.toml)
# for redis and the configuration in sqlite.toml for sqlite
chel migrate --from sqlite --from-config sqlite.toml --to redis
```

```sh
# Migrate from sqlite to redis using default values (possibly overridden in chel.toml)
# for sqlite and the configuration in redis.toml for redis
chel migrate --from sqlite --to redis --to-config redis.toml
```

```sh
# Migrate from sqlite to redis using the configuration in sqlite.toml for sqlite
# and the configuration in redis.toml for redis
chel migrate --from sqlite --from-config sqlite.toml --to redis --to-config redis.toml
```

## History

See [HISTORY.md](HISTORY.md)

## License

[AGPL-3.0](LICENSE)

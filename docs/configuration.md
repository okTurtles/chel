# Configuration

chel uses two files for two different things. `chel.toml` configures the
`chel` command itself, and `chelonia.json` describes your app's contracts.

## chel.toml

`chel.toml` configures the `chel` command at runtime: things like the
server's host and ports, the database backend and the signup limits.

By default, `chel` reads `./chel.toml`. To use another file, pass its path
with `--config`:

```bash
chel serve --config data/chel.toml dist
```

Each setting comes from the first of these that has it:

1. an environment variable
2. a command-line flag
3. `chel.toml`
4. the built-in default

Environment variables use the setting's path with `__` between the parts.
Their values are parsed, so numbers and booleans work:

```bash
server__port=9000 server__signup__disabled=true chel serve dist
```

`chel init` writes a starting file with a fresh `server_id` and the default
settings, the less common ones as comments.

The commands that read the file (`deploy`, `eventsAfter`, `get`, `migrate`,
`pin`, `serve` and `upload`) check it when they start. An unknown key is a
warning, often with the name it looks like, since it is usually a typo. A
value of the wrong type or shape is an error. A missing `./chel.toml` is fine,
and the defaults apply, but a missing `--config` file is an error.

```toml
# Example chel.toml
server_id = "..."  # written by chel init

[server]
host = "0.0.0.0"
port = 8000
dashboardPort = 8888
# The dashboard listens on this machine only, unless you change this
dashboardListenIP = "127.0.0.1"
# The dashboard shows no data until this is set to a long, random password
# dashboardAdminPassword = "..."

[server.vapid]
email = "admin@example.com"

[database]
backend = "sqlite"

# Signup size cap and the billing free tier; see
# signup-and-billing.md.
# [server.signup]
# maxFirstMessageBytes = 8192
#
# [server.billing]
# freeAllowanceBytes = 10485760
```

### Database backends

`database.backend` sets where chel keeps its data. Each backend takes its
options from its own table, `[database.backendOptions.<backend>]`.

| backend | options |
| --- | --- |
| `mem` (default) | none. Everything is kept in memory, and lost when chel stops |
| `fs` | `dirname` (default `data`): the folder with one file per entry. `depth` and `keyChunkLength` spread the files over subfolders named after parts of their keys, and `skipFsCaseSensitivityCheck` skips the startup check that the folder is on a case-sensitive filesystem |
| `sqlite` | `filepath` (default `data/chelonia.db`) |
| `redis` | `url`, starting with `redis://` or `rediss://` |
| `router` | sends keys to other backends by prefix: each prefix maps to `{ name, options }`, and an entry for `*` takes every other key |

With any backend but `mem`, `database.lruNumItems` (default `10000`) sets how
many entries the in-memory cache in front of it holds.

## chelonia.json

`chelonia.json` is an **app-level properties file** that describes which
contracts make up the application and their pinned versions. It is **not**
runtime configuration for `chel`. Instead, it is:

- **Created and updated** by `chel pin` when pinning contracts to specific
  versions.
- **Read by the server** (`chel serve`) at startup, which sends every client
  that connects the app's version and the version of each contract.

The file contains a `contracts` object keyed by the full contract name
(e.g. `gi.contracts/chatroom`), where each entry has:

| Field | Description |
|-------|-------------|
| `version` | The pinned version string for this contract |
| `path` | Relative path to the manifest file in the `contracts/` directory |

It may also contain an `appVersion` field for the overall application version.
`chel pin` does not write it.

**Example:**
```json
{
  "appVersion": "2.0.0",
  "contracts": {
    "gi.contracts/chatroom": {
      "version": "2.0.6",
      "path": "contracts/gi.contracts_chatroom/2.0.6/chatroom.2.0.6.manifest.json"
    },
    "gi.contracts/group": {
      "version": "2.0.0",
      "path": "contracts/gi.contracts_group/2.0.0/group.2.0.0.manifest.json"
    }
  }
}
```

`chel pin` writes `chelonia.json` in the current folder, but `chel serve`
looks for it in the app folder, unless `--app-manifest` (or `appManifest` in
`chel.toml`) points somewhere else. So when the app is in a subfolder, as in
`chel serve dist`, pass `--app-manifest chelonia.json`. Without it, the server
logs a warning and clients get no version information.

**Summary of differences:**

| | `chel.toml` | `chelonia.json` |
|---|---|---|
| **Purpose** | Runtime configuration of the `chel` CLI | App properties (e.g., contract versions) |
| **Managed by** | Manually by the developer / system administrator | Automatically by `chel pin` |
| **Read by** | `chel` commands (via `nconf`) | The server (at startup), values sent to clients |
| **Format** | TOML | JSON |
| **Example content** | Database configuration | Contract versions |

# HISTORY

### v3.3.0

- `chel eventsAfter` now accepts `--keys <file>` to decrypt encrypted events
  using a JSON map of secret keys (e.g. dumped from a `libcheloniajs` app's
  `rootState.secretKeys`).
- `chelonia.json` now reports `appVersion` and `contractsVersion`, see `Configuration Files`
  in README.md for details
- Hapi integration replaced by Hono

### v3.2.1

- Exit when finished by @corrideat in https://github.com/okTurtles/chel/pull/107
- Fix data corruption by @corrideat in https://github.com/okTurtles/chel/pull/109
- Change config format and update docs by @corrideat in https://github.com/okTurtles/chel/pull/110
- Add DB schema validation by @corrideat in https://github.com/okTurtles/chel/pull/111
- Fix tests on macOS by @corrideat in https://github.com/okTurtles/chel/pull/115
- Bump the npm_and_yarn group across 1 directory with 2 updates by @dependabot[bot] in https://github.com/okTurtles/chel/pull/119
- Fix manifest version by @corrideat in https://github.com/okTurtles/chel/pull/126

### v3.2.0

- Adds `chel pin` command by @corrideat and @akhileshthite in https://github.com/okTurtles/chel/pull/91
- `chel serve` now has `--dir` and `--dev` options
- Reduces size of the `chel` binary and fixed an sqlite issue by using `serdes` between the workers and main process
- Fixed a bug related to searching index on the server
- Fixed bug preventing `sqlite` from being used by `chel serve`

### v3.1.0

- `chel serve` now serves apps (thx @akhileshthite and @corrideat)
- `chel migrate` now migrates the database from one backend to another
- adds full Redis database backend support (thx @corrideat)
- configuration now powered by `nconf` via `chel.toml` (thx @corrideat)
- `npx` replaced with `deno` (thx @taoeffect)
- `axios` replaced with `fetch` (thx @harshjainh2j)
- SASS deprecation warnings removed (thx @SebinSong)

### v3.0.0

- Breaking change: sses new Shelter Protocol CIDs to be able to identify hashes for manifests, contracts, events, and files.

### v2.2.3

- Use `/dev-file` for file upload to URL endpoint on `deploy`

### v2.2.2

- Add arm64 support for Linux platforms.

### v2.2.1

- Restore `bin/chel` (fixes broken install). See [issue #37](https://github.com/okTurtles/chel/issues/37) for more details and if you'd like to help with this.

### v2.2.0

- Add a `name` field to the manifest with the contract's name
- Updated `eventsAfter` API to support latest changes related to use of height and streaming

### v2.1.1

- Change the way signing key files are read (from `import` to `readFile`) so that `chel manifest` works.

### v2.1.0

- Implemented signing (`chel manifest`, `chel keygen`) and verified (`chel verifySignature`) contracts. (h/t [@corrideat](https://github.com/okTurtles/chel/pull/27))

### v2.0.1

(Though breaking change, doesn't affect anyone.)

- multicode RAW changed from `0x55` to `0x00`
- use multicode RAW for all files, including json files

### v2.0.0

Breaking changes: hash format is now different (correct representation for `blake2b-256` and uses [CIDs](https://github.com/multiformats/cid)).

- Rename eventsSince to eventsAfter (h/t [@snowteamer](https://github.com/okTurtles/chel/pull/15))
- Add chel get command  (h/t [@snowteamer](https://github.com/okTurtles/chel/pull/16))
- Use CIDs for content addressing rather than plain hashes (h/t [@snowteamer](https://github.com/okTurtles/chel/pull/21))
- Native ARM binary for M-series macs.

### v1.2.1, v1.2.2

- Restore `bin/chel`

### v1.2.0

- `chel deploy` and `chel upload` now accept an SQLite database file as destination. (PR [#5](https://github.com/okTurtles/chel/pull/5) via [@snowteamer](https://github.com/snowteamer))
- `chel migrate` + pinned esm.sh dependencies. (PR [#7](https://github.com/okTurtles/chel/pull/7) via [@snowteamer](https://github.com/snowteamer))
- `chel eventsSince` implemented. (PR [#9](https://github.com/okTurtles/chel/pull/9) via [@snowteamer](https://github.com/snowteamer))
- Drop net perms. (PR [#10](https://github.com/okTurtles/chel/pull/10) via [@snowteamer](https://github.com/snowteamer))

### v1.1.3

- Fixed install issue on Apple Silicon

### v1.1.2

- Fixed errors related to `import()` usage.

### v1.1.1

- BREAKING (but nobody is using this right now so it's OK): by default `manifest` saves manifest next to the contract file instead of in CWD.

### v1.1.0

- `upload` and `deploy` support using directory as destination.

### v1.0.8

- First correctly functioning installation.

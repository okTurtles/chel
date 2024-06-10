# HISTORY

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

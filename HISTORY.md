# HISTORY

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

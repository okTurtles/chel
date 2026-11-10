# Distributing chel

How chel is built, packaged and published to npm. The list of supported
platforms is in the [README](../README.md#supported-platforms).

## Publishing a release

Steps to publish a new release of `@chelonia/cli` to npm:

1. **Login to npm** (prerequisite):

   ```bash
   npm login
   ```

   If your account uses 2FA, `npm publish` may prompt for authentication.
   Do not rely on `--otp=<code>`: a TOTP code entered at the start of the
   release may well have expired by the time the first sub-package is
   published. Complete the browser-based authentication flow when prompted,
   or use a granular automation token instead.

2. **Bump the version:**

   ```bash
   npm version patch   # or minor / major
   ```

   This triggers the `version` lifecycle hook, which runs *after* the version
   is bumped but *before* `npm version` commits and tags. The hook:
   - Runs `deno task sync-versions` to update `optionalDependencies` in
     `package.json` so they match the new version (and stages the change)
   - Runs `deno task build` to rebuild the JS bundle (stamped with the new
     version in `build/version.json`) and the dashboard
   - Stages the rebuilt `build/` artifacts

   As a result, the version commit and tag contain the up-to-date bundle and
   the working directory stays clean. The publish step verifies that what it
   ships is exactly this committed bundle and refuses to run otherwise.
   This also guarantees the maintainer rebuilds the bundle on `master`
   (merged PRs can each produce a correct bundle individually, yet the
   combined result on `master` may still differ).

3. **Build the release artifacts** (the tarballs for the GitHub release):

   ```bash
   deno task dist
   git diff --exit-code -- build   # fails if the rebuild diverged from the tag
   ```

   This lints, rebuilds the bundle, compiles one native binary per supported
   platform, and packs each one into `dist/chel-v<version>-<target>.tar.gz`,
   printing SHA256 checksums.

   The `git diff --exit-code -- build` afterwards confirms the rebuild is
   byte-identical to the version commit, i.e. that the build is reproducible.
   It also has to pass before publishing, since the next step requires a clean
   `build/`. If it fails, do not publish: investigate the divergence first.

4. **Publish:**

   ```bash
   npm publish --access public
   ```

   This triggers the `prepublishOnly` hook, which runs `deno task publish`.
   That script:
   - Verifies that the committed bundle matches `package.json` (via
     `build/version.json`) and that the working tree is clean for `build/`
     and `package.json`, refusing to publish otherwise
   - Reuses the native binaries from step 3 instead of compiling its own
     copies, so a release compiles each binary once and npm and GitHub are
     guaranteed to ship identical bytes. If a binary is missing, or was built
     from a different bundle, it is compiled here instead. Publishing without
     step 3 works, it just takes several minutes longer
   - Creates and publishes a platform sub-package (`@chelonia/cli-<arch>-<os>`) for each target
   - Reconciles `optionalDependencies` as a final safety check

   After the sub-packages are published, `npm publish` proceeds to publish the
   main `@chelonia/cli` package, whose `optionalDependencies` now point to the
   freshly published sub-packages.

5. **Push the version commit and tag:**

   ```bash
   git push && git push --tags
   ```

## Build caching

Compiling the five native binaries is by far the slowest part of a release, so
the tarballs and the npm sub-packages share one set of them, kept under the
gitignored `dist/` directory. `deno task dist` remains usable on its own, at
any time, to produce the tarballs without publishing anything.

The cache operates on content, not on timestamps. When the bundle, the Deno
version, or a compile flag changes, `deno task dist` compiles the binaries
again. When nothing changes, it does no compile work. To compile all binaries
again, set `CHEL_FORCE_COMPILE=1` or delete `dist/`.

To check that a compiled binary loads its SQLite addon, run
`CHEL_SMOKE_COMPILE=1 deno task smoke`. This test compiles a binary and is
therefore not part of `deno task test`.

## How the npm packages work

The `chel` command itself is always provided by the main `@chelonia/cli`
package, which ships a small launcher that spawns the native binary from the
sub-package npm selected. The sub-packages intentionally declare no command of
their own: if they did, they would compete with the main package for the same
`chel` entry in `node_modules/.bin`, and npm would end up wiring `chel` to a
bare platform binary (or to nothing at all when the main package is the project
root). Because npm therefore never adjusts the binary's permissions at install
time, the executable bit is baked into the published sub-package instead.

This layout is verified against npm 10, pnpm (both its isolated and hoisted
layouts), Yarn 1, and Yarn 4 (both Plug'n'Play and `node-modules`), for local
and global installs. The launcher's exit codes are listed in the
[README](../README.md#supported-platforms).

## Linux on musl

The Linux binaries are linked against glibc, so Linux distributions built on
musl libc (Alpine, for example) are **not** covered: the native SQLite addon
each Linux binary carries is the glibc build for its platform. Running `chel`
from source with Deno works there instead. Only the SQLite backend is affected,
and selecting it on such a system fails with a message saying so rather than
with a raw loader or missing-module error.

From source, nothing has to be compiled locally: the SQLite driver ships musl
prebuilds (`prebuilds/linuxmusl-<arch>.node`) next to the glibc ones, and its
resolver chooses between them by asking Node whether the process is running
against glibc. Deno hardcoded a glibc version into that answer until Deno
2.8.0 ([denoland/deno#33948](https://github.com/denoland/deno/issues/33948)),
so older versions pick the glibc prebuild on musl and then fail inside the
dynamic loader.

On Deno 2.8.0 or newer this works out of the box. On anything older, either
upgrade Deno or patch `node_modules/better-sqlite3/lib/binding.js` so that
`isLinuxMusl` always returns `true`. Compiling the addon from its C sources
(`npm run build-release`) does **not** help: the resolver returns a matching
prebuild before it ever looks at a locally built copy.

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
   is bumped but *before* `npm version` commits and tags. The hook runs
   `deno task sync-versions`, which updates `optionalDependencies` in
   `package.json` to the new version, and stages `package.json`.

   `build/` is gitignored, so the version commit and tag contain only the
   source. The next two steps each build the bundle from it.

3. **Build the release artifacts** (the tarballs for the GitHub release):

   ```bash
   deno task dist
   ```

   This lints, builds `build/` from scratch, compiles one native binary per
   supported platform, and packs each one into
   `dist/chel-v<version>-<target>.tar.gz`, printing SHA256 checksums.

4. **Publish:**

   ```bash
   npm publish --access public
   ```

   This triggers the `prepublishOnly` hook, which runs `deno task publish`.
   That script:
   - Refuses to publish unless `HEAD` is the commit that the `v<version>`
     tag points to and no tracked file differs from it (stash or discard such
     changes first). To publish a fix committed after `npm version`, first
     move the tag to it with `git tag -f v<version>`. It then builds `build/`
     from scratch, so the binaries embed exactly what the tag contains
   - Reuses the native binaries from step 3 instead of compiling its own
     copies: the build is reproducible, so the rebuild matches the bundle
     that step 3 compiled, and npm and GitHub ship identical bytes. If a
     binary is missing, or was built from a different bundle, it is compiled
     here instead. Publishing without step 3 works, it just takes several
     minutes longer. If a tarball of this version in `dist/` was packed from
     a different build (for example, step 3 ran with uncommitted changes),
     it stops before it compiles or publishes anything. Then run step 3
     again, or delete the tarballs to publish without them. If it stops
     again after step 3, the build is not reproducible: investigate that first
   - Creates and publishes a platform sub-package (`@chelonia/cli-<arch>-<os>`) for each target
   - Reconciles `optionalDependencies` as a final safety check

   After the sub-packages are published, `npm publish` proceeds to publish the
   main `@chelonia/cli` package, whose `optionalDependencies` now point to the
   freshly published sub-packages.

5. **Push the version commit and tag:**

   ```bash
   git push && git push --tags
   ```

   The tag push starts the [build audit](#build-audit).

## Build audit

When a `v*` tag is pushed, `.github/workflows/build-review.yml` audits the
build of that release. It calls the reusable workflow `build-review-crush.yml`
of [okTurtles/libcheloniajs](https://github.com/okTurtles/libcheloniajs/blob/main/.github/workflows/build-review-crush.yml)
from its `main` branch, whose header describes the audit in full. The job
builds the tag and the previous `v*` tag in a sandbox without network, diffs
the two `build/` dirs, and has crush review the diff with the code-review
skill. The job fails when the review finds code that the source changes do not
explain, or when the review cannot finish. The review is in the job summary and
in the `build-review-<tag>` artifact. Nothing is posted to GitHub.

The audit needs these repository settings (Settings → Secrets and variables →
Actions):

- The secret with the API key of the review provider: `OPENROUTER_API_KEY`
  (the default provider), `ZAI_API_KEY` or `KIMI_API_KEY`.
- Optional variables: `REVIEW_PROVIDER`, `REVIEW_MODEL` and `PROJECT_CTX`,
  which the PR review also uses, and `BUILD_REVIEW_TIMEOUT_MINUTES` (default
  60).

To run the audit again, for example after a provider error, run the Build
Review workflow by hand with the tag and, if needed, the tag to compare with:

```bash
gh workflow run build-review.yml -f tag=v3.6.0 -f base-tag=v3.5.0
```

Tags before v3.4.1 do not build from an empty `build/`, so the audit cannot
use them as either tag.

Limits:

- The audit vets the build that CI makes. The binaries on npm and in the
  GitHub release embed the build made on the maintainer's machine, which the
  audit does not compare with its own.
- Each release is compared only with the previous one, whose build the audit
  trusts.
- The fonts in `build/dist-dashboard/assets/fonts/` are not reviewed. The
  workflow checks that each one equals a font file in git.

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

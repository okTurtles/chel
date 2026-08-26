// Shared build artifact paths. Kept dependency-free so every build script
// (including the Node-flavored dashboard build) can import them without
// dragging in the rest of the toolchain.
//
// NOTE: package.json's "version" script runs `git add build/`, which stages
// every path below; if an artifact ever moves outside build/, update it.

export const BUILD_DIR = 'build'
export const BUNDLE_PATH = `${BUILD_DIR}/main.js`
export const SERVE_DIR = `${BUILD_DIR}/serve`
export const VERSION_STAMP_PATH = `${BUILD_DIR}/version.json`
export const DASHBOARD_DIR = `${BUILD_DIR}/dist-dashboard`

// Release artifacts. Everything below lives under the gitignored `dist/`, and
// is shared by the two consumers of the native binaries: the release tarballs
// (scripts/compile.ts) and the npm platform sub-packages (scripts/publish.ts).
//
// `BIN_DIR` is the single place a compiled binary is written to. Both
// consumers read from it instead of compiling their own copy, so a release
// runs `deno compile` once per target rather than twice.
export const DIST_DIR = 'dist'
export const BIN_DIR = `${DIST_DIR}/bin`
// Freshness records for the cached artifacts. Deliberately outside BIN_DIR so
// that archiving `BIN_DIR/<target>` cannot sweep them into a release tarball.
export const STAMP_DIR = `${DIST_DIR}/.stamps`

// npm packages that ship a native addon, and the subpaths of each that a
// release actually needs. Declared here, in the dependency-free module, because
// two unrelated build steps consume the same list and must not drift: the
// bundler keeps these packages external (scripts/build.ts) and the compiler
// embeds the subpaths below as data (nativeAddonPaths in scripts/targets.ts).
// Getting only the first half right yields a bundle that imports an addon the
// released binary does not contain.
//
// The subpaths follow the prebuildify layout better-sqlite3 uses: `lib/` is the
// JavaScript, `package.json` is what makes the directory resolvable as a
// package, and `prebuilds/` holds one `.node` binary per platform. Anything
// else the package ships (for better-sqlite3, ~10 MB of C sources for building
// from source) is deliberately left out.
//
// `prebuilds/` is deliberately NOT embedded wholesale: a binary can only ever
// load the addon built for the platform it runs on, so each compile target gets
// exactly one `.node` file (14.8 MB saved per binary). `prebuild(os, cpu)` must
// mirror the convention better-sqlite3 resolves at runtime,
// `prebuilds/${process.platform}-${process.arch}.node` (see its
// `lib/binding.js`); `Target.os`/`Target.cpu` are precisely those two values.
//
// Not covered by the mapping: better-sqlite3 also ships `linuxmusl-*.node`
// variants, selected when the process report exposes no glibc version. No
// binary we ship can select them, because `deno compile` has no musl target
// and the runtime it embeds is glibc-linked either way. Note that the reason
// is the absent target, not the detection: Deno used to hardcode a glibc
// version into the process report (denoland/deno#33948, fixed in 2.8.0), so a
// binary compiled with 2.8.0 or newer does ask for a musl prebuild when run on
// musl, and gets the \"no addon\" error from src/serve/database-sqlite.ts
// rather than a glibc addon the loader cannot use. If a musl target ever
// appears, adding the variant back must stay a one-line change here.
export const NATIVE_ADDON_PACKAGES: readonly {
  name: string
  sharedPaths: readonly string[]
  prebuild: (os: string, cpu: string) => string
}[] = [
  {
    name: 'better-sqlite3',
    sharedPaths: ['package.json', 'lib'],
    prebuild: (os, cpu) => `prebuilds/${os}-${cpu}.node`
  }
] as const

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
// embeds the subpaths below as data (NATIVE_ADDON_PATHS in scripts/targets.ts).
// Getting only the first half right yields a bundle that imports an addon the
// released binary does not contain.
//
// The subpaths follow the prebuildify layout better-sqlite3 uses: `lib/` is the
// JavaScript, `prebuilds/` the per-platform `.node` binaries, and
// `package.json` is what makes the directory resolvable as a package. Anything
// else the package ships (for better-sqlite3, ~10 MB of C sources for building
// from source) is deliberately left out.
export const NATIVE_ADDON_PACKAGES: readonly {
  name: string
  paths: readonly string[]
}[] = [
  { name: 'better-sqlite3', paths: ['package.json', 'lib', 'prebuilds'] }
] as const

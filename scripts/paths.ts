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

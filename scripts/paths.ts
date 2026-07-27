// Shared build artifact paths. Kept dependency-free so every build script
// (including the Node-flavored dashboard build) can import them without
// dragging in the rest of the toolchain.
//
// NOTE: package.json's "version" script lists these same paths in its
// `git add` invocation; keep the two in sync if they ever change.

export const BUILD_DIR = 'build'
export const BUNDLE_PATH = `${BUILD_DIR}/main.js`
export const SERVE_DIR = `${BUILD_DIR}/serve`
export const VERSION_STAMP_PATH = `${BUILD_DIR}/version.json`
export const DASHBOARD_DIR = `${BUILD_DIR}/dist-dashboard`

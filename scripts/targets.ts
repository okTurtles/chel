// Shared compilation target metadata and `deno compile` invocation.
//
// Consumed through `scripts/binaries.ts` by both `scripts/compile.ts` (release
// tarballs) and `scripts/publish.ts` (npm sub-packages), so that the set of
// targets, permission flags, and --include paths cannot drift between the two.

import { shell } from '~/utils.ts'
import { BUNDLE_PATH, SERVE_DIR, DASHBOARD_DIR, NATIVE_ADDON_PACKAGES } from './paths.ts'

export interface Target {
  // `deno compile --target` value
  denoTarget: string
  // npm platform identifiers (`process.platform` / `process.arch`)
  os: string
  cpu: string
  // resulting binary filename
  binary: string
}

// The set of OS/CPU combinations compiled into a sub-package.
//
// NOTE on coverage: the root package.json's `os` and `cpu` arrays are
// independent, so npm treats their full cross-product as supported. TARGETS
// below deliberately omits `win32 + arm64` (no sub-package is published for
// it). On a Windows ARM machine the root package still installs (win32 and
// arm64 are both individually allowed), but no `chel` binary is linked —
// the install succeeds and the missing command only surfaces at runtime.
// If/when Deno ships a stable `aarch64-pc-windows-msvc` target, add it here
// to close the gap; otherwise adjust the root `os`/`cpu` to exclude it.
export const TARGETS: readonly Target[] = [
  { denoTarget: 'x86_64-unknown-linux-gnu', os: 'linux', cpu: 'x64', binary: 'chel' },
  { denoTarget: 'aarch64-unknown-linux-gnu', os: 'linux', cpu: 'arm64', binary: 'chel' },
  { denoTarget: 'x86_64-pc-windows-msvc', os: 'win32', cpu: 'x64', binary: 'chel.exe' },
  { denoTarget: 'x86_64-apple-darwin', os: 'darwin', cpu: 'x64', binary: 'chel' },
  { denoTarget: 'aarch64-apple-darwin', os: 'darwin', cpu: 'arm64', binary: 'chel' }
] as const

// Namespace prefix for the platform sub-packages derived from TARGETS.
// Used both to construct sub-package names (subPackageName) and to identify
// which optionalDependencies keys we own (isCliSubPackage), so the prefix
// string lives in exactly one place.
const CLI_SUBPACKAGE_PREFIX = '@chelonia/cli-'

export function subPackageName (t: Target): string {
  return `${CLI_SUBPACKAGE_PREFIX}${t.cpu}-${t.os}`
}

// Field under which a sub-package advertises its binary's filename.
//
// Sub-packages must NOT use `bin` for this. npm links the `bin` entries of
// every package in the tree into the same `node_modules/.bin` directory, so a
// sub-package claiming the name `chel` competes with the root package's
// launcher for that link: whichever is linked last wins, and on npm 10 that is
// frequently the sub-package, leaving `.bin/chel` pointing at a native binary
// whose sibling packages were never checked (and, on install failures, a
// dangling link). Publishing the filename under a field npm ignores keeps
// `chel` owned solely by the root package while still letting bin/chel.js find
// the executable. `directories.bin` is likewise unusable: npm expands it into
// `bin` entries.
export const BINARY_FIELD = 'chelBinary'

// Mode the native binaries are published with. Shared by the compile step and
// the sub-package staging step so the two cannot drift; both need it because
// the executable bit has to be present in the published tarball itself (see
// BINARY_FIELD for why npm never sets it for us).
export const EXEC_MODE = 0o755

// Subset of the root package.json that sub-packages inherit metadata from.
export interface RootPackageMeta {
  version: string
  description: string
  repository: unknown
  author: string
  license: string
}

// The complete package.json contents for `target`'s sub-package. Shared with
// the tests so the "no bin field" invariant is pinned rather than assumed.
export function subPackageManifest (
  target: Target,
  rootPkg: RootPackageMeta
): Record<string, unknown> {
  return {
    name: subPackageName(target),
    version: rootPkg.version,
    description: `${rootPkg.description} (${target.os}/${target.cpu})`,
    repository: rootPkg.repository,
    author: rootPkg.author,
    license: rootPkg.license,
    os: [target.os],
    cpu: [target.cpu],
    files: [target.binary, 'LICENSE'],
    // Yarn's Plug'n'Play keeps packages zipped by default, which would leave
    // the launcher with no executable to spawn. Since npm no longer unpacks
    // this package on our behalf via `bin`, ask for it explicitly.
    preferUnplugged: true,
    [BINARY_FIELD]: target.binary
  }
}

export function subPackageDir (t: Target): string {
  return `dist/cli-${t.cpu}-${t.os}`
}

export function isCliSubPackage (name: string): boolean {
  return name.startsWith(CLI_SUBPACKAGE_PREFIX)
}

// Files of the npm packages that ship a native addon (currently only
// better-sqlite3, behind the `sqlite` database backend) that `target`'s binary
// has to embed. Such a package cannot be inlined into the JavaScript bundle:
// its `.node` binary has to remain a real file for the runtime to load, so
// `deno compile` embeds these paths as data and the bundle keeps importing the
// package by its bare `npm:` specifier (see scripts/build.ts).
//
// Derived from NATIVE_ADDON_PACKAGES so that the bundler's list of external
// packages and the compiler's list of embedded paths cannot disagree; which
// subpaths a package contributes, and why the rest is left out, is documented
// there. Paths are given through the `node_modules/<name>` symlink so that no
// pinned version number is baked in here.
//
// Per target, not shared: a binary can only load the addon compiled for the
// platform it runs on, so it embeds exactly one `.node` file instead of all
// eight (14.8 MB per binary, ~7.5 MB per compressed tarball).
export function nativeAddonPaths (target: Target): readonly string[] {
  return NATIVE_ADDON_PACKAGES.flatMap(({ name, sharedPaths, prebuild }) => [
    ...sharedPaths.map((p) => `node_modules/${name}/${p}`),
    `node_modules/${name}/${prebuild(target.os, target.cpu)}`
  ])
}

// The union of nativeAddonPaths over every target, de-duplicated: what the
// mtime pinning in scripts/binaries.ts must cover (so that compiling one target
// cannot change the bytes another target embeds) and what the tests assert
// against `node_modules`.
export const ALL_NATIVE_ADDON_PATHS: readonly string[] =
  [...new Set(TARGETS.flatMap(nativeAddonPaths))]

// The `deno compile` permission flags plus the target-independent
// include/exclude paths. Completed per target by compileFlags below.
//
// `--allow-read` (unrestricted) instead of `--allow-read=.` because Deno may
// need to load from its cache at runtime, and the cache path isn't known at
// compile time.
// TODO: fix upstream in Deno, or drop permissions programmatically at runtime.
//
// `--allow-sys` covers `hostname` plus `cpus` and `networkInterfaces`: the
// SQLite backend's native addon inspects the process report on Linux to tell
// glibc and musl builds apart before picking a prebuilt binary, and Deno gates
// that report behind those two extra `sys` scopes. Neither exposes anything the
// unrestricted network access the server already has could not probe.
//
// TODO: narrow this back to `--allow-sys=hostname`. The probe answers a
// question the release already decided at compile time (only the glibc variant
// is embedded, see NATIVE_ADDON_PACKAGES), yet every target pays for it,
// including macOS and Windows and every command that never opens a database.
// better-sqlite3 ships per-platform entrypoints that skip the probe entirely
// (`npm:better-sqlite3/<platform>-<arch>`, i.e. lib/linux-x64.js and friends,
// which bind `require('../prebuilds/linux-x64.node')` directly); importing one
// loads no addon by itself, so the bundle can import all of them and choose at
// runtime. That change also requires scripts/build.ts to keep the subpath
// specifiers external, and must be verified with `CHEL_SMOKE_COMPILE=1 deno
// task smoke`, since only a real compiled binary proves the addon still
// resolves. Until then scripts/targets.test.ts pins these scopes, so they
// cannot widen further without a deliberate edit.
const BASE_COMPILE_FLAGS =
  '--allow-env --allow-ffi --allow-sys=hostname,cpus,networkInterfaces --allow-read ' +
  '--allow-write=./ --allow-net ' +
  '--exclude node_modules ' +
  `--include ./${SERVE_DIR} --include ./${DASHBOARD_DIR}`

// The full flag set for one target. Kept here so the two call sites (the
// release tarballs and the npm sub-packages, both of which go through
// scripts/binaries.ts) cannot diverge, and so the binary cache can fold the
// exact flags a binary was built with into its per-target fingerprint.
//
// `--exclude node_modules` has to precede the `--include` paths: `deno compile`
// applies the exclusion to the npm snapshot it would otherwise embed wholesale,
// and the later, deeper includes add back only what is listed.
//
// `deno compile` embeds the mtime of every file it includes, so the addon paths
// are also what scripts/binaries.ts pins to a fixed timestamp before compiling;
// without that, a fresh `npm install` would silently change the released
// binaries even when nothing about their contents changed. The same paths are
// hashed into the binary cache's fingerprint: upgrading the package changes
// neither the bundle (it keeps the bare `npm:` specifier) nor these paths (they
// carry no version number), so their contents are the only thing that can tell
// the cache a rebuild is due.
export function compileFlags (target: Target): string {
  const includes = nativeAddonPaths(target).map((p) => `--include ./${p}`).join(' ')
  return `${BASE_COMPILE_FLAGS} ${includes}`
}

// The entry-point positional argument to `deno compile`. Kept separate from the
// flags so that flags and positionals can't collide: anything appended to
// compileFlags() stays a flag, and the entry point stays last on the command
// line (appending after it would make `deno compile` treat it as a second
// entry point or silently ignore it).
const ENTRY_POINT = `./${BUNDLE_PATH}`

// Runs a native compilation for `target`, writing the binary to `outputPath`
// (the full path including the binary filename). Prints command output.
//
// The explicit chmod matters for publishing: because sub-packages don't declare
// `bin` (see BINARY_FIELD), npm never fixes the mode at install time, so the
// executable bit has to be present in the published tarball itself. npm's
// packing preserves it; `deno compile` normally sets it, and this makes that a
// guarantee rather than an assumption. Skipped on Windows, which has no
// executable bit.
export async function compileBinary (outputPath: string, target: Target): Promise<void> {
  await shell(
    `deno compile -o ${outputPath} --target ${target.denoTarget} ${compileFlags(target)} ${ENTRY_POINT}`,
    { printOutput: true }
  )
  if (target.os !== 'win32') {
    await Deno.chmod(outputPath, EXEC_MODE)
  }
}

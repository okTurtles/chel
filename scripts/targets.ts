// Shared compilation target metadata and `deno compile` invocation.
//
// Consumed by both `scripts/compile.ts` (local native builds) and
// `scripts/publish.ts` (release sub-packages) so that the set of targets,
// permission flags, and --include paths cannot drift between the two.

import { shell } from '~/utils.ts'
import { BUNDLE_PATH, SERVE_DIR, DASHBOARD_DIR } from './paths.ts'

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

export function subPackageDir (t: Target): string {
  return `dist/cli-${t.cpu}-${t.os}`
}

export function isCliSubPackage (name: string): boolean {
  return name.startsWith(CLI_SUBPACKAGE_PREFIX)
}

// The full `deno compile` permission flag set + static include/exclude paths.
// Kept here so the two call sites (compile.ts, publish.ts) cannot diverge.
//
// `--allow-read` (unrestricted) instead of `--allow-read=.` because Deno may
// need to load from its cache at runtime, and the cache path isn't known at
// compile time.
// TODO: fix upstream in Deno, or drop permissions programmatically at runtime.
const COMPILE_FLAGS =
  '--allow-env --allow-ffi --allow-sys=hostname --allow-read --allow-write=./ --allow-net ' +
  `--exclude node_modules --include ./${SERVE_DIR} --include ./${DASHBOARD_DIR}`

// The entry-point positional argument to `deno compile`. Kept separate from
// COMPILE_FLAGS so that flags and positionals can't collide: anything appended
// to COMPILE_FLAGS stays a flag, and the entry point stays last on the command
// line (appending after it would make `deno compile` treat it as a second
// entry point or silently ignore it).
const ENTRY_POINT = `./${BUNDLE_PATH}`

// Runs a native compilation for `target`, writing the binary to `outputPath`
// (the full path including the binary filename). Prints command output.
export async function compileBinary (outputPath: string, target: Target): Promise<void> {
  await shell(
    `deno compile -o ${outputPath} --target ${target.denoTarget} ${COMPILE_FLAGS} ${ENTRY_POINT}`,
    { printOutput: true }
  )
}

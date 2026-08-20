// Content-addressed cache for the compiled native binaries.
//
// A release needs the same five native binaries twice: once inside the
// GitHub release tarballs (scripts/compile.ts) and once inside the npm
// platform sub-packages (scripts/publish.ts). Compiling them separately meant
// running `deno compile` ten times per release, which is both slow and
// pointless: the inputs are identical, so the outputs are too.
//
// Instead both consumers call `ensureBinaries()`, which compiles into a single
// shared location (`dist/bin/<target>/<binary>`) and skips any target whose
// binary was already built from the exact same inputs. Freshness is decided by
// content, not timestamps: a fingerprint of every file the binary embeds (the
// whole `build/` bundle plus the native-addon paths that target needs, taken
// straight out of `node_modules`, see nativeAddonPaths), plus the Deno version
// and that target's compile flags, is recorded next to the artifact and
// compared on the next run.
//
// The fingerprint is per target, because the binaries no longer share their
// inputs: each embeds only its own platform's `.node` addon. A practical
// upside is that reinstalling the native package invalidates only the targets
// whose own prebuilt addon actually changed.
//
// Consequences worth knowing:
//   - `deno task dist` twice in a row does no compilation the second time
//   - `deno task dist` followed by `npm publish` compiles once in total, and
//     the published binary is byte-identical to the one in the tarball
//   - touching anything under `build/`, reinstalling the native addon,
//     upgrading Deno, or changing the compile flags invalidates the cache
//     automatically
//   - `dist/` is gitignored, so the cache is per-checkout and never shipped
//
// Set CHEL_FORCE_COMPILE=1 to ignore the cache and recompile everything.

import { encodeHex } from 'jsr:@std/encoding/hex'
import { dirname } from 'jsr:@std/path/'
import { BIN_DIR, BUILD_DIR, STAMP_DIR } from './paths.ts'
import {
  ALL_NATIVE_ADDON_PATHS,
  TARGETS,
  compileBinary,
  compileFlags,
  nativeAddonPaths,
  type Target
} from './targets.ts'

// Kinds of cached artifact, each with its own stamp file per target.
export type ArtifactKind = 'bin' | 'tar'

export function binaryDir (target: Target): string {
  return `${BIN_DIR}/${target.denoTarget}`
}

export function binaryPath (target: Target): string {
  return `${binaryDir(target)}/${target.binary}`
}

export function stampPath (kind: ArtifactKind, target: Target): string {
  return `${STAMP_DIR}/${kind}-${target.denoTarget}.json`
}

function isNotFound (e: unknown): boolean {
  return e instanceof Error && e.name === 'NotFound'
}

async function removeIfPresent (path: string): Promise<void> {
  try {
    await Deno.remove(path)
  } catch (e) {
    if (!isNotFound(e)) throw e
  }
}

async function exists (path: string): Promise<boolean> {
  try {
    await Deno.stat(path)
    return true
  } catch (e) {
    if (isNotFound(e)) return false
    throw e
  }
}

// `deno compile` embeds each source file's mtime into the resulting binary,
// which makes consecutive builds produce different output even when the file
// contents are identical. Setting every mtime below `build/` to a fixed value
// (the UNIX epoch) before compiling restores determinism on a given host.
//
// `seen` guards against symlink cycles; callers never pass it.
export async function normalizeMtimes (
  dir: string,
  time: number,
  seen: Set<string> = new Set()
): Promise<void> {
  const entries: Deno.DirEntry[] = []
  try {
    for await (const entry of Deno.readDir(dir)) entries.push(entry)
  } catch (e) {
    if (isNotFound(e)) return
    throw e
  }
  for (const entry of entries) {
    await normalizePathMtimes(`${dir}/${entry.name}`, time, seen)
  }
}

// Same purpose as normalizeMtimes, for an entry that may be either a file or a
// directory: the native-addon paths embedded into the binaries (see
// nativeAddonPaths) mix the two.
//
// Resolves the real path first, because the two things that have to agree here
// both follow symlinks: `Deno.utime` has no `lutime` counterpart, so it always
// stamps the target, and `deno compile --include` embeds the target's bytes
// and mtime. Stamping the link itself is impossible, and skipping links would
// leave a file embedded with whatever mtime a fresh `npm install` gave it,
// which is exactly the non-reproducibility this function exists to prevent.
// It matters in practice: the addon paths deliberately go through the
// version-less `node_modules/<name>` symlink.
//
// A missing path is ignored rather than fatal, so these helpers stay usable
// over arbitrary trees (the tests drive them over temp dirs). A genuinely
// missing native addon is caught up front by assertNativeAddonsPresent.
async function normalizePathMtimes (
  path: string,
  time: number,
  seen: Set<string> = new Set()
): Promise<void> {
  let real: string
  try {
    real = await Deno.realPath(path)
  } catch (e) {
    if (isNotFound(e)) return
    throw e
  }
  if (seen.has(real)) return
  seen.add(real)
  let info: Deno.FileInfo
  try {
    info = await Deno.stat(real)
    await Deno.utime(real, time, time)
  } catch (e) {
    if (isNotFound(e)) return
    throw e
  }
  if (info.isDirectory) {
    await normalizeMtimes(real, time, seen)
  }
}

async function sha256 (bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  return encodeHex(await crypto.subtle.digest('SHA-256', bytes))
}

// `<relative path>\t<sha256 of contents>` for every file under `dir`,
// recursively. Symlinks are followed, for the same reason normalizePathMtimes
// resolves them: `deno compile` embeds what they point at, so that is what has
// to be hashed. The key stays the logical path, so a file keeps its identity
// whether or not the route to it went through a link.
async function fileDigests (
  dir: string,
  prefix = '',
  seen: Set<string> = new Set()
): Promise<string[]> {
  const digests: string[] = []
  for await (const entry of Deno.readDir(dir)) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    digests.push(...await digestsAt(`${dir}/${entry.name}`, rel, seen))
  }
  return digests
}

// Digest lines for one path, which may be a file or a directory, recorded
// under `key`. `seen` holds the real paths of directories already walked, so a
// symlink cycle terminates instead of recursing forever.
async function digestsAt (path: string, key: string, seen: Set<string>): Promise<string[]> {
  let info: Deno.FileInfo
  try {
    info = await Deno.stat(path)
  } catch (e) {
    if (isNotFound(e)) return []
    throw e
  }
  if (!info.isDirectory) {
    return [`${key}\t${await sha256(await Deno.readFile(path))}`]
  }
  const real = await Deno.realPath(path)
  if (seen.has(real)) return []
  seen.add(real)
  return await fileDigests(path, key, seen)
}

// Same as fileDigests, for an embedded input that may be either a file or a
// directory: the native-addon paths mix the two (see nativeAddonPaths). The
// root is used as the digest prefix, so identically named files under two
// different roots cannot collide and moving a file from one root to another
// still invalidates. A missing path contributes nothing, for the reason given
// on normalizePathMtimes.
async function pathDigests (path: string): Promise<string[]> {
  return await digestsAt(path, path, new Set())
}

// Hashes an already-collected set of inputs into a cache key. Split out from
// computeFingerprint so the memoized path below can reuse digests it has
// already computed without changing what the key means.
//
// Joined with NUL because a digest line can contain most other characters.
async function fingerprintOf (
  bundleDigests: readonly string[],
  addonDigests: readonly string[],
  flags: string
): Promise<string> {
  const payload = [
    `deno:${Deno.version.deno}`,
    `flags:${flags}`,
    ...bundleDigests,
    // Prefixed so an addon entry can never collide with a `build/` one.
    ...addonDigests.map((digest) => `addon:${digest}`).sort()
  ].join('\0')
  return await sha256(new TextEncoder().encode(payload))
}

// Identifies the inputs of a `deno compile` run: the bundle contents, the
// embedded native-addon files, the toolchain, and the flags. Two runs sharing a
// fingerprint produce the same binaries, so a cached artifact carrying it can
// be reused as-is.
//
// The addon paths have to be hashed separately from `dir`: they are embedded
// straight out of `node_modules` and are reached through a version-less
// symlink, so neither the bundle (which keeps the bare `npm:` specifier) nor
// the compile flags change when the package is upgraded.
//
// Deliberately pure and unmemoized: it re-reads everything on every call, which
// is what lets the tests drive it over mutating temp dirs. Release code goes
// through targetFingerprint below instead.
export async function computeFingerprint (
  dir: string,
  addonPaths: readonly string[],
  flags: string
): Promise<string> {
  const addons = (await Promise.all(addonPaths.map(pathDigests))).flat()
  return await fingerprintOf((await fileDigests(dir)).sort(), addons, flags)
}

// Memo caches, so that fingerprinting all five targets costs one walk of the
// (multi-megabyte) bundle and one hash per distinct addon path: the shared
// `package.json`/`lib` subpaths are hashed once and reused by every target,
// and only the single per-platform `.node` file differs between them.
let cachedBundleDigests: Promise<string[]> | undefined
const addonDigestCache = new Map<string, Promise<string[]>>()
const targetFingerprints = new Map<string, Promise<string>>()

function cachedPathDigests (path: string): Promise<string[]> {
  let cached = addonDigestCache.get(path)
  if (cached === undefined) {
    cached = pathDigests(path)
    addonDigestCache.set(path, cached)
  }
  return cached
}

// The cache key for `target`'s binary: the shared bundle, the single native
// addon that target embeds, the toolchain, and that target's own compile flags.
// Memoized, so the binary step and the tarball step can both ask for it.
//
// Being per target is what makes embedding only one platform's addon safe: a
// change to one platform's `.node` file invalidates that target alone.
export function targetFingerprint (target: Target): Promise<string> {
  let cached = targetFingerprints.get(target.denoTarget)
  if (cached === undefined) {
    cached = (async () => {
      cachedBundleDigests ??= fileDigests(BUILD_DIR).then((digests) => digests.sort())
      const addons = (await Promise.all(
        nativeAddonPaths(target).map(cachedPathDigests)
      )).flat()
      return await fingerprintOf(await cachedBundleDigests, addons, compileFlags(target))
    })()
    targetFingerprints.set(target.denoTarget, cached)
  }
  return cached
}

// Records the inputs an artifact was produced from. Creates the containing
// directory, so callers never have to.
export async function writeStamp (path: string, fingerprint: string): Promise<void> {
  await Deno.mkdir(dirname(path), { recursive: true })
  await Deno.writeTextFile(path, JSON.stringify({ fingerprint }, null, 2) + '\n')
}

// True iff `artifactPath` exists and was produced from `fingerprint`. Both
// conditions matter: the stamp alone would happily vouch for an artifact that
// was deleted, and the artifact alone says nothing about what produced it.
// Anything unreadable or unparseable counts as stale, never as fresh.
export async function isFresh (
  stampFile: string,
  fingerprint: string,
  artifactPath: string
): Promise<boolean> {
  const force = Deno.env.get('CHEL_FORCE_COMPILE')?.toLowerCase()
  if (force && force !== '0' && force !== 'false') return false
  if (!await exists(artifactPath)) return false
  try {
    const stamp = JSON.parse(await Deno.readTextFile(stampFile))
    return stamp?.fingerprint === fingerprint
  } catch {
    return false
  }
}

// The stamp is deleted before `fn` runs and only written after it returns, so
// an interrupted or failed run leaves the artifact marked stale rather than
// falsely fresh. Shared by every cached artifact, so that invariant lives in
// one place.
async function rebuildWithStamp (
  stampFile: string,
  fingerprint: string,
  fn: () => Promise<void>
): Promise<void> {
  await removeIfPresent(stampFile)
  await fn()
  await writeStamp(stampFile, fingerprint)
}

// Runs `fn` to (re)create `artifactPath` unless a previous run already
// produced it from the same inputs.
export async function ensureArtifact (
  kind: ArtifactKind,
  target: Target,
  artifactPath: string,
  fingerprint: string,
  fn: () => Promise<void>
): Promise<boolean> {
  const stampFile = stampPath(kind, target)
  if (await isFresh(stampFile, fingerprint, artifactPath)) {
    console.log(`Reusing ${artifactPath} (unchanged inputs)`)
    return false
  }
  await rebuildWithStamp(stampFile, fingerprint, fn)
  return true
}

// Fails before any compilation when a file a binary must embed is absent.
//
// `deno compile --include ./missing` does error out, so this is not the only
// thing standing between a missing addon and a shipped binary, but its message
// ("Including /abs/path: No such file or directory") says nothing about what to
// do. The package is not optional either: scripts/build.ts keeps it external,
// so the bundle carries a hard top-level import of it and a binary without the
// addon would be broken rather than merely reduced.
//
// Exported so the failure is testable without running a compile.
export async function assertNativeAddonsPresent (
  paths: readonly string[] = ALL_NATIVE_ADDON_PATHS
): Promise<void> {
  for (const path of paths) {
    if (await exists(path)) continue
    throw new Error(
      `Cannot compile: '${path}' is missing. Every released binary embeds the ` +
      'native SQLite addon, so it has to be installed first. Run `deno task ' +
      'build` (or `deno install`) once to materialise node_modules, and check ' +
      'NATIVE_ADDON_PACKAGES in scripts/paths.ts if the package layout changed.'
    )
  }
}

// Makes sure every target in `targets` has an up-to-date native binary under
// `dist/bin/`, compiling only the ones that are missing or stale. Returns the
// number of binaries actually compiled.
export async function ensureBinaries (targets: readonly Target[] = TARGETS): Promise<number> {
  const stale: Target[] = []
  for (const target of targets) {
    const fingerprint = await targetFingerprint(target)
    if (await isFresh(stampPath('bin', target), fingerprint, binaryPath(target))) {
      console.log(`Reusing ${binaryPath(target)} (unchanged inputs)`)
    } else {
      stale.push(target)
    }
  }
  if (stale.length === 0) return 0

  // Checked only once something has to be compiled, so that a fully cached
  // release (`deno task dist` followed by `deno task publish`) does not need
  // node_modules at all.
  await assertNativeAddonsPresent()
  // Only needed when something is actually compiled, and deliberately done
  // once for all of them: the binaries must be reproducible across targets and
  // across the tarball/sub-package consumers alike.
  await normalizeMtimes(BUILD_DIR, 0)
  // The native addon's files are embedded straight out of node_modules rather
  // than out of build/, so they need the same treatment. Normalized over the
  // union of every target's paths, not just the stale ones', so that which
  // targets happened to be recompiled cannot change the resulting bytes.
  for (const path of ALL_NATIVE_ADDON_PATHS) {
    await normalizePathMtimes(path, 0)
  }
  for (const target of stale) {
    console.log(`\n--- Compiling ${target.denoTarget} ---`)
    await Deno.mkdir(binaryDir(target), { recursive: true })
    await rebuildWithStamp(stampPath('bin', target), await targetFingerprint(target), () =>
      compileBinary(binaryPath(target), target)
    )
  }
  return stale.length
}

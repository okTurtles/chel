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
// whole `build/` bundle), plus the Deno version and the compile flags, is
// recorded next to the artifact and compared on the next run.
//
// Consequences worth knowing:
//   - `deno task dist` twice in a row does no compilation the second time
//   - `deno task dist` followed by `npm publish` compiles once in total, and
//     the published binary is byte-identical to the one in the tarball
//   - touching anything under `build/`, upgrading Deno, or changing the
//     compile flags invalidates the cache automatically
//   - `dist/` is gitignored, so the cache is per-checkout and never shipped
//
// Set CHEL_FORCE_COMPILE=1 to ignore the cache and recompile everything.

import { encodeHex } from 'jsr:@std/encoding/hex'
import { dirname } from 'jsr:@std/path/'
import { BIN_DIR, BUILD_DIR, STAMP_DIR } from './paths.ts'
import { COMPILE_FLAGS, TARGETS, compileBinary, type Target } from './targets.ts'

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
export async function normalizeMtimes (dir: string, time: number): Promise<void> {
  const entries: Deno.DirEntry[] = []
  try {
    for await (const entry of Deno.readDir(dir)) entries.push(entry)
  } catch (e) {
    if (isNotFound(e)) return
    throw e
  }
  for (const entry of entries) {
    // Skip symlinks: Deno.utime follows symlinks (there is no lutime
    // equivalent), so calling it on a symlink would mutate the target's
    // mtime rather than the link's. entry.isDirectory is lstat-based and
    // therefore already false for symlinks, so this guard (not the
    // recursion below) is what prevents the utime side-effect.
    if (entry.isSymlink) continue
    const path = `${dir}/${entry.name}`
    try {
      await Deno.utime(path, time, time)
    } catch (e) {
      if (!isNotFound(e)) throw e
    }
    if (entry.isDirectory) {
      await normalizeMtimes(path, time)
    }
  }
}

async function sha256 (bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  return encodeHex(await crypto.subtle.digest('SHA-256', bytes))
}

// `<relative path>\t<sha256 of contents>` for every regular file under `dir`,
// recursively. Symlinks are skipped for the same reason as in normalizeMtimes:
// what matters is the bytes `deno compile` embeds, and a link's target is
// hashed anyway when it lives inside the tree.
async function fileDigests (dir: string, prefix = ''): Promise<string[]> {
  const digests: string[] = []
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isSymlink) continue
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory) {
      digests.push(...await fileDigests(path, rel))
    } else {
      digests.push(`${rel}\t${await sha256(await Deno.readFile(path))}`)
    }
  }
  return digests
}

// Identifies the inputs of a `deno compile` run: the bundle contents, the
// toolchain, and the flags. Two runs sharing a fingerprint produce the same
// binaries, so a cached artifact carrying it can be reused as-is.
export async function computeFingerprint (dir: string = BUILD_DIR): Promise<string> {
  const payload = [
    `deno:${Deno.version.deno}`,
    `flags:${COMPILE_FLAGS}`,
    ...(await fileDigests(dir)).sort()
  ].join('\n')
  return await sha256(new TextEncoder().encode(payload))
}

// Memoized so the (multi-megabyte) bundle is hashed once per process even
// though both the binary and the tarball steps ask for it.
let cachedFingerprint: string | undefined
export async function bundleFingerprint (): Promise<string> {
  if (cachedFingerprint === undefined) {
    cachedFingerprint = await computeFingerprint()
  }
  return cachedFingerprint
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

// Makes sure every target in `targets` has an up-to-date native binary under
// `dist/bin/`, compiling only the ones that are missing or stale. Returns the
// number of binaries actually compiled.
export async function ensureBinaries (targets: readonly Target[] = TARGETS): Promise<number> {
  const fingerprint = await bundleFingerprint()
  const stale: Target[] = []
  for (const target of targets) {
    if (await isFresh(stampPath('bin', target), fingerprint, binaryPath(target))) {
      console.log(`Reusing ${binaryPath(target)} (unchanged inputs)`)
    } else {
      stale.push(target)
    }
  }
  if (stale.length === 0) return 0

  // Only needed when something is actually compiled, and deliberately done
  // once for all of them: the binaries must be reproducible across targets and
  // across the tarball/sub-package consumers alike.
  await normalizeMtimes(BUILD_DIR, 0)
  for (const target of stale) {
    console.log(`\n--- Compiling ${target.denoTarget} ---`)
    await Deno.mkdir(binaryDir(target), { recursive: true })
    await rebuildWithStamp(stampPath('bin', target), fingerprint, () =>
      compileBinary(binaryPath(target), target)
    )
  }
  return stale.length
}

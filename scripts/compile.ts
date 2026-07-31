#!/usr/bin/env -S deno run --allow-run --allow-read=. --allow-write=./build,./dist

// When: `deno task compile`, and as the last step of `deno task dist`.
//
// Produces the GitHub release tarballs: one reproducible
// `dist/chel-v<version>-<target>.tar.gz` per supported platform, followed by
// their SHA-256 checksums.
//
// The native binaries themselves are not compiled here; they are requested
// from the shared cache in `./binaries.ts`, which is also what the npm
// publish step uses. Running this script before `npm publish` therefore makes
// the release compile each binary once instead of once per consumer, and
// guarantees the bytes shipped to npm are the bytes shipped on GitHub.
// Re-running it is close to free: unchanged targets are neither recompiled
// nor re-archived.

import { encodeHex } from 'jsr:@std/encoding/hex'
import { TARGETS } from './targets.ts'
import { BIN_DIR, DIST_DIR } from './paths.ts'
import {
  bundleFingerprint,
  ensureArtifact,
  ensureBinaries,
  normalizeMtimes
} from './binaries.ts'

// Static import for TS JSON-import-attribute type inference. The path also
// lives in `rootPackagePath()` from `./sync-versions.ts`; keep both in sync.
const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

// Build a reproducible .tar.gz in a single tar invocation. Running tar and gzip
// in one process group (rather than a shell pipeline `tar | gzip > out`) yields
// a single exit code, so a tar failure can't be masked by gzip's success —
// POSIX `/bin/sh` has no `pipefail`. `--use-compress-program=gzip -n -9` passes
// the compressor and its flags as one argv entry; both GNU tar and bsdtar
// (libarchive) split the value into argv, applying gzip's `-n` (omit name+mtime
// header) and `-9` (max compression), both required for byte-identical archives
// on a given host. The owner/group/format/mtime and entry-order guarantees are
// achieved with different flag sets on GNU tar vs bsdtar (the macOS default);
// see buildTarArgs below.

// Detect whether the system `tar` is GNU tar. bsdtar (macOS default) rejects
// GNU-only options such as `--sort=name`, `--owner`, `--group` and `--mtime`.
let cachedIsGnuTar: boolean | undefined
async function isGnuTar (): Promise<boolean> {
  if (cachedIsGnuTar === undefined) {
    const { code, stdout } = await new Deno.Command('tar', {
      args: ['--version'],
      stdout: 'piped',
      stderr: 'null'
    }).output()
    cachedIsGnuTar = code === 0 &&
      new TextDecoder().decode(stdout).includes('GNU tar')
  }
  return cachedIsGnuTar
}

// Recursively collects the files under `root`/`prefix`, returned as paths
// relative to `root`, sorted lexically. Used on the bsdtar path to obtain a
// deterministic entry order without `--sort=name`: the sorted list is passed
// explicitly on the command line, making the archive independent of
// filesystem iteration order.
async function sortedFileList (root: string, prefix: string): Promise<string[]> {
  const files: string[] = []
  for await (const entry of Deno.readDir(`${root}/${prefix}`)) {
    const rel = `${prefix}/${entry.name}`
    if (entry.isDirectory) {
      files.push(...await sortedFileList(root, rel))
    } else {
      files.push(rel)
    }
  }
  return files.sort()
}

async function buildTarArgs (
  srcDir: string,
  archivePath: string,
  entry: string
): Promise<string[]> {
  if (await isGnuTar()) {
    return [
      '-C', srcDir,
      // `--sort=name` is required for reproducibility: it makes the archive
      // independent of filesystem iteration order. GNU-tar-only (>= 1.28);
      // bsdtar and other implementations reject it, hence the fallback below.
      '--sort=name', '--owner=0', '--group=0',
      '--numeric-owner', '--mtime=@0', '--format=ustar',
      '--use-compress-program=gzip -n -9',
      '-cvf', archivePath,
      entry
    ]
  }
  // bsdtar (macOS default) fallback: no `--sort`, `--owner`, `--group` or
  // `--mtime`. Equivalent reproducibility is obtained by:
  //   - pinning mtimes on disk to the epoch before archiving (in place of
  //     `--mtime=@0`)
  //   - passing an explicitly sorted file list (in place of `--sort=name`);
  //     directory entries are omitted from the archive, but extraction still
  //     recreates them
  //   - `--uid 0 --gid 0` (bsdtar's spelling of `--owner=0 --group=0`)
  await normalizeMtimes(srcDir, 0)
  const files = await sortedFileList(srcDir, entry)
  return [
    '-C', srcDir,
    '--uid', '0', '--gid', '0',
    '--numeric-owner', '--format', 'ustar',
    '--use-compress-program=gzip -n -9',
    '-cvf', archivePath,
    ...files
  ]
}

async function reproducibleTarGz (
  srcDir: string,
  archivePath: string,
  entry: string
): Promise<void> {
  try {
    const args = await buildTarArgs(srcDir, archivePath, entry)
    const { code, signal } = await new Deno.Command('tar', {
      args,
      stdout: 'inherit',
      stderr: 'inherit'
    }).output()
    if (code !== 0) {
      throw new Error(`tar exited with code ${code} (signal: ${signal ?? 'none'})`)
    }
  } catch (e) {
    // tar writes the gzip header before validating the entry list, so a failed
    // run can leave a small, valid-looking-but-truncated .tar.gz behind; remove
    // it so a corrupt archive can't masquerade as a valid one.
    try { Deno.removeSync(archivePath) } catch { /* may not have been created */ }
    throw e
  }
}

// Prints SHA-256 checksums for every archive in `dir` whose name starts with
// `prefix`, in `sha256sum`-compatible format (`<hex>  <path>`) so the output
// can be verified with `sha256sum -c` / `shasum -a 256 -c`. Done in-process
// with Web Crypto rather than shelling out, because macOS does not ship
// `sha256sum` (it ships `shasum`), and this keeps `deno task dist` working on
// both platforms without probing for binaries.
async function printSha256Sums (dir: string, prefix: string): Promise<void> {
  const names = Array.from(Deno.readDirSync(dir))
    .filter(e => e.isFile && e.name.startsWith(prefix))
    .map(e => e.name)
    .sort()
  for (const name of names) {
    const digest = await crypto.subtle.digest('SHA-256', await Deno.readFile(`${dir}/${name}`))
    console.log(`${encodeHex(digest)}  ${dir}/${name}`)
  }
}

export async function compile (): Promise<void> {
  await ensureBinaries()
  const fingerprint = await bundleFingerprint()
  for (const target of TARGETS) {
    const { denoTarget } = target
    const archivePath = `${DIST_DIR}/chel-v${version}-${denoTarget}.tar.gz`
    // The archive holds `<target>/<binary>`, so it can be created straight out
    // of the shared binary cache: BIN_DIR is already laid out that way.
    await ensureArtifact('tar', target, archivePath, fingerprint, () =>
      reproducibleTarGz(BIN_DIR, archivePath, denoTarget)
    )
  }
  await printSha256Sums(DIST_DIR, `chel-v${version}-`)
  // TODO: sign the sha256sum! pipe this to gpg and include a link to your GPG key in the release notes!
}

try {
  await compile()
} catch (e) {
  console.error('caught:', e)
  Deno.exit(1)
}

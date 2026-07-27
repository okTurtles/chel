#!/usr/bin/env -S deno run --allow-run --allow-read=. --allow-write=./build,./dist

import { shell, $ } from '~/utils.ts'
import { encodeHex } from 'jsr:@std/encoding/hex'
import { TARGETS, compileBinary } from './targets.ts'

// Static import for TS JSON-import-attribute type inference. The path also
// lives in `rootPackagePath()` from `./sync-versions.ts`; keep both in sync.
const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

// `deno compile` embeds each source file's mtime into the resulting binary,
// which makes consecutive builds produce different output even when the file
// contents are identical. Setting every mtime below `build/` to a fixed value
// (the UNIX epoch) before compiling restores determinism on a given host.
async function normalizeMtimes (dir: string, time: number): Promise<void> {
  const entries: Deno.DirEntry[] = []
  try {
    for await (const entry of Deno.readDir(dir)) entries.push(entry)
  } catch (e) {
    if (e instanceof Error && e.name === 'NotFound') return
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
      if (!(e instanceof Error && e.name === 'NotFound')) throw e
    }
    if (entry.isDirectory) {
      await normalizeMtimes(path, time)
    }
  }
}

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
  target: string,
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
      '-cvf', target,
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
    '--use-compress-program', 'gzip -n -9',
    '-cvf', target,
    ...files
  ]
}

async function reproducibleTarGz (
  srcDir: string,
  target: string,
  entry: string
): Promise<void> {
  try {
    const args = await buildTarArgs(srcDir, target, entry)
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
    try { Deno.removeSync(target) } catch { /* may not have been created */ }
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
  await normalizeMtimes('./build', 0)
  for (const target of TARGETS) {
    const { denoTarget, binary } = target
    const dir = `./dist/tmp/${denoTarget}`
    // note: could also use https://examples.deno.land/temporary-files
    await $(`mkdir -vp ${dir}`)
    await compileBinary(`${dir}/${binary}`, target)
    await reproducibleTarGz('./dist/tmp', `./dist/chel-v${version}-${denoTarget}.tar.gz`, denoTarget)
  }
  await printSha256Sums('dist', `chel-v${version}-`)
  // TODO: sign the sha256sum! pipe this to gpg and include a link to your GPG key in the release notes!
}

let exitCode = 0
try {
  await compile()
} catch (e) {
  console.error('caught:', e)
  exitCode = 1
} finally {
  try {
    await shell('rm -rf ./dist/tmp')
  } catch (e) {
    console.error('cleanup failed:', e)
  }
}
if (exitCode !== 0) Deno.exit(exitCode)

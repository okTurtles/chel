#!/usr/bin/env -S deno run --allow-run --allow-read=. --allow-write=./build,./dist

import { shell, $ } from '~/utils.ts'
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
// on a given host. The remaining flags pin owner/group/format/mtime and sort
// entries by name.
async function reproducibleTarGz (
  srcDir: string,
  target: string,
  entry: string
): Promise<void> {
  try {
    const { code, signal } = await new Deno.Command('tar', {
      args: [
        '-C', srcDir,
        // `--sort=name` is required for reproducibility: it makes the archive
        // independent of filesystem iteration order. Supported by GNU tar and
        // bsdtar/libarchive >= 3.3.0; older/other implementations will reject
        // the unknown option and fail the build.
        '--sort=name', '--owner=0', '--group=0',
        '--numeric-owner', '--mtime=@0', '--format=ustar',
        '--use-compress-program=gzip -n -9',
        '-cvf', target,
        entry
      ],
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
  await $(`sha256sum dist/chel-v${version}-*`)
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

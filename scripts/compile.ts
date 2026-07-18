#!/usr/bin/env -S deno run --allow-run --allow-read=. --allow-write=./build,./dist

import { shell } from '~/utils.ts'

function $ (command: string) {
  return shell(command, { printOutput: true })
}

const { default: { version } } = await import('../package.json', { with: { type: 'json' } })

// `deno compile` embeds each source file's mtime into the resulting binary,
// which makes consecutive builds produce different output even when the file
// contents are identical. Setting every mtime below `build/` to a fixed value
// (the UNIX epoch) before compiling restores determinism on a given host.
async function normalizeMtimes (dir: string, time: number): Promise<void> {
  let entries: Deno.DirEntry[]
  try {
    entries = []
    for await (const entry of Deno.readDir(dir)) entries.push(entry)
  } catch (e) {
    if (e instanceof Error && e.name === 'NotFound') return
    throw e
  }
  for (const entry of entries) {
    // Don't follow links out of build/: Deno.utime follows symlinks (there is
    // no lutime equivalent), and a symlinked directory would otherwise be
    // recursed into via entry.isDirectory, mutating the target's mtime.
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

// Build a reproducible .tar.gz by streaming `tar` into `gzip` via Deno.Command
// rather than a shell pipeline. The flags pin mtime/owner/group/format and
// gzip's `-n` omits the name+mtime header, so two builds on the same host
// produce byte-identical archives.
async function reproducibleTarGz (
  srcDir: string,
  target: string,
  entry: string
): Promise<void> {
  let output: Deno.FsFile | undefined
  let tar: Deno.ChildProcess | undefined
  let gzip: Deno.ChildProcess | undefined
  try {
    // Open the target before spawning anything so a failure here can't leave
    // orphaned child processes blocking on a full pipe (see kill() below).
    output = await Deno.open(target, { create: true, write: true, truncate: true })

    tar = new Deno.Command('tar', {
      args: [
        '-C', srcDir,
        // `--sort=name` is required for reproducibility: it makes the archive
        // independent of filesystem iteration order. Supported by GNU tar and
        // bsdtar/libarchive >= 3.3.0; a host without it would silently produce
        // valid-looking but un-sorted archives.
        '--sort=name', '--owner=0', '--group=0',
        '--numeric-owner', '--mtime=@0', '--format=ustar',
        '-cvf', '-', entry
      ],
      stdout: 'piped',
      stderr: 'inherit'
    }).spawn()

    gzip = new Deno.Command('gzip', {
      args: ['-n', '-9'],
      stdin: 'piped',
      stdout: 'piped',
      stderr: 'inherit'
    }).spawn()

    // Save the pipe promise so we can surface its error at the bottom. The
    // no-op `.catch` only suppresses the unhandled-rejection warning in case
    // we throw before reaching `await pipe` below; the real error is re-thrown
    // by that `await pipe`. If the rejection went unobserved AND gzip died
    // mid-stream, tar would block on a full stdout pipe, `tar.status` would
    // never settle, and the script-level `finally` cleanup could never run.
    const pipe = tar.stdout.pipeTo(gzip.stdin)
    pipe.catch(() => {})

    await gzip.stdout.pipeTo(output.writable)
    const [tarStatus, gzipStatus] = await Promise.all([tar.status, gzip.status])
    if (!tarStatus.success) throw new Error(`tar exited with code ${tarStatus.code}`)
    if (!gzipStatus.success) throw new Error(`gzip exited with code ${gzipStatus.code}`)
    // Awaited last: both processes have exited so this won't hang, and the
    // status errors above are more informative than a broken-pipe error.
    await pipe
  } catch (e) {
    // Kill both children on any error path so neither can outlive this call.
    // Wrapped because kill() throws if the process has already exited; `?.`
    // guards against the spawn itself throwing before assignment.
    try { tar?.kill('SIGKILL') } catch { /* already exited */ }
    try { gzip?.kill('SIGKILL') } catch { /* already exited */ }
    throw e
  } finally {
    // pipeTo closes the WritableStream on success, so close() may throw in
    // the happy path; guard it regardless.
    try { output?.close() } catch { /* already closed by pipeTo */ }
  }
}

export async function compile (): Promise<void> {
  await normalizeMtimes('./build', 0)
  const archs = ['x86_64-unknown-linux-gnu', 'aarch64-unknown-linux-gnu', 'x86_64-pc-windows-msvc', 'x86_64-apple-darwin', 'aarch64-apple-darwin']
  for (const arch of archs) {
    const dir = `./dist/tmp/${arch}`
    const bin = arch.includes('windows') ? 'chel.exe' : 'chel'
    // note: could also use https://examples.deno.land/temporary-files
    await $(`mkdir -vp ${dir}`)
    // --allow-read instead of --allow-read=. needed because Deno might try to
    // load things from the Deno cache, and the location of the cache isn't
    // known at the time the binary is generated.
    // TODO: This should either be fixed in Deno or by programmatically dropping
    // permissions at runtime.
    await $(`deno compile --allow-env --allow-ffi --allow-sys=hostname --allow-read --allow-write=./ --allow-net -o ${dir}/${bin} --target ${arch} --exclude node_modules --include ./build/serve --include ./build/dist-dashboard ./build/main.js`)
    await reproducibleTarGz('./dist/tmp', `./dist/chel-v${version}-${arch}.tar.gz`, arch)
  }
  await $(`sha256sum dist/chel-v${version}-*`)
  // TODO: sign the sha256sum! pipe this to gpg and include a link to your GPG key in the release notes!
}

try {
  await compile()
} catch (e) {
  console.error('caught:', e)
} finally {
  await shell('rm -rf ./dist/tmp')
}

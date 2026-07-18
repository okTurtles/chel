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
  const tar = new Deno.Command('tar', {
    args: [
      '-C', srcDir,
      '--sort=name', '--owner=0', '--group=0',
      '--numeric-owner', '--mtime=@0', '--format=ustar',
      '-cvf', '-', entry
    ],
    stdout: 'piped',
    stderr: 'inherit'
  }).spawn()

  const gzip = new Deno.Command('gzip', {
    args: ['-n', '-9'],
    stdin: 'piped',
    stdout: 'piped',
    stderr: 'inherit'
  }).spawn()

  // Don't swallow pipe errors: if gzip dies mid-stream, tar would otherwise
  // block on a full stdout pipe and `tar.status` would never settle, which
  // would hang the build and prevent the `finally` cleanup below from running.
  const pipe = tar.stdout.pipeTo(gzip.stdin)
  pipe.catch(() => {}) // prevent unhandled rejection if a status check throws first

  const output = await Deno.open(target, { create: true, write: true, truncate: true })
  try {
    await gzip.stdout.pipeTo(output.writable)
  } catch (e) {
    // pipeTo only closes the destination on successful source completion.
    output.close()
    throw e
  }

  const [tarStatus, gzipStatus] = await Promise.all([tar.status, gzip.status])
  if (!tarStatus.success) throw new Error(`tar exited with code ${tarStatus.code}`)
  if (!gzipStatus.success) throw new Error(`gzip exited with code ${gzipStatus.code}`)
  // Awaited last: both processes have exited so this won't hang, and the
  // status errors above are more informative than a broken-pipe error.
  await pipe
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

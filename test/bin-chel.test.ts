import { assertEquals } from 'jsr:@std/assert'

// Ensures ./test/temp exists on a fresh checkout (same pattern as
// sync-versions.test.ts). --allow-write=. in the test task covers it.
await Deno.mkdir('./test/temp', { recursive: true })

const BIN_CHEL = new URL('../bin/chel.js', import.meta.url).pathname

// Determines the sub-package name that bin/chel.js will look for on this
// machine, by asking Node directly (avoids hardcoding arch/platform mappings).
async function currentSubPkgName (): Promise<string> {
  const cmd = new Deno.Command('node', {
    args: ['-e', "process.stdout.write('@chelonia/cli-' + process.arch + '-' + process.platform)"],
    stdin: 'null',
    stdout: 'piped',
    stderr: 'null'
  })
  const { stdout } = await cmd.output()
  return new TextDecoder().decode(stdout)
}

// Creates a fake sub-package under tmpDir whose "binary" is a Node script with
// a shebang, so bin/chel.js can spawn it directly. `binaryScript` is the JS
// body the fake binary runs.
async function setupFakePackage (
  tmpDir: string,
  subPkgName: string,
  binaryScript: string
): Promise<void> {
  const pkgDir = `${tmpDir}/${subPkgName}`
  await Deno.mkdir(pkgDir, { recursive: true })

  await Deno.writeTextFile(
    `${pkgDir}/package.json`,
    JSON.stringify({
      name: subPkgName,
      version: '0.0.0-test',
      bin: { chel: 'fake-chel.js' }
    })
  )

  const binaryPath = `${pkgDir}/fake-chel.js`
  await Deno.writeTextFile(binaryPath, `#!/usr/bin/env node\n${binaryScript}\n`)
  await Deno.chmod(binaryPath, 0o755)
}

// Spawns `node bin/chel.js` with NODE_PATH set so the fake sub-package is
// resolved. Returns the process exit code.
async function runShim (nodePath: string): Promise<number> {
  const cmd = new Deno.Command('node', {
    args: [BIN_CHEL],
    env: { ...Deno.env.toObject(), NODE_PATH: nodePath },
    stdin: 'null',
    stdout: 'null',
    stderr: 'null'
  })
  const output = await cmd.output()
  return output.code
}

Deno.test('bin/chel.js forwards normal exit code from child', async () => {
  const tmpDir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    const name = await currentSubPkgName()
    await setupFakePackage(tmpDir, name, 'process.exit(42)')
    const code = await runShim(tmpDir)
    assertEquals(code, 42)
  } finally {
    await Deno.remove(tmpDir, { recursive: true })
  }
})

Deno.test('bin/chel.js exits 128+signum when child dies by signal', async () => {
  const tmpDir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    const name = await currentSubPkgName()
    await setupFakePackage(tmpDir, name, "process.kill(process.pid, 'SIGTERM')")
    const code = await runShim(tmpDir)
    assertEquals(code, 143) // 128 + 15 (SIGTERM)
  } finally {
    await Deno.remove(tmpDir, { recursive: true })
  }
})

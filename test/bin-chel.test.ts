import { assertEquals, assertStringIncludes } from 'jsr:@std/assert'

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
// body the fake binary runs. The binary is advertised the way real
// sub-packages do it (`chelBinary`, never `bin`) unless `omitBinaryField` asks
// for the pre-`chelBinary` layout, where the shim must fall back to the
// platform's default filename.
async function setupFakePackage (
  tmpDir: string,
  subPkgName: string,
  binaryScript: string,
  { omitBinaryField = false }: { omitBinaryField?: boolean } = {}
): Promise<void> {
  const pkgDir = `${tmpDir}/${subPkgName}`
  await Deno.mkdir(pkgDir, { recursive: true })

  const binaryName = omitBinaryField
    ? (Deno.build.os === 'windows' ? 'chel.exe' : 'chel')
    : 'fake-chel.js'

  await Deno.writeTextFile(
    `${pkgDir}/package.json`,
    JSON.stringify({
      name: subPkgName,
      version: '0.0.0-test',
      ...(omitBinaryField ? {} : { chelBinary: binaryName })
    })
  )

  const binaryPath = `${pkgDir}/${binaryName}`
  await Deno.writeTextFile(binaryPath, `#!/usr/bin/env node\n${binaryScript}\n`)
  await Deno.chmod(binaryPath, 0o755)
}

// Spawns `node bin/chel.js` with NODE_PATH set so the fake sub-package is
// resolved. Returns the process exit code.
async function runShim (nodePath: string): Promise<number> {
  return (await runShimCapturingStderr(nodePath)).code
}

// As runShim, but also returns stderr so error messages can be asserted on.
async function runShimCapturingStderr (
  nodePath: string
): Promise<{ code: number, stderr: string }> {
  const cmd = new Deno.Command('node', {
    args: [BIN_CHEL],
    env: { ...Deno.env.toObject(), NODE_PATH: nodePath },
    stdin: 'null',
    stdout: 'null',
    stderr: 'piped'
  })
  const output = await cmd.output()
  return { code: output.code, stderr: new TextDecoder().decode(output.stderr) }
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

Deno.test('bin/chel.js falls back to the default binary name', async () => {
  const tmpDir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    const name = await currentSubPkgName()
    await setupFakePackage(tmpDir, name, 'process.exit(7)', { omitBinaryField: true })
    const code = await runShim(tmpDir)
    assertEquals(code, 7)
  } finally {
    await Deno.remove(tmpDir, { recursive: true })
  }
})

Deno.test('bin/chel.js reports an unsupported platform without a stack trace', async () => {
  const tmpDir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    // Nothing installed under tmpDir, so the sub-package cannot be resolved.
    const { code, stderr } = await runShimCapturingStderr(tmpDir)
    assertEquals(code, 127)
    assertStringIncludes(stderr, 'is not installed')
    assertEquals(stderr.includes('    at '), false)
  } finally {
    await Deno.remove(tmpDir, { recursive: true })
  }
})

Deno.test('bin/chel.js reports a missing binary without a stack trace', async () => {
  const tmpDir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    const name = await currentSubPkgName()
    await setupFakePackage(tmpDir, name, 'process.exit(0)')
    // Simulate a corrupt install: the sub-package is there, the binary is not.
    await Deno.remove(`${tmpDir}/${name}/fake-chel.js`)
    const { code, stderr } = await runShimCapturingStderr(tmpDir)
    assertEquals(code, 126)
    assertStringIncludes(stderr, 'its binary is missing')
    assertEquals(stderr.includes('    at '), false)
  } finally {
    await Deno.remove(tmpDir, { recursive: true })
  }
})

Deno.test('bin/chel.js reports a non-executable binary', async () => {
  if (Deno.build.os === 'windows') return // no executable bit on Windows
  const tmpDir = await Deno.makeTempDir({ dir: './test/temp' })
  try {
    const name = await currentSubPkgName()
    await setupFakePackage(tmpDir, name, 'process.exit(0)')
    // The exec bit now comes from the published tarball rather than from npm,
    // so losing it must produce a clear diagnostic.
    await Deno.chmod(`${tmpDir}/${name}/fake-chel.js`, 0o644)
    const { code, stderr } = await runShimCapturingStderr(tmpDir)
    assertEquals(code, 126)
    assertStringIncludes(stderr, 'not executable')
  } finally {
    await Deno.remove(tmpDir, { recursive: true })
  }
})

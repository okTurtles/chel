import { assertEquals, assertStringIncludes } from 'jsr:@std/assert'
import { BINARY_FIELD } from './targets.ts'
import { withTempDir } from '../test/test-helpers.ts'

// Behavior tests for the bin/chel.js launcher: the exit codes and messages
// it promises are documented in README.md ("exit code 127 means no sub-package
// ... 126 means one was found but its binary is missing or not executable"),
// so pin them here instead of trusting them to manual release checks.

// The launcher derives the sub-package name from Node's process.arch /
// process.platform at runtime; mirror that mapping from Deno.build so the
// fixture matches what the launcher looks for on the current machine.
const nodeArch = Deno.build.arch === 'x86_64' ? 'x64' : 'arm64'
const nodePlatform = Deno.build.os === 'windows' ? 'win32' : Deno.build.os
const subPkgName = `@chelonia/cli-${nodeArch}-${nodePlatform}`

// The launcher is copied into the temp dir before running so its
// require.resolve() only sees the fixture node_modules created there.
const withLauncher = (fn: (dir: string) => Promise<void>): Promise<void> => {
  return withTempDir(async (dir) => {
    await Deno.copyFile(new URL('../bin/chel.js', import.meta.url), `${dir}/chel.js`)
    await fn(dir)
  })
}

// Runs `node chel.js` inside the fixture dir, where node resolves the
// sub-package from <dir>/node_modules like a real install would.
const runLauncher = async (dir: string, args: string[] = []): Promise<
  { code: number, stdout: string, stderr: string }
> => {
  const { code, stdout, stderr } = await new Deno.Command('node', {
    args: ['chel.js', ...args],
    cwd: dir,
    stdout: 'piped',
    stderr: 'piped'
  }).output()
  return {
    code,
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr)
  }
}

// Writes the sub-package manifest. `binary` names the file the manifest
// advertises; creating that file (or not) is left to the test, so each
// failure mode can be set up precisely.
const writeSubPackage = async (dir: string, binary: string): Promise<string> => {
  const pkgDir = `${dir}/node_modules/${subPkgName}`
  await Deno.mkdir(pkgDir, { recursive: true })
  await Deno.writeTextFile(
    `${pkgDir}/package.json`,
    JSON.stringify({ name: subPkgName, version: '0.0.0', [BINARY_FIELD]: binary })
  )
  return pkgDir
}

Deno.test('bin/chel.js launcher', async (t) => {
  await t.step('exits 127 with an explanation when no sub-package is installed', async () => {
    await withLauncher(async (dir) => {
      // An empty package dir in the nearest node_modules blocks resolution
      // from walking up to a real install further up the tree, so this case
      // stays deterministic no matter what is installed in the repository.
      await Deno.mkdir(`${dir}/node_modules/${subPkgName}`, { recursive: true })
      const { code, stderr } = await runLauncher(dir)
      assertEquals(code, 127)
      assertStringIncludes(stderr, 'no binary for')
      assertStringIncludes(stderr, subPkgName)
    })
  })

  await t.step('exits 126 when the sub-package is installed but its binary is missing', async () => {
    await withLauncher(async (dir) => {
      await writeSubPackage(dir, 'chel')
      const { code, stderr } = await runLauncher(dir)
      assertEquals(code, 126)
      assertStringIncludes(stderr, 'its binary is missing')
      assertStringIncludes(stderr, 'npm install --force @chelonia/cli')
    })
  })

  await t.step({
    name: 'exits 126 when the binary exists but is not executable',
    ignore: Deno.build.os === 'windows',
    fn: async () => {
      await withLauncher(async (dir) => {
        const pkgDir = await writeSubPackage(dir, 'chel')
        await Deno.writeTextFile(`${pkgDir}/chel`, '#!/bin/sh\necho hi\n')
        await Deno.chmod(`${pkgDir}/chel`, 0o644)
        const { code, stderr } = await runLauncher(dir)
        assertEquals(code, 126)
        assertStringIncludes(stderr, 'its binary is not executable')
      })
    }
  })

  await t.step({
    // A directory passes the X_OK pre-check (it is searchable) but execve
    // rejects it, which makes spawn's 'error' event fire for real. That path
    // must report a clean one-line message with the documented exit code,
    // never a stack trace.
    name: 'exits 126 with a clean message when the spawn itself fails',
    ignore: Deno.build.os === 'windows',
    fn: async () => {
      await withLauncher(async (dir) => {
        const pkgDir = await writeSubPackage(dir, 'chel')
        await Deno.mkdir(`${pkgDir}/chel`, { recursive: true })
        await Deno.chmod(`${pkgDir}/chel`, 0o755)
        const { code, stderr } = await runLauncher(dir)
        assertEquals(code, 126)
        assertStringIncludes(stderr, 'cannot be run (EACCES)')
        assertEquals(stderr.includes('Error:'), false, `launcher printed a stack trace: ${stderr}`)
      })
    }
  })

  await t.step({
    name: 'forwards arguments, output and the exit code of the binary',
    ignore: Deno.build.os === 'windows',
    fn: async () => {
      await withLauncher(async (dir) => {
        const pkgDir = await writeSubPackage(dir, 'chel')
        await Deno.writeTextFile(
          `${pkgDir}/chel`,
          '#!/bin/sh\necho "hello $1"\nexit 42\n'
        )
        await Deno.chmod(`${pkgDir}/chel`, 0o755)
        const { code, stdout, stderr } = await runLauncher(dir, ['world'])
        assertEquals(code, 42)
        assertEquals(stdout, 'hello world\n')
        assertEquals(stderr, '')
      })
    }
  })
})

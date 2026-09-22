import { assertEquals } from 'jsr:@std/assert'
import process from 'node:process'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import parseConfig from './parseConfig.ts'
import { withTempDir } from '../test/test-helpers.ts'

// The settings below are reachable three ways, and the one that used to be
// broken is `chel.toml`: the `serve` command declared yargs defaults for them,
// yargs put those into argv, and nconf reads argv before the file.
//
// nconf and the working directory are both global, so each case builds its own
// directory and puts everything back afterwards.
async function resolveConfig (toml: string | null, args: string[]) {
  let resolved = {}
  await withTempDir(async (dir) => {
    const originalCwd = Deno.cwd()
    const originalArgv = process.argv
    if (toml !== null) await Deno.writeTextFile(`${dir}/chel.toml`, toml)
    try {
      Deno.chdir(dir)
      process.argv = ['deno', 'chel', ...args]
      for (const store of ['env', 'argv', 'file', 'defaults']) nconf.remove(store)
      await parseConfig()
      resolved = {
        port: nconf.get('server:port'),
        dashboardPort: nconf.get('server:dashboardPort'),
        appDir: nconf.get('server:appDir')
      }
    } finally {
      process.argv = originalArgv
      Deno.chdir(originalCwd)
    }
  })
  return resolved
}

const CONFIG = `server_id = "parseConfig-test"

[server]
port = 9001
dashboardPort = 9111
appDir = "from-the-file"
`

Deno.test({
  name: 'settings that have both a CLI flag and a chel.toml key',
  async fn (t: Deno.TestContext) {
    await t.step('come from the file when no flag is given', async () => {
      assertEquals(await resolveConfig(CONFIG, ['serve']), {
        port: 9001,
        dashboardPort: 9111,
        appDir: 'from-the-file'
      })
    })

    await t.step('come from the flag when there is one', async () => {
      const args = ['serve', '--port', '7777', '--dashboard-port', '7778', 'from-the-flag']
      assertEquals(await resolveConfig(CONFIG, args), {
        port: 7777,
        dashboardPort: 7778,
        appDir: 'from-the-flag'
      })
    })

    await t.step('fall back to the built-in defaults with no file and no flag', async () => {
      assertEquals(await resolveConfig(null, ['serve']), {
        port: 8000,
        dashboardPort: 8888,
        appDir: '.'
      })
    })
  }
})

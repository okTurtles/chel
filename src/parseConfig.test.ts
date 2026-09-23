import { assertEquals } from 'jsr:@std/assert'
import process from 'node:process'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import parseConfig from './parseConfig.ts'
import { withTempDir } from '../test/test-helpers.ts'

// The settings below are reachable three ways, and the one that used to be
// broken is `chel.toml`: the `serve` command declared yargs defaults for them,
// yargs put those into argv, and nconf reads argv before the file.

// The stores `parseConfig` sets up. Dropping them is what gives each case a
// clean read, and what keeps one case out of the next.
const STORES = ['env', 'argv', 'file', 'defaults']
const dropStores = () => STORES.forEach((store) => nconf.remove(store))

// The env store outranks everything, so a `server__port` in the environment
// running the tests would quietly decide the answer. Cleared for the duration
// unless a case sets one on purpose.
const ENV_KEYS = ['server__port', 'server__dashboardPort', 'server__appDir', 'appManifest']

// nconf, the working directory, process.argv and process.env are all
// process-global, so each case sets them up and puts them back. Leaving a
// store in place would point a later suite at a temp directory that no longer
// exists.
type Resolved = {
  port?: number
  dashboardPort?: number
  appDir?: string
  appManifest?: string
}

async function resolveConfig (
  toml: string | null, args: string[], env: Record<string, string> = {}
): Promise<Resolved> {
  let resolved: Resolved = {}
  await withTempDir(async (dir) => {
    const originalCwd = Deno.cwd()
    const originalArgv = process.argv
    const originalEnv = ENV_KEYS.map((key) => [key, process.env[key]] as const)
    if (toml !== null) await Deno.writeTextFile(`${dir}/chel.toml`, toml)
    try {
      Deno.chdir(dir)
      process.argv = ['deno', 'chel', ...args]
      for (const key of ENV_KEYS) delete process.env[key]
      for (const [key, value] of Object.entries(env)) process.env[key] = value
      dropStores()
      await parseConfig()
      resolved = {
        port: nconf.get('server:port'),
        dashboardPort: nconf.get('server:dashboardPort'),
        appDir: nconf.get('server:appDir'),
        appManifest: nconf.get('appManifest')
      }
    } finally {
      dropStores()
      for (const [key, value] of originalEnv) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
      process.argv = originalArgv
      Deno.chdir(originalCwd)
    }
  })
  return resolved
}

const CONFIG = `server_id = "parseConfig-test"
appManifest = "from-the-file.json"

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
        appDir: 'from-the-file',
        appManifest: 'from-the-file.json'
      })
    })

    await t.step('come from the flag when there is one', async () => {
      const args = [
        'serve', '--port', '7777', '--dashboard-port', '7778',
        '--app-manifest', 'from-the-flag.json', 'from-the-flag'
      ]
      assertEquals(await resolveConfig(CONFIG, args), {
        port: 7777,
        dashboardPort: 7778,
        appDir: 'from-the-flag',
        appManifest: 'from-the-flag.json'
      })
    })

    await t.step('fall back to the built-in defaults with no file and no flag', async () => {
      assertEquals(await resolveConfig(null, ['serve']), {
        port: 8000,
        dashboardPort: 8888,
        appDir: '.',
        appManifest: undefined
      })
    })

    // What the README says the order is. nconf adds the env store first, so it
    // wins over a flag, which surprises most people.
    await t.step('come from the environment even when a flag is given', async () => {
      const args = ['serve', '--port', '7777']
      const env = { server__port: '5555' }
      assertEquals((await resolveConfig(CONFIG, args, env)).port, 5555)
    })

    // `chel pin` declares the same option, so it had the same problem.
    await t.step('reach `chel pin` from the file too', async () => {
      const args = ['pin', 'some.manifest.json']
      assertEquals((await resolveConfig(CONFIG, args)).appManifest, 'from-the-file.json')
    })
  }
})

import * as colors from 'jsr:@std/fmt/colors'
import process from 'node:process'
import sbp from 'npm:@sbp/sbp'
import { debounce } from 'npm:turtledash'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { deploy } from './deploy.ts'
import { findManifestFiles } from './utils.ts'
import { startServer } from './serve/index.ts'
import { startDashboard } from './serve/dashboard-server.ts'
import { closeDB, initDB } from '~/serve/database.ts'

type Params = {
  port: number,
  'dashboard-port': number,
  directory: string,
  dev: boolean,
  'manifests-dir': string,
  'app-manifest': string
}

async function deployManifests (args: ArgumentsCamelCase<Params>): Promise<string | null> {
  const dir = args['manifests-dir']
  if (!dir) return null

  const manifests = await findManifestFiles(dir)
  await deploy({
    ...args,
    manifests: Array.from(manifests)
  })

  return dir
}

async function watch (args: ArgumentsCamelCase<Params>): Promise<void> {
  const dir = await deployManifests(args)
  if (dir === null) return

  const manifestSet = new Set<string>()
  const watcher = Deno.watchFs(dir, { recursive: true })
  const queueName = 'internal:manifests-watch'
  const debouncedRedeploy = debounce(() => {
    if (manifestSet.size === 0) return
    sbp('okTurtles.eventQueue/queueEvent', queueName, () => {
      const manifests = Array.from(manifestSet)
      manifestSet.clear()
      deploy({
        ...args,
        manifests
      }).catch((e) => {
        console.warn(e, 'Error deploying contracts')
      })
    })
  }, 100)

  ;(async () => {
    try {
      for await (const event of watcher) {
        if (event.kind === 'remove') {
          event.paths.forEach((path) => manifestSet.delete(path))
          continue
        }
        if (event.kind !== 'create' && event.kind !== 'modify') continue
        const manifests = event.paths.filter((path) => path.toLowerCase().endsWith('.manifest.json'))
        for (const manifestPath of manifests) {
          try {
            await sbp('okTurtles.eventQueue/queueEvent', queueName, async () => {
              const realPath = await Deno.realPath(manifestPath)
              const info = await Deno.lstat(realPath)
              if (!info.isDirectory) {
                manifestSet.add(manifestPath)
              }
            })
          } catch (e) {
            console.warn(e, 'Error during watch')
          }
        }
        debouncedRedeploy()
      }
    } catch (e) {
      console.error('Watch loop error:', e)
    } finally {
      watcher.close()
    }
  })()
}

export async function serve (args: ArgumentsCamelCase<Params>) {
  // `deployManifests` / `watch` will open the database and then close it.
  // By callig `initDB` here, we ensure that the DB isn't closed.
  await initDB()
  try {
    // Start dashboard server on port 7000 first
    try {
      await startDashboard()
    } catch (error) {
      console.error(colors.red('❌ Failed to start dashboard server:'), error)
      throw error
    }

    // If we're running in 'development' mode, then we preload contracts from
    // the `manifests-dir` directory _and_ watch for changes to automatically
    // re-deploy.
    // If we're running in 'production' mode, then we also preload contracts
    // from the `manifests-dir` directory, but we do _not_ watch for changes.
    // This means that, in production mode, deploying changes requires a manual
    // invocation of `chel deploy` or restarting the server.
    try {
      if (args.dev) {
        await watch(args)
      } else {
        await deployManifests(args)
      }
    } catch (error) {
      console.error(colors.red('❌ Failed to preload contracts:'), error)
      throw error
    }

    // Start application server on port 8000 second
    try {
      await startServer()
    } catch (error) {
      console.error(colors.red('❌ Failed to start application server:'), error)
      throw error
    }
  } catch (error) {
    console.error(colors.red('❌ Failed to start server:'), error)
    throw error
  } finally {
    // Safe to close because the server has opened the DB, increasing the
    // reference count.
    await closeDB()
  }
}

// ./node_modules/.bin/chel deploy ${dest ? `--url ${dest}` : ''} ${manifestDir}/*.manifest.json

export const module = {
  builder: (yargs) => {
    return yargs
      .option('port', {
        default: 8000,
        describe: 'Port to listen on (app)',
        requiresArg: true,
        number: true
      })
      .alias('p', 'port')
      .alias('server:port', 'port')
      .option('dashboard-port', {
        default: 8888,
        describe: 'Port to listen on (dashboard)',
        requiresArg: true,
        number: true
      })
      .alias('a', 'dashboard-port')
      .alias('server:dashboardPort', 'dashboard-port')
      .option('dev', {
        default: false,
        describe: 'Development mode',
        requiresArg: false,
        boolean: true
      })
      .alias('d', 'dev')
      .option('manifests-dir', {
        default: 'contracts',
        describe: 'Directory for contracts',
        requiresArg: true,
        string: true
      })
      .alias('m', 'manifests-dir')
      .option('app-manifest', {
        default: '',
        describe: 'Location of chelonia.json',
        string: true
      })
      .alias('i', 'app-manifest')
      .alias('appManifest', 'app-manifest')
      .positional('directory', {
        default: '.',
        describe: 'Directory',
        type: 'string'
      })
      .alias('server:appDir', 'directory')
  },
  command: 'serve [directory]',
  describe: 'start the server',
  postHandler: (argv) => {
    return serve(argv)
  }
} as CommandModule<object, Params>

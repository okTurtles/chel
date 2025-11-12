import * as colors from 'jsr:@std/fmt/colors'
import process from 'node:process'
// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase, CommandModule } from 'npm:yargs'

type Params = { port: number, 'dashboard-port': number, directory: string }

// Dashboard server function
async function startDashboardServer (): Promise<void> {
  // Import and start the dashboard server
  const dashboardServer = await import('./serve/dashboard-server.ts')
  await dashboardServer.startDashboard()
}

// Application server function
async function startApplicationServer (): Promise<void> {
  // Import and start the application server
  const startServer = await import('./serve/index.ts')
  await startServer.default
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function serve (_args: ArgumentsCamelCase<Params>) {
  try {
    // Start dashboard server on port 7000 first
    try {
      await startDashboardServer()
    } catch (error) {
      console.error(colors.red('❌ Failed to start dashboard server:'), error)
      throw error
    }

    // Start application server on port 8000 second
    try {
      await startApplicationServer()
    } catch (error) {
      console.error(colors.red('❌ Failed to start application server:'), error)
      throw error
    }

    await new Promise(() => {})
  } catch (error) {
    console.error(colors.red('❌ Failed to start server:'), error)
    process.exit(1)
  }
}

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
      .alias('d', 'dashboard-port')
      .alias('server:dashboardPort', 'dashboard-port')
      .positional('directory', {
        default: '.',
        describe: 'Directory',
        type: 'string'
      })
      .alias('server:appDir', 'directory')
  },
  command: 'serve [--port PORT] [--dashboard-port PORT] [directory]',
  describe: 'start the server',
  handler: (argv) => {
    return serve(argv)
  }
} as CommandModule<object, Params>

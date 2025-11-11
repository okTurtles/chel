import * as colors from 'jsr:@std/fmt/colors'
import process from 'node:process'
// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase, CommandModule } from 'npm:yargs'

type Params = { port: number, 'dashboard-port': number, directory: string }

// Dashboard server function
async function startDashboardServer (port: number) {
  // Import and start the dashboard server
  const dashboardServer = await import('./serve/dashboard-server.ts')
  await dashboardServer.startDashboard(port)
}

// Application server function
async function startApplicationServer (port: number, directory: string): Promise<void> {
  // Set environment variables that the server expects
  process.env.API_PORT = port.toString()
  process.env.CHELONIA_APP_DIR = directory

  // Import and start the application server
  const startServer = await import('./serve/index.ts')
  await startServer.default
}

export async function serve (args: ArgumentsCamelCase<Params>) {
  const { port: applicationPort, 'dashboard-port': dashboardPort, directory } = args

  try {
    // Start dashboard server on port 7000 first
    try {
      await startDashboardServer(dashboardPort)
    } catch (error) {
      console.error(colors.red('❌ Failed to start dashboard server:'), error)
      throw error
    }

    // Start application server on port 8000 second
    try {
      await startApplicationServer(applicationPort, directory)
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

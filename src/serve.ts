import * as flags from 'jsr:@std/flags/'
import * as colors from 'jsr:@std/fmt/colors'
import process from 'node:process'

interface ServeOptions {
  dp?: number
  port?: number
  'db-type'?: string
  'db-location'?: string
}

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

export async function serve (args: string[]) {
  const { directory, options } = parseServeArgs(args)
  const {
    dp: dashboardPort = 8888,
    port: applicationPort = 8000,
    'db-type': dbType = 'mem',
    'db-location': dbLocation
  } = options

  console.log(colors.cyan('🚀 Starting Chelonia app server...'))
  console.log(colors.blue('Directory:'), directory || '')
  console.log(colors.blue('Dashboard port:'), dashboardPort)
  console.log(colors.blue('Application port:'), applicationPort)
  console.log(colors.blue('Database type:'), dbType)
  if (dbLocation) {
    console.log(colors.gray(`Database location: ${dbLocation}`))
  }

  try {
    // Start dashboard server on port 7000 first
    console.log(colors.cyan('🚀 Starting dashboard server...'))
    try {
      await startDashboardServer(dashboardPort)
      console.log(colors.green(`✅ Dashboard server started on port ${dashboardPort}`))
    } catch (error) {
      console.error(colors.red('❌ Failed to start dashboard server:'), error)
      throw error
    }

    // Start application server on port 8000 second
    console.log(colors.cyan('🚀 Starting application server...'))
    try {
      await startApplicationServer(applicationPort, directory)
      console.log(colors.green(`✅ Application server started on port ${applicationPort}`))
    } catch (error) {
      console.error(colors.red('❌ Failed to start application server:'), error)
      throw error
    }

    console.log(colors.green('✅ Both servers started successfully!'))
    console.log(colors.yellow(`📊 Dashboard: http://localhost:${dashboardPort}`))
    console.log(colors.yellow(`🌐 Application: http://localhost:${applicationPort}`))

    await new Promise(() => {})
  } catch (error) {
    console.error(colors.red('❌ Failed to start server:'), error)
    process.exit(1)
  }
}

export function parseServeArgs (args: string[]): { directory: string; options: ServeOptions } {
  const parsed = flags.parse(args, {
    string: ['dp', 'port', 'db-type', 'db-location'],
    default: {
      dp: '8888',
      port: '8000',
      'db-type': 'mem'
    }
  })

  const directory = parsed._[0] as string || '.'

  const options: ServeOptions = {
    dp: parseInt(parsed.dp),
    port: parseInt(parsed.port),
    'db-type': parsed['db-type'],
    'db-location': parsed['db-location']
  }

  return { directory, options }
}

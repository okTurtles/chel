import { flags, colors } from './deps.ts'
import process from 'node:process'

interface ServeOptions {
  dp?: number
  port?: number
  'db-type'?: 'files' | 'sqlite' | 'mem'
  'db-location'?: string
}

// Dashboard server function
async function startDashboardServer (port: number): Promise<void> {
  // Set dashboard-specific environment variables
  process.env.IS_CHELONIA_DASHBOARD_DEV = 'true'
  process.env.DASHBOARD_PORT = port.toString()
  process.env.PORT = port.toString()

  // Import and start the dashboard server
  const dashboardServer = await import('./serve/dashboard-server.ts')
  await dashboardServer.startDashboard(port)
}

// Application server function
async function startApplicationServer (port: number): Promise<void> {
  // Set application-specific environment variables
  delete process.env.IS_CHELONIA_DASHBOARD_DEV
  process.env.PORT = port.toString()
  process.env.API_PORT = port.toString()

  // Import and start the application server
  const startServer = await import('./serve/index.ts')
  await startServer.default
}

export async function serve (directory: string, options: ServeOptions = {}) {
  const {
    dp: dashboardPort = 7001,
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
    // Set environment variables for the serve backend
    process.env.NODE_ENV = 'development'
    process.env.GI_PERSIST = dbType === 'mem' ? '' : dbType

    if (dbLocation) {
      if (dbType === 'files') {
        process.env.DB_PATH = dbLocation
      } else if (dbType === 'sqlite') {
        process.env.DB_PATH = dbLocation
      }
    }

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
    process.env.PORT = applicationPort.toString()
    process.env.API_PORT = applicationPort.toString()
    try {
      await startApplicationServer(applicationPort)
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
      dp: '7000',
      port: '7000',
      'db-type': 'mem'
    }
  })

  const directory = parsed._[0] as string
  if (!directory) {
    throw new Error('Directory argument is required')
  }

  const options: ServeOptions = {
    dp: parseInt(parsed.dp),
    port: parseInt(parsed.port),
    'db-type': parsed['db-type'] as 'files' | 'sqlite' | 'mem',
    'db-location': parsed['db-location']
  }

  return { directory, options }
}

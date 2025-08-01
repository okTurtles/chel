import { flags, colors } from './deps.ts'
import process from 'node:process'

interface ServeOptions {
  dp?: number
  port?: number
  'db-type'?: 'files' | 'sqlite' | 'mem'
  'db-location'?: string
}

export async function serve (directory: string, options: ServeOptions = {}) {
  const {
    dp: dashboardPort = 7000,
    port: applicationPort = 8000,
    'db-type': dbType = 'mem',
    'db-location': dbLocation
  } = options

  console.log(colors.cyan('🚀 Starting Chelonia app server...'))
  console.log(colors.gray(`Directory: ${directory}`))
  console.log(colors.gray(`Dashboard port: ${dashboardPort}`))
  console.log(colors.gray(`Application port: ${applicationPort}`))
  console.log(colors.gray(`Database type: ${dbType}`))
  if (dbLocation) {
    console.log(colors.gray(`Database location: ${dbLocation}`))
  }

  try {
    // Set environment variables for the serve backend
    process.env.NODE_ENV = 'development'
    process.env.PORT = applicationPort.toString()
    process.env.API_PORT = applicationPort.toString()
    process.env.DASHBOARD_PORT = dashboardPort.toString()
    process.env.GI_PERSIST = dbType === 'mem' ? '' : dbType

    if (dbLocation) {
      if (dbType === 'files') {
        process.env.DB_PATH = dbLocation
      } else if (dbType === 'sqlite') {
        process.env.DB_PATH = dbLocation
      }
    }

    // Import and start the server
    const startServer = await import('./serve/index.ts')
    await startServer.default

    console.log(colors.green('✅ Server started successfully!'))
    console.log(colors.yellow(`📊 Dashboard: http://localhost:${dashboardPort}`))
    console.log(colors.yellow(`🌐 Application: http://localhost:${applicationPort}`))

    await new Promise(() => {})
  } catch (error) {
    console.error(colors.red('❌ Failed to start server:'), error)
    Deno.exit(1)
  }
}

export function parseServeArgs (args: string[]): { directory: string; options: ServeOptions } {
  const parsed = flags.parse(args, {
    string: ['dp', 'port', 'db-type', 'db-location'],
    default: {
      dp: '7000',
      port: '8000',
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

import { Hapi, Inert } from '~/deps.ts'
import path from 'node:path'
import process from 'node:process'

// Get the current directory for dashboard assets
const getDashboardPath = () => {
  // In development, use relative path from serve directory
  return path.resolve(import.meta.dirname || process.cwd(), 'dist-dashboard')
}

export async function startDashboard (port: number): Promise<void> {
  // Create a separate Hapi server for the dashboard
  const dashboardServer = new Hapi.Server({
    port: port,
    host: 'localhost',
    routes: {
      files: {
        relativeTo: getDashboardPath()
      }
    }
  })

  // Register the Inert plugin for static file serving
  await dashboardServer.register(Inert)

  // Dashboard assets routes (must come first to handle static files)
  dashboardServer.route({
    method: 'GET',
    path: '/assets/{path*}',
    handler: {
      directory: {
        path: 'assets',
        redirectToSlash: false
      }
    }
  })

  // Support accessing dashboard under /dashboard/ path
  dashboardServer.route({
    method: 'GET',
    path: '/dashboard',
    handler: (_request: Hapi.Request, h: Hapi.ResponseToolkit) => h.file('index.html')
  })

  dashboardServer.route({
    method: 'GET',
    path: '/dashboard/',
    handler: (_request: Hapi.Request, h: Hapi.ResponseToolkit) => h.file('index.html')
  })

  // Catch-all route for root and other paths (serves index.html)
  dashboardServer.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  })

  // Start the dashboard server
  await dashboardServer.start()
  console.log(`📊 Dashboard server running at: http://localhost:${port}`)
}

export default startDashboard

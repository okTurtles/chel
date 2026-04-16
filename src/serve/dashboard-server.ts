import path from 'node:path'
import process from 'node:process'
import { Hono } from 'npm:hono'
import { serveStatic } from 'npm:hono/deno'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'

const getDashboardPath = () => {
  // When running from build/main.js, the dashboard is in build/dist-dashboard
  // import.meta.dirname points to the build/ directory in that case
  const baseDir = import.meta.dirname || path.join(process.cwd(), 'build')
  const dashboardPath = path.resolve(baseDir, 'dist-dashboard')
  return dashboardPath
}

export async function startDashboard (): Promise<void> {
  const port = nconf.get('server:dashboardPort')
  const host = nconf.get('server:host') || '0.0.0.0'
  const dashboardRoot = getDashboardPath()

  const app = new Hono()

  app.get('/assets/*', serveStatic({ root: dashboardRoot, rewriteRequestPath: (p) => p }))

  app.get('/dashboard', serveStatic({ path: path.join(dashboardRoot, 'index.html') }))
  app.get('/dashboard/', serveStatic({ path: path.join(dashboardRoot, 'index.html') }))

  // SPA fallback: try static file first, then serve index.html for SPA routing
  app.get('/*', async (c) => {
    const staticResponse = await serveStatic({ root: dashboardRoot, rewriteRequestPath: (p) => p })(c, async () => {})
    // If static file exists and was served successfully, return it
    if (staticResponse) {
      return staticResponse
    }
    // File not found, serve index.html for SPA routing
    const indexResponse = await serveStatic({ path: path.join(dashboardRoot, 'index.html') })(c, async () => {})
    return indexResponse || c.text('Not Found', 404)
  })

  await new Promise<void>((resolve) => {
    Deno.serve({ port, hostname: host, onListen: () => resolve() }, app.fetch)
  })
}

export default startDashboard

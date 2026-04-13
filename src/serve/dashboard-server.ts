import path from 'node:path'
import process from 'node:process'
import { Hono } from 'npm:hono'
import { serveStatic } from 'npm:hono/deno'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'

const getDashboardPath = () => {
  return path.resolve(import.meta.dirname || process.cwd(), 'dist-dashboard')
}

export async function startDashboard (): Promise<void> {
  const port = nconf.get('server:dashboardPort')
  const host = nconf.get('server:host') || '0.0.0.0'
  const dashboardRoot = getDashboardPath()

  const app = new Hono()

  app.get('/assets/*', serveStatic({ root: dashboardRoot, rewriteRequestPath: (p) => p }))

  app.get('/dashboard', serveStatic({ path: path.join(dashboardRoot, 'index.html') }))
  app.get('/dashboard/', serveStatic({ path: path.join(dashboardRoot, 'index.html') }))

  app.get('/*', serveStatic({ root: dashboardRoot, rewriteRequestPath: (p) => p }))

  app.get('/*', serveStatic({ path: path.join(dashboardRoot, 'index.html') }))

  await new Promise<void>((resolve) => {
    Deno.serve({ port, hostname: host, onListen: () => resolve() }, app.fetch)
  })
}

export default startDashboard

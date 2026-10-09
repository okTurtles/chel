import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Hono } from 'npm:hono'
import { serveStatic } from 'npm:hono/deno'
import { createAdaptorServer, type ServerType } from 'npm:@hono/node-server'
import { etag } from 'npm:hono/etag'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'

export const getDashboardPath = (): string => {
  const baseDir = import.meta.dirname || path.join(process.cwd(), 'build')
  const candidates = [
    // build/main.js: the dashboard is next to it, in build/dist-dashboard
    path.resolve(baseDir, 'dist-dashboard'),
    // Run from source, this file is in src/serve/
    path.resolve(baseDir, '../../build/dist-dashboard')
  ]
  return candidates.find((p) => existsSync(p)) ?? candidates[0]
}

export async function startDashboard (): Promise<ServerType> {
  const port = nconf.get('server:dashboardPort')
  const host = nconf.get('server:host') || '0.0.0.0'
  const dashboardRoot = getDashboardPath()

  const app = new Hono()

  // Cache middleware instances to avoid creating new ones on every request
  const staticMiddleware = serveStatic({ root: dashboardRoot, rewriteRequestPath: (p) => p })
  // `path` alone would be joined onto `./` and resolve against the working
  // directory, so every page except `/` would 404 on reload.
  const indexMiddleware = serveStatic({ root: dashboardRoot, path: 'index.html' })

  app.get('/assets/*', etag(), staticMiddleware)

  app.get('/dashboard', etag(), indexMiddleware)
  app.get('/dashboard/', etag(), indexMiddleware)

  // SPA fallback: try static file first, then serve index.html for SPA routing
  app.get('/*', async (c) => {
    const staticResponse = await staticMiddleware(c, async () => {})
    // If static file exists and was served successfully, return it
    if (staticResponse) {
      return staticResponse
    }
    // File not found, serve index.html for SPA routing
    const indexResponse = await indexMiddleware(c, async () => {})
    return indexResponse || c.text('Not Found', 404)
  })

  // Start listening
  const server = createAdaptorServer({ fetch: app.fetch })
  await new Promise<string>((resolve, reject) => {
    server.listen(port, host, () => {
      const addr = server.address() as { address: string; port: number }
      const uri = `http://${addr.address}:${addr.port}`
      console.info('Dashboard server running at:', uri)
      resolve(uri)
    }).once('error', reject)
  })

  return server
}

export default startDashboard

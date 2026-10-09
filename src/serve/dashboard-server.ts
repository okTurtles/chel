import { createHash, timingSafeEqual } from 'node:crypto'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Hono } from 'npm:hono'
import { basicAuth } from 'npm:hono/basic-auth'
import { serveStatic } from 'npm:hono/deno'
import { createAdaptorServer, type ServerType } from 'npm:@hono/node-server'
import { etag } from 'npm:hono/etag'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { contractManifest, listContracts, listUsers, overview } from './dashboard-data.ts'

// The same rule routes.ts checks contract IDs with
const CID_REGEX = /^z[1-9A-HJ-NP-Za-km-z]{8,72}$/

// Compares digests, so how long it takes says nothing about the password
const samePassword = (given: string, expected: string): boolean => {
  const digest = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(digest(given), digest(expected))
}

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
  // The dashboard shows usernames, storage and credits, so by default only
  // this machine can reach it
  const host = nconf.get('server:dashboardListenIP') || '127.0.0.1'
  // Set from the environment, nconf turns a password like "1234" into a number
  const configured = nconf.get('server:dashboardAdminPassword')
  const password = configured == null || configured === '' ? undefined : String(configured)
  const dashboardRoot = getDashboardPath()

  const app = new Hono()

  // With a password, the browser asks for it before showing any page. Only
  // the password is checked, not the user name.
  if (password) {
    app.use('*', basicAuth({
      realm: 'Chelonia dashboard',
      verifyUser: (_username, given) => samePassword(given, password)
    }))
  }

  // Without one, the pages still load, but they get no data
  app.use('/api/*', async (c, next) => {
    if (!password) return c.json({ error: 'no-password' }, 403)
    await next()
  })
  app.get('/api/overview', async (c) => c.json(await overview()))
  app.get('/api/contracts', async (c) => c.json(await listContracts()))
  app.get('/api/users', async (c) => c.json(await listUsers()))
  app.get('/api/contracts/:contractID/manifest', async (c) => {
    const contractID = c.req.param('contractID')
    const found = CID_REGEX.test(contractID) ? await contractManifest(contractID) : null
    return found ? c.json(found) : c.json({ error: 'not-found' }, 404)
  })
  // Rather than the app's index.html from the fallback below
  app.all('/api/*', (c) => c.json({ error: 'not-found' }, 404))

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

// TODO: Use logger for debug output if needed

import { Buffer } from 'node:buffer'
import { SPMessage } from 'npm:@chelonia/lib/SPMessage'
import 'npm:@chelonia/lib/chelonia'
import { blake32Hash, createCID, maybeParseCID, multicodes } from 'npm:@chelonia/lib/functions'
import 'npm:@chelonia/lib/persistent-actions'
import { getConnInfo } from 'npm:@hono/node-server/conninfo'
import sbp from 'npm:@sbp/sbp'
import Bottleneck from 'npm:bottleneck'
import chalk from 'npm:chalk'
import { HTTPException } from 'npm:hono/http-exception'
// TODO: Use logger for debugging route handlers
import { isIP } from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { Readable } from 'node:stream'
import { zValidator } from 'npm:@hono/zod-validator'
import type { Context, Hono, MiddlewareHandler } from 'npm:hono'
import { bodyLimit } from 'npm:hono/body-limit'
import { appendToIndexFactory, lookupUltimateOwner } from './database.ts'
import logger from './logger.ts'
import { getChallenge, getContractSalt, redeemSaltRegistrationToken, redeemSaltUpdateToken, register, registrationKey, updateContractSalt } from './zkppSalt.ts'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import * as z from 'npm:zod'
import { authMiddleware, type AuthCredentials } from './auth.ts'

const MEGABYTE = 1048576 // TODO: add settings for these
const SECOND = 1000

// Regexes validated as safe with <https://devina.io/redos-checker>
const CID_REGEX = /^z[1-9A-HJ-NP-Za-km-z]{8,72}$/
// deno-lint-ignore no-control-regex
const KV_KEY_REGEX = /^(?!_private)[^\x00]{1,256}$/
// Rules from validateUsername:
//   - Length: 1-80
//   - Can't start or end with _ or -
//   - No two consecutive - or _
//   - Allowed characters: lowercase letters, numbers, underscore and dashes
const NAME_REGEX = /^(?![_-])((?!([_-])\2)[a-z\d_-]){1,80}(?<![_-])$/
const NON_NEGATIVE_INTEGER_REGEX = /^\d{1,16}$/

// MIME types for asset serving
const MIME_TYPES: Record<string, string> = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.map': 'application/json'
}

// Zod schemas for declarative request validation
const cidSchema = z.string().regex(CID_REGEX, 'Invalid CID')
const nameSchema = z.string().regex(NAME_REGEX, 'Invalid name')
const kvKeySchema = z.string().regex(KV_KEY_REGEX, 'Invalid key')
const nonNegativeIntegerSchema = z.string().regex(NON_NEGATIVE_INTEGER_REGEX, 'Invalid non-negative integer')

// Custom validator for endpoints that accept both JSON and form-urlencoded bodies
function zValidatorFormOrJson<T extends z.ZodTypeAny> (
  schema: T
): MiddlewareHandler {
  return async (c, next) => {
    const contentType = (c.req.header('content-type') || '').trim().toLowerCase()
    let data: unknown

    try {
      if (contentType.startsWith('application/x-www-form-urlencoded')) {
        const form = await c.req.parseBody()
        data = Object.fromEntries(
          Object.entries(form as Record<string, string | File>)
            .filter(([, v]) => typeof v === 'string')
        )
      } else if (contentType.startsWith('application/json')) {
        data = await c.req.json()
      } else {
        throw new HTTPException(415, { message: 'Content-Type header expected with form or JSON data' })
      }
    } catch (e) {
      if (e instanceof HTTPException) throw e
      throw new HTTPException(400, { message: 'Invalid request body' })
    }

    const result = schema.safeParse(data)
    if (!result.success) {
      throw new HTTPException(400, { message: 'Invalid request body' })
    }

    c.set('validatedBody', result.data as z.infer<T>)
    return next()
  }
}

const cidLookupTable = {
  [multicodes.SHELTER_CONTRACT_MANIFEST]: 'application/vnd.shelter.contractmanifest+json',
  [multicodes.SHELTER_CONTRACT_TEXT]: 'application/vnd.shelter.contracttext',
  [multicodes.SHELTER_CONTRACT_DATA]: 'application/vnd.shelter.contractdata+json',
  [multicodes.SHELTER_FILE_MANIFEST]: 'application/vnd.shelter.filemanifest+json',
  [multicodes.SHELTER_FILE_CHUNK]: 'application/vnd.shelter.filechunk+octet-stream'
}

// Given an IPv4 or IPv6, extract a suitable key to be used for rate limiting.
// For IPv4 addresses (including IPv4 addresses embedded in IPv6 addresses),
// just use the full IPv4 address as is.
// For IPv6 addresses, discard the least significant 64 bits. This makes DoS
// harder and because of subnetting the discarded bits likely all represent
// addresses belonging to the same individual.
// Note: link-local IPv6 addresses aren't transformed and used in full.
// See: <https://github.com/okTurtles/group-income/issues/2832>
const limiterKey = (ip: string) => {
  const ipVersion = isIP(ip)
  if (ipVersion === 4) {
    return ip
  } else if (ipVersion === 6) {
    // Likely IPv6
    const [address, zoneIdx] = ip.split('%')
    const segments = address.split(':')

    // Is this a compressed form IPv6 address?
    let isCompressed = false
    for (let i = 0; i < segments.length - 1; i++) {
      // Compressed form address
      if (!isCompressed && segments[i] === '') {
        const requiredSegments = 8 - (segments.length - 1)
        if (requiredSegments < 0) {
          throw new Error('Invalid IPv6 address: too many segments')
        }
        if ((i === 0 || i === segments.length - 2) && segments[i + 1] === '') {
          segments[i + 1] = '0'
        }
        if (i === 0 && segments.length === 3 && segments[i + 2] === '') {
          segments[i + 2] = '0'
        }
        segments.splice(i, 1, ...new Array(requiredSegments).fill('0'))
        isCompressed = true
        continue
      }
      // Remove leading zeroes
      segments[i] = segments[i].replace(/^0+/, '0')
    }

    if (segments.length === 8 && isIP(segments[7]) === 4) {
      // IPv4-embedded, IPv4-mapped and IPv4-translated addresses are returned
      // as IPv4
      return segments[7]
    } else if (segments.length === 8) {
      if (zoneIdx) {
        segments[7] = segments[7].replace(/^0+/, '0')
        // Use tagged (link-local) addresses in full
        return segments.join(':').toLowerCase() + '%' + zoneIdx
      } else {
        // If an IPv6 address, return the first 64 bits. This is because that's
        // the smallest possible subnet, and spammers can easily get an entire
        // /64
        return segments.slice(0, 4).join(':').toLowerCase() + '::'
      }
    } else {
      throw new Error('Invalid IPv6 address')
    }
  }

  throw new Error('Invalid address format')
}

// Constant-time equal
const ctEq = (expected: string, actual: string): boolean => {
  let r = actual.length ^ expected.length
  for (let i = 0; i < actual.length; i++) {
    r |= actual.codePointAt(i)! ^ expected.codePointAt(i)!
  }
  return r === 0
}

let currentLimiters: Bottleneck.Group[] = []
let rateLimitersInstalled = false

function installRateLimiterSelectorsOnce (): void {
  if (rateLimitersInstalled) return
  rateLimitersInstalled = true
  sbp('sbp/selectors/register', {
    'backend/server/stopRateLimiters': async function () {
      const limiters = currentLimiters
      await Promise.allSettled(limiters.map(l => l.disconnect()))
      // Bottleneck v2 Group.disconnect() only disconnects the Redis connection (if any).
      // The internal `setInterval` from `_startAutoCleanup()` is not cleaned up, causing
      // async leaks on shutdown. We must clear it via the private `interval` property.
      for (const limiter of limiters) {
        clearInterval((limiter as unknown as { interval: ReturnType<typeof setInterval> }).interval)
      }
    }
  })
}

export function getStaticServeConfig () {
  const isCheloniaDashboard = process.env.IS_CHELONIA_DASHBOARD_DEV
  const appDir = nconf.get('server:appDir') || '.'
  const dashboardDir = import.meta.dirname || './build/dist-dashboard'
  return {
    distAssets: path.resolve(path.join(isCheloniaDashboard ? dashboardDir : appDir, 'assets')),
    distIndexHtml: path.resolve(path.join(isCheloniaDashboard ? dashboardDir : appDir, 'index.html')),
    redirect: isCheloniaDashboard ? '/dashboard/' : '/app/'
  }
}

const errorMapper = (e: Error): HTTPException => {
  switch (e?.name) {
    case 'BackendErrorNotFound':
      return new HTTPException(404)
    case 'BackendErrorGone':
      return new HTTPException(410)
    case 'BackendErrorBadData':
      return new HTTPException(422, { message: e.message })
    default:
      console.error(e, 'Unexpected backend error')
      return new HTTPException(500, { message: e.message ?? 'internal error' })
  }
}

export function getClientIP (c: Context): string {
  const headerIP = c.req.header('x-real-ip')
  if (headerIP) return headerIP
  try {
    const info = getConnInfo(c)
    return info.remote.address || 'unknown'
  } catch {
    return 'unknown'
  }
}

// helper function that returns 404 and prevents client from caching the 404 response
// which can sometimes break things: https://github.com/okTurtles/group-income/issues/2608
function notFoundNoCache (c: Context): Response {
  return c.body(null, 404, { 'Cache-Control': 'no-store' })
}

function safePathWithin (base: string, subpath: string): string | null {
  const resolved = path.resolve(base, subpath)
  if (!resolved.startsWith(base + path.sep) && resolved !== base) return null
  return resolved
}

// Helper to serve static assets with proper caching headers
function serveAsset (c: Context, subpath: string, assetsDir: string): Promise<Response> {
  const basename = path.basename(subpath)
  const filePath = safePathWithin(assetsDir, subpath)
  if (!filePath) return Promise.resolve(notFoundNoCache(c))

  return Deno.readFile(filePath)
    .then((file) => {
      const headers: Record<string, string> = {}

      if (basename.includes('-cached')) {
        headers['ETag'] = `"${basename}"`
        headers['Cache-Control'] = 'public,max-age=31536000,immutable'
      }

      if (subpath.includes('js/sw-')) {
        console.debug('adding header: Service-Worker-Allowed /')
        headers['Service-Worker-Allowed'] = '/'
      }

      const ext = path.extname(subpath).toLowerCase()
      headers['Content-Type'] = MIME_TYPES[ext] || 'application/octet-stream'

      return c.body(file, 200, headers)
    })
    .catch(() => notFoundNoCache(c))
}

export function registerRoutes (app: Hono): void {
  // Clean up any previous rate limiters (their intervals leak if stopRateLimiters
  // wasn't called, e.g. when the SERVER_EXITING handler was consumed already)
  for (const limiter of currentLimiters) {
    limiter.disconnect()
    clearInterval((limiter as unknown as { interval: ReturnType<typeof setInterval> }).interval)
  }

  const FILE_UPLOAD_MAX_BYTES = nconf.get('server:fileUploadMaxBytes') || 30 * MEGABYTE
  const SIGNUP_LIMIT_MIN = nconf.get('server:signup:limit:minute') || 2
  const SIGNUP_LIMIT_HOUR = nconf.get('server:signup:limit:hour') || 10
  const SIGNUP_LIMIT_DAY = nconf.get('server:signup:limit:day') || 50
  const SIGNUP_LIMIT_DISABLED = process.env.NODE_ENV !== 'production' || nconf.get('server:signup:limit:disabled')
  const ARCHIVE_MODE = nconf.get('server:archiveMode')

  const limiterPerMinute = new Bottleneck.Group({
    strategy: Bottleneck.strategy.LEAK,
    highWater: 0,
    reservoir: SIGNUP_LIMIT_MIN,
    reservoirRefreshInterval: 60 * SECOND,
    reservoirRefreshAmount: SIGNUP_LIMIT_MIN
  })
  const limiterPerHour = new Bottleneck.Group({
    strategy: Bottleneck.strategy.LEAK,
    highWater: 0,
    reservoir: SIGNUP_LIMIT_HOUR,
    reservoirRefreshInterval: 60 * 60 * SECOND,
    reservoirRefreshAmount: SIGNUP_LIMIT_HOUR
  })
  const limiterPerDay = new Bottleneck.Group({
    strategy: Bottleneck.strategy.LEAK,
    highWater: 0,
    reservoir: SIGNUP_LIMIT_DAY,
    reservoirRefreshInterval: 24 * 60 * 60 * SECOND,
    reservoirRefreshAmount: SIGNUP_LIMIT_DAY
  })
  currentLimiters = [limiterPerMinute, limiterPerHour, limiterPerDay]
  installRateLimiterSelectorsOnce()

  const isCheloniaDashboard = process.env.IS_CHELONIA_DASHBOARD_DEV
  const staticServeConfig = getStaticServeConfig()

  // RESTful API routes

  // NOTE: We could get rid of this RESTful API and just rely on pubsub.js to do this
  //       —BUT HTTP2 might be better than websockets and so we keep this around.
  //       See related TODO in pubsub.js and the reddit discussion link.
  app.post('/event',
    zValidator('header', z.object({
      'shelter-namespace-registration': nameSchema.optional(),
      'shelter-salt-update-token': z.string().optional(),
      'shelter-salt-registration-token': z.string().optional(),
      'shelter-deletion-token-digest': z.string().optional()
    })),
    bodyLimit({ maxSize: MEGABYTE }),
    authMiddleware('chel-shelter', 'optional'),
    async function (c) {
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      // IMPORTANT: IT IS A REQUIREMENT THAT ANY PROXY SERVERS (E.G. nginx) IN FRONT OF US SET THE
      // X-Real-IP HEADER! OTHERWISE THIS IS EASILY SPOOFED!
      const ip = getClientIP(c)
      try {
        const contentType = c.req.header('content-type')
        if (contentType && !contentType.toLowerCase().startsWith('application/json')) {
          throw new HTTPException(415, { message: 'Expected JSON body' })
        }
        const payload = await c.req.text()
        const validatedHeaders = c.req.valid('header')
        if (!payload) throw new HTTPException(400, { message: 'Invalid request payload input' })
        const deserializedHEAD = SPMessage.deserializeHEAD(payload)
        try {
          const parsed = maybeParseCID(deserializedHEAD.head.manifest)
          if (parsed?.code !== multicodes.SHELTER_CONTRACT_MANIFEST) {
            throw new HTTPException(422, { message: 'Invalid manifest' })
          }
          const credentials = c.get('credentials') as AuthCredentials | undefined
          // Only allow identity contracts to be created without attribution
          if (!credentials?.billableContractID && deserializedHEAD.isFirstMessage) {
            const manifest = await sbp('chelonia.db/get', deserializedHEAD.head.manifest)
            const parsedManifest = JSON.parse(manifest)
            const { name } = JSON.parse(parsedManifest.body)
            if (name !== 'gi.contracts/identity') {
              throw new HTTPException(401, { message: 'This contract type requires ownership information' })
            }
            if (nconf.get('server:signup:disabled')) {
              throw new HTTPException(403, { message: 'Registration disabled' })
            }
            // rate limit signups in production
            if (!SIGNUP_LIMIT_DISABLED) {
              try {
              // See discussion: https://github.com/okTurtles/group-income/pull/2280#pullrequestreview-2219347378
                const keyedIp = limiterKey(ip)
                await limiterPerMinute.key(keyedIp).schedule(() => Promise.resolve())
                await limiterPerHour.key(keyedIp).schedule(() => Promise.resolve())
                await limiterPerDay.key(keyedIp).schedule(() => Promise.resolve())
              } catch {
                console.warn('rate limit hit for IP:', ip)
                throw new HTTPException(429, { message: 'Rate limit exceeded' })
              }
            }
          }
          const saltUpdateToken = validatedHeaders['shelter-salt-update-token']
          let updateSalts
          if (saltUpdateToken) {
          // If we've got a salt update token (i.e., a password change),
          // validate the token
            updateSalts = await redeemSaltUpdateToken(deserializedHEAD.contractID, saltUpdateToken)
          }
          await sbp('backend/server/handleEntry', deserializedHEAD, payload)
          // If it's a salt update, do it now after handling the message. This way
          // we make it less likely that someone will end up locked out from their
          // identity contract.
          await updateSalts?.(deserializedHEAD.hash)
          if (deserializedHEAD.isFirstMessage) {
          // Store attribution information
            if (credentials?.billableContractID) {
              await sbp('backend/server/saveOwner', credentials.billableContractID, deserializedHEAD.contractID)
              // A billable entity has been created
            } else {
              await sbp('backend/server/registerBillableEntity', deserializedHEAD.contractID)
            }
            // If this is the first message in a contract and the
            // `shelter-namespace-registration` header is present, proceed with also
            // registering a name for the new contract
            const name = validatedHeaders['shelter-namespace-registration']
            if (name) {
              // Name registation is enabled only for identity contracts
              const cheloniaState = sbp('chelonia/rootState')
              if (cheloniaState.contracts[deserializedHEAD.contractID]?.type === 'gi.contracts/identity') {
                try {
                  await sbp('backend/db/registerName', name, deserializedHEAD.contractID)
                } catch (registerErr: unknown) {
                  if ((registerErr as Error).name === 'BackendErrorConflict') {
                    throw new HTTPException(409, { message: 'Name already exists' })
                  }
                  throw registerErr
                }
                const saltRegistrationToken = validatedHeaders['shelter-salt-registration-token']
                console.info(`new user: ${name}=${deserializedHEAD.contractID} (${ip})`)
                if (saltRegistrationToken) {
                // If we've got a salt registration token, redeem it
                  await redeemSaltRegistrationToken(name, deserializedHEAD.contractID, saltRegistrationToken)
                }
              }
            }
            const deletionTokenDgst = validatedHeaders['shelter-deletion-token-digest']
            if (deletionTokenDgst) {
              await sbp('chelonia.db/set', `_private_deletionTokenDgst_${deserializedHEAD.contractID}`, deletionTokenDgst)
            }
          }
          // Store size information
          await sbp('backend/server/updateSize', deserializedHEAD.contractID, Buffer.byteLength(payload), deserializedHEAD.isFirstMessage && !credentials?.billableContractID ? deserializedHEAD.contractID : undefined)
        } catch (err: unknown) {
          if (err instanceof HTTPException) throw err
          console.error(err, chalk.bold.yellow((err as Error).name))
          if ((err as Error).name === 'ChelErrorDBBadPreviousHEAD' || (err as Error).name === 'ChelErrorAlreadyProcessed') {
            const HEADinfo = await sbp('chelonia/db/latestHEADinfo', deserializedHEAD.contractID) ?? { HEAD: null, height: 0 }
            return c.json({ message: (err as Error).message, data: { HEADinfo } }, 409, {
              'shelter-headinfo-head': HEADinfo.HEAD,
              'shelter-headinfo-height': String(HEADinfo.height)
            })
          } else if ((err as Error).name === 'ChelErrorSignatureError') {
            throw new HTTPException(422, { message: 'Invalid signature' })
          } else if ((err as Error).name === 'ChelErrorSignatureKeyUnauthorized') {
            throw new HTTPException(403, { message: 'Unauthorized signing key' })
          }
          throw err // rethrow error
        }
        return c.text(deserializedHEAD.hash)
      } catch (err) {
        if (err instanceof HTTPException) throw err
        ;(err as unknown as { ip: string }).ip = ip
        logger.error(err, 'POST /event', (err as Error).message)
        throw err
      }
    })

  app.get('/eventsAfter/:contractID/:since/:limit?',
    zValidator('param', z.object({
      contractID: cidSchema,
      since: nonNegativeIntegerSchema,
      limit: nonNegativeIntegerSchema.optional()
    }).strict()),
    zValidator('query', z.object({
      keyOps: z.stringbool().optional()
    }).strict()),
    async function (c) {
      const { contractID, since, limit } = c.req.valid('param')

      const keyOps = c.req.valid('query').keyOps
      const ip = getClientIP(c)
      try {
        const parsed = maybeParseCID(contractID)
        if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) {
          throw new HTTPException(400)
        }

        const stream = await sbp('backend/db/streamEntriesAfter', contractID, Number(since), limit == null ? undefined : Number(limit), { keyOps }) as Readable
        stream.on('error', (err) => logger.error('eventsAfter stream error', err))
        // "On an HTTP server, make sure to manually close your streams if a request is aborted."
        // From: http://knexjs.org/#Interfaces-Streams
        //       https://github.com/tgriesser/knex/wiki/Manually-Closing-Streams
        // Use the request abort signal to destroy the stream when the client disconnects
        c.req.raw.signal.addEventListener('abort', () => stream.destroy())
        // Convert the Node Readable stream to a web ReadableStream for the Response
        const streamHeaders = (stream as { headers?: Record<string, string> }).headers || {}
        const webStream = Readable.toWeb(stream) as ReadableStream
        return new Response(webStream, {
          headers: { 'content-type': 'application/json', ...streamHeaders }
        })
      } catch (err) {
        if (err instanceof HTTPException) throw err
        ;(err as unknown as { ip: string }).ip = ip
        logger.error(err, `GET /eventsAfter/${contractID}/${since}`, (err as Error).message)
        throw errorMapper(err as Error)
      }
    })

  // This endpoint returns to anyone in possession of a contract's SAK all of the
  // resources that that contract owns (without recursion). This is useful for
  // APIs and for some UI actions (e.g., to warn users about resources that would
  // be (cascade) deleted following a delete)
  app.get('/ownResources',
    authMiddleware('chel-shelter', 'required'),
    async function (c) {
      const billableContractID = (c.get('credentials') as AuthCredentials).billableContractID
      const resources = (await sbp('chelonia.db/get', `_private_resources_${billableContractID}`))?.split('\x00')

      return c.json(resources || [])
    })

  if (process.env.NODE_ENV === 'development') {
    const levelToColor = {
      error: chalk.bold.red,
      warn: chalk.yellow,
      log: chalk.green,
      info: chalk.green,
      debug: chalk.blue
    }
    app.post('/log', async function (c) {
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      const body = await c.req.json() as { level: string, value: string }
      if (!body.level || !body.value) throw new HTTPException(400, { message: 'level and value are required' })
      const ip = getClientIP(c)
      const log = (levelToColor as Record<string, (text: string) => string>)[body.level]
      console.debug(chalk.bold.yellow(`REMOTE LOG (${ip}): `) + log(`[${body.level}] ${body.value}`))
      return c.body(null, 200)
    })
  }

  /*
  // The following endpoint is disabled because name registrations are handled
  // through the `shelter-namespace-registration` header when registering a
  // new contract
  app.post('/name', async function (c) {
    try {
      const { name, value } = await c.req.json()
      if (!name || !value) throw new HTTPException(400)
      if (value.startsWith('_private')) throw new HTTPException(422)
      return c.json(await sbp('backend/db/registerName', name, value))
    } catch (err) {
      if (err instanceof HTTPException) throw err
      logger.error(err, 'POST /name', (err as Error).message)
      throw err
    }
  })
  */

  app.get('/name/:name',
    zValidator('param', z.object({ name: nameSchema }).strict()),
    async function (c) {
      const { name } = c.req.valid('param')
      try {
        const lookupResult = await sbp('backend/db/lookupName', name)
        return lookupResult
          ? c.text(lookupResult)
          : notFoundNoCache(c)
      } catch (err) {
        logger.error(err, `GET /name/${name}`, (err as Error).message)
        throw err
      }
    }
  )

  app.get('/latestHEADinfo/:contractID',
    zValidator('param', z.object({ contractID: cidSchema }).strict()),
    async function (c) {
      const { contractID } = c.req.valid('param')
      try {
        const parsed = maybeParseCID(contractID)
        if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) throw new HTTPException(400)

        const HEADinfo = await sbp('chelonia/db/latestHEADinfo', contractID)
        if (HEADinfo === '') {
          throw new HTTPException(410)
        }
        if (!HEADinfo) {
          console.warn(`[backend] latestHEADinfo not found for ${contractID}`)
          return notFoundNoCache(c)
        }
        return c.json(HEADinfo, 200, { 'Cache-Control': 'no-store' })
      } catch (err) {
        if (err instanceof HTTPException) throw err
        logger.error(err, `GET /latestHEADinfo/${contractID}`, (err as Error).message)
        throw err
      }
    }
  )

  app.get('/time', function (c) {
    return c.text(new Date().toISOString(), 200, {
      'Cache-Control': 'no-store'
    })
  })

  // TODO: if the browser deletes our cache then not everyone
  //       has a complete copy of the data and can act as a
  //       new coordinating server... I don't like that.

  // API endpoint to check for streams support
  app.post('/streams-test', async function (c) {
    const raw = await c.req.arrayBuffer()
    const buf = Buffer.from(raw)
    if (buf.byteLength === 2 && buf.toString() === 'ok') {
      return c.body(null, 204)
    } else {
      throw new HTTPException(400)
    }
  })

  // Development file upload route. The difference between this and /file is that
  // this endpoint bypasses checks in /file for well-formedness, and it also
  // doesn't set or read accounting information.
  // If accepted, the file will be stored in Chelonia DB.
  if (process.env.NODE_ENV === 'development') {
    app.post('/dev-file', bodyLimit({ maxSize: 6 * MEGABYTE }), async function (c) {
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      try {
        console.log('FILE UPLOAD!')
        const formData = await c.req.parseBody({ all: true })
        const hash = formData['hash']
        const data = formData['data']
        if (!hash || typeof hash !== 'string') throw new HTTPException(400, { message: 'missing hash' })
        if (!data || Array.isArray(data)) throw new HTTPException(400, { message: 'missing data' })

        const parsed = maybeParseCID(hash)
        if (!parsed) throw new HTTPException(400, { message: 'invalid hash' })

        const dataStringOrBytes = typeof data === 'string' ? data : Buffer.from(await data.bytes()).toString()
        const ourHash = createCID(dataStringOrBytes, parsed.code)
        if (ourHash !== hash) {
          console.error(`hash(${hash}) != ourHash(${ourHash})`)
          throw new HTTPException(400, { message: 'bad hash!' })
        }
        await sbp('chelonia.db/set', hash, dataStringOrBytes)
        return c.text('/file/' + hash)
      } catch (err) {
        if (err instanceof HTTPException) throw err
        logger.error(err)
        throw new HTTPException(500, { message: 'File upload failed' })
      }
    })
  }

  // File upload route.
  // If accepted, the file will be stored in Chelonia DB.
  app.post('/file',
    authMiddleware('chel-shelter', 'required'),
    bodyLimit({ maxSize: FILE_UPLOAD_MAX_BYTES }),
    async function (c) {
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      try {
        console.info('FILE UPLOAD!')
        const credentials = c.get('credentials') as AuthCredentials
        if (!credentials?.billableContractID) {
          throw new HTTPException(401, { message: 'Uploading files requires ownership information' })
        }

        const contentType = c.req.header('content-type') || ''
        if (!contentType.includes('multipart/form-data')) {
          throw new HTTPException(400, { message: 'Expected multipart/form-data' })
        }

        const formData = await c.req.formData()
        const manifestFile = formData.get('manifest') as File | null
        if (!manifestFile) throw new HTTPException(400, { message: 'missing manifest' })
        if (manifestFile.name !== 'manifest.json') throw new HTTPException(400, { message: 'wrong manifest filename' })
        const manifestPayload = new Uint8Array(await manifestFile.arrayBuffer())

        const manifest = (() => {
          try {
            return JSON.parse(Buffer.from(manifestPayload).toString())
          } catch {
            throw new HTTPException(422, { message: 'Error parsing manifest' })
          }
        })()
        if (!manifest || typeof manifest !== 'object') throw new HTTPException(422, { message: 'manifest format is invalid' })
        if (manifest.version !== '1.0.0') throw new HTTPException(422, { message: 'unsupported manifest version' })
        if (manifest.cipher !== 'aes256gcm') throw new HTTPException(422, { message: 'unsupported cipher' })
        if (!Array.isArray(manifest.chunks) || !manifest.chunks.length) throw new HTTPException(422, { message: 'missing chunks' })

        // Collect all chunk files from form data (numbered keys: 0, 1, 2, ...)
        const chunkFiles: File[] = []
        for (let i = 0; ; i++) {
          const chunkFile = formData.get(String(i)) as File | null
          if (!chunkFile) break
          chunkFiles.push(chunkFile)
        }

        // Now that the manifest format looks right, validate the chunks
        let ourSize = 0
        const chunks: [string, Uint8Array][] = await Promise.all(manifest.chunks.map(async (chunk: [number, string], i: number) => {
        // Validate the chunk information
          if (
            !Array.isArray(chunk) ||
          chunk.length !== 2 ||
          typeof chunk[0] !== 'number' ||
          typeof chunk[1] !== 'string' ||
          !Number.isSafeInteger(chunk[0]) ||
          chunk[0] <= 0
          ) {
            throw new HTTPException(422, { message: 'bad chunk description' })
          }
          if (!chunkFiles[i]) {
            throw new HTTPException(400, { message: 'chunk missing in submitted data' })
          }
          const chunkPayload = new Uint8Array(await chunkFiles[i].arrayBuffer())
          const ourHash = createCID(chunkPayload, multicodes.SHELTER_FILE_CHUNK)
          if (chunkPayload.byteLength !== chunk[0]) {
            throw new HTTPException(400, { message: 'bad chunk size' })
          }
          if (ourHash !== chunk[1]) {
            throw new HTTPException(400, { message: 'bad chunk hash' })
          }
          // We're done validating the chunk
          ourSize += chunk[0]
          return [ourHash, chunkPayload] as [string, Uint8Array]
        }))
        // Finally, verify the size is correct
        if (ourSize !== manifest.size) throw new HTTPException(400, { message: 'Mismatched total size' })

        const manifestHash = createCID(manifestPayload, multicodes.SHELTER_FILE_MANIFEST)

        // Check that we're not overwriting data. At best this is a useless operation
        // since there is no need to write things that exist. However, overwriting
        // data would also make it ambiguous in terms of ownership. For example,
        // someone could upload a file F1 using some existing chunks (from a
        // different file F2) and then request to delete their file F1, which would
        // result in corrupting F2.
        // Ensure that the manifest doesn't exist
        if (await sbp('chelonia.db/get', manifestHash)) {
          throw new Error(`Manifest ${manifestHash} already exists`)
        }
        // Ensure that the chunks do not exist
        await Promise.all(chunks.map(async ([cid]) => {
          const exists = !!(await sbp('chelonia.db/get', cid))
          if (exists) {
            throw new Error(`Chunk ${cid} already exists`)
          }
        }))
        // Now, store all chunks and the manifest
        await Promise.all(chunks.map(([cid, data]) => sbp('chelonia.db/set', cid, data)))
        await sbp('chelonia.db/set', manifestHash, manifestPayload)
        // Store attribution information
        await sbp('backend/server/saveOwner', credentials.billableContractID, manifestHash)
        // Store size information
        const size = manifest.size + manifestPayload.byteLength
        await sbp('backend/server/updateSize', manifestHash, size)
        await sbp('backend/server/updateContractFilesTotalSize', credentials.billableContractID, size)
        // Store deletion token
        const deletionTokenDgst = c.req.header('shelter-deletion-token-digest')
        if (deletionTokenDgst) {
          await sbp('chelonia.db/set', `_private_deletionTokenDgst_${manifestHash}`, deletionTokenDgst)
        }
        return c.text(manifestHash)
      } catch (err) {
        if (err instanceof HTTPException) throw err
        logger.error(err, 'POST /file', (err as Error).message)
        throw err
      }
    })

  // Serve data from Chelonia DB.
  // Note that a `Last-Modified` header isn't included in the response.
  app.get('/file/:hash',
    zValidator('param', z.object({ hash: cidSchema }).strict()),
    async function (c) {
      const { hash } = c.req.valid('param')

      const parsed = maybeParseCID(hash)
      if (!parsed) {
        throw new HTTPException(400)
      }

      const blobOrString = await sbp('chelonia.db/get', `any:${hash}`)
      if (blobOrString?.length === 0) {
        throw new HTTPException(410)
      } else if (!blobOrString) {
        return notFoundNoCache(c)
      }

      const type = cidLookupTable[parsed.code] || 'application/octet-stream'

      return c.body(blobOrString, 200, {
        'ETag': `"${hash}"`,
        'Cache-Control': 'public,max-age=31536000,immutable',
        // CSP to disable everything -- this only affects direct navigation to the
        // `/file` URL.
        // The CSP below prevents any sort of resource loading or script execution
        // on direct navigation. The `nosniff` header instructs the browser to
        // honour the provided content-type.
        'Content-Security-Policy': 'default-src \'none\'; frame-ancestors \'none\'; form-action \'none\'; upgrade-insecure-requests; sandbox',
        'X-Content-Type-Options': 'nosniff',
        'Content-Type': type
      })
    }
  )

  app.post('/deleteFile/:hash',
    authMiddleware(['chel-shelter', 'chel-bearer'], 'required'),
    zValidator('param', z.object({ hash: cidSchema }).strict()),
    async function (c) {
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      const { hash } = c.req.valid('param')
      const strategy = c.get('authStrategy')
      const parsed = maybeParseCID(hash)
      if (parsed?.code !== multicodes.SHELTER_FILE_MANIFEST) {
        throw new HTTPException(400)
      }

      const owner = await sbp('chelonia.db/get', `_private_owner_${hash}`)
      if (!owner) {
        throw new HTTPException(404)
      }

      const credentials = c.get('credentials') as AuthCredentials
      switch (strategy) {
        case 'chel-shelter': {
          const ultimateOwner = await lookupUltimateOwner(owner)
          // Check that the user making the request is the ultimate owner (i.e.,
          // that they have permission to delete this file)
          if (!ctEq(credentials.billableContractID as string, ultimateOwner)) {
            throw new HTTPException(401, { message: 'Invalid shelter auth' })
          }
          break
        }
        case 'chel-bearer': {
          const expectedTokenDgst = await sbp('chelonia.db/get', `_private_deletionTokenDgst_${hash}`)
          if (!expectedTokenDgst) {
            throw new HTTPException(404)
          }
          const tokenDgst = blake32Hash(credentials.token as string)
          // Constant-time comparison
          // Check that the token provided matches the deletion token for this file
          if (!ctEq(expectedTokenDgst, tokenDgst)) {
            throw new HTTPException(401, { message: 'Invalid token' })
          }
          break
        }
        default:
          throw new HTTPException(401, { message: 'Missing or invalid auth strategy' })
      }

      // Authentication passed, now proceed to delete the file and its associated
      // keys
      try {
        await sbp('backend/deleteFile', hash, null, true)
        return c.body(null, 200)
      } catch (e) {
        throw errorMapper(e as Error)
      }
    })

  app.post('/deleteContract/:hash',
    authMiddleware(['chel-shelter', 'chel-bearer'], 'required'),
    zValidator('param', z.object({ hash: cidSchema }).strict()),
    async function (c) {
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      const { hash } = c.req.valid('param')
      const strategy = c.get('authStrategy')

      const credentials = c.get('credentials') as AuthCredentials
      switch (strategy) {
        case 'chel-shelter': {
          const owner = await sbp('chelonia.db/get', `_private_owner_${hash}`)
          if (!owner) {
            throw new HTTPException(404)
          }

          const ultimateOwner = await lookupUltimateOwner(owner)
          // Check that the user making the request is the ultimate owner (i.e.,
          // that they have permission to delete this file)
          if (!ctEq(credentials.billableContractID as string, ultimateOwner)) {
            throw new HTTPException(401, { message: 'Invalid shelter auth' })
          }
          break
        }
        case 'chel-bearer': {
          const expectedTokenDgst = await sbp('chelonia.db/get', `_private_deletionTokenDgst_${hash}`)
          if (!expectedTokenDgst) {
            throw new HTTPException(404)
          }
          const tokenDgst = blake32Hash(credentials.token as string)
          // Constant-time comparison
          // Check that the token provided matches the deletion token for this contract
          if (!ctEq(expectedTokenDgst, tokenDgst)) {
            throw new HTTPException(401, { message: 'Invalid token' })
          }
          break
        }
        default:
          throw new HTTPException(401, { message: 'Missing or invalid auth strategy' })
      }

      const username = await sbp('chelonia.db/get', `_private_cid2name_${hash}`)
      // Authentication passed, now proceed to delete the contract and its associated
      // keys
      try {
        const [id] = sbp('chelonia.persistentActions/enqueue', ['backend/deleteContract', hash, null, true])
        if (username) {
          const ip = getClientIP(c)
          console.info({ contractID: hash, username, ip, taskId: id }, 'Scheduled deletion on named contract')
        }
        // We return the queue ID to allow users to track progress
        // TODO: Tracking progress not yet implemented
        return c.json({ id }, 202)
      } catch (e) {
        throw errorMapper(e as Error)
      }
    })

  app.post('/kv/:contractID/:key',
    zValidator('param', z.object({ contractID: cidSchema, key: kvKeySchema }).strict()),
    authMiddleware('chel-shelter', 'required'),
    bodyLimit({ maxSize: 6 * MEGABYTE }),
    async function (c) {
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      const { contractID, key } = c.req.valid('param')

      const parsed = maybeParseCID(contractID)
      if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) {
        throw new HTTPException(400)
      }

      const credentials = c.get('credentials') as AuthCredentials
      if (!ctEq(credentials.billableContractID as string, contractID)) {
        throw new HTTPException(401)
      }

      const payloadBuffer = Buffer.from(await c.req.arrayBuffer())

      // Use a queue to prevent race conditions (for example, writing to a contract
      // that's being deleted or updated)
      return sbp('chelonia/queueInvocation', contractID, async () => {
        const existing = await sbp('chelonia.db/get', `_private_kv_${contractID}_${key}`)

        // Some protection against accidental overwriting by implementing the if-match
        // header
        const expectedEtag = c.req.header('if-match')
        if (!expectedEtag) {
          throw new HTTPException(400, { message: 'if-match is required' })
        }
        // "Quote" string (to match ETag format)
        const cid = existing ? createCID(existing, multicodes.RAW) : ''

        if (expectedEtag === '*') {
          // pass through
        } else {
          if (!expectedEtag.split(',').map((v: string) => v.trim()).includes(`"${cid}"`)) {
            return new Response(existing || '', {
              status: 412,
              headers: {
                'ETag': `"${cid}"`,
                'x-cid': `"${cid}"`
              }
            })
          }
        }

        try {
          const serializedData = JSON.parse(payloadBuffer.toString())
          const { contracts } = sbp('chelonia/rootState')
          // Check that the height is the latest value
          if (contracts[contractID].height !== Number(serializedData.height)) {
            return new Response(existing || '', {
              status: 409,
              headers: {
                'ETag': `"${cid}"`,
                'x-cid': `"${cid}"`
              }
            })
          }
          // Check that the signature is valid
          sbp('chelonia/parseEncryptedOrUnencryptedDetachedMessage', {
            contractID,
            serializedData,
            meta: key
          })
        } catch (parseErr) {
          if (parseErr instanceof Response) throw parseErr
          throw new HTTPException(422)
        }

        const existingSize = existing ? Buffer.from(existing).byteLength : 0
        await sbp('chelonia.db/set', `_private_kv_${contractID}_${key}`, payloadBuffer)
        await sbp('backend/server/updateSize', contractID, payloadBuffer.byteLength - existingSize)
        await appendToIndexFactory(`_private_kvIdx_${contractID}`)(key)
        // No await on broadcast for faster responses
        sbp('backend/server/broadcastKV', contractID, key, payloadBuffer.toString()).catch((e: Error) => console.error(e, 'Error broadcasting KV update', contractID, key))

        return c.body(null, 204)
      })
    })

  app.get('/kv/:contractID/:key',
    authMiddleware('chel-shelter', 'required'),
    zValidator('param', z.object({ contractID: cidSchema, key: kvKeySchema }).strict()),
    async function (c) {
      const { contractID, key } = c.req.valid('param')

      const parsed = maybeParseCID(contractID)
      if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) {
        throw new HTTPException(400)
      }

      const credentials = c.get('credentials') as AuthCredentials
      if (!ctEq(credentials.billableContractID as string, contractID)) {
        throw new HTTPException(401)
      }

      const result = await sbp('chelonia.db/get', `_private_kv_${contractID}_${key}`)
      if (!result) {
        return notFoundNoCache(c)
      }

      const cid = createCID(result, multicodes.RAW)
      return new Response(result, {
        headers: {
          'ETag': `"${cid}"`,
          'x-cid': `"${cid}"`,
          'Cache-Control': 'no-store'
        }
      })
    })

  app.get('/serverMessages', function (c) {
    const messages = nconf.get('server:messages')
    if (!messages) return c.json([])
    return c.json(messages, 200, { 'Cache-Control': 'no-store' })
  })

  // SPA routes

  app.get('/assets/:subpath{.+}', function (c) {
    const subpath = c.req.param('subpath')
    return serveAsset(c, subpath, staticServeConfig.distAssets)
  })

  // Dashboard-specific assets route (when IS_CHELONIA_DASHBOARD_DEV is set)
  if (isCheloniaDashboard) {
    app.get('/dashboard/assets/:subpath{.+}', function (c) {
      const subpath = c.req.param('subpath')
      return serveAsset(c, subpath, staticServeConfig.distAssets)
    })
  }

  // SPA catch-all route
  app.get(isCheloniaDashboard ? '/dashboard/*' : '/app/*', async function (c) {
    try {
      const file = await Deno.readFile(staticServeConfig.distIndexHtml)
      return c.body(file, 200, { 'Content-Type': 'text/html' })
    } catch {
      return notFoundNoCache(c)
    }
  })

  app.get('/', function (c) {
    return c.redirect(staticServeConfig.redirect)
  })

  const zkppRegisterBodySchema = z.union([
    z.object({ b: z.string() }).strict(),
    z.object({ r: z.string(), s: z.string(), sig: z.string(), Eh: z.string() }).strict()
  ])
  app.post('/zkpp/register/:name',
    zValidator('param', z.object({ name: nameSchema }).strict()),
    zValidatorFormOrJson(zkppRegisterBodySchema),
    async function (c) {
      const { name } = c.req.valid('param')
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })

      const payload = c.get('validatedBody') as z.infer<typeof zkppRegisterBodySchema>

      const lookupResult = await sbp('backend/db/lookupName', name)
      if (lookupResult) {
      // If the username is already registered, abort
        throw new HTTPException(409)
      }
      try {
        if ('b' in payload) {
          const result = registrationKey(name, payload.b)

          if (result) {
            return c.json(result)
          }
        } else {
          const result = register(name, payload.r, payload.s, payload.sig, payload.Eh)

          if (result) {
            return c.text(result)
          }
        }
      } catch (e) {
        if (e instanceof HTTPException) throw e
        ;(e as { ip: string }).ip = getClientIP(c)
        console.error(e, 'Error at POST /zkpp/register/:name: ' + (e as Error).message)
      }

      throw new HTTPException(500, { message: 'internal error' })
    }
  )

  app.get('/zkpp/:contractID/auth_hash',
    zValidator('param', z.object({ contractID: cidSchema }).strict()),
    zValidator('query', z.object({ b: z.string().min(1, 'b is required') })),
    async function (c) {
      const { contractID } = c.req.valid('param')
      const { b } = c.req.valid('query')
      try {
        const challenge = await getChallenge(contractID, b)

        return challenge ? c.json(challenge) : notFoundNoCache(c)
      } catch (e) {
        ;(e as unknown as { ip: string }).ip = getClientIP(c)
        console.error(e, 'Error at GET /zkpp/{contractID}/auth_hash: ' + (e as Error).message)
      }

      throw new HTTPException(500, { message: 'internal error' })
    }
  )

  app.get('/zkpp/:contractID/contract_hash',
    zValidator('param', z.object({ contractID: cidSchema }).strict()),
    zValidator('query', z.object({
      r: z.string().min(1, 'r is required'),
      s: z.string().min(1, 's is required'),
      sig: z.string().min(1, 'sig is required'),
      hc: z.string().min(1, 'hc is required')
    }).strict()),
    async function (c) {
      const { contractID } = c.req.valid('param')
      const { r, s, sig, hc } = c.req.valid('query')
      try {
        const salt = await getContractSalt(contractID, r, s, sig, hc)

        if (salt) {
          return c.text(salt)
        }
      } catch (e) {
        ;(e as { ip: string }).ip = getClientIP(c)
        console.error(e, 'Error at GET /zkpp/{contractID}/contract_hash: ' + (e as Error).message)
      }

      throw new HTTPException(500, { message: 'internal error' })
    }
  )

  const zkppUpdatePasswordBodySchema = z.object({
    r: z.string().min(1, 'r is required'),
    s: z.string().min(1, 's is required'),
    sig: z.string().min(1, 'sig is required'),
    hc: z.string().min(1, 'hc is required'),
    Ea: z.string().min(1, 'Ea is required')
  }).strict()
  app.post('/zkpp/:contractID/updatePasswordHash',
    zValidator('param', z.object({ contractID: cidSchema }).strict()),
    zValidatorFormOrJson(zkppUpdatePasswordBodySchema),
    async function (c) {
      const { contractID } = c.req.valid('param')
      if (ARCHIVE_MODE) throw new HTTPException(501, { message: 'Server in archive mode' })
      try {
        const payload = c.get('validatedBody') as z.infer<typeof zkppUpdatePasswordBodySchema>
        const result = await updateContractSalt(contractID, payload.r, payload.s, payload.sig, payload.hc, payload.Ea)

        if (result) {
          return c.json(result)
        }
      } catch (e) {
        if (e instanceof HTTPException) throw e
        ;(e as unknown as { ip: string }).ip = getClientIP(c)
        console.error(e, 'Error at POST /zkpp/{contractID}/updatePasswordHash: ' + (e as Error).message)
      }

      throw new HTTPException(500, { message: 'internal error' })
    }
  )
}

import { verifyShelterAuthorizationHeader } from 'npm:@chelonia/lib/utils'
import { HTTPException } from 'npm:hono/http-exception'
import type { Context, MiddlewareHandler } from 'npm:hono'

export type AuthCredentials = {
  token?: string
  billableContractID?: string
}

declare module 'npm:hono' {
  interface ContextVariableMap {
    credentials: AuthCredentials
    authStrategy: string
  }
}

function extractBearer (c: Context): AuthCredentials | null {
  const authorization = c.req.header('authorization')
  if (!authorization) return null
  const prefix = 'bearer '
  if (authorization.slice(0, prefix.length) !== prefix) return null
  return { token: authorization.slice(prefix.length) }
}

function extractShelter (c: Context): AuthCredentials | null {
  const authorization = c.req.header('authorization')
  if (!authorization) return null
  const prefix = 'shelter '
  if (authorization.slice(0, prefix.length) !== prefix) return null
  try {
    const billableContractID = verifyShelterAuthorizationHeader(authorization)
    return { billableContractID }
  } catch (e) {
    console.warn(e, 'Shelter authorization failed')
    return null
  }
}

const extractors: Record<string, (c: Context) => AuthCredentials | null> = {
  'chel-bearer': extractBearer,
  'chel-shelter': extractShelter
}

export function authMiddleware (
  strategies: string | string[],
  mode: 'required' | 'optional' = 'required'
): MiddlewareHandler {
  const strategyList = Array.isArray(strategies) ? strategies : [strategies]

  return async (c, next) => {
    for (const strategy of strategyList) {
      const extractor = extractors[strategy]
      if (!extractor) throw new Error(`Unknown auth strategy: ${strategy}`)
      const credentials = extractor(c)
      if (credentials) {
        c.set('credentials', credentials)
        c.set('authStrategy', strategy)
        return next()
      }
    }
    if (mode === 'optional') {
      c.set('credentials', {} as AuthCredentials)
      c.set('authStrategy', '')
      return next()
    }
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
}

import { Hapi, Request, ResponseToolkit, Boom, verifyShelterAuthorizationHeader } from '~/deps.ts'

const plugin = {
  name: 'chel-auth',
  register (server: Hapi, opts: unknown) {
    server.auth.scheme('chel-bearer', (server: Hapi, options: Record<string, unknown>) => {
      return {
        authenticate (request: Request, h: ResponseToolkit) {
          const { authorization } = request.headers
          if (!authorization) {
            return h.unauthenticated(Boom.unauthorized(null, 'bearer'))
          }
          const thisScheme = 'bearer '
          if (authorization.slice(0, thisScheme.length) !== thisScheme) {
            return h.unauthenticated(Boom.unauthorized(null, 'bearer'))
          }
          const token = authorization.slice(thisScheme.length)
          return h.authenticated({ credentials: { token } })
        }
      }
    })

    server.auth.scheme ('chel-shelter', (server: Hapi, options: Record<string, unknown>) => {
      return {
        authenticate (request: Request, h: ResponseToolkit) {
          const { authorization } = request.headers
          if (!authorization) {
            return h.unauthenticated(Boom.unauthorized(null, 'shelter'))
          }
          const thisScheme = 'shelter '
          if (authorization.slice(0, thisScheme.length) !== thisScheme) {
            return h.unauthenticated(Boom.unauthorized(null, 'shelter'))
          }
          try {
            const billableContractID = verifyShelterAuthorizationHeader(authorization)
            return h.authenticated({ credentials: { billableContractID } })
          } catch (e: unknown) {
            console.warn(e, 'Shelter authorization failed')
            return h.unauthenticated(Boom.unauthorized('Authentication failed', 'shelter'))
          }
        }
      }
    })

    server.auth.strategy('chel-bearer', 'chel-bearer')
    server.auth.strategy('chel-shelter', 'chel-shelter')
  }
}

export default plugin

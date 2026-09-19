import { assertEquals } from 'jsr:@std/assert'
import { module as serveCommand } from './serve.ts'

Deno.test('serve port options leave defaults to nconf', () => {
  const builder = serveCommand.builder
  if (typeof builder !== 'function') throw new Error('serve command builder is not callable')
  const options = new Map<string, Record<string, unknown>>()
  const fakeYargs = {
    option (name: string, config: Record<string, unknown>) {
      options.set(name, config)
      return this
    },
    alias () {
      return this
    },
    positional () {
      return this
    },
  } as unknown as Parameters<typeof builder>[0]
  builder(fakeYargs)

  assertEquals(options.get('port')?.default, undefined)
  assertEquals(options.get('dashboard-port')?.default, undefined)
})

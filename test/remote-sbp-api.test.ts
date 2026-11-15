import { createServer as createHttpServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { assertEquals } from 'jsr:@std/assert'
import sbp from 'npm:@sbp/sbp'
import { RSI_ERROR, RSI_OK, createServer, type WSS } from '../src/serve/pubsub.ts'
import '../src/serve/remote-sbp-api.ts'

sbp('sbp/selectors/register', {
  'pubsub/test/reject' (...args: unknown[]) {
    return new Promise((resolve, reject) => reject(args))
  },
  'pubsub/test/rejectNewError' (message: string) {
    return new Promise((resolve, reject) => reject(new Error(message)))
  },
  'pubsub/test/return' (...args: unknown[]) {
    return args
  },
  'pubsub/test/resolve' (...args: unknown[]) {
    return new Promise(resolve => resolve(args))
  },
  'pubsub/test/resolveLater' (arg: unknown, delay: number) {
    return new Promise(resolve => {
      setTimeout(() => resolve(arg), delay)
    })
  },
  'pubsub/test/throwNewError' (message: string) {
    throw new Error(message)
  },
  'pubsub/test/throwNewErrorAsync' (message: string) {
    return new Promise(() => {
      throw new Error(message)
    })
  },
})

// This test currently uses a minimal pubsub client mock.
// TODO: use a real libchelonia client.
Deno.test('Remote SBP invocation via web sockets', async () => {
  const http = createHttpServer()
  await new Promise<void>(resolve => http.listen(0, resolve))
  const pubsubServer = createServer(http) as WSS
  const { port } = http.address() as AddressInfo

  const ws = new WebSocket(`ws://127.0.0.1:${port}`)
  await new Promise(resolve => {
    ws.onopen = resolve

    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data)
      pending.get(msg.to)?.(msg)
    }
  })
  let nextId = 0
  const pending = new Map<number, (msg: unknown) => void>()

  const rsi = (data: unknown, timeout = 2000) => {
    const id = ++nextId
    return new Promise<any>((resolve, reject) => {
      const timeoutID = setTimeout(() => { pending.delete(id); reject(new Error(`No reply for ID ${id}`)) }, timeout)
      pending.set(id, msg => { clearTimeout(timeoutID); pending.delete(id); resolve(msg) })
      ws.send(JSON.stringify({ type: 'rsi', id, data }))
    })
  }

  try {
    const data = ['foo', 'bar']
    const msg = 'boom'
    // Run the promises concurrently to test if the returned 'to' values still match correctly.
    await Promise.all([
      rsi(['test/reject', ...data]).then(r => assertEquals(r, { type: RSI_ERROR, to: 1, data: '' })),
      rsi(['test/resolve', ...data]).then(r => assertEquals(r, { type: RSI_OK, to: 2, data })),
      rsi(['test/return', ...data]).then(r => assertEquals(r, { type: RSI_OK, to: 3, data })),
      rsi(['test/rejectNewError', msg]).then(r => assertEquals(r, { type: RSI_ERROR, to: 4, data: msg })),
      rsi(['test/throwNewError', msg]).then(r => assertEquals(r, { type: RSI_ERROR, to: 5, data: msg })),
      rsi(['test/throwNewErrorAsync', msg]).then(r => assertEquals(r, { type: RSI_ERROR, to: 6, data: msg }))
    ])

    assertEquals((await rsi([])).type, RSI_ERROR)
    assertEquals((await rsi({})).type, RSI_ERROR)
    assertEquals((await rsi(['test/unknown'])).type, RSI_ERROR)
    assertEquals((await rsi('not-an-array')).type, RSI_ERROR)
  } finally {
    ws.close()
    clearInterval(pubsubServer.pingIntervalID)
    pubsubServer.close()
    await new Promise(r => http.close(r))
  }
})

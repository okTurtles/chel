import { Buffer } from 'node:buffer'
import { deserializer, serdesDeserializeSymbol, serdesSerializeSymbol, serdesTagSymbol, serializer } from 'npm:@chelonia/serdes'
import 'npm:@sbp/okturtles.eventqueue'
import sbp from 'npm:@sbp/sbp'
import './logger.ts'

Object.defineProperties(Buffer, {
  [serdesDeserializeSymbol]: {
    value (buf: Uint8Array) {
      return Buffer.from(buf)
    }
  },
  [serdesSerializeSymbol]: {
    value (buf: Buffer) {
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
    }
  },
  [serdesTagSymbol]: {
    value: 'node:buffer'
  }
})
deserializer.register(Buffer as typeof Buffer & { [serdesDeserializeSymbol]: (buf: unknown) => Buffer, [serdesTagSymbol]: string })

export const readyQueueName = 'parentPort'

const rpc = (...args: unknown[]) => {
  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel()
    const onmessage = (event: MessageEvent) => {
      if (event.data && Array.isArray(event.data)) {
        const r = deserializer(event.data[1])

        if (event.data[0] === true) {
          resolve(r)
        } else {
          reject(r)
        }
        cleanup()
      }
    }
    const onmessageerror = (event: MessageEvent) => {
      reject(event.data)
      cleanup()
    }
    const cleanup = () => {
      // This can help prevent memory leaks if the GC doesn't clean up once
      // the port goes out of scope
      messageChannel.port1.removeEventListener('message', onmessage, false)
      messageChannel.port1.removeEventListener('messageerror', onmessageerror, false)
      messageChannel.port1.close()
    }
    messageChannel.port1.addEventListener('message', onmessage, false)
    messageChannel.port1.addEventListener('messageerror', onmessageerror, false)
    messageChannel.port1.start()
    const { data, transferables } = serializer(args)
    ;(self.postMessage as unknown as Worker['postMessage'])({
      type: 'sbp',
      port: messageChannel.port2,
      data
    }, [messageChannel.port2, ...transferables])
  })
}

sbp('sbp/selectors/register', {
  'chelonia.db/*': rpc
})

self.addEventListener('message', (ev) => {
  if (!Array.isArray(ev.data) || ev.data.length < 1) return
  const [port, ...msg] = ev.data as [MessagePort, ...unknown[]]
  if (!port) return

  sbp('okTurtles.eventQueue/queueEvent', readyQueueName, () => {
    (async () => {
      try {
        // The `any` cast is not ideal, but sbp's dynamic nature makes
        // this hard to type statically without more complex infrastructure.
        port.postMessage([true, await sbp(...(msg as [string, ...unknown[]]))])
      } catch (e) {
        port.postMessage([false, e])
      }
    })()
  })
})

sbp('okTurtles.eventQueue/queueEvent', readyQueueName, () => {
  self.postMessage('ready')
})

import { Buffer } from 'node:buffer'
import { basename } from 'node:path'
import process from 'node:process'
import { deserializer, serdesDeserializeSymbol, serdesSerializeSymbol, serdesTagSymbol, serializer } from 'npm:@chelonia/serdes'
import sbp from 'npm:@sbp/sbp'

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

export type WorkerType = {
    ready: Promise<void>,
    rpcSbp: (...args: unknown[]) => Promise<unknown>,
    terminate: () => void | Promise<void>
  }

const createWorker = (path: string): WorkerType => {
  let worker: Worker
  let ready: Promise<void>

  const launchWorker = (): Promise<void> => {
    worker = new Worker(new URL(path, import.meta.url), { type: 'module' })
    return new Promise<void>((resolve, reject) => {
      const msgHandler = (event: MessageEvent) => {
        const msg = event.data
        if (msg === 'ready') {
          worker.removeEventListener('error', reject, { capture: false })
          worker.addEventListener('error', (ev) => {
            const e = ev.error
            console.error(e, `Running worker ${basename(path)} terminated. Attempting relaunch...`)
            worker.removeEventListener('message', msgHandler, false)
            // This won't result in an infinite loop because of exiting and
            // because this handler is only executed after the 'ready' event
            // Relaunch can happen multiple times, so long as the worker doesn't
            // immediately fail.
            ready = launchWorker().catch((e: unknown) => {
              console.error(e, `Error on worker ${basename(path)} relaunch`)
              process.exit(1)
            })
          }, false)
          resolve()
        } else if (msg && typeof msg === 'object' && msg.type === 'sbp' && Array.isArray(msg.data) && String(msg.data[0]).startsWith('chelonia.db/')) {
          const port = msg.port
          Promise.try(() => sbp(...(deserializer(msg.data)) as [string, ...unknown[]])).then((r) => {
            const { data, transferables } = serializer(r)
            port.postMessage([true, data], transferables)
          }).catch((e) => {
            const { data, transferables } = serializer(e)
            port.postMessage([false, data], transferables)
          }).finally(() => {
            port.close()
          })
        }
      }
      worker.addEventListener('message', msgHandler, false)
      worker.addEventListener('error', reject, { capture: false, once: true })
    })
  }
  ready = launchWorker()

  const rpcSbp = (...args: unknown[]): Promise<unknown> => {
    return ready.then(() => new Promise<unknown>((resolve, reject) => {
      const mc = new MessageChannel()
      const cleanup = ((worker: Worker) => () => {
        worker.removeEventListener('error', reject, { capture: true })
        mc.port2.close()
        mc.port2.onmessage = null
        mc.port2.onmessageerror = null
      })(worker)
      mc.port2.onmessage = (event) => {
        cleanup()
        const [success, result] = (event.data as unknown) as [boolean, unknown]
        if (success) return resolve(result)
        reject(result)
      }
      mc.port2.onmessageerror = () => {
        cleanup()
        reject(new Error('Message error'))
      }
      worker.postMessage([mc.port1, ...args], [mc.port1])
      // If the worker itself breaks during an SBP call, we want to make sure
      // this promise immediately rejects
      worker.addEventListener('error', reject, { capture: false, once: true })
    }))
  }

  return {
    ready,
    rpcSbp,
    terminate: () => worker.terminate()
  }
}

export default createWorker

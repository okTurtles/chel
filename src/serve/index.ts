import process from 'node:process'
import 'npm:@sbp/okturtles.data'
import 'npm:@sbp/okturtles.eventqueue'
import 'npm:@sbp/okturtles.events'
import sbp from 'npm:@sbp/sbp'
import chalk from 'npm:chalk'
import { SERVER_EXITING, SERVER_RUNNING } from './events.ts'
import { PUBSUB_INSTANCE } from './instance-keys.ts'
import './logger.ts'

console.info('NODE_ENV =', process.env.NODE_ENV)

const dontLog: Record<string, boolean> = {
  'backend/server/broadcastEntry': true,
  'backend/server/broadcastDeletion': true,
  'backend/server/broadcastKV': true
}

function logSBP (_domain: string, selector: string, data: Array<unknown>) {
  if (!dontLog[selector]) {
    if (selector === 'backend/server/handleEntry') {
      console.debug(chalk.bold(`[sbp] ${selector}`), (data[0] as { description: () => string }).description())
    } else {
      console.debug(chalk.bold(`[sbp] ${selector}`), data)
    }
  }
}

;['backend'].forEach(domain => sbp('sbp/filters/domain/add', domain, logSBP))
// any specific selectors outside of backend namespace to log
;[].forEach(sel => sbp('sbp/filters/selector/add', sel, logSBP))

export default (new Promise<void>((resolve, reject) => {
  sbp('okTurtles.events/on', SERVER_RUNNING, function () {
    console.info(chalk.bold('backend startup sequence complete.'))
    resolve()
  })
  // call this after we've registered listener for SERVER_RUNNING
  import('./server.ts').catch(reject)
}))

sbp('okTurtles.events/once', SERVER_EXITING, () => {
  sbp('okTurtles.data/apply', PUBSUB_INSTANCE, function (pubsub: { on: (event: string, callback: () => void) => void; close: () => void; clients: { forEach: (callback: (client: { terminate: () => void }) => void) => void } }) {
    sbp('okTurtles.eventQueue/queueEvent', SERVER_EXITING, () => {
      return new Promise<void>((resolve) => {
        pubsub.on('close', async function () {
          try {
            await sbp('backend/server/stop')
            console.info('Hapi server down')
          } catch (err) {
            console.error(err, 'Error during shutdown')
          } finally {
            resolve()
          }
        })
        pubsub.close()
        // Since `ws` v8.0, `WebSocketServer.close()` no longer closes remaining connections.
        // See https://github.com/websockets/ws/commit/df7de574a07115e2321fdb5fc9b2d0fea55d27e8
        pubsub.clients.forEach((client: { terminate: () => void }) => client.terminate())
      })
    })
  })
})

process.on('uncaughtException', (err: Error) => {
  console.error(err, '[server] Unhandled exception')
  process.exit(1)
})

process.on('unhandledRejection', (reason: unknown) => {
  console.error(reason, '[server] Unhandled promise rejection:', reason)
  process.exit(1)
})

const exit = (code: number) => {
  // Make sure `process.exit` is called after all existing SERVER_EXITING
  // handlers. This is because once `process.exit` is called, all handlers
  // must be synchronous.
  sbp('okTurtles.events/once', SERVER_EXITING, () => {
    // In case there are asynchronous events, wait for them to finish
    sbp('okTurtles.eventQueue/queueEvent', SERVER_EXITING, () => {
      process.send?.({}) // tell grunt we've successfully shutdown the server
      process.nextTick(() => process.exit(code)) // triple-check we quit :P
    })
  })
  sbp('okTurtles.events/emit', SERVER_EXITING)
}

const handleSignal = (signal: string, code: number) => {
  process.on(signal, () => {
    console.error(`Exiting upon receiving ${signal} (${code})`)
    // Exit codes follow the 128 + signal code convention.
    // See <https://tldp.org/LDP/abs/html/exitcodes.html>
    exit(128 + code)
  })
}

// Codes from <signal.h>
;([
  ['SIGHUP', 1],
  ['SIGINT', 2],
  ['SIGQUIT', 3],
  ['SIGTERM', 15],
  ['SIGUSR1', 10],
  ['SIGUSR2', 11]
] as [string, number][]).forEach(([signal, code]) => handleSignal(signal, code))

// TODO: should we use Bluebird to handle swallowed errors
// http://jamesknelson.com/are-es6-promises-swallowing-your-errors/
// when spawned via grunt, listen for message to cleanly shutdown and relinquish port
process.on('message', (message) => {
  console.info('message received in child, shutting down...', message)
  exit(0)
})

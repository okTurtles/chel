import process from 'node:process'
import 'npm:@sbp/okturtles.data'
import 'npm:@sbp/okturtles.eventqueue'
import 'npm:@sbp/okturtles.events'
import sbp from 'npm:@sbp/sbp'
import chalk from 'npm:chalk'
import { SERVER_EXITING, SERVER_RUNNING } from './events.ts'
import { startServer as startServerImpl, stopServer as stopServerImpl } from './server.ts'
import { initializeLogger } from './logger.ts'

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

// Signal handlers are installed only once per process
let signalHandlersInstalled = false
const signalHandlers: Array<[string, () => void]> = []

// Global exception handlers are installed only once per process
let globalExceptionHandlersInstalled = false

// Helper to install global exception handlers (once per process)
function installGlobalExceptionHandlers (): void {
  if (globalExceptionHandlersInstalled) return
  globalExceptionHandlersInstalled = true

  process.on('uncaughtException', (err: Error) => {
    console.error(err, '[server] Unhandled exception')
    process.exit(1)
  })

  process.on('unhandledRejection', (reason: unknown) => {
    console.error(reason, '[server] Unhandled promise rejection:', reason)
    process.exit(1)
  })
}

// Helper to install signal handlers
function installSignalHandlers (): void {
  if (signalHandlersInstalled) return
  signalHandlersInstalled = true

  const handleSignal = (signal: string, code: number) => {
    const handler = () => {
      console.error(`Exiting upon receiving ${signal} (${code})`)
      // Exit codes follow the 128 + signal code convention.
      // See <https://tldp.org/LDP/abs/html/exitcodes.html>
      exit(128 + code)
    }
    signalHandlers.push([signal, handler])
    process.on(signal, handler)
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
}

export function removeSignalHandlers (): void {
  for (const [signal, handler] of signalHandlers) {
    process.removeListener(signal, handler)
  }
  signalHandlers.length = 0
  signalHandlersInstalled = false
}

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

export interface StartServerOptions {
  installSignalHandlers?: boolean
}

export async function startServer (options: StartServerOptions = {}): Promise<{ uri: string }> {
  const { installSignalHandlers: shouldInstallSignalHandlers = true } = options

  // Initialize pino logger (replaces console.* methods)
  initializeLogger()

  // Install global exception handlers once per process (only if signal handlers are enabled)
  if (shouldInstallSignalHandlers) {
    installGlobalExceptionHandlers()
    installSignalHandlers()
  }

  // Register a SERVER_EXITING handler for this startServer call
  // This handler self-removes when it fires
  sbp('okTurtles.events/once', SERVER_EXITING, async () => {
    try {
      removeSignalHandlers()
      await stopServer()
      console.info('Server down')
    } catch (err) {
      console.error(err, 'Error during shutdown')
    }
  })

  // Start the server and wait for it to be running
  return await new Promise((resolve, reject) => {
    sbp('okTurtles.events/on', SERVER_RUNNING, function onRunning (info: { info: { uri: string } }) {
      sbp('okTurtles.events/off', SERVER_RUNNING, onRunning)
      console.info(chalk.bold('backend startup sequence complete.'))
      resolve({ uri: info.info.uri })
    })
    startServerImpl().catch(reject)
  })
}

export async function stopServer (): Promise<void> {
  await stopServerImpl()
}

// Backwards compatibility: default export is startServer
export default startServer

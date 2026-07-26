import process from 'node:process'
import pino from 'npm:pino'

// `PRETTY` (and dev/CI envs) only raise the default log level to `debug`; it no
// longer enables pretty rendering here (that happens externally via a piped
// `pino-pretty`, see the NOTE below). Kept for backward compatibility.
const verboseByDefault = process.env.NODE_ENV === 'development' || process.env.CI || process.env.CYPRESS_RECORD_KEY || process.env.PRETTY

function getLogLevel (): string {
  return process.env.LOG_LEVEL || (verboseByDefault ? 'debug' : 'info')
}

function logMethod (this: unknown, args: unknown[], method: (...args: unknown[]) => void): void {
  const stringIdx = typeof args[0] === 'string' ? 0 : 1
  if (args.length > 1) {
    for (let i = stringIdx + 1; i < args.length; ++i) {
      (args[stringIdx] as string) += typeof args[i] === 'string' ? ' %s' : ' %o'
    }
  }
  method.apply(this, args)
}

type Logger = {
  level: string;
  levels: { values: Record<string, unknown> };
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

// NOTE: We deliberately avoid pino's `transport` option (e.g. `pino-pretty`).
// pino transports run in a worker thread that resolves the target module at
// runtime, which breaks inside `deno compile` binaries and results in a
// confusing "unable to determine transport target" warning. Callers that want
// pretty output should pipe our stderr through `pino-pretty` externally (this
// is what Group Income does).
// Detect whether this process is a `deno test` run. Under `deno test` the main
// module is the test file (e.g. `…/server-id.test.ts`); under the real server
// it is `main.ts` or the compiled binary, never a `*.test.*` file. We use this
// to make logging synchronous only under the test runner — see below.
const isTestRun = (() => {
  try {
    return /\.test\.[mc]?[tj]sx?(?:$|\?)/.test(new URL(Deno.mainModule).pathname)
  } catch {
    return false
  }
})()

// Pino's default destination is an async `sonic-boom` (with `minLength: 0`),
// so every log line dispatches an `fs.write` (`op_write`) that may still be in
// flight when a Deno test ends — Deno's resource sanitizer then reports "An
// async call to op_write was started before the test, but completed during the
// test." That async behaviour is what we want for the real server (it keeps the
// event loop from blocking on every log line), but under `deno test` we route
// output through a *synchronous* destination (`fs.writeSync` per line) so each
// write completes inline and no async op straddles a test boundary. The
// production path is left on pino's built-in default destination, unchanged.
const pinoFactory = pino as unknown as (config: unknown, dest?: unknown) => Logger
const logger = isTestRun
  ? pinoFactory(
    { hooks: { logMethod } },
    (pino as unknown as { destination: (opts: { fd: number; sync: boolean }) => unknown })
      .destination({ fd: process.stdout.fd || 1, sync: true })
  )
  : pinoFactory({ hooks: { logMethod } })

const logLevel = getLogLevel()
if (Object.keys(logger.levels.values).includes(logLevel)) {
  logger.level = logLevel
} else {
  logger.warn(`Unknown log level: ${logLevel}`)
}

let loggerInitialized = false

/**
 * Initialize the pino logger by replacing console.* methods.
 * This should be called explicitly when pino logging is desired
 * (e.g., in the serve command), not automatically on import.
 */
export function initializeLogger (): void {
  if (loggerInitialized) return
  loggerInitialized = true

  console.debug = logger.debug.bind(logger)
  console.info = logger.info.bind(logger)
  console.log = logger.info.bind(logger)
  console.warn = logger.warn.bind(logger)
  console.error = logger.error.bind(logger)
}

export default logger

import process from 'node:process'
import pino from 'npm:pino'

const prettyPrint = process.env.NODE_ENV === 'development' || process.env.CI || process.env.CYPRESS_RECORD_KEY || process.env.PRETTY

function getLogLevel (): string {
  return process.env.LOG_LEVEL || (prettyPrint ? 'debug' : 'info')
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
const logger = (pino as unknown as (config: unknown) => Logger)({ hooks: { logMethod } })

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

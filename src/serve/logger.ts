import { pino } from '~/deps.ts'
import process from 'node:process'

const prettyPrint = process.env.NODE_ENV === 'development' || process.env.CI || process.env.CYPRESS_RECORD_KEY || process.env.PRETTY

function logMethod (this: unknown, args: unknown[], method: (...args: unknown[]) => void): void {
  const stringIdx = typeof args[0] === 'string' ? 0 : 1
  if (args.length > 1) {
    for (let i = stringIdx + 1; i < args.length; ++i) {
      (args[stringIdx] as string) += typeof args[i] === 'string' ? ' %s' : ' %o'
    }
  }
  method.apply(this, args)
}

// Try to use pino-pretty transport, fall back to basic config if it fails
let loggerConfig: unknown = { hooks: { logMethod } }
if (prettyPrint) {
  try {
    loggerConfig = {
      hooks: { logMethod },
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    }
  } catch (e) {
    // Fall back to basic config if pino-pretty transport fails (e.g., in CI)
    console.warn('pino-pretty transport unavailable, using basic logging', e)
  }
}

const logger = (pino as unknown as (config: unknown) => {
  level: string;
  levels: { values: Record<string, unknown> };
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
})(loggerConfig)

const logLevel = process.env.LOG_LEVEL || (prettyPrint ? 'debug' : 'info')
if (Object.keys(logger.levels.values).includes(logLevel)) {
  logger.level = logLevel
} else {
  logger.warn(`Unknown log level: ${logLevel}`)
}

(globalThis as { logger?: unknown }).logger = logger // TypeScript global assignment
console.debug = logger.debug.bind(logger)
console.info = logger.info.bind(logger)
console.log = logger.info.bind(logger)
console.warn = logger.warn.bind(logger)
console.error = logger.error.bind(logger)

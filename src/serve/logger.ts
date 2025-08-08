import { pino } from '~/deps.ts'
import process from 'node:process'

// NOTE: enabling pretty print does add a slight bit of overhead to logging and therefore is not recommended in production
// Learn more about the Pino API here: https://github.com/pinojs/pino/blob/master/docs/api.md
const prettyPrint = process.env.NODE_ENV === 'development' || process.env.CI || process.env.CYPRESS_RECORD_KEY || process.env.PRETTY
// support regular console.log('asdf', 'adsf', 'adsf') style logging that might be used by libraries
// https://github.com/pinojs/pino/blob/master/docs/api.md#interpolationvalues-any
// TODO: Use this function for custom logging
// function logMethod (args: unknown[], method: (...args: unknown[]) => void) {
//   if (!method || typeof method !== 'function') {
//     console.error('logMethod called with invalid method:', method)
//     return
//   }
//   const stringIdx = typeof args[0] === 'string' ? 0 : 1
//   if (args.length > 1) {
//     for (let i = stringIdx + 1; i < args.length; ++i) {
//       args[stringIdx] += typeof args[i] === 'string' ? ' %s' : ' %o'
//     }
//   }
//   method(...args)
// }
const logger = (pino as unknown as (config: unknown) => {
  level: string;
  levels: { values: Record<string, unknown> };
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
})({
  level: 'debug'
})

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

import { pino } from '../deps.ts'

// NOTE: enabling pretty print does add a slight bit of overhead to logging and therefore is not recommended in production
// Learn more about the Pino API here: https://github.com/pinojs/pino/blob/master/docs/api.md
const prettyPrint = process.env.NODE_ENV === 'development' || process.env.CI || process.env.CYPRESS_RECORD_KEY || process.env.PRETTY
// support regular console.log('asdf', 'adsf', 'adsf') style logging that might be used by libraries
// https://github.com/pinojs/pino/blob/master/docs/api.md#interpolationvalues-any
function logMethod (args: any[], method: any) {
  if (!method || typeof method !== 'function') {
    console.error('logMethod called with invalid method:', method)
    return
  }
  const stringIdx = typeof args[0] === 'string' ? 0 : 1
  if (args.length > 1) {
    for (let i = stringIdx + 1; i < args.length; ++i) {
      args[stringIdx] += typeof args[i] === 'string' ? ' %s' : ' %o'
    }
  }
  method.apply(null, args)
}
const logger = pino({
  level: 'debug'
})

const logLevel = process.env.LOG_LEVEL || (prettyPrint ? 'debug' : 'info')
if (Object.keys(logger.levels.values).includes(logLevel)) {
  logger.level = logLevel
} else {
  logger.warn(`Unknown log level: ${logLevel}`)
}

(global as any).logger = logger // TypeScript global assignment
console.debug = logger.debug.bind(logger) // $FlowExpectedError
console.info = logger.info.bind(logger) // $FlowExpectedError
console.log = logger.info.bind(logger) // $FlowExpectedError
console.warn = logger.warn.bind(logger) // $FlowExpectedError
console.error = logger.error.bind(logger)

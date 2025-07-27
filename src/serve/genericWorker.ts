'use strict'

import '@sbp/okturtles.eventqueue'
import { sbp } from '../deps.ts'
import { parentPort } from 'node:worker_threads'
import { initDB } from './database.ts'
import './logger.ts'

export const readyQueueName = 'parentPort'

if (parentPort) {
  parentPort.on('message', ([port, ...msg]: [MessagePort, ...unknown[]]) => {
    sbp('okTurtles.eventQueue/queueEvent', readyQueueName, () => {
      (async () => {
        try {
          // The `any` cast is not ideal, but sbp's dynamic nature makes
          // this hard to type statically without more complex infrastructure.
          port?.postMessage([true, await sbp(...(msg as any[]))])
        } catch (e) {
          const err = e as Error
          port?.postMessage([false, { message: err.message, stack: err.stack }])
        }
      })()
    })
  })
}

if (parentPort) {
  sbp('okTurtles.eventQueue/queueEvent', readyQueueName, async () => {
    await initDB({ skipDbPreloading: true })
    parentPort?.postMessage('ready')
  })
}

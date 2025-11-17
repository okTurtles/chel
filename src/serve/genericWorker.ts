import { parentPort } from 'node:worker_threads'
import sbp from 'npm:@sbp/sbp'
import parseConfig from '../parseConfig.ts'
import { initDB } from './database.ts'
import './logger.ts'

export const readyQueueName = 'parentPort'

parentPort!.on('message', ([port, ...msg]: [MessagePort, ...unknown[]]) => {
  sbp('okTurtles.eventQueue/queueEvent', readyQueueName, () => {
    (async () => {
      try {
        // The `any` cast is not ideal, but sbp's dynamic nature makes
        // this hard to type statically without more complex infrastructure.
        port?.postMessage([true, await sbp(...(msg as [string, ...unknown[]]))])
      } catch (e) {
        port?.postMessage([false, e])
      }
    })()
  })
})

sbp('okTurtles.eventQueue/queueEvent', readyQueueName, async () => {
  parseConfig()
  await initDB({ skipDbPreloading: true })
  parentPort!.postMessage('ready')
})

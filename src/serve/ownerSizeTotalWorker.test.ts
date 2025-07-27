import { after, before, describe, it } from 'node:test'
import '@sbp/okturtles.data'
import '@sbp/okturtles.events'
import '@sbp/okturtles.eventqueue'
import { sbp } from '../deps.ts'
import { join } from 'node:path'
import { Worker } from 'node:worker_threads'
import { createCID } from '../deps.ts'
import { appendToIndexFactory, initDB, updateSize as updateSize_ } from './database.ts'
import assert from 'node:assert'

let worker = new Worker(join(__dirname, 'ownerSizeTotalWorker.js'))
const workerReady = new Promise<void>((resolve, reject) => {
  worker.on('message', (msg: any) => {
    if (msg === 'ready') resolve()
  })
  worker.on('error', reject)
})

const randInt = (upperBound: number) => Math.random() * upperBound | 0

const updateSize = (resourceID: string, sizeKey: string, size: number) => {
  return updateSize_(resourceID, sizeKey, size).then(() => {
    return new Promise<void>((resolve, reject) => {
      const mc = new MessageChannel()
      mc.port2.onmessage = (event: MessageEvent) => {
        const [success, result]: [boolean, any] = event.data
        if (success) return resolve()
        reject(result)
      }
      mc.port2.onmessageerror = () => {
        reject(Error('Message error'))
      }
      worker.postMessage([mc.port1, 'worker/updateSizeSideEffects', { resourceID, sizeKey, size }], [mc.port1 as any])
    })
  })
}

class Contract {
  id: string
  _ownSize: number
  _kvSize: number
  _totalSize: number
  _owner: Contract | null
  resources: Contract[]
  indirectResources: Contract[]

  constructor (owner?: Contract) {
    const buffer = new Uint8Array(16)
    crypto.getRandomValues(buffer)
    this.id = createCID(buffer)
    this._ownSize = 0
    this._kvSize = 0
    this._totalSize = 0
    this.resources = []
    this.indirectResources = []
    this._owner = null
    if (owner) {
      owner.resources.push(this)
      this._owner = owner
      let indirectOwner: Contract | null = owner
      while ((indirectOwner = indirectOwner._owner)) {
        indirectOwner.indirectResources.push(this)
      }
    }
  }

  get ownSize () {
    return this._ownSize
  }

  set ownSize (value: number) {
    const difference = value - this._ownSize
    this._ownSize = value
    this.totalSize += difference
  }

  get kvSize () {
    return this._kvSize
  }

  set kvSize (value: number) {
    const difference = value - this._kvSize
    this._kvSize = value
    this.ownSize += difference
  }

  get totalSize () {
    return this._totalSize
  }

  set totalSize (value: number) {
    const difference = value - this._totalSize
    this._totalSize = value
    if (this.ultimateOwner) {
      this.ultimateOwner.totalSize += difference
    }
  }

  get ultimateOwner (): Contract | null {
    if (!this._owner) return null
    return this._owner.ultimateOwner || this._owner
  }

  set ultimateOwner (value: Contract | null) {
    // empty
  }

  static async saveIndirectResourcesIndex (resourceID: string) {
    const ownerID = await sbp('chelonia.db/get', `_private_owner_${resourceID}`)
    let indirectOwnerID = ownerID
    while ((indirectOwnerID = await sbp('chelonia.db/get', `_private_owner_${indirectOwnerID}`))) {
      await appendToIndexFactory(`_private_indirectResources_${indirectOwnerID}`)(resourceID)
    }
  }

  static registerBillableEntity = appendToIndexFactory('_private_billable_entities')

  static async saveOwner (ownerID: string, resourceID: string) {
    // Store the owner for the current resource
    // Use a queue to check that the owner exists, preventing the creation of
    // orphaned resources (e.g., because the owner was just deleted)
    await sbp('chelonia.db/set', `_private_owner_${resourceID}`, ownerID)
    const resourcesKey = `_private_resources_${ownerID}`
    // Store the resource in the resource index key
    // This is done in a queue to handle several simultaneous requests
    // reading and writing to the same key
    await appendToIndexFactory(resourcesKey)(resourceID)
    setTimeout(() => this.saveIndirectResourcesIndex(resourceID), randInt(500))
  }

  async init () {
    await updateSize(this.id, `_private_size_${this.id}`, this.ownSize)
    if (this._owner) {
      await (this.constructor as typeof Contract).saveOwner(this._owner.id, this.id)
    } else {
      await (this.constructor as typeof Contract).registerBillableEntity(this.id)
    }
  }

  async newMessage () {
    const size = randInt(9999)
    this.ownSize += size
    await updateSize(this.id, `_private_size_${this.id}`, size)
  }

  async newKvValue () {
    const val = randInt(9999)
    const sign = randInt(2)
    const size = (sign === 0) ? Math.max(-this.kvSize, -val) : val
    this.kvSize += size
    await updateSize(this.id, `_private_size_${this.id}`, size)
  }
}

// Implemented as a generator to represent a single simulation step
// Each 'yield' means the end of a step
async function * randomOp (iterations: number): AsyncGenerator<void, Contract[], void> {
  const mainContracts: Contract[] = []
  const allContracts: Contract[] = []

  {
    const contract = new Contract()
    console.log('Created initial contract', contract.id)
    await contract.init()
    mainContracts.push(contract)
    allContracts.push(contract)
    yield
  }

  while (iterations-- > 0) {
    const op = randInt(9)
    switch (op) {
      case 0: {
        const contract = new Contract()
        console.log('Created new main contract', contract.id)
        await contract.init()
        mainContracts.push(contract)
        allContracts.push(contract)
        break
      }
      case 1:
      case 2:
      case 3:
      case 4:
      case 5: {
        if (!allContracts.length) break
        const idx = randInt(allContracts.length)
        const contract = allContracts[idx]
        const subop = randInt(4)
        switch (subop) {
          case 0: {
            console.log('Simulated new event on', contract.id)
            await contract.newMessage()
            break
          }
          case 1: {
            console.log('Simulated KV update on', contract.id)
            await contract.newKvValue()
            break
          }
          case 2: {
            // Do nothing (no event and no subcontract)
            break
          }
          case 3: {
            const subContract = new Contract(contract)
            console.log('Simulated new subcontract for', contract.id, 'id', subContract.id, 'ultimate owner', subContract.ultimateOwner?.id)
            await subContract.init()
            allContracts.push(subContract)
            break
          }
        }
        break
      }
      case 6: {
        const wait = randInt(100)
        console.log('Random wait', wait)
        await new Promise<void>(resolve => setTimeout(resolve, wait))
        break
      }
      case 7: {
        console.log('Simulating forcible computation')
        await new Promise<void>((resolve, reject) => {
          const mc = new MessageChannel()
          mc.port2.onmessage = (event: MessageEvent) => {
            const [success, result]: [boolean, any] = event.data
            if (success) return resolve()
            reject(result)
          }
          mc.port2.onmessageerror = () => {
            reject(Error('Message error'))
          }
          worker.postMessage([mc.port1, 'backend/server/computeSizeTaskDeltas'], [mc.port1 as any])
        })
        break
      }
      case 8: {
        console.log('Simulating server restart')
        await new Promise<void>(resolve => setTimeout(resolve, 250))
        await worker.terminate()
        worker = new Worker(join(__dirname, 'ownerSizeTotalWorker.js'))
        await new Promise<void>((resolve, reject) => {
          worker.on('message', (msg: string) => {
            if (msg === 'ready') resolve()
          })
          worker.on('error', reject)
        })
        break
      }
    }

    yield
  }

  // Wait for transactions to be written
  await new Promise<void>((resolve, reject) => {
    const mc = new MessageChannel()
    mc.port2.onmessage = (event: MessageEvent) => {
      const [success, result]: [boolean, any] = event.data
      if (success) return resolve()
      reject(result)
    }
    mc.port2.onmessageerror = () => {
      reject(Error('Message error'))
    }
    worker.postMessage([mc.port1, 'backend/server/computeSizeTaskDeltas'], [mc.port1 as any])
  })
  return mainContracts
}

describe('Owner total size computation fuzzing', () => {
  before(async () => {
    await initDB()
    await workerReady
  })

  after(async () => {
    await worker.terminate()
  })

  it('Simulated events have the expected size', async () => {
    const iterations = randInt(4096) | 512
    const iterator = randomOp(iterations)
    let v: IteratorResult<void, Contract[]>
    for (;;) {
      v = await iterator.next()
      if (v.done) break
    }

    const contracts = v.value as Contract[]
    if (contracts) {
      await Promise.all(contracts.map(async (contract: Contract) => {
        const totalSize = await sbp('chelonia.db/get', `_private_ownerTotalSize_${contract.id}`)
        assert.equal(parseInt(totalSize as string, 10), contract.totalSize, contract.id)
      }))
    }
  })
})

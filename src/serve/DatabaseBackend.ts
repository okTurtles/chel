import { Buffer } from 'node:buffer'

const requiredMethodNames = ['init', 'clear', 'readData', 'writeData', 'deleteData', 'close', 'iterKeys'] as const

export default abstract class DatabaseBackend {
  abstract init (): Promise<void>
  abstract clear (): Promise<void>
  abstract readData (key: string): Promise<Buffer | string | void>
  abstract writeData (key: string, value: Buffer | string): Promise<void>
  abstract deleteData (key: string): Promise<void>
  abstract close (): Promise<void> | void
  abstract iterKeys (): AsyncGenerator<string>

  constructor () {
    if (new.target === DatabaseBackend) {
      throw new Error('Class DatabaseBackend cannot be instantiated directly.')
    }
    // Also rebind them to the instance so as to make them usable with destructuring.
    const bindMethod = <K extends typeof requiredMethodNames[number]>(name: K) => {
      this[name] = this[name].bind(this) as typeof this[K]
    }
    for (const name of requiredMethodNames) {
      bindMethod(name)
    }
  }
}

import { Buffer } from 'node:buffer'

const requiredMethodNames = ['init', 'clear', 'readData', 'writeData', 'deleteData', 'close', 'iterKeys', 'keyCount'] as const

export default abstract class DatabaseBackend {
  abstract init (): Promise<void>
  abstract clear (): Promise<void>
  abstract readData (key: string): Promise<Buffer | string | void>
  abstract writeData (key: string, value: Buffer | string): Promise<void>
  abstract deleteData (key: string): Promise<void>
  abstract close (): Promise<void> | void
  // Walks every key currently stored. Implementations may hold a live cursor
  // for the lifetime of the generator, so callers must not write through the
  // same backend while iterating: the sqlite backend rejects such a write
  // outright, and the others give no ordering guarantee for keys added or
  // removed mid-walk. Drain the iterator (or collect the keys) first.
  abstract iterKeys (): AsyncGenerator<string>
  abstract keyCount (): Promise<number>

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

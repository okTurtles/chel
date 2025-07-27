export interface IDatabaseBackend {
  init (): Promise<void>;
  clear (): Promise<void>;
  readData (key: string): Promise<Buffer | string | void>;
  writeData (key: string, value: Buffer | string): Promise<void>;
  deleteData (key: string): Promise<void>;
}

const requiredMethodNames = ['init', 'clear', 'readData', 'writeData', 'deleteData']

export default class DatabaseBackend {
  constructor () {
    if (new.target === DatabaseBackend) {
      throw new Error('Class DatabaseBackend cannot be instantiated directly.')
    }
    // Also rebind them to the instance so as to make them usable with destructuring.
    for (const name of requiredMethodNames) {
      const method = (this as any)[name]
      if (typeof method === 'function') {
        (this as any)[name] = method.bind(this)
      }
    }
  }
}

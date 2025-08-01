import { blake32Hash } from '~/deps.ts'
import { Buffer } from 'node:buffer'

if (typeof window === 'object' && typeof Buffer === 'undefined') {
  ;(window as any).Buffer = Buffer
}

// Re-export blake32Hash for convenience
export { blake32Hash }

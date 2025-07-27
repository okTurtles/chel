import { blake32Hash, Buffer } from '../../../deps.ts'

if (typeof window === 'object' && typeof Buffer === 'undefined') {
  (window as any).Buffer = Buffer
}

// Re-export blake32Hash for convenience
export { blake32Hash }

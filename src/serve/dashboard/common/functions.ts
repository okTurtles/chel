import { Buffer } from 'node:buffer'

if (typeof window === 'object' && typeof Buffer === 'undefined') {
  ;(window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
}

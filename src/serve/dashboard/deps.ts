// Browser-compatible dependencies for dashboard
// This file replaces src/deps.ts for dashboard builds to avoid server-side imports

// Vue ecosystem (loaded via CDN in index.html)
export { default as Vue } from 'vue'
export { default as Vuex } from 'vuex'
export { default as VueRouter } from 'vue-router'
export { default as VueClickaway, mixin as clickaway } from 'vue-clickaway'
export * as Three from 'three'

// Browser-compatible utilities
export { default as dompurify } from 'dompurify'
export { validationMixin } from 'vuelidate'
export { default as pug } from 'pug'

// SBP for dashboard functionality
export { default as sbp } from '@sbp/sbp'

// Import SBP selector implementations needed by dashboard
import '@sbp/okturtles.data'
import '@sbp/okturtles.events'

// Stub out server-side dependencies that dashboard shouldn't use
export const chalk = { green: (s: string) => s, red: (s: string) => s, yellow: (s: string) => s }
export const process = { env: { NODE_ENV: 'development' } }

// Re-export common utilities that are safe for browser
export function cloneDeep (obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

export function omit (obj: any, keys: string[]): any {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

// Additional exports needed by dashboard components
export function createCID (): string {
  // Placeholder implementation for browser environment
  return 'cid-placeholder-' + Math.random().toString(36).substr(2, 9)
}

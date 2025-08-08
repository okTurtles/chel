// Browser-compatible dependencies for dashboard
// This file replaces src/deps.ts for dashboard builds to avoid server-side imports

// Vue ecosystem - using full build with template compiler for dashboard
export { default as Vue } from 'vue/dist/vue.esm.js'
export { default as Vuex } from 'vuex'
export { default as VueRouter } from 'vue-router'
export { default as VueClickaway, mixin as clickaway } from 'vue-clickaway'
export * as Three from 'three'

// Browser-compatible utilities
export { default as dompurify } from 'dompurify'
export { validationMixin } from 'vuelidate'
// Note: pug is build-time only, not included in browser bundle

// SBP for dashboard functionality
import sbpDefault from '@sbp/sbp'
export { sbpDefault as sbp }
export default sbpDefault

// Import SBP selector implementations needed by dashboard
import '@sbp/okturtles.data'
import '@sbp/okturtles.events'

// Additional SBP selectors needed for dashboard functionality
import '@sbp/okturtles.eventqueue'

// Stub out server-side dependencies that dashboard shouldn't use
export const chalk = { green: (s: string) => s, red: (s: string) => s, yellow: (s: string) => s }
export const process = { env: { NODE_ENV: 'development' } }

// Re-export common utilities that are safe for browser
export function cloneDeep<T> (obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function omit (obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

// Additional exports needed by dashboard components
export function createCID (): string {
  // Placeholder implementation for browser environment
  return 'cid-placeholder-' + Math.random().toString(36).substr(2, 9)
}

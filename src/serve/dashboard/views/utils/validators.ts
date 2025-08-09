// Simple validators for form validation
export const required = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export const email = (value: string): boolean => {
  // Using the exact same email regex as Vuelidate for consistency
  // Source: https://github.com/vuelidate/vuelidate/blob/d028e164e0781ed2e716dbac77228a1443222366/packages/validators/src/raw/email.js
  // deno-lint-ignore no-control-regex
  const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
  return emailRegex.test(value)
}

export const minLength = (min: number) => (value: string): boolean => {
  return Boolean(value && value.length >= min)
}

export const maxLength = (max: number) => (value: string): boolean => {
  return Boolean(value && value.length <= max)
}

export const decimals = (places: number) => (value: number): boolean => {
  const decimal = value.toString().split('.')[1]
  return !decimal || decimal.length <= places
}

// Simple validators for form validation
export const required = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export const email = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export const minLength = (min: number) => (value: string): boolean => {
  return value && value.length >= min
}

export const maxLength = (max: number) => (value: string): boolean => {
  return value && value.length <= max
}

export const decimals = (places: number) => (value: number): boolean => {
  const decimal = value.toString().split('.')[1]
  return !decimal || decimal.length <= places
}

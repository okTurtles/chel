// In binary units, the same ones chel.toml uses for its byte limits
export const humanBytes = (bytes: number): string => {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return unit === 0 ? `${value} B` : `${value.toFixed(1)} ${units[unit]}`
}

// The server keeps balances in picocredits, a trillionth of a credit
export const credits = (picocredits: string): string =>
  (Number(picocredits) / 1e12).toFixed(2)

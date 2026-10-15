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

// The server keeps balances in picocredits, a trillionth of a credit. Worked
// out exactly and cut to 2 decimals, since a Number loses digits on big ones.
const PICOCREDITS_PER_CREDIT = 1_000_000_000_000n
const PICOCREDITS_PER_CENT = PICOCREDITS_PER_CREDIT / 100n

export const credits = (picocredits: string): string => {
  const balance = BigInt(picocredits)
  const abs = balance < 0n ? -balance : balance
  const whole = abs / PICOCREDITS_PER_CREDIT
  const cents = (abs % PICOCREDITS_PER_CREDIT) / PICOCREDITS_PER_CENT
  const shown = `${whole}.${String(cents).padStart(2, '0')}`
  // A balance just below zero shows as 0.00, not -0.00
  return balance < 0n && shown !== '0.00' ? `-${shown}` : shown
}

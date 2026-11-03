// Numbers are written the way the browser's locale writes them. `locale` is
// only passed by the tests, so they don't depend on the machine.

const hasIntl = typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function'

// In binary units, the same ones chel.toml uses for its byte limits
export const humanBytes = (bytes: number, locale?: string): string => {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  const digits = unit === 0 ? 0 : 1
  const number = hasIntl
    ? new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
    : value.toFixed(digits)
  return `${number} ${units[unit]}`
}

// The server keeps balances in picocredits, a trillionth of a credit.
const PICOCREDITS_PER_CREDIT = 1_000_000_000_000n
const PICOCREDIT_DIGITS = 12
const PICOCREDITS_PER_CENT = PICOCREDITS_PER_CREDIT / 100n

export const credits = (picocredits: string, locale?: string): string => {
  const balance = BigInt(picocredits)
  const abs = balance < 0n ? -balance : balance
  const whole = abs / PICOCREDITS_PER_CREDIT
  const fraction = abs % PICOCREDITS_PER_CREDIT
  if (hasIntl) {
    // Given as a decimal string, so even a balance too big for a Number is
    // formatted exactly. Cut to 2 decimals rather than rounded, and a balance
    // just below zero shows as 0.00, not -0.00.
    const exact = `${balance < 0n ? '-' : ''}${whole}.${String(fraction).padStart(PICOCREDIT_DIGITS, '0')}`
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        roundingMode: 'trunc',
        signDisplay: 'negative'
      }).format(exact as unknown as number)
    } catch {
      // A browser too old for these options. Written out by hand below.
    }
  }
  const shown = `${whole}.${String(fraction / PICOCREDITS_PER_CENT).padStart(2, '0')}`
  return balance < 0n && shown !== '0.00' ? `-${shown}` : shown
}

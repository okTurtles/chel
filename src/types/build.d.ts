interface ImportMeta {
  VERSION: string
  ownerSizeTotalWorker?: string
  creditsWorker?: string
  lockDbSelectors?: boolean
}

declare const logger: {
  level: string
  levels: {
    values: Record<string, unknown>
  }
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

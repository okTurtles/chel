export const nconfDefaults = {
  // Unique, stable identity for this server instance. Required at runtime by
  // `chel serve` (see `src/serve/server.ts`) to scope push subscriptions;
  // left unset here so that file-only commands and `chel init` work without it.
  server_id: undefined,
  server: {
    appDir: '.',
    host: '0.0.0.0',
    port: 8000,
    dashboardPort: 8888,
    fileUploadMaxBytes: 31457280,
    signup: {
      disabled: false,
      // Size sanity caps for unattributed (ownerless) first messages, i.e.
      // identity contract registration. They bound how much data can be written
      // 'for free'; see POST /event in src/serve/routes.ts.
      maxFirstMessageBytes: 5 * 1024,
      maxContractSizeBytes: 500 * 1024,
      limit: {
        disabled: false,
        minute: 2,
        hour: 10,
        day: 50
      }
    },
    // Billing settings. The credits worker has no access to nconf (it runs in
    // a separate worker process), so `freeAllowanceBytes` is persisted to the
    // database at startup (see src/serve/server.ts) and re-read each billing
    // cycle (see src/serve/creditsWorker.ts).
    billing: {
      // Per-billable-entity storage (identity contract + everything it owns)
      // that is not charged for. 0 disables the free tier.
      freeAllowanceBytes: 10 * 1024 * 1024
    },
    vapid: {
      email: undefined
    },
    messages: [],
    maxEventsBatchSize: 500,
    archiveMode: false,
    reclaimForeignSubscriptions: false
  },
  database: {
    lruNumItems: 10000,
    backend: 'mem',
    backendOptions: {}
  }
}

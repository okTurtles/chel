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
    logLevel: 'debug',
    signup: {
      disabled: false,
      limit: {
        disabled: false,
        minute: 2,
        hour: 10,
        day: 50
      }
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

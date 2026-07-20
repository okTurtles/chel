export const nconfDefaults = {
  server: {
    appDir: '.',
    host: '0.0.0.0',
    port: 8000,
    dashboardPort: 8888,
    fileUploadMaxBytes: 31457280,
    signup: {
      disabled: false,
      limit: {
        disabled: false,
        minute: 2,
        hour: 10,
        day: 50
      }
    },
    logLevel: 'debug',
    messages: [],
    maxEventsBatchSize: 500,
    archiveMode: false
  },
  database: {
    lruNumItems: 10000,
    backend: 'mem',
    backendOptions: {}
  }
}

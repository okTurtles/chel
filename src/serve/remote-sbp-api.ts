import sbp from 'npm:@sbp/sbp'

// Registers selectors to be available for remote invocation by pubsub clients.
// All these selectors must start with 'pubsub/'.
sbp('sbp/selectors/register', {
  'pubsub/*' (selector: string) {
    throw new Error(`Selector not found: '${selector}'`)
  }
})

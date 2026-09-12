import sbp from 'npm:@sbp/sbp'

// Registers selectors to be available for remote invocation by pubsub clients.
// All these selectors must start with 'pubsub/'.
sbp('sbp/selectors/register', {
  'pubsub/*' (selector: string, ...args: unknown[]) {
    console.log(`Unknown selector '${selector}' called with parameters:`, args)
  },
  'pubsub/test/addNumbers' (...args: number[]) {
    console.log('[pubsub] Adding numbers:',  ...args)
    return args.reduce((acc, arg) => acc + Number(arg), 0)
  },
  'pubsub/test/say' (...args: string[]) {
    console.log('[pubsub] Saying:',  ...args)
  }
})

import sbp from 'npm:@sbp/sbp'
import { WS } from '~/serve/pubsub.ts'

/**
 * Registers selectors to be available for remote invocation by pubsub clients.
 *
 * - All these selectors must start with 'pubsub/'.
 * - They may be async. The call will be awaited.
 * - The first argument is always the web socket representing the client connection.
 * - Other arguments come from the request message payload via JSON.parse().
 * - Note: the message ID is not meant to be available here.
 *
 * To send back an empty ok response (no payload) through the socket:
 *   Just return undefined, or a promise for undefined.
 *
 * To send back an ok response with a value as payload:
 *   Just return that value, or a promise. It will be awaited and serialized using plain JSON.stringify() first.
 *   Note: an error response will be sent instead in case of promise rejection or stringify() error.
 *
 * To send back an error response with a message:
 *   Throw an Error() object using that message.
 *   Note: currently only the error message is transmitted, other error properties are discarded.
 */

sbp('sbp/selectors/register', {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  'pubsub/*' (selector: string, socket: WS, ...args: unknown[]) {
    throw new Error(`Selector not found: '${selector}'`)
  }
})

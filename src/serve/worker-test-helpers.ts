// Helpers shared by the worker tests (`creditsWorker.test.ts`,
// `ownerSizeTotalWorker.test.ts`).
//
// Deliberately kept separate from `routes-test-helpers.ts`: that module pulls in
// the whole server (`./index.ts`), which the worker tests avoid so that the
// worker's `chelonia.db/*` RPC selectors cannot shadow the real database ones.
import { createCID } from 'npm:@chelonia/lib/functions'

// A random, well-formed CID, for use as a stand-in contract or entity id.
export const randCID = (): string => {
  const buffer = new Uint8Array(16)
  crypto.getRandomValues(buffer)
  return createCID(buffer)
}

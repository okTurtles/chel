// Guards for ownerless (unattributed) first messages, i.e. the registration of
// a new billable entity via `POST /event`. Kept out of `routes.ts` so that the
// manifest parsing and the size accounting can be tested directly, without an
// HTTP server and without having to reach the branch through a signed message.
//
// See the "Signup, registration, and billing" section of README.md for what
// these caps are for.

import { Buffer } from 'node:buffer'
import { maybeParseCID, multicodes } from 'npm:@chelonia/lib/functions'
import sbp from 'npm:@sbp/sbp'
import { HTTPException } from 'npm:hono/http-exception'

// The hashes in a manifest body are attacker-influenced (whoever deployed the
// manifest wrote them) and are about to be used as database keys, so an
// unvalidated string could name any key, including a `_private_` one. Checking
// the multicode as well as the CID syntax keeps the reachable key space to
// contract sources, matching the check `POST /event` already does on the
// manifest CID itself.
const requireContractTextCID = (hash: unknown, field: string): string => {
  if (typeof hash !== 'string') throw new Error(`missing ${field} hash`)
  if (maybeParseCID(hash)?.code !== multicodes.SHELTER_CONTRACT_TEXT) {
    throw new Error(`invalid ${field} hash`)
  }
  return hash
}

// Extracts the contract source hashes a manifest refers to: `contract.hash`,
// plus `contractSlim.hash` when a slim build is present. Throws a 422 for a
// manifest that is missing, unparseable, or does not name usable sources: the
// size check below cannot be performed without them, and `handleEntry` would
// refuse such a manifest anyway.
export const parseContractSourceHashes = (manifest: unknown): string[] => {
  try {
    if (typeof manifest !== 'string' || !manifest) throw new Error('empty manifest')
    const { contract, contractSlim } = JSON.parse(JSON.parse(manifest).body)
    const hashes = [requireContractTextCID(contract?.hash, 'contract')]
    // A present-but-malformed `contractSlim` is rejected rather than skipped:
    // silently ignoring it would leave its source out of the size check while
    // `handleEntry` would refuse the manifest anyway
    if (contractSlim != null) {
      hashes.push(requireContractTextCID(contractSlim.hash, 'contractSlim'))
    }
    return hashes
  } catch {
    throw new HTTPException(422, { message: 'Invalid manifest' })
  }
}

// Adds up the sizes of the given contract sources, throwing a 413 as soon as
// the running total exceeds `maxBytes` so that an over-sized set of sources is
// rejected without reading all of them. Returns the total size on success.
export const assertContractSourcesWithinCap = async (
  hashes: string[],
  maxBytes: number
): Promise<number> => {
  let contractSizeBytes = 0
  for (const hash of hashes) {
    const source = await sbp('chelonia.db/get', hash)
    if (typeof source !== 'string') {
      throw new HTTPException(422, { message: 'Missing contract source' })
    }
    contractSizeBytes += Buffer.byteLength(source)
    if (contractSizeBytes > maxBytes) {
      throw new HTTPException(413, { message: 'Contract source exceeds size limit' })
    }
  }
  return contractSizeBytes
}

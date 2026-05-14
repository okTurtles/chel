// chel eventsAfter [--limit N] [--url url] <contractID> <height>

import * as base64 from 'jsr:@std/encoding/base64'
import sbp from 'npm:@sbp/sbp'
import { SPMessage } from 'npm:@chelonia/lib/SPMessage'
import 'npm:@chelonia/lib/chelonia'
import { Secret } from 'npm:@chelonia/lib/Secret'
import { SERVER } from 'npm:@chelonia/lib/presets'
import { unwrapMaybeEncryptedData } from 'npm:@chelonia/lib/encryptedData'
import { isSignedData } from 'npm:@chelonia/lib/signedData'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { closeDB, initDB } from './serve/database.ts'
import { exit, readJsonFile } from './utils.ts'

type Params = {
  limit: number
  url: string | undefined
  contractID: string
  height: number
  keys: string | undefined
}

export async function loadSecretKeys(
  file: string,
  { internal = false }: { internal?: boolean } = {}
): Promise<Record<string, string>> {
  let parsed: unknown
  try {
    parsed = await readJsonFile(file)
  } catch (e) {
    return exit(`failed to read --keys file '${file}': ${(e as Error).message}`, internal)
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return exit(
      `--keys file '${file}' must contain a JSON object of { keyId: serializedSecretKey }`,
      internal
    )
  }
  for (const [k, v] of Object.entries(parsed)) {
    if (typeof v !== 'string') {
      return exit(`--keys file '${file}' entry '${k}' is not a string (got ${typeof v})`, internal)
    }
  }
  return parsed as Record<string, string>
}

export type DecryptCtx = {
  // Per-contract state accumulator. The values are produced by
  // `chelonia/in/processMessage`, which owns all the rules for OP_CONTRACT,
  // OP_KEY_*, etc.; we just thread the state from one message to the next.
  states: Map<string, unknown>
  // Caller-supplied secret keys. `chelonia/in/processMessage` reaches them
  // through the transient key store (populated by `storeSecretKeys`), but
  // the *second* local `SPMessage.deserialize` we run for value extraction
  // doesn't share that store — it takes its key map as a constructor
  // argument, so we thread the same map through here.
  additionalKeys: Record<string, string>
}

// Decryption is purely additive: every original field of the input envelope
// (including the local-DB `serverMeta` wrapper, when present) is preserved
// on `raw`, and the decrypted/derived fields are appended alongside.
export type DecryptedOp = {
  op: string
  decryptedValue?: unknown
  innerSigningKeyId?: string
}

export type DecryptedEvent = {
  height: number
  hash: string
  contractID: string
  op: string
  signingKeyId?: string
  innerSigningKeyId?: string
  decryptedValue?: unknown
  // Present only for OP_ATOMIC envelopes — one entry per nested operation.
  ops?: DecryptedOp[]
  raw: unknown
  error?: string
}

// Unwrap a single op body to extract the plaintext value and any inner
// signing key id. Mirrors `SPMessage.decryptedValue()` but operates on an
// arbitrary op body so we can reuse it for OP_ATOMIC sub-ops (which are
// only flattened one level — nested OP_ATOMICs are forbidden by the library
// in `internals.ts`, so single-level expansion is sufficient).
const unwrapOpValue = (
  rawValue: unknown
): { decryptedValue?: unknown; innerSigningKeyId?: string } => {
  try {
    const data = unwrapMaybeEncryptedData(rawValue as never)
    if (!data || data.data == null) return {}
    const inner = data.data as unknown
    if (isSignedData(inner)) {
      const signed = inner as { valueOf: () => unknown; signingKeyId: string }
      return { decryptedValue: signed.valueOf(), innerSigningKeyId: signed.signingKeyId }
    }
    return { decryptedValue: inner }
  } catch {
    return {}
  }
}

let cheloniaConfigurePromise: Promise<unknown> | null = null
// Configure Chelonia once for read-only event decoding. Of the options on
// the SERVER preset, only `skipActionProcessing` (avoid manifest fetches /
// running contract code) and `strictProcessing` (propagate OP_ATOMIC sub-op
// failures inside the library) actually affect this code path; the rest
// are pulled in for parity with the server.
function configureChelonia(): Promise<unknown> {
  if (!cheloniaConfigurePromise) {
    cheloniaConfigurePromise = sbp('chelonia/configure', {
      ...SERVER,
      // We *do* want decryption to happen here; SERVER sets this to true.
      skipDecryptionAttempts: false
    })
  }
  return cheloniaConfigurePromise!
}

function storeSecretKeys(additionalKeys: Record<string, string>): string[] {
  const ids = Object.keys(additionalKeys)
  if (ids.length) {
    sbp(
      'chelonia/storeSecretKeys',
      new Secret(ids.map((id) => ({ key: additionalKeys[id], transient: true })))
    )
  }
  return ids
}

// Best-effort decryption of a single envelope.
// `rawEnvelope` is the parsed JSON envelope object as produced by
// `getMessagesSince` / `getRemoteMessagesSince`.
export async function decryptOne(
  rawEnvelope: unknown,
  ctx: DecryptCtx
): Promise<DecryptedEvent> {
  // The local DB stream (`backend/db/streamEntriesAfter`) wraps each entry as
  // `{ serverMeta, message: "<serialized envelope>" }`, while the remote
  // `/eventsAfter` endpoint returns bare envelope objects. Normalize here so
  // both transport shapes feed `SPMessage.deserialize*` correctly.
  let serialized: string
  if (
    rawEnvelope && typeof rawEnvelope === 'object' &&
    'message' in rawEnvelope &&
    typeof (rawEnvelope as { message: unknown }).message === 'string'
  ) {
    serialized = (rawEnvelope as { message: string }).message
  } else {
    serialized = JSON.stringify(rawEnvelope)
  }
  let head, hash, contractID, op
  try {
    const headInfo = SPMessage.deserializeHEAD(serialized)
    head = headInfo.head
    hash = headInfo.hash
    contractID = headInfo.contractID
    op = head.op
  } catch (e) {
    return { height: -1, hash: '', contractID: '', op: '', raw: rawEnvelope, error: (e as Error).message }
  }

  const priorState = ctx.states.get(contractID)
  // Non-OP_CONTRACT messages need the prior contract state to be decrypted.
  // If it is missing (e.g. user passed a partial chain), fall through with
  // `raw` so the user still sees the envelope.
  if (!priorState && op !== SPMessage.OP_CONTRACT) {
    return {
      height: head.height,
      hash,
      contractID,
      op,
      raw: rawEnvelope,
      error: `no prior contract state for ${contractID} (need OP_CONTRACT first)`
    }
  }

  // Hand the raw serialized envelope to `chelonia/in/processMessage`, which:
  //   * deserializes the SPMessage against a *clone* of the prior state, so
  //     the signedIncomingData / encryptedIncomingData closures inside are
  //     bound to the mutating copy — critical for OP_ATOMIC sub-ops that
  //     depend on mutations made by earlier sub-ops (e.g. OP_KEY_ADD
  //     followed by OP_ACTION_ENCRYPTED signed by the new key, see the long
  //     comment in `@chelonia/lib/internals.ts` near the OP_ATOMIC handler),
  //   * applies all OP_CONTRACT / OP_KEY_* / OP_ATOMIC state transitions,
  //   * returns the new contract state so we can thread it through.
  // Pass an empty state for OP_CONTRACT; SPMessage.deserialize derives
  // _vm.authorizedKeys from the message body itself in that case.
  const stateForProcessing = priorState ?? Object.create(null)
  let nextState: unknown
  try {
    nextState = await sbp('chelonia/in/processMessage', serialized, stateForProcessing)
  } catch (e) {
    return {
      height: head.height,
      hash,
      contractID,
      op,
      raw: rawEnvelope,
      error: (e as Error).message
    }
  }
  // `chelonia/in/processMessage` swallows processing rejections in its own
  // `.catch` and returns the *original* `state` reference on failure. Detect
  // that here so we surface an explicit error instead of silently treating
  // the message as a no-op.
  if (nextState === stateForProcessing) {
    return {
      height: head.height,
      hash,
      contractID,
      op,
      raw: rawEnvelope,
      error: 'chelonia/in/processMessage rejected the event (see preceding warning)'
    }
  }
  ctx.states.set(contractID, nextState)

  // Deserialize locally for value extraction, bound to the *post-processing*
  // state so the closures see all intermediate OP_ATOMIC mutations. The
  // additional keys must be passed explicitly here: SPMessage.deserialize
  // wires them into the signed/encrypted closures it builds, independently
  // of chelonia's transient key store.
  let message: SPMessage
  try {
    message = SPMessage.deserialize(
      serialized,
      ctx.additionalKeys as never,
      nextState as never
    )
  } catch (e) {
    return {
      height: head.height,
      hash,
      contractID,
      op,
      raw: rawEnvelope,
      error: (e as Error).message
    }
  }

  let decryptedValue: unknown
  let innerSigningKeyId: string | undefined
  let ops: DecryptedOp[] | undefined
  try {
    if (op === SPMessage.OP_ATOMIC) {
      // For OP_ATOMIC the top-level decryptedValue isn't meaningful; instead
      // expose each sub-op individually. `SPMessage.deserialize` has already
      // recursed into each entry, so we just unwrap the values here.
      const subOps = message.message() as ReadonlyArray<[string, unknown]>
      ops = subOps.map(([subOp, subBody]) => ({
        op: subOp,
        ...unwrapOpValue(subBody)
      }))
    } else {
      decryptedValue = message.decryptedValue()
      innerSigningKeyId = message.innerSigningKeyId()
    }
  } catch {
    // decryptedValue is best-effort; leave undefined on failure
  }

  const result: DecryptedEvent = {
    height: head.height,
    hash,
    contractID,
    op,
    signingKeyId: message.signingKeyId(),
    innerSigningKeyId,
    decryptedValue,
    raw: rawEnvelope
  }
  if (ops) result.ops = ops
  return result
}

// Decrypts a sequence of envelopes in order, accumulating per-contract state.
// Any secret keys registered for this call are cleared from the transient
// key store on return so successive `decryptEnvelopes` invocations don't
// inherit each other's keys (also keeps the test suite hermetic).
export async function decryptEnvelopes(
  envelopes: ReadonlyArray<unknown>,
  additionalKeys: Record<string, string>
): Promise<DecryptedEvent[]> {
  await configureChelonia()
  const addedIds = storeSecretKeys(additionalKeys)
  try {
    const ctx: DecryptCtx = { states: new Map(), additionalKeys }
    const out: DecryptedEvent[] = []
    for (const envelope of envelopes) {
      const result = await decryptOne(envelope, ctx)
      if (result.error) {
        console.warn(`[chel] warning: ${result.op || '?'} ${result.hash || '?'}: ${result.error}`)
      }
      out.push(result)
    }
    return out
  } finally {
    if (addedIds.length) {
      sbp('chelonia/clearTransientSecretKeys', addedIds)
    }
  }
}

export async function eventsAfter({
  limit,
  url,
  contractID,
  height,
  keys
}: ArgumentsCamelCase<Params>): Promise<void> {
  // Load and validate the optional --keys file up-front so we fail fast.
  const additionalKeys = keys ? await loadSecretKeys(keys) : undefined
  let dbOpen = false
  try {
    let messages
    if (url) {
      messages = await getRemoteMessagesSince(url, contractID, height, limit)
    } else {
      await initDB({ skipDbPreloading: true })
      dbOpen = true
      messages = await getMessagesSince(contractID, height, limit)
    }
    if (additionalKeys) {
      const decrypted = await decryptEnvelopes(messages, additionalKeys)
      console.log(JSON.stringify(decrypted, null, 2))
    } else {
      console.log(JSON.stringify(messages, null, 2))
    }
  } finally {
    if (dbOpen) {
      await closeDB()
    }
  }
}

async function getMessagesSince(
  contractID: string,
  sinceHeight: number,
  limit: number
): Promise<unknown[]> {
  const readable = await sbp('backend/db/streamEntriesAfter', contractID, sinceHeight, limit)

  return new Promise<unknown[]>((resolve, reject) => {
    const data: string[] = []
    readable.on('readable', () => {
      let chunk
      while (null !== (chunk = readable.read())) {
        data.push(chunk)
      }
    })

    readable.on('error', reject)

    readable.on('end', () => {
      const events = JSON.parse(data.join('')).map((s: string) => {
        return JSON.parse(new TextDecoder().decode(base64.decodeBase64(s)))
      })
      resolve(events)
    })
  })
}

async function getRemoteMessagesSince(
  src: string,
  contractID: string,
  sinceHeight: number,
  limit: number
): Promise<unknown[]> {
  const response = await fetch(`${src}/eventsAfter/${contractID}/${sinceHeight}`)
  if (!response.ok) {
    // The response body may contain some useful error info.
    const bodyText = (await response.text().catch(() => '')) || ''
    throw new Error(
      `failed network request to ${src}: ${response.status} - ${response.statusText} - '${bodyText}'`
    )
  }
  const b64messages: string[] = await response.json()
  if (b64messages.length > limit) {
    b64messages.length = limit
  }
  return b64messages.map((b64str) =>
    JSON.parse(new TextDecoder().decode(base64.decodeBase64(b64str)))
  )
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('limit', {
        describe: 'Limit',
        default: 50,
        number: true,
        requiresArg: true,
        coerce(v: number) {
          if (!Number.isSafeInteger(v) || v < 0) {
            throw new Error('--limit must be a valid non-negative integer')
          }
          return v
        }
      })
      .option('url', {
        describe: 'URL of a remote server',
        string: true
      })
      .option('keys', {
        describe:
          'Path to a JSON file containing { keyId: serializedSecretKey } used to decrypt events',
        string: true,
        requiresArg: true
      })
      .positional('contractID', {
        describe: 'Contract ID',
        demandOption: true,
        type: 'string'
      })
      .positional('height', {
        describe: 'Height',
        demandOption: true,
        type: 'number'
      })
  },
  command: 'eventsAfter <contractID> <height>',
  describe:
    'Displays a JSON array of the first LIMIT events that happened in a given contract, since a given entry identified by its height.\n\n' +
    '- Older events are displayed first.\n' +
    '- The output is parseable with tools such as \'jq\'.\n' +
    '- If --url is given, then its /eventsAfter REST endpoint will be called.\n',
  postHandler: (argv) => {
    return eventsAfter(argv)
  }
} as CommandModule<object, Params>

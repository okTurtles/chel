// chel eventsAfter [--limit N] [--url url] <contractID> <height>

import * as base64 from 'jsr:@std/encoding/base64'
import sbp from 'npm:@sbp/sbp'
import { SPMessage } from 'npm:@chelonia/lib/SPMessage'
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

export async function loadSecretKeys (
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

// Minimal `_vm` shape we maintain across messages of the same contract so
// that `SPMessage.deserialize` can validate signatures and decrypt the
// `OP_ACTION_ENCRYPTED` / `OP_KEY_*` ops that come after `OP_CONTRACT`.
type ChelStateLite = {
  _vm: {
    type: string
    // `ChelContractKey`-shaped, but we widen to `unknown` to avoid
    // depending on internal types that have varied across @chelonia/lib
    // versions. The library only inspects `id`, `purpose`, `_notBeforeHeight`,
    // `_notAfterHeight`, `permissions`, and `data`, all of which we copy
    // through verbatim from the deserialized message.
    authorizedKeys: Record<string, Record<string, unknown>>
  }
}

export type DecryptCtx = {
  additionalKeys: Record<string, string>
  states: Map<string, ChelStateLite>
}

// Snapshot the authorizedKeys map after deserializing an OP_CONTRACT.
// Mirrors SPMessage.ts:602-621 / internals.ts `keysToMap` (without
// permission/ringLevel checks): take each key in the message body, unwrap
// any `EncryptedData<SPKey>` wrapper, and key by `id`.
const snapshotAuthorizedKeys = (
  type: string,
  height: number,
  rawKeys: ReadonlyArray<unknown>
): ChelStateLite => {
  const authorizedKeys: ChelStateLite['_vm']['authorizedKeys'] = Object.create(null)
  for (const wrapped of rawKeys) {
    const data = unwrapMaybeEncryptedData(wrapped as never)
    if (!data) continue
    const k = data.data as Record<string, unknown>
    const id = typeof k?.id === 'string' ? k.id : undefined
    if (!id) continue
    const copy = { ...k }
    if (copy._notBeforeHeight == null) copy._notBeforeHeight = height
    delete copy._notAfterHeight
    authorizedKeys[id] = copy
  }
  return { _vm: { type, authorizedKeys } }
}

// Apply post-deserialize state mutations for key-management ops so that
// subsequent messages of the same contract can be decrypted/verified.
const applyKeyOpToState = (
  state: ChelStateLite,
  op: string,
  height: number,
  body: unknown
): void => {
  if (op === SPMessage.OP_KEY_ADD) {
    for (const wrapped of body as ReadonlyArray<unknown>) {
      const data = unwrapMaybeEncryptedData(wrapped as never)
      if (!data) continue
      const k = data.data as Record<string, unknown>
      const id = typeof k?.id === 'string' ? k.id : undefined
      if (!id) continue
      const copy = { ...k }
      if (copy._notBeforeHeight == null) copy._notBeforeHeight = height
      delete copy._notAfterHeight
      state._vm.authorizedKeys[id] = copy
    }
  } else if (op === SPMessage.OP_KEY_DEL) {
    for (const wrapped of body as ReadonlyArray<unknown>) {
      const data = unwrapMaybeEncryptedData(wrapped as never)
      if (!data) continue
      const id = typeof data.data === 'string' ? data.data : undefined
      if (!id) continue
      const existing = state._vm.authorizedKeys[id]
      if (existing) existing._notAfterHeight = height
    }
  } else if (op === SPMessage.OP_KEY_UPDATE) {
    for (const wrapped of body as ReadonlyArray<unknown>) {
      const data = unwrapMaybeEncryptedData(wrapped as never)
      if (!data) continue
      const u = data.data as Record<string, unknown>
      const oldKeyId = typeof u?.oldKeyId === 'string' ? u.oldKeyId : undefined
      const newId = typeof u?.id === 'string' ? u.id : oldKeyId
      if (!newId) continue
      const base = (oldKeyId && state._vm.authorizedKeys[oldKeyId]) || {}
      state._vm.authorizedKeys[newId] = { ...base, ...u, _notBeforeHeight: height }
      delete (state._vm.authorizedKeys[newId] as Record<string, unknown>)._notAfterHeight
    }
  }
}

// Decryption is purely additive: every original field of the input envelope
// (including the local-DB `serverMeta` wrapper, when present) is preserved
// on `raw`, and the decrypted/derived fields are appended alongside.
export type DecryptedOp = {
  op: string
  decryptedValue?: unknown
  innerSigningKeyId?: string
  // For OP_ATOMIC, each sub-op is unwrapped recursively.
  ops?: DecryptedOp[]
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

// Recursively unwrap a single op body to extract the plaintext value and any
// inner signing key id. Mirrors `SPMessage.decryptedValue()` but operates on
// an arbitrary op body so we can reuse it for OP_ATOMIC sub-ops.
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

// Apply key-op state updates for a single op (key id, etc.). Used both for
// top-level key ops and for key ops nested inside OP_ATOMIC.
const maybeApplyKeyOp = (
  state: ChelStateLite | undefined,
  op: string,
  height: number,
  body: unknown
): void => {
  if (!state) return
  if (
    op === SPMessage.OP_KEY_ADD ||
    op === SPMessage.OP_KEY_DEL ||
    op === SPMessage.OP_KEY_UPDATE
  ) {
    try {
      applyKeyOpToState(state, op, height, body)
    } catch (e) {
      console.warn(`[chel] warning: failed to apply ${op}: ${(e as Error).message}`)
    }
  }
}

// Best-effort decryption of a single envelope.
// `rawEnvelope` is the parsed JSON envelope object as produced by
// `getMessagesSince` / `getRemoteMessagesSince`.
export function decryptOne (rawEnvelope: unknown, ctx: DecryptCtx): DecryptedEvent {
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

  let state = ctx.states.get(contractID)
  // Non-OP_CONTRACT messages need the prior contract state to be decrypted.
  // If it is missing (e.g. user passed a partial chain), fall through with
  // `raw` so the user still sees the envelope.
  if (!state && op !== SPMessage.OP_CONTRACT) {
    return {
      height: head.height,
      hash,
      contractID,
      op,
      raw: rawEnvelope,
      error: `no prior contract state for ${contractID} (need OP_CONTRACT first)`
    }
  }

  let message
  try {
    message = SPMessage.deserialize(serialized, ctx.additionalKeys, state as never)
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

  // After successful deserialization, update accumulator state.
  try {
    if (op === SPMessage.OP_CONTRACT) {
      const body = message.message() as { type: string; keys: ReadonlyArray<unknown> }
      state = snapshotAuthorizedKeys(body.type, head.height, body.keys ?? [])
      ctx.states.set(contractID, state)
    } else if (op === SPMessage.OP_ATOMIC) {
      // Apply key-op state updates for any nested key ops so that subsequent
      // messages can still be verified/decrypted.
      const subOps = message.message() as ReadonlyArray<[string, unknown]>
      for (const [subOp, subBody] of subOps) {
        maybeApplyKeyOp(state, subOp, head.height, subBody)
      }
    } else {
      maybeApplyKeyOp(state, op, head.height, message.message())
    }
  } catch (e) {
    // State update failures should not fail the whole decode; we still
    // return the decoded message.
    console.warn(`[chel] warning: failed to update state after ${op} ${hash}: ${(e as Error).message}`)
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
export function decryptEnvelopes (
  envelopes: ReadonlyArray<unknown>,
  additionalKeys: Record<string, string>
): DecryptedEvent[] {
  const ctx: DecryptCtx = { additionalKeys, states: new Map() }
  const out: DecryptedEvent[] = []
  for (const envelope of envelopes) {
    const result = decryptOne(envelope, ctx)
    if (result.error) {
      console.warn(`[chel] warning: ${result.op || '?'} ${result.hash || '?'}: ${result.error}`)
    }
    out.push(result)
  }
  return out
}

export async function eventsAfter ({
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
      const decrypted = decryptEnvelopes(messages, additionalKeys)
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

async function getMessagesSince (
  contractID: string,
  sinceHeight: number,
  limit: number
): Promise<string[]> {
  const readable = await sbp('backend/db/streamEntriesAfter', contractID, sinceHeight, limit)

  return new Promise((resolve, reject) => {
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

async function getRemoteMessagesSince (
  src: string,
  contractID: string,
  sinceHeight: number,
  limit: number
): Promise<string[]> {
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
        coerce (v: number) {
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
    'Displays a JSON array of the first LIMIT events that happened in a given contract, since a given entry identified by its hash.\n\n' +
    '- Older events are displayed first.\n' +
    '- The output is parseable with tools such as \'jq\'.\n' +
    '- If --url is given, then its /eventsAfter REST endpoint will be called.\n',
  postHandler: (argv) => {
    return eventsAfter(argv)
  }
} as CommandModule<object, Params>

export { assert, assertEquals, assertRejects, assertThrows } from 'jsr:@std/assert@1.0.13'
export * as base64 from 'jsr:@std/encoding@1.0.10/base64'
export * as flags from 'jsr:@std/flags@0.224.0'
export * as colors from 'jsr:@std/fmt@1.0.8/colors'
export * as fs from 'jsr:@std/fs@1.0.19'
export * as path from 'jsr:@std/path@1.1.1'
export * as streams from 'jsr:@std/streams@1.0.10'
export * as util from 'jsr:@std/io@0.225.2'
export { copy, readAll, writeAll } from 'jsr:@std/io@0.225.2'
export * as sqlite from 'jsr:@db/sqlite@0.12.0'
export { type Database as SQLiteDB } from 'jsr:@db/sqlite@0.12.0'
export { z } from 'npm:zod@4.0.5'
export { default as tweetnacl } from 'npm:tweetnacl@1.0.3'
export { base58btc } from 'npm:multiformats@11.0.2/bases/base58'
export { type Multibase } from 'npm:multiformats@11.0.2'
export { default as blake } from 'npm:@multiformats/blake2@1.0.13'
export { CID } from 'npm:multiformats@11.0.2/cid'

// Serve command dependencies (pinned to Group Income versions)
export { default as sbp } from 'npm:@sbp/sbp@2.4.1'
export  * as Hapi from 'npm:@hapi/hapi@21.4.3'
export { default as Boom } from 'npm:@hapi/boom@10.0.1'
export { default as Joi } from 'npm:joi@18.0.1'
export { default as Inert } from 'npm:@hapi/inert@7.1.0'
export { default as chalk } from 'npm:chalk@4.1.0'
export { default as pino } from 'npm:pino@8.19.0'
export { default as LRU } from 'npm:lru-cache@7.14.0'
// @deno-types="npm:@types/ws@8.5.10"
export { default as WebSocket, WebSocketServer } from 'npm:ws@8.5.0'
export { v4 as uuid } from 'npm:uuid@9.0.0'
export { cloneDeep, omit } from 'npm:turtledash@1.0.3'

export { default as Bottleneck } from 'npm:bottleneck@2.19.5'
export { default as scrypt } from 'npm:scrypt-async@2.0.1'

// RFC8188 encryption dependencies
export { aes128gcm } from 'npm:@apeleghq/rfc8188@1.0.7/encodings'
export { default as rfc8188Encrypt } from 'npm:@apeleghq/rfc8188@1.0.7/encrypt'

// Chelonia dependencies
export * from 'npm:@chelonia/lib@1.2.4/chelonia'
// Import persistent-actions for SBP selector registration
import 'npm:@chelonia/lib@1.2.4/persistent-actions'
// Specific exports needed by serve files (not covered by export *)
export { blake32Hash, createCID, maybeParseCID, multicodes, strToB64, getSubscriptionId, parseCID } from 'npm:@chelonia/lib@1.2.4/functions'
export { checkKey, parsePrefixableKey, prefixHandlers } from 'npm:@chelonia/lib@1.2.4/db'
export { SPMessage } from 'npm:@chelonia/lib@1.2.4/SPMessage'
export { SERVER } from 'npm:@chelonia/lib@1.2.4/presets'
export { ChelErrorGenerator } from 'npm:@chelonia/lib@1.2.4/errors'
export type { SubMessage, UnsubMessage, Message, PubMessage, NotificationTypeEnum } from 'npm:@chelonia/lib@1.2.4/pubsub'
export { PUSH_SERVER_ACTION_TYPE, REQUEST_TYPE, RESPONSE_TYPE, NOTIFICATION_TYPE, createMessage, createClient, createKvMessage, messageParser } from 'npm:@chelonia/lib@1.2.4/pubsub'
export { verifyShelterAuthorizationHeader } from 'npm:@chelonia/lib@1.2.4/utils'
// ZKPP functions and constants (re-exported from shared directory)
export { base64ToBase64url, base64urlToBase64, boxKeyPair, computeCAndHc, decryptSaltUpdate, encryptContractSalt, encryptSaltUpdate, hash, hashRawStringArray, hashStringArray, parseRegisterSalt, randomNonce } from 'npm:@chelonia/lib@1.2.4/zkpp'
export { AUTHSALT, CONTRACTSALT, CS, SALT_LENGTH_IN_OCTETS, SU } from 'npm:@chelonia/lib@1.2.4/zkppConstants'
export { EDWARDS25519SHA512BATCH, CURVE25519XSALSA20POLY1305, XSALSA20POLY1305 } from 'npm:@chelonia/crypto@1.0.1'
export { keygen, serializeKey, deserializeKey, keygenOfSameType, keyId, generateSalt, deriveKeyFromPassword } from 'npm:@chelonia/crypto@1.0.1'
export { sign, verifySignature, encrypt, decrypt } from 'npm:@chelonia/crypto@1.0.1'

// Vue validation dependencies
export { validationMixin } from 'npm:vuelidate@0.7.6'

import { colors, flags } from './deps.ts'
import { revokeNet } from './utils.ts'
import { deserializeKey, keyId, verifySignature as cryptoVerifySignature } from './lib/crypto.ts'
import { importJsonFile } from './utils.ts'

export const verifySignature = async (args: string[], internal = false) => {
  await revokeNet()
  const parsedArgs = flags.parse(args)
  const [keyFile, manifestFile] = parsedArgs._
  const [keyDescriptor, manifest] = await Promise.all([
    importJsonFile(keyFile),
    importJsonFile(manifestFile)
  ])
  if (!keyDescriptor.pubkey) {
    throw new Error('Public key missing from key file')
  }
  if (!manifest.head?.manifestVersion) {
    throw new Error('Invalid manifest: missing head or manifest version')
  }
  if (!manifest.body) {
    throw new Error('Invalid manifest: missing body')
  }
  if (!manifest.signature) {
    throw new Error('Invalid manifest: missing signature')
  }
  if (!manifest.signature.keyId) {
    throw new Error('Invalid manifest: missing signature key ID')
  }
  if (!manifest.signature.value) {
    throw new Error('Invalid manifest: missing signature value')
  }
  const pubKey = deserializeKey(keyDescriptor.pubkey)
  const id = keyId(pubKey)
  if (manifest.signature.keyId !== id) {
    throw new Error(`Invalid manifest signature: key ID doesn\'t match the provided key file. Expected ${id} but got ${manifest.signature.keyId}.`)
  }
  cryptoVerifySignature(pubKey, manifest.body + manifest.head.manifestVersion, manifest.signature.value)

  if (!internal) console.log(colors.green('signature ok'), '(verification not yet complete)')

  const body = JSON.parse(manifest.body)
  if (!Array.isArray(body.signingKeys)) throw new Error('Missing signingKeys in manifest')
  if (body.signingKeys.every((k: string) => {
    return keyId(k) !== id
  })) {
    throw new Error('The signing key is not listed in signingKeys')
  }

  if (!internal) console.log(colors.green('ok'), 'all checks passed')
}
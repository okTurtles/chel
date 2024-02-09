import { colors, flags } from './deps.ts'
import { exit, revokeNet } from './utils.ts'
import { deserializeKey, keyId, verifySignature as cryptoVerifySignature } from './lib/crypto.ts'
import { importJsonFile } from './utils.ts'

export const verifySignature = async (args: string[], internal = false) => {
  await revokeNet()
  const parsedArgs = flags.parse(args)
  const [manifestFile] = parsedArgs._
  const keyFile = parsedArgs.k
  const [externalKeyDescriptor, manifest] = await Promise.all([
    keyFile ? importJsonFile(keyFile) : null,
    importJsonFile(manifestFile)
  ])
  if (keyFile && !externalKeyDescriptor.pubkey) {
    exit('Public key missing from key file', internal)
  }
  if (!manifest.head?.manifestVersion) {
    exit('Invalid manifest: missing head or manifest version', internal)
  }
  if (!manifest.body) {
    exit('Invalid manifest: missing body', internal)
  }
  if (!manifest.signature) {
    exit('Invalid manifest: missing signature', internal)
  }
  if (!manifest.signature.keyId) {
    exit('Invalid manifest: missing signature key ID', internal)
  }
  if (!manifest.signature.value) {
    exit('Invalid manifest: missing signature value', internal)
  }
  const body = JSON.parse(manifest.body)
  const signingKey = body.signingKeys?.find((k: string) => {
    return keyId(k) === manifest.signature.keyId
  })

  if (externalKeyDescriptor) {
    const id = keyId(externalKeyDescriptor.pubkey)
    if (manifest.signature.keyId !== id) {
      exit(`Invalid manifest signature: key ID doesn\'t match the provided key file. Expected ${id} but got ${manifest.signature.keyId}.`, internal)
    }
  }

  // If an external public key is provided, we use that one for verification,
  // even if it is missing in body.signingKeys
  const serializedPubKey =  signingKey || externalKeyDescriptor?.pubkey
  if (!serializedPubKey) {
    exit('The manifest appears to be signed but verification can\'t proceed because the key used is unknown.', internal);
  }

  const pubKey = deserializeKey(serializedPubKey)
  cryptoVerifySignature(pubKey, manifest.body + manifest.head.manifestVersion, manifest.signature.value)

  if (!signingKey) {
    exit('The signature is valid but the signing key is not listed in signingKeys', internal)
  }

  if (!internal) console.log(colors.green('ok'), 'all checks passed')
}
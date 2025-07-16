import { hash } from './commands.ts'
import { colors, flags, path } from './deps.ts'
import { verifySignature as cryptoVerifySignature, deserializeKey, keyId } from './lib/crypto.ts'
import { exit, multicodes, readJsonFile, revokeNet } from './utils.ts'

interface ExternalKeyDescriptor {
  pubkey: string
}

interface ManifestSignature {
  keyId: string
  value: string
}

interface Manifest {
  head: string
  body: string
  signature: ManifestSignature
}

function isExternalKeyDescriptor (obj: unknown): obj is ExternalKeyDescriptor {
  return obj !== null && typeof obj === 'object' && typeof (obj as Record<string, unknown>).pubkey === 'string'
}

function isManifest (obj: unknown): obj is Manifest {
  const maybe = obj as Record<string, unknown>
  return (
    obj !== null &&
    typeof maybe.head === 'string' &&
    typeof maybe.body === 'string' &&
    typeof maybe.signature === 'object' &&
    maybe.signature !== null
  )
}

export const verifySignature = async (args: string[], internal = false): Promise<void> => {
  await revokeNet()
  const parsedArgs = flags.parse(args)
  const [manifestFile] = parsedArgs._
  const keyFile = parsedArgs.k
  const [externalKeyDescriptorRaw, manifestRaw] = await Promise.all([
    typeof keyFile === 'string' ? readJsonFile(keyFile) : null,
    readJsonFile(manifestFile)
  ])
  const externalKeyDescriptor = externalKeyDescriptorRaw as ExternalKeyDescriptor | null
  const manifest = manifestRaw as Manifest
  if (typeof keyFile === 'string' && (externalKeyDescriptorRaw === null || !isExternalKeyDescriptor(externalKeyDescriptorRaw))) {
    exit('Public key missing from key file', internal)
  }
  if (!isManifest(manifestRaw)) {
    exit('Invalid manifest: missing signature key ID', internal)
  }
  if (typeof manifest.head !== 'string' || manifest.head === '') {
    exit('Invalid manifest: missing head', internal)
  }
  if (typeof manifest.body !== 'string' || manifest.body === '') {
    exit('Invalid manifest: missing body', internal)
  }
  if (typeof manifest.signature !== 'object' || manifest.signature === null) {
    exit('Invalid manifest: missing signature', internal)
  }
  if (typeof manifest.signature.keyId !== 'string' || manifest.signature.keyId === '') {
    exit('Invalid manifest: missing signature key ID', internal)
  }
  if (typeof manifest.signature.value !== 'string' || manifest.signature.value === '') {
    exit('Invalid manifest: missing signature value', internal)
  }
  const body = JSON.parse(manifest.body)
  const signingKey = body.signingKeys?.find((k: string) => {
    return keyId(k) === manifest.signature.keyId
  })

  if (externalKeyDescriptor !== null) {
    const id = keyId(externalKeyDescriptor.pubkey)
    if (manifest.signature.keyId !== id) {
      exit(`Invalid manifest signature: key ID doesn't match the provided key file. Expected ${id} but got ${manifest.signature.keyId}.`, internal)
    }
  }

  // If an external public key is provided, we use that one for verification,
  // even if it is missing in body.signingKeys
  const serializedPubKey = signingKey ?? externalKeyDescriptor?.pubkey
  if (typeof serializedPubKey !== 'string' || serializedPubKey === '') {
    exit('The manifest appears to be signed but verification can\'t proceed because the key used is unknown.', internal)
  }

  const pubKey = deserializeKey(serializedPubKey)
  try {
    cryptoVerifySignature(pubKey, manifest.body + manifest.head, manifest.signature.value)
  } catch (e) {
    const errMessage = typeof (e as Error)?.message === 'string' && (e as Error).message !== ''
      ? (e as Error).message
      : String(e)
    exit('Error validating signature: ' + errMessage, internal)
  }

  if (typeof signingKey !== 'string' || signingKey === '') {
    exit('The signature is valid but the signing key is not listed in signingKeys', internal)
  }

  const parsedFilepath = path.parse(String(manifestFile))
  if (typeof body.contract?.file !== 'string' || body.contract.file === '') {
    exit('Invalid manifest: no contract file', internal)
  }
  const computedHash = await hash([path.join(parsedFilepath.dir, body.contract.file)], multicodes.SHELTER_CONTRACT_TEXT, true)
  if (typeof body.contract.hash !== 'string' || computedHash !== body.contract.hash) {
    exit(`Invalid contract file hash. Expected ${String(body.contract.hash)} but got ${computedHash}`, internal)
  }

  if (typeof body.contractSlim === 'object' && body.contractSlim !== null) {
    const computedHash = await hash([path.join(parsedFilepath.dir, body.contractSlim.file)], multicodes.SHELTER_CONTRACT_TEXT, true)
    if (computedHash !== body.contractSlim.hash) {
      exit(`Invalid slim contract file hash. Expected ${String(body.contractSlim.hash)} but got ${computedHash}`, internal)
    }
  }

  if (!internal) console.log(colors.green('ok'), 'all checks passed')
}

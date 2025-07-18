import { hash } from './commands.ts'
import { colors, flags, path, verifySignature as cryptoVerifySignature, deserializeKey, keyId } from './deps.ts'
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
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (keyFile && (!externalKeyDescriptorRaw || !isExternalKeyDescriptor(externalKeyDescriptorRaw))) {
    exit('Public key missing from key file', internal)
  }
  if (!isManifest(manifestRaw)) {
    exit('Invalid manifest: missing signature key ID', internal)
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!manifest.head) {
    exit('Invalid manifest: missing head', internal)
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!manifest.body) {
    exit('Invalid manifest: missing body', internal)
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!manifest.signature) {
    exit('Invalid manifest: missing signature', internal)
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!manifest.signature.keyId) {
    exit('Invalid manifest: missing signature key ID', internal)
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!manifest.signature.value) {
    exit('Invalid manifest: missing signature value', internal)
  }
  const body = JSON.parse(manifest.body)
  const signingKey = body.signingKeys?.find((k: string) => {
    return keyId(k) === manifest.signature.keyId
  })

  if (externalKeyDescriptor !== null) {
    const id = keyId(externalKeyDescriptor.pubkey)
    if (manifest.signature.keyId !== id) {
      exit(`Invalid manifest signature: key ID doesn't match the provided key file. Expected ${String(id)} but got ${String(manifest.signature.keyId)}.`, internal)
    }
  }

  // If an external public key is provided, we use that one for verification,
  // even if it is missing in body.signingKeys
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const serializedPubKey = signingKey || externalKeyDescriptor?.pubkey
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!serializedPubKey) {
    exit('The manifest appears to be signed but verification can\'t proceed because the key used is unknown.', internal)
  }

  const pubKey = deserializeKey(serializedPubKey)
  try {
    cryptoVerifySignature(pubKey, manifest.body + manifest.head, manifest.signature.value)
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    exit('Error validating signature: ' + ((e as Error)?.message || String(e)), internal)
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!signingKey) {
    exit('The signature is valid but the signing key is not listed in signingKeys', internal)
  }

  const parsedFilepath = path.parse(manifestFile as string)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!body.contract?.file) {
    exit('Invalid manifest: no contract file', internal)
  }
  const computedHash = await hash([path.join(parsedFilepath.dir, body.contract.file)], multicodes.SHELTER_CONTRACT_TEXT, true)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (computedHash !== body.contract.hash) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    exit(`Invalid contract file hash. Expected ${body.contract.hash} but got ${computedHash}`, internal)
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (body.contractSlim) {
    const computedHash = await hash([path.join(parsedFilepath.dir, body.contractSlim.file)], multicodes.SHELTER_CONTRACT_TEXT, true)
    if (computedHash !== body.contractSlim.hash) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      exit(`Invalid slim contract file hash. Expected ${body.contractSlim.hash} but got ${computedHash}`, internal)
    }
  }

  if (!internal) console.log(colors.green('ok'), 'all checks passed')
}

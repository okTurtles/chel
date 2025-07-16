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

function isExternalKeyDescriptor(obj: any): obj is ExternalKeyDescriptor {
  return obj && typeof obj.pubkey === 'string'
}

function isManifestSignature(obj: any): obj is ManifestSignature {
  return obj && typeof obj.keyId === 'string' && typeof obj.value === 'string'
}

function isManifest(obj: any): obj is Manifest {
  return obj
    && typeof obj.head === 'string'
    && typeof obj.body === 'string'
    && typeof obj.signature === 'object' && obj.signature !== null
}

export const verifySignature = async (args: string[], internal = false) => {
  await revokeNet()
  const parsedArgs = flags.parse(args)
  const [manifestFile] = parsedArgs._
  const keyFile = parsedArgs.k
  const [externalKeyDescriptorRaw, manifestRaw] = await Promise.all([
    keyFile ? readJsonFile(keyFile) : null,
    readJsonFile(manifestFile)
  ])
  const externalKeyDescriptor = externalKeyDescriptorRaw as ExternalKeyDescriptor | null
  const manifest = manifestRaw as Manifest
  if (keyFile && (!externalKeyDescriptorRaw || !isExternalKeyDescriptor(externalKeyDescriptorRaw))) {
    exit('Public key missing from key file', internal)
  }
  if (!isManifest(manifestRaw)) {
    exit('Invalid manifest: missing signature key ID', internal)
  }
  if (!manifest.head) {
    exit('Invalid manifest: missing head', internal)
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
  const serializedPubKey = signingKey || externalKeyDescriptor?.pubkey
  if (!serializedPubKey) {
    exit('The manifest appears to be signed but verification can\'t proceed because the key used is unknown.', internal)
  }

  const pubKey = deserializeKey(serializedPubKey)
  try {
    cryptoVerifySignature(pubKey, manifest.body + manifest.head, manifest.signature.value)
  } catch (e) {
    exit('Error validating signature: ' + ((e as Error)?.message || String(e)), internal)
  }

  if (!signingKey) {
    exit('The signature is valid but the signing key is not listed in signingKeys', internal)
  }

  const parsedFilepath = path.parse(manifestFile as string)
  if (!body.contract?.file) {
    exit('Invalid manifest: no contract file', internal)
  }
  const computedHash = await hash([path.join(parsedFilepath.dir, body.contract.file)], multicodes.SHELTER_CONTRACT_TEXT, true)
  if (computedHash !== body.contract.hash) {
    exit(`Invalid contract file hash. Expected ${body.contract.hash} but got ${computedHash}`, internal)
  }

  if (body.contractSlim) {
    const computedHash = await hash([path.join(parsedFilepath.dir, body.contractSlim.file)], multicodes.SHELTER_CONTRACT_TEXT, true)
    if (computedHash !== body.contractSlim.hash) {
      exit(`Invalid slim contract file hash. Expected ${body.contractSlim.hash} but got ${computedHash}`, internal)
    }
  }

  if (!internal) console.log(colors.green('ok'), 'all checks passed')
}

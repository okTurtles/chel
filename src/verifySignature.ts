import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path/'
import { verifySignature as cryptoVerifySignature, deserializeKey, keyId } from 'npm:@chelonia/crypto'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { hash } from './hash.ts'
import { exit, multicodes, readJsonFile, revokeNet } from './utils.ts'

type Params = { key?: string, manifestFile: string }

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
    typeof obj === 'object' &&
    obj !== null &&
    typeof maybe.head === 'string' &&
    typeof maybe.body === 'string' &&
    typeof maybe.signature === 'object' &&
    maybe.signature !== null
  )
}

export const verifySignature = async (args: ArgumentsCamelCase<Params>, internal = false): Promise<void> => {
  await revokeNet()
  const { key: keyFile, manifestFile } = args
  const [externalKeyDescriptorRaw, manifestRaw] = await Promise.all([
    typeof keyFile === 'string' ? readJsonFile(keyFile) : null,
    readJsonFile(manifestFile)
  ])

  let externalKeyDescriptor: ExternalKeyDescriptor | undefined
  if (keyFile && externalKeyDescriptorRaw) {
    if (!isExternalKeyDescriptor(externalKeyDescriptorRaw)) {
      return exit('Public key missing from key file', internal)
    }
    externalKeyDescriptor = externalKeyDescriptorRaw
  }

  if (!isManifest(manifestRaw)) {
    return exit('Invalid manifest: missing signature key ID', internal)
  }
  const manifest = manifestRaw

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
      exit(`Invalid manifest signature: key ID doesn't match the provided key file. Expected ${id} but got ${manifest.signature.keyId}.`, internal)
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
  const computedHash = await hash({ ...args, filename: path.join(parsedFilepath.dir, body.contract.file) }, multicodes.SHELTER_CONTRACT_TEXT, true)
  if (computedHash !== body.contract.hash) {
    exit(`Invalid contract file hash. Expected ${body.contract.hash} but got ${computedHash}`, internal)
  }

  if (body.contractSlim) {
    const computedHash = await hash({ ...args, filename: path.join(parsedFilepath.dir, body.contractSlim.file) }, multicodes.SHELTER_CONTRACT_TEXT, true)
    if (computedHash !== body.contractSlim.hash) {
      exit(`Invalid slim contract file hash. Expected ${body.contractSlim.hash} but got ${computedHash}`, internal)
    }
  }

  if (!internal) console.log(colors.green('ok'), 'all checks passed')
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('key', {
        describe: 'Public key',
        requiresArg: true,
        string: true,
      })
      .alias('k', 'key')
      .positional('manifestFile', {
        describe: 'Manifest file',
        demandOption: true,
        type: 'string'
      })
  },
  command: 'verifySignature <manifestFile>',
  describe: '',
  postHandler: (argv) => {
    return verifySignature(argv)
  }
} as CommandModule<object, Params>

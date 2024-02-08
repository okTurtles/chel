import { flags } from './deps.ts'
import { revokeNet } from './utils.ts'
import { EDWARDS25519SHA512BATCH, keygen as cryptoKeygen, serializeKey } from './lib/crypto.ts'

export const keygen = async (args: string[]) => {
  await revokeNet()
  const parsedArgs = flags.parse(args)
  const key = cryptoKeygen(EDWARDS25519SHA512BATCH)
  const textEncoder = new TextEncoder()
  const result = textEncoder.encode(JSON.stringify({
    version: '1.0.0',
    pubkey: serializeKey(key, false),
    privkey: serializeKey(key, true)
  }))

  if (parsedArgs['out']) {
    await Deno.writeFile(parsedArgs['out'], result)
  } else {
    await Deno.stdout.write(result)
  }
}
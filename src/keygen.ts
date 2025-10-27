import * as flags from 'jsr:@std/flags/'
import * as colors from 'jsr:@std/fmt/colors'
import { EDWARDS25519SHA512BATCH, keygen as cryptoKeygen, keyId, serializeKey } from 'npm:@chelonia/crypto'
import { revokeNet } from './utils.ts'

export const keygen = async (args: string[]): Promise<void> => {
  await revokeNet()
  const parsedArgs = flags.parse(args)
  const key = cryptoKeygen(EDWARDS25519SHA512BATCH)
  const pubKeyData = {
    version: '1.0.0',
    pubkey: serializeKey(key, false)
  }
  const keyData = {
    ...pubKeyData,
    privkey: serializeKey(key, true)
  }
  const result = JSON.stringify(keyData)
  const pubResult = JSON.stringify(pubKeyData)

  const idx = keyId(key).slice(-12)
  const outFile = parsedArgs.out || `${EDWARDS25519SHA512BATCH}-${idx}.json`
  const pubOutFile = parsedArgs.pubout || `${EDWARDS25519SHA512BATCH}-${idx}.pub.json`

  await Deno.writeTextFile(outFile, result)
  console.log(colors.green('wrote:'), outFile, colors.blue('(secret)'))

  await Deno.writeTextFile(pubOutFile, pubResult)
  console.log(colors.green('wrote:'), pubOutFile, colors.blue('(public)'))
}

import { colors, flags, EDWARDS25519SHA512BATCH, keygen as cryptoKeygen, keyId, serializeKey } from './deps.ts'
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
  const outFile: string = typeof parsedArgs.out === 'string' && parsedArgs.out.trim() !== ''
    ? parsedArgs.out
    : `${String(EDWARDS25519SHA512BATCH)}-${String(idx)}.json`
  const pubOutFile: string = typeof parsedArgs.pubout === 'string' && parsedArgs.pubout.trim() !== ''
    ? parsedArgs.pubout
    : `${String(EDWARDS25519SHA512BATCH)}-${String(idx)}.pub.json`

  await Deno.writeTextFile(outFile, result)
  console.log(colors.green('wrote:'), outFile, colors.blue('(secret)'))

  await Deno.writeTextFile(pubOutFile, pubResult)
  console.log(colors.green('wrote:'), pubOutFile, colors.blue('(public)'))
}

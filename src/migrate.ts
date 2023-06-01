"use strict"
// chel migrate --from fs --to sqlite --out ./database.db ./data

import { colors, flags, path } from './deps.ts'
import { exit, isDir, isFile, isNotHashKey, isValidKey, revokeNet } from './utils.ts'

const backends = {
  fs: await import('./database-fs.ts'),
  sqlite: await import('./database-sqlite.ts')
}

export async function migrate(args: string[]) {
  await revokeNet()
  const parsedArgs = flags.parse(args)

  const { from, to, out } = parsedArgs
  const src = path.resolve(String(parsedArgs._[0]) ?? '.')

  if (!from) exit('missing argument: --from')
  if (!to) exit('missing argument: --to')
  if (!out) exit('missing argument: --out')

  const backendFrom = backends[from as keyof typeof backends]
  const backendTo = backends[to as keyof typeof backends]
  
  if (!backendFrom) exit(`unknown storage backend: "${from}"`)
  if (!backendTo) exit(`unknown storage backend: "${to}"`)
  if (from === to) exit('arguments --from and --to must be different')

  if (isDir(src)) {
    if (from === 'sqlite') exit(`not a database file: "${src}"`)
  } else if (isFile(src)) {
    if (from === 'fs') exit(`not a directory: "${src}"`)
  } else {
    exit(`not found: "${src}"`)
  }

  if (isDir(out)) {
    if (to === 'sqlite') exit(`argument --out is a directory: "${out}"`)
  } else if (isFile(out)) {
    if (to === 'fs') exit(`argument --out is a file: "${out}"`)
  } else if (out.endsWith('./')) {
    if (to === 'sqlite') exit(`argument --out ends with a slash: "${out}"`)
  }

  try {
    await backendFrom.initStorage(from === 'fs' ? {dirname: src} : {dirname: path.dirname(src), filename: path.basename(src)})
  } catch (error) {
    exit(`could not init storage backend at "${src}" to migrate from: ${error.message}`)
  }
  try {
    await backendTo.initStorage(to === 'fs' ? {dirname: out} : {dirname: path.dirname(out), filename: path.basename(out)})
  } catch (error) {
    exit(`could not init storage backend to migrate to: ${error.message}`)
  }

  const numKeys = await backendFrom.count()

  let numVisitedKeys = 0

  for await (const key of backendFrom.iterKeys()) {
    if (!isValidKey(key)) continue
    const value = await backendFrom.readData(key)
    // Make `deno check` happy.
    if (value === undefined) continue
    if (isNotHashKey(key)) {
      await backendTo.writeData(key, value)
    } else {
      await backendTo.writeDataOnce(key, value)
    }
    ++numVisitedKeys
    // Prints a message roughly every 10% of progress.
    if (numVisitedKeys % (numKeys / 10) < 1) {
      console.log(`[chel] Migrating... ${Math.round(numVisitedKeys / (numKeys / 10))}0% done`)
    }
  }
  numKeys && console.log(`[chel] ${colors.green('Migrated:')} ${numKeys} entries`)
}

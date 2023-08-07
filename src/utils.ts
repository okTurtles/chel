'use strict'

import { CID, base58btc, blake, colors, path } from './deps.ts'
import * as fs from './database-fs.ts'
import * as sqlite from './database-sqlite.ts'

const backends = { fs, sqlite }

// We can change these constants later if we want.
const multibase = base58btc
const multicodes = { JSON: 0x0200, RAW: 0x55 }
// @ts-ignore Property 'blake2b256' does not exist on type '{}'.
const multihasher = blake.blake2b.blake2b256

export type Backend = typeof backends.sqlite | typeof backends.fs

// For now our entry keys are CIDs serialized to base58btc and our values are always Uint8Array instances.
export type Entry = [string, Uint8Array]

export function checkKey (key: string): void {
  if (!isValidKey(key)) {
    throw new Error(`bad key: ${JSON.stringify(key)}`)
  }
}

export async function createEntryFromFile (filepath: string): Promise<Entry> {
  const buffer = await Deno.readFile(filepath)
  const multicode = getPathExtension(filepath) === '.json' ? multicodes.JSON : multicodes.RAW
  const key = createCID(buffer, multicode)
  return [key, buffer]
}

// TODO: implement a streaming hashing function for large files.
// Note: in fact this returns a serialized CID, not a CID object.
export function createCID (data: string | Uint8Array, multicode = multicodes.RAW): string {
  const uint8array = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const digest = multihasher.digest(uint8array)
  return CID.create(1, multicode, digest).toString(multibase.encoder)
}

export function exit (message: string): never {
  console.error('[chel]', colors.red('Error:'), message)
  Deno.exit(1)
}

export async function getBackend (src: string): Promise<Backend> {
  let from
  let options
  if (isDir(src)) {
    from = 'fs'
    options = { internal: true, dirname: src }
  } else if (isFile(src)) {
    from = 'sqlite'
    options = { internal: true, dirname: path.dirname(src), filename: path.basename(src) }
  } else throw new Error(`invalid argument: "${src}"`)

  const backend: Backend = backends[from as keyof typeof backends]
  try {
    await backend.initStorage(options)
  } catch (error) {
    throw new Error(`could not init storage backend at "${src}": ${error.message}`)
  }
  return backend
}

export function getPathExtension (path: string): string {
  const index = path.lastIndexOf(".")
  if (index === -1 || index === 0) return ""
  return path.slice(index).toLowerCase()
}

export function isArrayLength (arg: number): boolean {
  return Number.isInteger(arg) && arg >= 0 && arg <= 2 ** 32 - 1
}

// Checks whether a path points to a directory, following symlinks if any.
export function isDir (path: string | URL): boolean {
  try {
    const info = Deno.statSync(path)
    return info.isDirectory
  } catch (_e) {
    return false
  }
}

// Checks whether a path points to a file, following symlinks if any.
export function isFile (path: string | URL): boolean {
  try {
    const info = Deno.statSync(path)
    return info.isFile
  } catch (_e) {
    return false
  }
}

export function isNotHashKey (key: string): boolean {
  return key.startsWith('head=') || key.startsWith('name=')
}

export function isURL (arg: string): boolean {
  return URL.canParse(arg) && Boolean(new URL(arg).host)
}

export function isValidKey (key: string): boolean {
  // Disallow unprintable characters, slashes, and TAB.
  // deno-lint-ignore no-control-regex
  return !/[\x00-\x1f\x7f\t\\/]/.test(key)
}

export async function readRemoteData (src: string, key: string): Promise<Uint8Array> {
  const buffer = await fetch(`${src}/file/${key}`)
    .then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error(`failed network request to ${src}: ${r.status} - ${r.statusText}`)))
  return new Uint8Array(buffer)
}

export async function revokeNet () {
  await Deno.permissions.revoke({ name: 'net' })
}

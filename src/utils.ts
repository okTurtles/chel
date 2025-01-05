'use strict'

import { CID, base58btc, blake, colors, path } from './deps.ts'
import * as fs from './database-fs.ts'
import * as sqlite from './database-sqlite.ts'

// We can update these constants later if we want.
const backends = { fs, sqlite }
const multibase = base58btc
// Values from https://github.com/multiformats/multicodec/blob/master/table.csv
export const multicodes = {
  RAW: 0x00,
  JSON: 0x0200,
  SHELTER_CONTRACT_MANIFEST: 0x511e00,
  SHELTER_CONTRACT_TEXT: 0x511e01,
  SHELTER_CONTRACT_DATA: 0x511e02,
  SHELTER_FILE_MANIFEST: 0x511e03,
  SHELTER_FILE_CHUNK: 0x511e04
}
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

export async function createEntryFromFile (filepath: string, multicode: number): Promise<Entry> {
  const buffer = await Deno.readFile(filepath)
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

export function exit (message: string, internal = false): never {
  if (internal) throw new Error(message)
  console.error('[chel]', colors.red('Error:'), message)
  Deno.exit(1)
}

// Supported backend types: fs and sqlite
export async function getBackend (src: string, { type, create } = { type: '', create: false }): Promise<Backend> {
  const fsOptions = { internal: true, dirname: src }
  const sqliteOptions = { internal: true, dirname: path.dirname(src), filename: path.basename(src) }

  // If 'create' is falsy then make sure 'src' already exists, becqause otherwise 'initStorage()' would create it.
  if (!create && !await isDir(src) && !await isFile(src)) throw new Error(`not found: "${src}"`)

  // We first need to know the backend type and init options.
  let from = type
  if (!from) {
    // Attempt to auto-detect the backend type.
    if (await isDir(src)) from = 'fs'
    else if (await isFile(src)) from = 'sqlite'
    else throw new Error(`could not infer backend type. Not found: "${src}"`)
  }

  let initOptions
  switch (from) {
    case 'fs': initOptions = fsOptions; break
    case 'sqlite': initOptions = sqliteOptions; break
    default: throw new Error(`unknown backend type: "${from}"`)
  }

  const backend: Backend = backends[from as keyof typeof backends]
  try {
    await backend.initStorage(initOptions)
  } catch (error) {
    throw new Error(`could not init '${from}' storage backend at "${src}": ${error.message}`)
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
export async function isDir (path: string | URL): Promise<boolean> {
  try {
    return (await Deno.stat(path)).isDirectory
  } catch {
    return false
  }
}

// Checks whether a path points to a file, following symlinks if any.
export async function isFile (path: string | URL): Promise<boolean> {
  try {
    return (await Deno.stat(path)).isFile
  } catch {
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

export const readJsonFile = async (file: unknown) => {
  const contents = await Deno.readTextFile(path.resolve(String(file)))
  return JSON.parse(contents)
}
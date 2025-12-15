import * as colors from 'jsr:@std/fmt/colors'
import * as path from 'jsr:@std/path/'
import { join } from 'node:path'
import { createCID } from 'npm:@chelonia/lib/functions'

// For now our entry keys are CIDs serialized to base58btc and our values are always Uint8Array instances.
export type Entry = [string, Uint8Array<ArrayBuffer>]

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

export function exit (x: unknown, internal = false): never {
  const msg = x instanceof Error ? x.message : String(x)

  if (internal) throw new Error(msg)

  console.error('[chel]', colors.red('Error:'), msg)
  Deno.exit(1)
}

export function getPathExtension (path: string): string {
  const index = path.lastIndexOf('.')
  if (index === -1 || index === 0) return ''
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
    .then(async r => r.ok ? await r.arrayBuffer() : await Promise.reject(new Error(`failed network request to ${src}: ${r.status} - ${r.statusText}`)))
  return new Uint8Array(buffer)
}

export async function revokeNet (): Promise<void> {
  await Deno.permissions.revoke({ name: 'net' })
}

export const readJsonFile = async (file: unknown): Promise<unknown> => {
  const contents = await Deno.readTextFile(path.resolve(String(file)))
  return JSON.parse(contents)
}

// Add to src/utils.ts
export interface ShellOptions {
  printOutput?: boolean
  shell?: string
  cwd?: string
}

export async function shell (
  command: string,
  options: ShellOptions = {}
): Promise<string> {
  const { printOutput = false, shell = '/bin/sh', cwd } = options
  const cmd = new Deno.Command(shell, {
    args: ['-c', command],
    stdout: 'piped',
    stderr: 'piped',
    cwd
  })

  const { code, stdout, stderr } = await cmd.output()
  const decoder = new TextDecoder()

  if (printOutput) {
    await Deno.stdout.write(stdout)
    await Deno.stderr.write(stderr)
  }

  if (code !== 0) {
    throw new Error(
      `Command failed with exit code ${code}: ${decoder.decode(stderr)}`
    )
  }

  return decoder.decode(stdout).trim()
}

export const findManifestFiles = async (path: string): Promise<Set<string>> => {
  const visited = new Set<string>()
  const internal = async (path: string) => {
    if (visited.has(path)) {
      return new Set<string>()
    }
    visited.add(path)

    const entries = Deno.readDir(path)
    const manifests = new Set<string>()
    for await (const entry of entries) {
      const realPath = await Deno.realPath(join(path, entry.name))
      const info = await Deno.lstat(realPath)
      if (info.isDirectory) {
        const subitems = await internal(realPath)
        for (const item of subitems) {
          manifests.add(item)
        }
      } else if (entry.name.toLowerCase().endsWith('.manifest.json')) {
        manifests.add(join(path, entry.name))
      }
    }

    return manifests
  }

  const realPath = await Deno.realPath(path)
  return internal(realPath)
}

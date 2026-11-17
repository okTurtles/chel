import { realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import { SQLITE_DEFAULT_FILEPATH } from './backend-schemas.ts'

// Canonicalizes a filepath for same-file comparison. resolve() alone is
// lexical, which is not enough on two counts: on case-insensitive
// filesystems (the macOS and Windows defaults) two spellings can name one
// file, and a symlink can name the source file from somewhere else.
// realpathSync.native answers both, returning the path the filesystem itself
// recognizes (including the on-disk case). A path that does not exist yet has
// no real path to ask for, and cannot be a file that is already open, so the
// lexical form stands in.
function canonicalFilepath (filepath: string): string {
  const resolved = resolve(filepath)
  try {
    return realpathSync.native(resolved)
  } catch {
    return resolved
  }
}

// The file a sqlite backend with these options opens, canonicalized. An
// omitted filepath resolves the way SqliteBackend itself resolves it, via the
// constant the backend derives its own defaults from. Used by `chel migrate`'s
// same-file guard and by the router, to give prefixes on one file one backend.
export function sqliteFilepath (options: { filepath?: string } | undefined): string {
  return canonicalFilepath(options?.filepath || SQLITE_DEFAULT_FILEPATH)
}

// Adapted from Group Income's utils.js for Deno/TypeScript compatibility
// Original: https://github.com/okTurtles/group-income/blob/93de1fea25b9775499a6e7ce5cc00a3c747e4ece/scripts/esbuild-plugins/utils.js

import { dirname, join, relative } from 'node:path'
import process from 'node:process'

function escapeForRegExp (string: string): string {
  return string.replace(/[.*+?^${}()|\\[\]]/g, '\\$&')
}

/**
 * Creates an alias replacement function from a mapping of path aliases, to be
 * used in import statements, import expressions and at-import rules.
 */
export function createAliasReplacer (aliases: Record<string, string>) {
  if (Object.keys(aliases).some(alias => alias.includes('/'))) {
    throw new Error('Path aliases may not include slash characters.')
  }

  const cwd = process.cwd()
  const escapedAndSortedAliases = Object.keys(aliases).map(escapeForRegExp).sort().reverse()
  const re = new RegExp(
    `(?:^import[ (]|\\bimport[ (]|import .+? from |^\\} from |^@use )['"](${ escapedAndSortedAliases.join('|')})(?:['"]|/[^'"]+?['"])`,
    'gm'
  )

  return function aliasReplacer ({ path, source }: { path: string; source: string }): string {
    const relativeDirPath = relative(dirname(path), cwd)

    return source.replace(re, (match, capture) => {
      const resolvedPathSegment = aliases[capture]
      const replacement = join(relativeDirPath, resolvedPathSegment)
        // Make sure to use only forward slashes even on Windows.
        .replace(/\\/g, '/')

      return match.replace(capture, replacement)
    })
  }
}

// Creates a filtering regular expression from an array of path aliases.
export function createFilterRegExpFromAliases (aliases: string[]): RegExp {
  if (aliases.some(alias => alias.includes('/'))) {
    throw new Error('Path aliases may not include slash characters.')
  }
  return new RegExp(`^(${aliases.map(escapeForRegExp).sort().reverse().join('|')})(/|$)`)
}

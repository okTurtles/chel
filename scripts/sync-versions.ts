#!/usr/bin/env -S deno run --allow-read=. --allow-write=. --allow-run

// Keeps `optionalDependencies` in lockstep with the top-level `version` field
// and the set of compilation TARGETS in package.json.
//
// Wired into two places so the committed manifest can never drift:
//   1. The npm `version` lifecycle hook — runs after `npm version` bumps the
//      top-level version and before it commits, so the version commit is
//      self-consistent.
//   2. `publish.ts` — runs again at publish time as defense-in-depth.
//
// The library functions (expectedOptionalDeps, reconcileOptionalDeps) are
// importable; the CLI body below is guarded by `import.meta.main`.

import { shell } from '~/utils.ts'
import { TARGETS, subPackageName, isCliSubPackage, type Target } from './targets.ts'

// Absolute path to the root package.json. Used by runtime lookups in this file
// (the `import.meta.main` CLI block) and in `publish.ts` (the `try` block) via
// `Deno.readTextFile`. The literal `'../package.json'` also appears in static
// `import(... { with: { type: 'json' } })` calls in `publish.ts`, `compile.ts`,
// and `build.ts`; those cannot use this function because TS needs a static
// string for JSON-import-attribute type inference. Keep all references in sync
// if the path ever changes.
export const rootPackagePath = (): URL =>
  new URL('../package.json', import.meta.url)

// Computes the expected @chelonia/cli-* -> version map from the target list.
// The dep *set* derives from TARGETS, so adding/removing a target is reflected
// here automatically — package.json follows code.
export function expectedOptionalDeps (
  version: string,
  targets: readonly Target[]
): Record<string, string> {
  const deps: Record<string, string> = {}
  for (const t of targets) {
    deps[subPackageName(t)] = version
  }
  return deps
}

// Reconciles optionalDependencies in the package.json at `pkgPath`:
//   - adds/updates @chelonia/cli-* keys to match `targets` at `version`
//   - removes stale @chelonia/cli-* keys no longer in `targets`
//   - preserves unrelated optionalDependencies
//   - writes back with @chelonia/cli-* keys alphabetically sorted;
//     unrelated entries keep their original order, only if something changed
// Returns true iff the file was rewritten. Performs no git operations.
export async function reconcileOptionalDeps (
  pkgPath: string | URL,
  version: string,
  targets: readonly Target[]
): Promise<boolean> {
  const pkg = JSON.parse(await Deno.readTextFile(pkgPath))
  const current: Record<string, string> = pkg.optionalDependencies ?? {}

  // Preserve unrelated deps in their original order; replace the @chelonia/cli-*
  // set, sorted alphabetically for deterministic diffs.
  const reconciled: Record<string, string> = {}
  for (const [k, v] of Object.entries(current)) {
    if (!isCliSubPackage(k)) reconciled[k] = v
  }
  for (const name of targets.map(subPackageName).sort()) {
    reconciled[name] = version
  }

  // Treat an ordering difference as a change (keeps diffs deterministic).
  if (JSON.stringify(reconciled) === JSON.stringify(current)) {
    return false
  }

  pkg.optionalDependencies = reconciled
  await Deno.writeTextFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  return true
}

// CLI entry — invoked via `deno task sync-versions` (the npm `version` hook).
if (import.meta.main) {
  const pkgPath = rootPackagePath()
  const { version } = JSON.parse(await Deno.readTextFile(pkgPath))
  const changed = await reconcileOptionalDeps(pkgPath, version, TARGETS)
  if (changed) {
    // Stage the rewrite so it lands in the `npm version` commit. Harmless
    // elsewhere (git add on an unchanged file is a no-op).
    await shell('git add package.json', { printOutput: false })
    console.log(`synced optionalDependencies -> ${version}`)
  } else {
    console.log(`optionalDependencies already at ${version}`)
  }
}

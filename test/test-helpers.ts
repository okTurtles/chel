// Scaffolding shared by the test suites under `scripts/`, `src/` and `test/`.
//
// Deliberately not named `*.test.ts`: `deno test` would otherwise pick it up as
// a suite of its own and report it as having no tests. The name follows the
// existing `src/serve/routes-test-helpers.ts` convention.
//
// What lives here is the scaffolding that was previously copy-pasted per file
// and had already started to drift (one copy of `withTempDir` resolved its
// directory to an absolute path, two others did not).
import { resolve } from 'jsr:@std/path/'

// Scratch space inside the project, so the main test task's `--allow-write=.`
// covers it without widening the grant to the OS temp dir.
const TEMP_ROOT = './test/temp'

// Stand-in for a real `deno compile` flag set. The suites using it only care
// that the flags participate in a cache key, not what they say.
export const FAKE_COMPILE_FLAGS = '--fake-compile-flags'

// Runs `fn` with a fresh temp directory, removed afterwards even on failure.
//
// The path is absolute: `Deno.makeTempDir` echoes back the relativity of its
// `dir` option, and a relative symlink target is resolved against the link's
// own directory rather than the CWD, so relative temp dirs produce dangling
// links. Absolute is a safe superset — required by the symlink suites,
// immaterial to everyone else.
//
// Creating TEMP_ROOT is part of the helper because `makeTempDir` does not
// create intermediate directories, and a fresh checkout has no `test/temp`.
export async function withTempDir (fn: (dir: string) => Promise<void>): Promise<void> {
  await Deno.mkdir(TEMP_ROOT, { recursive: true })
  const dir = resolve(await Deno.makeTempDir({ dir: TEMP_ROOT }))
  try {
    await fn(dir)
  } finally {
    await Deno.remove(dir, { recursive: true })
  }
}

let symlinkProbe: Promise<boolean> | undefined

// Whether this process can actually create a symlink, answered by trying it
// rather than by inspecting permission state.
//
// `Deno.symlink` needs Deno's *unscoped* `--allow-write` **and** unscoped
// `--allow-read` (with `--allow-read=. --allow-write` it still fails with
// `NotCapable: Requires read access`), and no permission-state query can see
// the second requirement. Attempting the operation covers both, plus the
// platforms where symlink creation is a privilege rather than a permission
// (Windows without Developer Mode).
//
// Memoized, and a function rather than a module-scope constant, so suites that
// only want `withTempDir` do no filesystem work on import.
export function symlinkSupported (): Promise<boolean> {
  symlinkProbe ??= (async () => {
    try {
      let supported = false
      await withTempDir(async (dir) => {
        await Deno.writeTextFile(`${dir}/probe-target`, '')
        try {
          await Deno.symlink(`${dir}/probe-target`, `${dir}/probe-link`)
          supported = true
        } catch {
          supported = false
        }
      })
      return supported
    } catch {
      // No writable scratch space at all: symlink work is out of the question.
      return false
    }
  })()
  return symlinkProbe
}

// Presence checks over a path. Every failure counts as absent, not just
// NotFound: a path the test process cannot stat is of no use to it either.
//
// Deliberately more forgiving than the private `exists` in scripts/binaries.ts,
// which rethrows anything that is not NotFound: there, a path that cannot be
// stat'd has to abort the release rather than be quietly read as "needs
// rebuilding". The two look alike but are not candidates for unification.
//
// Both spellings exist because a `Deno.test` step body cannot await: use
// `existsSync` in synchronous steps, `exists` everywhere else. Importing one
// under the other's name defeats the distinction.
export async function exists (path: string): Promise<boolean> {
  try {
    await Deno.stat(path)
    return true
  } catch {
    return false
  }
}

export function existsSync (path: string): boolean {
  try {
    Deno.statSync(path)
    return true
  } catch {
    return false
  }
}

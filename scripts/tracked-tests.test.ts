// Guards against the failure mode that hides test coverage instead of
// breaking it: a `*.test.ts` file that exists in a working tree but was never
// committed. `deno task test` passes locally for whoever wrote it, the suite
// is missing for everybody else, and a `deno.json` task naming the file fails
// with a module-resolution error rather than a test failure.
import { assertEquals } from 'jsr:@std/assert'

// Mirrors deno.json's lint exclusions plus the generated and scratch trees:
// none of them hold sources of ours.
const SKIP = new Set(['node_modules', 'vendor', 'dist', 'build', 'temp', '.git'])

// Deliberately hand-rolled rather than pulling in a directory-walking
// dependency: this runs on every test invocation and its only job is to list
// file names.
async function testFilesUnder (dir: string, prefix = ''): Promise<string[]> {
  const found: string[] = []
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isSymlink || SKIP.has(entry.name)) continue
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory) {
      found.push(...await testFilesUnder(`${dir}/${entry.name}`, rel))
    } else if (entry.name.endsWith('.test.ts')) {
      found.push(rel)
    }
  }
  return found
}

async function trackedTestFiles (): Promise<Set<string>> {
  const { code, stdout, stderr } = await new Deno.Command('git', {
    args: ['ls-files', '*.test.ts'],
    stdout: 'piped',
    stderr: 'piped'
  }).output()
  if (code !== 0) {
    throw new Error(`git ls-files failed: ${new TextDecoder().decode(stderr)}`)
  }
  return new Set(
    new TextDecoder().decode(stdout).split('\n').map((line) => line.trim()).filter(Boolean)
  )
}

Deno.test('every test file is committed', async () => {
  const root = new URL('..', import.meta.url).pathname
  const tracked = await trackedTestFiles()
  const untracked = (await testFilesUnder(root)).filter((path) => !tracked.has(path)).sort()
  assertEquals(
    untracked,
    [],
    `untracked test files (run \`git add\` on them): ${untracked.join(', ')}`
  )
})

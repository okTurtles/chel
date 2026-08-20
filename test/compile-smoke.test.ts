// Opt-in end-to-end check that a compiled binary can actually load the single
// SQLite addon it embeds.
//
// This is the only test that exercises the prebuild mapping in
// scripts/paths.ts for real: everything else compares strings. A wrong mapping
// produces a binary that compiles and starts fine and only fails the moment
// the sqlite backend is used, so it is worth having, but a compile costs
// minutes and ~100 MB of disk. It therefore stays out of `deno task test` and
// runs on request:
//
//   CHEL_SMOKE_COMPILE=1 deno task smoke
//
// Only the host target is compiled, because only the host's binary can be
// executed here. Other platforms have to be spot-checked on their own machine.

import { assertEquals, assertStringIncludes } from 'jsr:@std/assert'
import { binaryPath, ensureBinaries } from '../scripts/binaries.ts'
import { TARGETS } from '../scripts/targets.ts'

const enabled = (Deno.env.get('CHEL_SMOKE_COMPILE') ?? '').toLowerCase()
const ignore = !enabled || enabled === '0' || enabled === 'false'

const hostTarget = TARGETS.find((t) => t.denoTarget === Deno.build.target)

Deno.test({
  name: 'compiled binary loads its embedded SQLite addon',
  ignore,
  async fn () {
    if (!hostTarget) {
      throw new Error(
        `no TARGETS entry for the host (${Deno.build.target}); ` +
          'this platform cannot be smoke-tested'
      )
    }
    await ensureBinaries([hostTarget])

    // Run in a scratch directory: `migrate` creates `data/chelonia.db`, and
    // opening it is what forces the addon to load.
    await Deno.mkdir('./test/temp', { recursive: true })
    const cwd = await Deno.makeTempDir({ dir: './test/temp' })
    try {
      const { code, stdout, stderr } = await new Deno.Command(
        await Deno.realPath(binaryPath(hostTarget)),
        {
          args: ['migrate', '--from', 'mem', '--to', 'sqlite'],
          cwd,
          stdout: 'piped',
          stderr: 'piped'
        }
      ).output()
      const decoder = new TextDecoder()
      const output = decoder.decode(stdout) + decoder.decode(stderr)
      assertEquals(code, 0, `migrate exited with ${code}:\n${output}`)
      // Printed by src/serve/database-sqlite.ts once the native addon has
      // opened the database; absent when the wrong prebuild was embedded.
      assertStringIncludes(output, 'SQLite database.')
    } finally {
      await Deno.remove(cwd, { recursive: true })
    }
  }
})

// Opt-in end-to-end check that a compiled binary can actually load the single
// SQLite addon it embeds.
//
// `prebuild(os, cpu)` in scripts/paths.ts decides which addon file a compiled
// binary embeds. Only this test operates a real binary. All the other tests
// compare strings.
//
// An incorrect mapping gives a binary that compiles and starts without an
// error. The error occurs only when the sqlite backend loads the embedded
// addon. For this reason, this test is necessary.
//
// However, a compile needs approximately 100 MB of disk space. Thus,
// `deno task test` does not include this test. Start it manually with this
// command:
//
//   CHEL_SMOKE_COMPILE=1 deno task smoke
//
// Only the host target is compiled, because only the host's binary can be
// executed here. Other platforms have to be spot-checked on their own machine.

import { assertEquals, assertStringIncludes } from 'jsr:@std/assert'
import { binaryPath, ensureBinaries } from '../scripts/binaries.ts'
import { TARGETS } from '../scripts/targets.ts'
import { withTempDir } from './test-helpers.ts'

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
    await withTempDir(async (cwd) => {
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
    })
  }
})

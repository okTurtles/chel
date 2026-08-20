// Guards a property of the committed bundle that is easy to lose and hard to
// notice: it must contain the code the CLI runs, and nothing else.
import { assertEquals } from 'jsr:@std/assert'
import { BUNDLE_PATH } from './paths.ts'

const bundle = Deno.readTextFileSync(new URL(`../${BUNDLE_PATH}`, import.meta.url))

Deno.test('the committed bundle', async (t) => {
  await t.step('contains no test suites', () => {
    // The database layer loads its backend through a computed specifier, and
    // esbuild expands that into every file matching the pattern, test suites
    // included. Nothing can reach them at runtime, but they would ship inside
    // every released binary together with the assertion library they pull in.
    assertEquals(bundle.includes('Deno.test('), false, `${BUNDLE_PATH} bundles test code`)
    assertEquals(
      bundle.includes('assertRejects'),
      false,
      `${BUNDLE_PATH} bundles the assertion library`
    )
  })

  await t.step('still resolves the real database backends', () => {
    // The counterpart: emptying the test modules must not have emptied the
    // backends they sit next to.
    for (const backend of ['fs', 'sqlite', 'redis', 'router']) {
      assertEquals(
        bundle.includes(`./database-${backend}.ts`),
        true,
        `${BUNDLE_PATH} must keep the ${backend} backend loadable`
      )
    }
  })
})

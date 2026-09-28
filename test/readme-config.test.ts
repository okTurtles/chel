// Drift guard for the operator-facing documentation of the signup and billing
// settings.
//
// `chel init` interpolates every default into the generated `chel.toml` and
// `src/init.test.ts` pins that, so the template cannot go stale. The
// commented-out example in README.md and the prose in docs/signup-and-billing.md
// are written by hand, which is where the numbers an operator actually reads
// live, so this test pins those numbers too: a default that changes without the
// documentation following leaves the docs quietly wrong. Only the values are
// checked, not the wording around them, so the prose can be edited freely.
import { assert } from 'jsr:@std/assert'
import { nconfDefaults } from '../src/config-defaults.ts'
import { MAX_EVENT_BODY_BYTES } from '../src/serve/constants.ts'

const readme = await Deno.readTextFile('README.md')
const doc = await Deno.readTextFile('docs/signup-and-billing.md')

const assertDocumented = (text: string, description: string, snippet: string) => {
  assert(
    text.includes(snippet),
    `the documentation should cover ${description}. Expected to find: ${snippet}`
  )
}

Deno.test({
  name: 'README and docs document the current signup and billing defaults',
  fn () {
    const { signup, billing } = nconfDefaults.server

    // The commented-out example block near "Runtime CLI Configuration"
    assertDocumented(readme, 'the example first-message cap', `maxFirstMessageBytes = ${signup.maxFirstMessageBytes}`)
    assertDocumented(readme, 'the example free allowance', `freeAllowanceBytes = ${billing.freeAllowanceBytes}`)

    // The prose in docs/signup-and-billing.md
    for (const [window, value] of Object.entries(signup.limit)) {
      if (typeof value !== 'number') continue
      assertDocumented(doc, `the per-${window} rate limit default`, `\`${value}\``)
    }
    assertDocumented(doc, 'the first-message cap default', `\`${signup.maxFirstMessageBytes}\``)
    assertDocumented(doc, 'the free allowance default', `\`${billing.freeAllowanceBytes}\``)

    // A limit that is enforced elsewhere but bounds these settings in
    // practice, and which operators cannot discover from the settings
    assertDocumented(doc, 'the POST /event request body limit', `(${MAX_EVENT_BODY_BYTES} bytes)`)
  }
})

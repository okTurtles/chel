// Drift guard for the operator-facing documentation of the signup and billing
// settings.
//
// `chel init` interpolates every default into the generated `chel.toml` and
// `src/init.test.ts` pins that, so the template cannot go stale. The
// commented-out example in README.md and the prose in docs/signup-and-billing.md
// are written by hand, which is where the numbers an operator actually reads
// live, so this test pins those too: a default that changes without the
// documentation following leaves the docs quietly wrong.
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
    assertDocumented(readme, 'the example first-message cap', `# maxFirstMessageBytes = ${signup.maxFirstMessageBytes}`)
    assertDocumented(readme, 'the example free allowance', `# freeAllowanceBytes = ${billing.freeAllowanceBytes}`)

    // The prose in docs/signup-and-billing.md
    assertDocumented(
      doc,
      'the per-IP rate limit defaults',
      `(defaults \`${signup.limit.minute}\`/\`${signup.limit.hour}\`/\`${signup.limit.day}\` per IP)`
    )
    assertDocumented(
      doc,
      'the first-message cap default',
      `\`server.signup.maxFirstMessageBytes\` (default \`${signup.maxFirstMessageBytes}\`)`
    )
    assertDocumented(doc, 'the free allowance default', `\`${billing.freeAllowanceBytes}\``)
    assertDocumented(
      doc,
      'the signup kill switch default',
      `\`server.signup.disabled\` (default \`${signup.disabled}\`)`
    )

    // Limits that are enforced elsewhere but bound these settings in practice,
    // and which operators cannot discover from the settings themselves
    assertDocumented(doc, 'the POST /event request body limit', `over 1 MiB (${MAX_EVENT_BODY_BYTES} bytes)`)
    assertDocumented(doc, 'that the per-IP limits only apply in production', '`NODE_ENV=production`')
  }
})

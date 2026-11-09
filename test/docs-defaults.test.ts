// Drift guard for the operator-facing documentation of the defaults.
//
// `chel init` interpolates every default into the generated `chel.toml` and
// `src/init.test.ts` pins that, so the template cannot go stale. The example
// and the backends table in docs/configuration.md and the prose in
// docs/signup-and-billing.md are written by hand, which is where the numbers an
// operator actually reads live, so this test pins those numbers too: a default
// that changes without the documentation following leaves the docs quietly
// wrong. Only the values are checked, not the wording around them, so the prose
// can be edited freely.
import { assert } from 'jsr:@std/assert'
import { nconfDefaults } from '../src/config-defaults.ts'
import { MAX_EVENT_BODY_BYTES } from '../src/serve/constants.ts'

const config = await Deno.readTextFile('docs/configuration.md')
const doc = await Deno.readTextFile('docs/signup-and-billing.md')

const assertDocumented = (text: string, description: string, snippet: string) => {
  assert(
    text.includes(snippet),
    `the documentation should cover ${description}. Expected to find: ${snippet}`
  )
}

Deno.test({
  name: 'the docs document the current defaults',
  fn () {
    const { server, database } = nconfDefaults
    const { signup, billing } = server

    // The example chel.toml in docs/configuration.md
    assertDocumented(config, 'the example app port', `port = ${server.port}`)
    assertDocumented(
      config,
      'the example dashboard port',
      `dashboardPort = ${server.dashboardPort}`
    )
    assertDocumented(
      config,
      'the example dashboard address',
      `dashboardListenIP = "${server.dashboardListenIP}"`
    )
    assertDocumented(
      config,
      'the example first-message cap',
      `maxFirstMessageBytes = ${signup.maxFirstMessageBytes}`
    )
    assertDocumented(
      config,
      'the example free allowance',
      `freeAllowanceBytes = ${billing.freeAllowanceBytes}`
    )

    // The backends table in docs/configuration.md
    assertDocumented(config, 'the default backend', `\`${database.backend}\` (default)`)
    assertDocumented(config, 'the cache size default', `(default \`${database.lruNumItems}\`)`)

    // The prose in docs/signup-and-billing.md. The three rate limits are
    // checked together, in the order the doc lists them, so a changed default
    // can't pass by matching another number in the doc.
    const { minute, hour, day } = signup.limit
    assertDocumented(
      doc,
      'the per-minute/hour/day rate limit defaults',
      `\`${minute}\`/\`${hour}\`/\`${day}\``
    )
    assertDocumented(doc, 'the first-message cap default', `\`${signup.maxFirstMessageBytes}\``)
    assertDocumented(doc, 'the free allowance default', `\`${billing.freeAllowanceBytes}\``)

    // A limit that is enforced elsewhere but bounds these settings in
    // practice, and which operators cannot discover from the settings
    assertDocumented(doc, 'the POST /event request body limit', `(${MAX_EVENT_BODY_BYTES} bytes)`)
  }
})

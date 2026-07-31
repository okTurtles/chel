import { assertEquals } from 'jsr:@std/assert'
import * as commands from './commands.ts'
import type { CommandModule } from './commands.ts'

// Commands that read server/database config from `chel.toml` must opt into
// validation so misconfiguration fails fast; commands that only touch files or
// a remote URL must NOT, so a malformed config file can't block them (see
// `parseConfig.ts`). These lists force a deliberate decision whenever a new
// command is added: the "accounted for" step fails until it is classified.
const validatesConfig = ['serve', 'migrate', 'get', 'upload', 'eventsAfter', 'pin', 'deploy']
const skipsValidation = ['hash', 'init', 'keygen', 'manifest', 'verifySignature', 'version']

Deno.test('command config-validation opt-in', async (t) => {
  const modules = commands as unknown as Record<string, CommandModule<object, object>>

  await t.step('every exported command is accounted for', () => {
    assertEquals(
      Object.keys(modules).sort(),
      [...validatesConfig, ...skipsValidation].sort()
    )
  })

  for (const name of validatesConfig) {
    await t.step(`${name} opts into chel.toml validation`, () => {
      assertEquals(modules[name].validatesConfig, true)
    })
  }

  for (const name of skipsValidation) {
    await t.step(`${name} does not validate chel.toml`, () => {
      assertEquals(modules[name].validatesConfig, undefined)
    })
  }
})

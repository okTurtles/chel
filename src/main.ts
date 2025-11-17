#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env

// Deno APIs:
// https://doc.deno.land/deno/stable
// https://doc.deno.land/https://deno.land/std/
// Deno examples:
// https://doc.deno.land/https://deno.land/std@0.141.0/examples
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

import sbp from 'npm:@sbp/sbp'
import parseConfig, { postHandler } from './parseConfig.ts'
import { SERVER_EXITING } from './serve/events.ts'

parseConfig()

try {
  // `postHandler` is set by `parseArgs` (called by `parseConfig`)
  // Run the selected subcommand
  await postHandler()
} finally {
  // Indicate that we're done, which is useful for cleaning up, closing DB
  // connections, etc.
  sbp('okTurtles.events/emit', SERVER_EXITING)
}

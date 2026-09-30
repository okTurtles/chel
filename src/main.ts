#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env --allow-ffi

// Deno APIs:
// https://docs.deno.com/api/deno/
// https://docs.deno.com/runtime/reference/std/
// Deno examples:
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

// Has to stay the first import. The server always has to store messages, and
// @chelonia/lib has to know that before it loads. See the module for more.
import './lightweight-client-off.ts'

import parseConfig, { handlerState } from './parseConfig.ts'
import { exit } from './utils.ts'

// `postHandler` is set by `parseArgs` (called by `parseConfig`)
// Run the selected subcommand
try {
  await parseConfig()
  await handlerState.postHandler()
} catch (e) {
  exit(e)
}

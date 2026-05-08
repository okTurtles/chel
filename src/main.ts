#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env

// Deno APIs:
// https://docs.deno.com/api/deno/
// https://docs.deno.com/runtime/reference/std/
// Deno examples:
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

import parseConfig, { handlerState } from './parseConfig.ts'
import { exit } from './utils.ts'

parseConfig()

// `postHandler` is set by `parseArgs` (called by `parseConfig`)
// Run the selected subcommand
try {
  await handlerState.postHandler()
} catch (e) {
  exit(e)
}

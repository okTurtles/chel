#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env --allow-ffi

// Deno APIs:
// https://docs.deno.com/api/deno/
// https://docs.deno.com/runtime/reference/std/
// Deno examples:
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

import process from 'node:process'

// chel is the server, so @chelonia/lib has to keep what it stores. Since
// okTurtles/libcheloniajs#104 it defaults to a lightweight client that keeps
// nothing, and it reads this once when it loads, so it is set before the imports.
process.env.LIGHTWEIGHT_CLIENT = 'false'

const { default: parseConfig, handlerState } = await import('./parseConfig.ts')
const { exit } = await import('./utils.ts')

// `postHandler` is set by `parseArgs` (called by `parseConfig`)
// Run the selected subcommand
try {
  await parseConfig()
  await handlerState.postHandler()
} catch (e) {
  exit(e)
}

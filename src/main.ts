#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env

// Deno APIs:
// https://doc.deno.land/deno/stable
// https://doc.deno.land/deno~land/std/
// Deno examples:
// https://doc.deno.land/deno~land/std@0.141.0/examples
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

import parseConfig, { handlerState } from './parseConfig.ts'

parseConfig()

// `postHandler` is set by `parseArgs` (called by `parseConfig`)
// Run the selected subcommand
await handlerState.postHandler()

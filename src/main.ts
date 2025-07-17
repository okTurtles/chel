#!/usr/bin/env -S deno run --allow-read=./ --allow-write=./  --allow-net --no-remote --import-map=vendor/import_map.json

'use strict'

// Deno APIs:
// https://doc.deno.land/deno/stable
// https://doc.deno.land/https://deno.land/std/
// Deno examples:
// https://doc.deno.land/https://deno.land/std@0.141.0/examples
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

import * as commands from './commands.ts'

const [command, ...rest] = Deno.args

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
if (!command) {
  commands.help()
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
} else if (commands[command as keyof typeof commands]) {
  await commands[command as keyof typeof commands](rest)
} else {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.error(`Unknown command: ${command}`)
  Deno.exit(1)
}

Deno.exit(0)

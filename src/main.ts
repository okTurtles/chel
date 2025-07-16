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

if (typeof command !== 'string' || command.trim() === '') {
  commands.help()
} else if (
  typeof command === 'string' &&
  Object.prototype.hasOwnProperty.call(commands, command)
) {
  const cmdFn = commands[command as keyof typeof commands]
  if (typeof cmdFn === 'function') {
    await cmdFn(rest)
  } else {
    console.error(`Command exists but is not callable: ${String(command)}`)
    Deno.exit(1)
  }
} else {
  console.error(`Unknown command: ${String(command)}`)
  Deno.exit(1)
}

Deno.exit(0)

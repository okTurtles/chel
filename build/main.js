#!/usr/bin/env -S deno run --allow-read=./ --allow-write=./  --allow-net --no-remote --import-map=vendor/import_map.json
import * as commands from "./commands.ts";
const [command, ...rest] = Deno.args;
if (!command) {
  commands.help();
} else if (commands[command]) {
  await commands[command](rest);
} else {
  console.error(`Unknown command: ${command}`);
  Deno.exit(1);
}
Deno.exit(0);

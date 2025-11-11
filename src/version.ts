// @deno-types="npm:@types/yargs"
import type { CommandModule } from 'npm:yargs'

export function version (): void {
  console.log(import.meta.VERSION)
}

export const module = {
  command: 'version',
  describe: 'show chel version',
  handler: () => {
    return version()
  }
} as CommandModule<object, object>

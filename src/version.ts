import type { CommandModule } from './commands.ts'
import type { ImportMeta } from './types/build.d.ts'

export function version (): void {
  console.log((import.meta as ImportMeta).VERSION)
}

export const module = {
  command: 'version',
  describe: 'show chel version',
  postHandler: () => {
    return version()
  }
} as CommandModule<object, object>

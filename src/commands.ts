// @deno-types="npm:@types/yargs"
import type { ArgumentsCamelCase, CommandModule as YCommandModule } from 'npm:yargs'
export type CommandModule<T, U> = Omit<YCommandModule<T, U>, 'handler'> & {
  handler?: YCommandModule<T, U>['handler']
  postHandler: YCommandModule<T, U>['handler']
}
export type { ArgumentsCamelCase }

export { module as deploy } from './deploy.ts'
export { module as eventsAfter } from './eventsAfter.ts'
export { module as get } from './get.ts'
export { module as hash } from './hash.ts'
export { module as keygen } from './keygen.ts'
export { module as manifest } from './manifest.ts'
export { module as migrate } from './migrate.ts'
export { module as serve } from './serve.ts'
export { module as upload } from './upload.ts'
export { module as verifySignature } from './verifySignature.ts'
export { module as version } from './version.ts'

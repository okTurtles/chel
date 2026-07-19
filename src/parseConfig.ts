// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse, stringify } from 'npm:smol-toml'
import { readFile } from 'node:fs/promises'
import parseArgs, { handlerState } from './parseArgs.ts'
import { validateTomlConfig } from './validateConfig.ts'

// Loads the `chel.toml` config into nconf and validates its contents against a
// whitelist of known options. The file is loaded manually first so that:
//   - unknown keys print a warning (likely a typo);
//   - values of the wrong shape fail with a helpful error message.
//
// This function is async because reading the TOML is async; any validation
// error is thrown so that `main.ts` can surface it via `exit()` instead of
// becoming an unhandled rejection (see issue #104).
const parseConfig = async (): Promise<void> => {
  nconf
    .env({
      separator: '__',
      parseValues: true
    })
    .argv(parseArgs())
    .file({ file: 'chel.toml', format: { parse, stringify } })
    .defaults({
      server: {
        appDir: '.',
        host: '0.0.0.0',
        port: 8000,
        dashboardPort: 8888,
        fileUploadMaxBytes: 31457280,
        signup: {
          disabled: false,
          limit: {
            disabled: false,
            minute: 2,
            hour: 10,
            day: 50
          },
          vapid: {
            email: undefined
          }
        },
        logLevel: 'debug',
        messages: [],
        maxEventsBatchSize: 500,
        archiveMode: false
      },
      database: {
        lruNumItems: 10000,
        backend: 'mem',
        backendOptions: {}
      }
    })

  // Manually re-read and validate the raw TOML so that only the file's own
  // contents (not merged env/CLI/defaults) are checked. nconf silently ignores
  // a missing `chel.toml`, so we do the same.
  await validateConfigFile('chel.toml')
}

// Reads, parses, and validates a TOML config file. Prints warnings for unknown
// keys and throws an Error (with all value-shape problems listed) on invalid
// values. Missing files are ignored.
async function validateConfigFile (filePath: string): Promise<void> {
  let raw: string
  try {
    raw = await readFile(filePath, { encoding: 'utf-8', flag: 'r' })
  } catch (e: unknown) {
    // No config file is the common case (e.g. for non-server commands); mirror
    // nconf's behaviour and skip validation.
    if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') return
    throw e
  }

  let parsed: unknown
  try {
    parsed = parse(raw)
  } catch (e: unknown) {
    throw new Error(`Could not parse ${filePath}: ${(e as Error).message}`)
  }

  const { warnings, errors } = validateTomlConfig(parsed)
  for (const warning of warnings) {
    console.warn(`[chel] ${filePath}: ${warning}`)
  }
  if (errors.length) {
    const listing = errors.map((e) => `  - ${e}`).join('\n')
    throw new Error(`Invalid ${filePath}:\n${listing}`)
  }
}

export default parseConfig
export { handlerState }

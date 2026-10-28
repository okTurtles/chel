// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse, stringify } from 'npm:smol-toml'
import parseArgs, { handlerState } from './parseArgs.ts'
import { validateConfigFile } from './validateConfig.ts'
import { DEFAULT_CONFIG_FILE, nconfDefaults } from './config-defaults.ts'

// Re-exported for `chel init` (see `src/init.ts`), which interpolates the
// generated `chel.toml` template from these values so it cannot silently drift
// from the runtime defaults. The canonical definition lives in
// `config-defaults.ts` so it can be shared (e.g. with `validateConfig.test.ts`)
// without pulling in the whole config-loading stack.
export const SERVER_DEFAULTS = nconfDefaults

// Loads the config file (`chel.toml`, or the `--config` path) into nconf and
// validates its contents against a whitelist of known options. The file is
// loaded manually first so that:
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

  // `handlerState` is populated by the yargs parse that `.argv()` above
  // triggers, so the `--config` path is only known from here on. The file
  // store is still added after argv, so the priorities stay the same. Relative
  // paths inside the file (e.g. a database filepath) stay relative to the
  // working directory, not to the file.
  const configFile = handlerState.configFile ?? DEFAULT_CONFIG_FILE
  nconf
    .file({ file: configFile, format: { parse, stringify } })
    .defaults(nconfDefaults)

  // Only commands that actually read server/database config opt into
  // validation (via `validatesConfig` on their command module). This keeps a
  // malformed `chel.toml` from blocking file- or URL-only commands such as
  // `chel hash` or `chel keygen`.
  if (handlerState.validatesConfig) {
    // Manually re-read and validate the raw TOML so that only the file's own
    // contents (not merged env/CLI/defaults) are checked. nconf silently
    // ignores a missing file. That is fine for the default `chel.toml`, but a
    // missing `--config` file is most likely a typo, so it is an error.
    await validateConfigFile(configFile, { required: handlerState.configFile !== undefined })
  }
}

export default parseConfig
export { handlerState }

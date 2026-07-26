// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'
import { parse, stringify } from 'npm:smol-toml'
import parseArgs, { handlerState } from './parseArgs.ts'
import { validateConfigFile } from './validateConfig.ts'
import { nconfDefaults } from './config-defaults.ts'

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
    .defaults(nconfDefaults)

  // Only commands that actually read server/database config opt into
  // validation (via `validatesConfig` on their command module). This keeps a
  // malformed `chel.toml` from blocking file- or URL-only commands such as
  // `chel hash` or `chel keygen`. `handlerState` is populated by the yargs
  // parse that `.argv()` above triggers.
  if (handlerState.validatesConfig) {
    // Manually re-read and validate the raw TOML so that only the file's own
    // contents (not merged env/CLI/defaults) are checked. nconf silently
    // ignores a missing `chel.toml`, so we do the same.
    await validateConfigFile('chel.toml')
  }
}

export default parseConfig
export { handlerState }

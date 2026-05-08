# AGENTS.md

Guide for AI agents working in the Chelonia CLI (`chel`) codebase.

## Project Overview

**Chelonia CLI** (`@chelonia/cli`) is a Deno-based TypeScript command-line tool for Chelonia contract development, deployment, and server management. It provides commands for generating cryptographic keys, creating contract manifests, deploying contracts, running development servers, and managing contract versions.

Chelonia is a system for building arbitrary federated, end-to-end encrypted apps. `chel` contains both the server and various utility functions for interacting with it, as well as generating manifests and pinning contracts during development.

## Essential Commands

All commands are run via Deno tasks defined in `deno.json`:

```bash
deno task lint            # Lint the codebase
deno task test            # Run tests
deno task build           # Build the project (outputs to build/)
deno task compile         # Compile native binaries for multiple platforms (outputs to dist/)
deno task dist            # Full distribution (lint + build + compile)
deno task chel -- <args>  # Run the CLI locally (lint + build + execute)
```

### Individual CLI Commands

After building, run the CLI directly:

```bash
# Development (via Deno)
deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env src/main.ts <command>

# Or after building
./build/main.js <command>
```

Available CLI commands:
- `chel keygen` - Generate cryptographic key pairs
- `chel manifest` - Create signed contract manifests
- `chel deploy` - Deploy contracts to a server or directory
- `chel serve` - Start the server with contract preloading
- `chel pin` - Pin contracts to specific versions
- `chel upload` - Upload files to a server or directory
- `chel hash` - Compute CID hash of a file
- `chel migrate` - Migrate data between database backends
- `chel latestState` - Get latest contract state
- `chel eventsAfter` / `chel eventsBefore` - Query contract events

## Project Structure

```
src/
├── main.ts              # CLI entry point
├── commands.ts          # Command module type definitions and exports
├── parseArgs.ts         # Yargs CLI argument parsing
├── parseConfig.ts       # Configuration (nconf + chel.toml)
├── utils.ts             # Shared utilities (file ops, validation, etc.)
├── deploy.ts            # Contract deployment command
├── manifest.ts          # Manifest generation command
├── serve.ts             # Development server command
├── pin.ts               # Contract versioning command
├── upload.ts            # File upload command
├── hash.ts              # File hashing command
├── migrate.ts           # Database migration command
├── keygen.ts            # Key generation command
├── verifySignature.ts   # Signature verification command
├── version.ts           # Version display command
├── get.ts               # Data retrieval command
├── eventsAfter.ts       # Event query commands
├── types/               # TypeScript type definitions
└── serve/               # Server implementation
    ├── index.ts         # Main server entry
    ├── server.ts        # Hapi server setup
    ├── database.ts      # Database layer (SBP selectors)
    ├── database-*.ts    # Database backend implementations (fs, sqlite, redis)
    ├── routes.ts        # HTTP route definitions
    ├── pubsub.ts        # WebSocket pub/sub
    ├── auth.ts          # Authentication logic
    ├── dashboard/       # Vue.js dashboard UI (separate workspace)
    └── *.test.ts        # Inline test files

scripts/
├── build.ts             # esbuild bundling
├── compile.ts           # Deno compile for native binaries
├── dashboard-esbuild.ts # Dashboard UI bundling
├── lint.ts              # ESLint wrapper
└── dist.ts              # Distribution script (TODO)

test/
├── assets/              # Test fixtures (keys, manifests, contracts)
├── hash.test.ts         # Hash command tests
└── signature.test.ts    # Signature verification tests
```

## Code Conventions

### Style (enforced by ESLint)

- **No semicolons** (`'semi': ['error', 'never']`)
- **Single quotes** for strings
- **2-space indentation**
- **Space before function parentheses**: `function name () {}`
- **Space before blocks**: `if (x) {}`
- **Object curly spacing**: `{ key: value }`
- **Trailing commas**: Not enforced, follow file context

### Formatting (deno.json fmt)

```json
{
  "lineWidth": 100,
  "semiColons": false,
  "singleQuote": true
}
```

### TypeScript

- Target: ESNext
- Module: NodeNext with NodeNext resolution
- Strict mode enabled
- Path aliases: `~/` → `./src/`, `@/*` → `./src/*`
- Use `// @deno-types="..."` comments for JS type imports

### Import Patterns

```typescript
// Deno standard library
import * as path from 'jsr:@std/path/'
import { assertEquals } from 'jsr:@std/assert'
import * as colors from 'jsr:@std/fmt/colors'

// npm packages (prefixed with npm:)
import sbp from 'npm:@sbp/sbp'
import * as z from 'npm:zod'
import yargs from 'npm:yargs'

// Local imports (using ~/ alias)
import { exit, readJsonFile } from '~/utils.ts'
import type { CommandModule } from './commands.ts'
```

## Architecture Patterns

### SBP (Selector-Based Programming)

The codebase uses `@sbp/sbp` for dependency injection, event handling, code organization, RPC, and more:

```typescript
// Register selectors
sbp('sbp/selectors/register', {
  'backend/db/streamEntriesAfter': async function (...) { ... },
  'backend/db/lookupName': async function (...) { ... }
})

// Call selectors
await sbp('chelonia.db/get', key)
await sbp('okTurtles.events/emit', EVENT_NAME, data)
```

### Command Module Pattern

Each CLI command exports a `module` object conforming to `CommandModule`:

```typescript
export const module = {
  command: 'deploy <manifests..>',
  describe: 'Deploy contracts',
  builder: (yargs) => {
    return yargs
      .option('url', { string: true, describe: 'Server URL' })
      .positional('manifests', { array: true, type: 'string' })
  },
  postHandler: (argv) => {
    return deploy(argv)
  }
} as CommandModule<object, Params>
```

Key difference from yargs: `handler` is optional, `postHandler` is required. The `postHandler` is set by `parseArgs` and executed in `main.ts` after config parsing.

### Database Backends

Three persistence backends available:
- `mem` - In-memory (default in development)
- `fs` - Filesystem
- `sqlite` - SQLite database
- `redis` - Redis server

Configured via `chel.toml` or environment variables with `__` separator.

### Configuration

Uses `nconf` with priority: CLI args > Environment > chel.toml > Defaults

```toml
# chel.toml example
[server]
host = "0.0.0.0"
port = 8000
dashboardPort = 8888

[database]
backend = "sqlite"
```

## Testing

### Running Tests

```bash
deno task test
```

### Test Structure

Tests use Deno's built-in test framework:

```typescript
import { assertEquals, assertRejects } from 'jsr:@std/assert'

Deno.test({
  name: "Test name",
  async fn (t) {
    await t.step('subtest description', async () => {
      const result = await functionUnderTest()
      assertEquals(result, expected)
    })
  }
})
```

Test fixtures are in `test/assets/` including:
- Key files (`.json`)
- Contract manifests (`.manifest.json`)
- Sample contracts (`.js`)

## Important Patterns & Gotchas

### 1. Permission Flags

Deno requires explicit permissions. Scripts include shebangs with required flags:

```typescript
#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env
```

### 2. Deno Bundle Deprecation

`scripts/build.ts` uses `deno bundle` which may be deprecated. The build process:
1. esbuild bundles TypeScript
2. Output files are re-bundled with `deno bundle` for dependency resolution

### 3. Vendor Directory

The project uses `vendor: true` in deno.json. Some dependencies are vendored. Exclude `vendor/` from linting.

### 4. Dashboard Workspace

`src/serve/dashboard/` has its own `deno.json` as a workspace member. It's a Vue.js 2 SPA with separate build process.

### 5. Import Meta Variables

Build process injects:
- `import.meta.VERSION` - Package version from package.json
- `import.meta.ownerSizeTotalWorker` - 'Owner size total' worker path
- `import.meta.creditsWorker` - 'Credits' worker path
- `import.meta.lockDbSelectors` - Lock DB selectors upon init

### 6. No Network After Key Loading

Security pattern: `revokeNet()` is called after loading cryptographic keys to prevent network access during sensitive operations.

### 7. Contract File Structure

Contracts are organized by name and version:
```
contracts/
├── gi.contracts_chatroom/
│   ├── 2.0.5/
│   │   ├── chatroom.js
│   │   └── chatroom-slim.js
│   └── 2.0.6/
│       └── ...
```

### 8. Manifest Format

Manifests are JSON with signed body:
```json
{
  "head": "{\"manifestVersion\":\"1.0.0\"}",
  "body": "{\"version\":\"...\",\"contract\":{...}}",
  "signature": { "keyId": "...", "value": "..." }
}
```

### 9. dist/ under version control, ignore it!

These are version controlled to catch bugs or vulnerabilities in the transpilation process, but they are not intended for review unless there is a vulnerability introduced that's not found in src/.

## Key Dependencies

- `@sbp/sbp` - Selector-based programming / dependency injection
- `@chelonia/lib` - Core Chelonia library
- `@chelonia/crypto` - Cryptographic operations (Ed25519)
- `yargs` - CLI argument parsing
- `zod` - Schema validation
- `@hapi/hapi` - HTTP server framework
- `@db/sqlite` - SQLite bindings for Deno
- `multiformats` - CID / multihash support
- `esbuild` - Bundling

## Development Workflow

1. **Make changes** to TypeScript files in `src/`
2. **Run lint**: `deno task lint`
3. **Run tests**: `deno task test`
4. **Build**: `deno task build`
5. **Test CLI**: `./build/main.js <command>`

## Release Process

1. Update version in `package.json`
2. Run `deno task dist` to build and compile binaries
3. Binaries output to `dist/chel-v<version>-<arch>.tar.gz`
4. SHA256 checksums printed for verification

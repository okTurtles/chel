# AGENTS.md

Guide for AI agents working in the Chelonia CLI (`chel`) codebase.

## Project Overview

**Chelonia CLI** (`@chelonia/cli`) is a Deno-based TypeScript command-line tool for Chelonia contract development, deployment, and server management. Chelonia is a system for building arbitrary federated, end-to-end encrypted apps; `chel` contains the server plus utilities for generating manifests and pinning contracts during development.

## Essential Commands

All commands are run via Deno tasks defined in `deno.json`:

```bash
deno task lint            # Lint the codebase
deno task test            # Run tests (includes test:symlinks)
deno task build           # Build the project (outputs to build/)
deno task compile         # Native binaries + release tarballs (outputs to dist/)
deno task dist            # Full distribution (lint + build + compile)
deno task chel -- <args>  # Run the CLI locally (lint + build + execute)
```

To run the CLI directly:

```bash
deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env --allow-ffi src/main.ts <command>
./build/main.js <command>  # after building
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
├── utils.ts             # Shared utilities
├── <command>.ts         # One file per CLI command (deploy, manifest, serve, pin, ...)
├── types/               # TypeScript type definitions
└── serve/               # Server implementation (routes, database backends, pubsub, dashboard)
    └── *.test.ts        # Inline test files

scripts/                 # Build, lint, and release tooling (plus their tests)
test/                    # Test suites; fixtures live in test/assets/
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

## Guidelines

- **Tests**: Use Deno's built-in test framework. New tests go next to the code (`src/**/*.test.ts`) or in `test/`; shared fixtures go in `test/assets/`. Every `*.test.ts` file must be committed (enforced by `scripts/tracked-tests.test.ts`).
- **Server code**: Organized around SBP selectors (`@sbp/sbp`) with several database backends; see `src/serve/` and `src/validateConfig.ts`.
- **Tests**: Use Deno's built-in test framework. New tests go next to the code (`src/**/*.test.ts`) or in `test/`; shared fixtures go in `test/assets/`. Every `*.test.ts` file must be committed (enforced by `scripts/tracked-tests.test.ts`).
- **Server code**: Organized around SBP selectors (`@sbp/sbp`) with several database backends; see `src/serve/` and `src/validateConfig.ts`.

## Important Patterns & Gotchas

### 1. Permission Flags

Deno requires explicit permissions. Scripts include shebangs with required flags:

```typescript
#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env --allow-ffi
```

`--allow-ffi` is what lets the `sqlite` database backend load its native addon;
without it, selecting that backend fails at startup.

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

## Development Workflow

1. Make changes in `src/`
2. `deno task lint`
3. `deno task test`
4. `deno task build`
5. Try the CLI: `./build/main.js <command>`

## Release Process

1. `npm version <patch|minor|major>` (rebuilds and commits the bundle)
2. `deno task dist` to compile the binaries and pack the release tarballs
3. `git diff --exit-code -- build` to confirm the rebuild is reproducible
4. `npm publish --access public`

See the Packaging section of README.md for the full procedure.

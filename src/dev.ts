import { flags, colors } from './deps.ts'
import { readFile } from 'node:fs/promises'
import { readFileSync, existsSync, watch, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import process from 'node:process'
import { serve } from './serve.ts'
import { deploy } from './deploy.ts'

/**
 * Sanitize contract name for filesystem safety
 * Replaces characters that are not allowed in directory names
 * @param contractName - Full contract name (e.g., "gi.contracts/group")
 * @returns Sanitized name safe for filesystem use
 */
function sanitizeContractName (contractName: string): string {
  return contractName.replace(/[/\\:*?"<>|]/g, '_')
}

interface DevOptions {
  port?: number
  dashboardPort?: number
  dbType?: string
  host?: string
  'watch-contracts'?: boolean
  'hot-reload'?: boolean
  'auto-test'?: boolean
  'interactive'?: boolean
  debug?: boolean
}

interface CheloniaConfig {
  contracts: Record<string, { version: string, path: string }>
}

interface ContractChangeEvent {
  file: string
  type: 'added' | 'changed' | 'removed'
  timestamp: Date
}

interface DevMetrics {
  contractsWatched: number
  changesDetected: number
  hotReloads: number
  uptime: number
}

interface RecentlyRegeneratedManifest {
  path: string
  timestamp: number
}

/**
 * Live Development Environment for Chelonia Contracts
 *
 * Provides live-testing functionality similar to grunt dev:
 * - Hot reload of contracts when files change
 * - Interactive testing environment with running server
 * - Automatic contract redeployment on changes
 * - Live dashboard for monitoring contract changes
 *
 * This leverages the robust chel serve infrastructure for reliability.
 */
class DevEnvironment {
  private watchers: { close?: () => void }[] = []
  close?: () => void
  private serverProcess?: unknown
  private options: DevOptions
  private projectRoot: string
  private metrics: DevMetrics
  private startTime: Date
  private contractChanges: ContractChangeEvent[] = []
  private cheloniaConfig: CheloniaConfig = { contracts: {} }
  private recentlyRegeneratedManifests: RecentlyRegeneratedManifest[] = []

  constructor (projectRoot: string, options: DevOptions) {
    this.projectRoot = resolve(projectRoot)
    this.options = options
    this.metrics = {
      contractsWatched: 0,
      changesDetected: 0,
      hotReloads: 0,
      uptime: 0
    }
    this.startTime = new Date()
  }

  async start () {
    this.printWelcomeBanner()
    await this.startServer()
    await this.startContractWatching()
    await this.startInteractiveMode()
  }

  private async startServer () {
    console.log(colors.blue('🚀 Starting development server with hot reload...'))

    // Start the server in the background using our robust serve infrastructure
    const serverArgs = [
      '--dp', String(this.options.dashboardPort || 3000),
      '--port', String(this.options.port || 8000),
      '--db-type', this.options.dbType || 'mem', // Use memory for faster dev iterations by default
      this.projectRoot
    ]

    try {
      // Start the serve function in the background
      // Don't await it here as it runs indefinitely
      this.serverProcess = serve(serverArgs).catch(error => {
        console.error(colors.red('❌ Server error:'), error)
        process.exit(1)
      })

      // Give the server a moment to start
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log(colors.green('✅ Development server started'))
      console.log(colors.gray(`   Dashboard: http://localhost:${this.options.dashboardPort || 3000}`))
      console.log(colors.gray(`   Application: http://0.0.0.0:${this.options.port || 8000} (all interfaces)`))
    } catch (error) {
      console.error(colors.red('❌ Failed to start development server:'), error)
      throw error
    }
  }

  private printWelcomeBanner () {
    console.log(colors.cyan('╔══════════════════════════════════════════════════════════════╗'))
    console.log(colors.cyan('║') + colors.bold(colors.white('               🧪 CHEL LIVE DEVELOPMENT                     ')) + colors.cyan('  ║'))
    console.log(colors.cyan('║') + colors.white('           Live-testing with Hot Reload & Interaction        ') + colors.cyan(' ║'))
    console.log(colors.cyan('╚══════════════════════════════════════════════════════════════╝'))
    console.log()
    console.log(colors.gray('Provides live-testing environment with automatic contract'))
    console.log(colors.gray('redeployment and interactive testing capabilities.'))
    console.log()
  }

  private async loadCheloniaConfig () {
    // Load chelonia.json to get known contracts and their manifest paths
    const cheloniaConfigPath = join(this.projectRoot, 'chelonia.json')
    if (existsSync(cheloniaConfigPath)) {
      const cheloniaConfigContent = await readFile(cheloniaConfigPath, 'utf8')
      this.cheloniaConfig = JSON.parse(cheloniaConfigContent)
    } else {
      console.log(colors.yellow('⚠️  No chelonia.json found'))
      return
    }
  }

  private async startContractWatching () {
    console.log(colors.blue('👀 Setting up contract file watching...'))

    // Load chelonia.json to get known contracts and their manifest paths
    await this.loadCheloniaConfig()

    const manifestPaths = Object.values(this.cheloniaConfig.contracts).map((contract: { version: string, path: string }) => contract.path)

    if (manifestPaths.length === 0) {
      console.log(colors.yellow('⚠️  No contracts found in chelonia.json'))
      console.log(colors.gray('   Use `chel pin <version> <manifest-path>` to pin contracts first'))
      return
    }

    try {
      let totalWatchedFiles = 0

      // Watch the specific manifest files from chelonia.json (no file extension scanning)
      for (const manifestPath of manifestPaths) {
        const fullManifestPath = join(this.projectRoot, manifestPath)
        if (existsSync(fullManifestPath)) {
          // Watch the manifest file itself
          const manifestWatcher = watch(fullManifestPath, (eventType) => {
            this.handleContractChange(eventType, manifestPath).catch(error => {
              console.error(colors.red('❌ Error handling manifest change:'), error)
            })
          })
          this.watchers.push(manifestWatcher)
          totalWatchedFiles++

          // Parse the manifest to get contract source files and watch them too
          const contractInfo = await this.parseManifest(fullManifestPath)
          if (contractInfo) {
            const manifestDir = fullManifestPath.substring(0, fullManifestPath.lastIndexOf('/'))

            // Watch main contract file
            const mainContractPath = join(manifestDir, contractInfo.contractFiles.main)
            if (existsSync(mainContractPath)) {
              const mainWatcher = watch(mainContractPath, (eventType) => {
                console.log(colors.yellow(`📝 Contract file ${eventType}: ${contractInfo.contractFiles.main}`))
                this.handleContractChange(eventType, manifestPath).catch(error => {
                  console.error(colors.red('❌ Error handling contract file change:'), error)
                })
              })
              this.watchers.push(mainWatcher)
              totalWatchedFiles++
            }

            // Watch slim contract file if it exists
            if (contractInfo.contractFiles.slim) {
              const slimContractPath = join(manifestDir, contractInfo.contractFiles.slim)
              if (existsSync(slimContractPath)) {
                const slimWatcher = watch(slimContractPath, (eventType) => {
                  console.log(colors.yellow(`📝 Contract file ${eventType}: ${contractInfo.contractFiles.slim}`))
                  this.handleContractChange(eventType, manifestPath).catch(error => {
                    console.error(colors.red('❌ Error handling slim contract file change:'), error)
                  })
                })
                this.watchers.push(slimWatcher)
                totalWatchedFiles++
              }
            }
          }
        }
      }

      this.metrics.contractsWatched = totalWatchedFiles
      console.log(colors.green(`✅ Watching ${totalWatchedFiles} files (manifests + contract sources) from chelonia.json`))
    } catch (error) {
      console.error(colors.red('❌ Error setting up file watching:'), error)
    }
  }

  private async handleContractChange (eventType: string, filename: string) {
    const changeEvent: ContractChangeEvent = {
      file: filename,
      type: eventType === 'rename' ? 'added' : 'changed',
      timestamp: new Date()
    }

    this.contractChanges.push(changeEvent)
    this.metrics.changesDetected++

    console.log(colors.yellow(`📝 Contract change: ${filename}`))

    // Check if this is a recently regenerated manifest file to prevent infinite loops
    if (filename.includes('manifest.json')) {
      const now = Date.now()
      const recentlyRegenerated = this.recentlyRegeneratedManifests.find(
        manifest => manifest.path === filename && (now - manifest.timestamp) < 2000 // 2 second window
      )

      if (recentlyRegenerated) {
        console.log(colors.gray('   → Skipping hot reload for recently regenerated manifest'))
        // Clean up old entries while we're here
        this.recentlyRegeneratedManifests = this.recentlyRegeneratedManifests.filter(
          manifest => (now - manifest.timestamp) < 5000 // Keep entries for 5 seconds
        )
        return
      }
    }

    if (this.options['hot-reload'] !== false) {
      await this.triggerHotReload(filename)
    }
  }

  private async triggerHotReload (filename: string) {
    try {
      console.log(colors.blue(`🔄 Hot reloading contract: ${filename}`))

      // For hot reload, we need to:
      // 1. Re-create the manifest file and re-sign it on the fly
      // 2. Redeploy to the running server
      // 3. Notify the dashboard of the change
      // Note: Development contracts are not pinned, only manifests are regenerated

      // Find the manifest path that corresponds to this filename
      const manifestPath = this.findManifestForFile(filename)
      if (!manifestPath) {
        console.log(colors.yellow('   ⚠️  No manifest found for changed file, skipping hot reload'))
        return
      }

      console.log(colors.gray('   → Regenerating manifest and redeploying...'))

      // Step 1: Regenerate and re-sign the manifest using manifest.ts logic
      await this.regenerateManifest(manifestPath)

      // Step 2: Redeploy the updated manifest to the running server
      await this.redeployContract(manifestPath)

      this.metrics.hotReloads++
      console.log(colors.green('   ✅ Hot reload completed - manifest regenerated, re-signed, and redeployed'))
    } catch (error) {
      console.error(colors.red('❌ Hot reload failed:'), error)
    }
  }

  /**
   * Find the manifest file that corresponds to a changed contract file
   */
  private findManifestForFile (changedFile: string): string | null {
    // If the changed file is already a manifest, return it
    if (changedFile.includes('manifest.json')) {
      return changedFile
    }

    // Look through chelonia.json contracts to find which manifest references this file
    for (const contract of Object.values(this.cheloniaConfig.contracts)) {
      const manifestPath = contract.path
      const fullManifestPath = join(this.projectRoot, manifestPath)

      try {
        // Check if this manifest references the changed file
        const manifestDir = fullManifestPath.substring(0, fullManifestPath.lastIndexOf('/'))
        const contractInfo = this.parseManifestSync(fullManifestPath)

        if (contractInfo) {
          const mainContractPath = join(manifestDir, contractInfo.contractFiles.main)
          const slimContractPath = contractInfo.contractFiles.slim
            ? join(manifestDir, contractInfo.contractFiles.slim)
            : null

          // Check if the changed file matches any of the contract files
          const changedFilePath = resolve(this.projectRoot, changedFile)
          if (changedFilePath === mainContractPath ||
              (slimContractPath && changedFilePath === slimContractPath)) {
            return manifestPath
          }
        }
      } catch (error) {
        console.error(colors.red('   ⚠️  Error parsing manifest:'), error)
        // Skip this manifest if we can't parse it
        continue
      }
    }

    return null
  }

  /**
   * Regenerate and re-sign a manifest file using the logic from manifest.ts
   */
  private async regenerateManifest (manifestPath: string) {
    const fullManifestPath = join(this.projectRoot, manifestPath)
    const manifestDir = fullManifestPath.substring(0, fullManifestPath.lastIndexOf('/'))

    // Parse the existing manifest to get the contract info
    const contractInfo = await this.parseManifest(fullManifestPath)
    if (!contractInfo) {
      throw new Error(`Failed to parse manifest: ${manifestPath}`)
    }

    // Look for a key file in the project root or manifest directory
    const keyFile = this.findKeyFile(manifestDir)
    if (!keyFile) {
      console.log(colors.yellow('   ⚠️  No signing key found (key.json or chel keygen-generated), skipping manifest signing'))
      return
    }

    // Use the manifest generation logic from manifest.ts
    // We'll call the manifest function programmatically
    const contractFile = join(manifestDir, contractInfo.contractFiles.main)
    const slimFile = contractInfo.contractFiles.slim
      ? join(manifestDir, contractInfo.contractFiles.slim)
      : undefined

    const args = [
      keyFile,
      contractFile,
      '--version', contractInfo.version,
      '--out', fullManifestPath
    ]

    if (slimFile) {
      args.push('--slim', slimFile)
    }

    // Import and call the manifest function
    const { manifest } = await import('./manifest.ts')
    await manifest(args)

    // Track this manifest as recently regenerated to prevent infinite loops
    this.recentlyRegeneratedManifests.push({
      path: manifestPath,
      timestamp: Date.now()
    })

    console.log(colors.gray(`   → Manifest regenerated: ${manifestPath}`))
  }

  /**
   * Redeploy a contract manifest to the running server
   * This ensures the server has the latest version after hot reload
   */
  private async redeployContract (manifestPath: string) {
    try {
      const fullManifestPath = join(this.projectRoot, manifestPath)

      // Deploy target is the data directory (same as serve.ts preloadContracts)
      const deployTarget = resolve(join(this.projectRoot, 'data'))

      console.log(colors.gray(`   → Redeploying contract to server: ${manifestPath}`))

      // Use the same deploy function that serve.ts uses for preloading
      await deploy([deployTarget, fullManifestPath])

      console.log(colors.gray('   → Contract redeployed successfully'))
    } catch (error) {
      console.error(colors.red('   ❌ Failed to redeploy contract:'), error)
      throw error // Re-throw so hot reload can handle the error
    }
  }

  /**
   * Find a key file for signing manifests
   * Supports both legacy key.json and chel keygen-generated key files
   */
  private findKeyFile (manifestDir: string): string | null {
    // Helper function to find key files in a directory
    const findKeyInDir = (dir: string): string | null => {
      try {
        const files = readdirSync(dir)

        // First, look for legacy key.json
        if (files.includes('key.json')) {
          return join(dir, 'key.json')
        }

        // Then look for chel keygen-generated key files (pattern: algorithm-id.json)
        const keyFiles = files.filter((file: string) =>
          file.endsWith('.json') &&
          !file.endsWith('.pub.json') &&
          file.includes('edwards25519sha512batch-')
        )

        if (keyFiles.length > 0) {
          // Use the first matching key file (there should typically be only one)
          return join(dir, keyFiles[0])
        }

        return null
      } catch (error) {
        console.error('Error reading directory:', error)
        // Directory doesn't exist or can't be read
        return null
      }
    }

    // Look in project root first
    const rootKeyFile = findKeyInDir(this.projectRoot)
    if (rootKeyFile) {
      return rootKeyFile
    }

    // Look in manifest directory
    const manifestKeyFile = findKeyInDir(manifestDir)
    if (manifestKeyFile) {
      return manifestKeyFile
    }

    return null
  }

  /**
   * Shared manifest parsing logic to avoid code duplication
   */
  private parseManifestContent (manifestContent: string, manifestPath: string): { contractName: string, contractFiles: { main: string, slim?: string }, version: string } | null {
    try {
      const manifest = JSON.parse(manifestContent)
      const body = JSON.parse(manifest.body)

      const fullContractName = body.name
      const version = body.version
      const mainFile = body.contract.file
      const slimFile = body.contractSlim?.file

      if (!fullContractName || !mainFile || !version) {
        return null
      }

      // Use the full contract name (sanitized for filesystem safety)
      // e.g., "gi.contracts/group" -> "gi.contracts_group"
      const contractName = sanitizeContractName(fullContractName)

      return {
        contractName,
        version,
        contractFiles: {
          main: mainFile,
          slim: slimFile
        }
      }
    } catch (error) {
      console.error(colors.red(`Failed to parse manifest ${manifestPath}:`), error)
      return null
    }
  }

  /**
   * Synchronous version of parseManifest for use in findManifestForFile
   */
  private parseManifestSync (manifestPath: string): { contractName: string, contractFiles: { main: string, slim?: string }, version: string } | null {
    try {
      const manifestContent = readFileSync(manifestPath, 'utf8')
      return this.parseManifestContent(manifestContent, manifestPath)
    } catch (error) {
      console.error(colors.red('   ⚠️  Error reading manifest:'), error)
      return null
    }
  }

  /**
   * Async version of parseManifest for use in regenerateManifest
   */
  private async parseManifest (manifestPath: string): Promise<{ contractName: string, contractFiles: { main: string, slim?: string }, version: string } | null> {
    try {
      const manifestContent = await readFile(manifestPath, 'utf8')
      return this.parseManifestContent(manifestContent, manifestPath)
    } catch (error) {
      console.error(colors.red(`Failed to read manifest ${manifestPath}:`), error)
      return null
    }
  }

  private async startInteractiveMode () {
    console.log(colors.blue('🎛️  Starting interactive mode...'))
    console.log(colors.gray('Interactive commands:'))
    console.log(colors.gray('  - Press Ctrl+C to exit'))
    console.log(colors.gray('  - File changes will trigger hot reload automatically'))
    console.log(colors.gray('  - Check the dashboard for live contract status'))
    console.log()

    // Setup graceful shutdown for all relevant signals
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'] as const
    signals.forEach(signal => {
      process.on(signal, () => {
        console.log(colors.yellow(`\n🛑 Received ${signal}, shutting down development environment...`))
        this.cleanup()
        process.exit(0)
      })
    })

    // Keep the process alive
    console.log(colors.green('🎯 Live development environment ready!'))
    console.log(colors.gray('Watching for contract changes...'))

    // Keep the process alive indefinitely
    await new Promise(() => {})
  }

  private cleanup () {
    console.log(colors.blue('🧹 Cleaning up watchers...'))
    for (const watcher of this.watchers) {
      if (watcher && typeof watcher.close === 'function') {
        watcher.close()
      }
    }
    this.watchers = []
  }
}

export async function dev (args: string[]) {
  const { directory, options } = parseDevArgs(args)
  const devEnv = new DevEnvironment(directory, options)
  await devEnv.start()
}

function parseDevArgs (args: string[]): { directory: string; options: DevOptions } {
  const parsed = flags.parse(args, {
    string: ['port', 'dp', 'dashboard-port'],
    boolean: ['watch-contracts', 'hot-reload', 'auto-test', 'interactive', 'debug'],
    default: {
      'watch-contracts': true,
      'hot-reload': true,
      'auto-test': false,
      interactive: true,
      debug: false
    },
    alias: {
      p: 'port',
      dp: 'dashboard-port'
    }
  })

  const directory = parsed._[0] as string || '.'
  const options: DevOptions = {
    port: parsed.port ? parseInt(parsed.port) : 8000,
    dashboardPort: parsed['dashboard-port'] ? parseInt(parsed['dashboard-port']) : 3000,
    'watch-contracts': parsed['watch-contracts'],
    'hot-reload': parsed['hot-reload'],
    'auto-test': parsed['auto-test'],
    interactive: parsed.interactive,
    debug: parsed.debug
  }

  return { directory, options }
}

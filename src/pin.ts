import { flags, colors } from './deps.ts'
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, join, dirname, basename } from 'node:path'
import process from 'node:process'

/**
 * Options for the pin command
 */
interface PinOptions {
  overwrite?: boolean
  'only-changed'?: boolean
}

/**
 * Structure of chelonia.json configuration file
 * This is ecosystem-agnostic and separate from package.json
 */
interface CheloniaConfig {
  contracts: {
    [contractName: string]: {
      version: string
      path: string // relative path to the contract file
    }
  }
  // Future: can add other Chelonia-specific configuration here
  // like deployment targets, signing keys, etc.
}

/**
 * Structure of contractManifests.json
 * This tracks the deployed contract manifests and their hashes
 */
interface ContractManifests {
  manifests: {
    [contractKey: string]: string // contract key -> hash
  }
}

/**
 * ContractPinner class handles pinning individual contracts to specific versions
 *
 * Key improvements over the old implementation:
 * 1. Uses chelonia.json instead of package.json for ecosystem-agnostic config
 * 2. Supports per-contract versioning instead of global versioning
 * 3. Uses contracts/<name>/<version>/<files...> directory structure
 * 4. Only updates the specific contract being pinned, not all contracts
 * 5. Maintains compatibility with chel manifest and chel deploy commands
 */
class ContractPinner {
  private projectRoot: string
  private options: PinOptions
  private cheloniaConfig: CheloniaConfig

  constructor (projectRoot: string, options: PinOptions) {
    this.projectRoot = resolve(projectRoot)
    this.options = options
    // Initialize with empty config - will be loaded from chelonia.json if it exists
    this.cheloniaConfig = { contracts: {} }
  }

  /**
   * Pin a specific contract to a version
   *
   * @param version - The version to pin to (e.g., '2.0.3')
   * @param contractPath - Path to the contract file to pin (e.g., 'frontend/model/contracts/chatroom.js')
   */
  async pin (version: string, contractPath?: string) {
    if (!version || typeof version !== 'string') {
      throw new Error('Usage: chel pin <version> [contract-file-path]')
    }

    // If no contract path provided, show available contracts and exit
    if (!contractPath) {
      await this.showAvailableContracts()
      return
    }

    console.log(colors.cyan(`📌 Pinning contract to version: ${version}`))
    console.log(colors.gray(`Contract: ${contractPath}`))

    // Load existing chelonia.json configuration
    await this.loadCheloniaConfig()

    // Extract contract name from the file path
    const contractName = this.extractContractName(contractPath)
    console.log(colors.blue(`Contract name: ${contractName}`))

    // Validate that the contract file exists
    const fullContractPath = join(this.projectRoot, contractPath)
    if (!existsSync(fullContractPath)) {
      throw new Error(`Contract file not found: ${contractPath}`)
    }

    // Check if this version already exists for this contract
    const contractVersionDir = join(this.projectRoot, 'contracts', contractName, version)

    if (existsSync(contractVersionDir)) {
      if (this.options['only-changed'] || this.options.overwrite) {
        console.log(colors.yellow(`Version ${version} already exists for ${contractName} - updating configuration only`))
        console.log(colors.gray('Existing version directory preserved as-is'))
        // Just update the configuration and return
        await this.updateCheloniaConfig(contractName, version, contractPath)
        return
      } else {
        throw new Error(`Version ${version} already exists for contract ${contractName}. Use --overwrite to replace it, or --only-changed to switch to it`)
      }
    }

    // Create the new version directory structure
    await this.createVersionDirectory(contractName, version)

    // Copy contract files to the new version directory
    await this.copyContractFiles(contractPath, contractName, version)

    // Update chelonia.json configuration
    await this.updateCheloniaConfig(contractName, version, contractPath)

    // Generate manifests for this specific contract version
    await this.generateContractManifest(contractName, version)

    console.log(colors.green(`✅ Successfully pinned ${contractName} to version ${version}`))
    console.log(colors.gray(`Location: contracts/${contractName}/${version}/`))
  }

  /**
   * Load chelonia.json configuration file
   * Creates a default one if it doesn't exist
   */
  private async loadCheloniaConfig () {
    const configPath = join(this.projectRoot, 'chelonia.json')

    if (existsSync(configPath)) {
      try {
        const configContent = await readFile(configPath, 'utf8')
        this.cheloniaConfig = JSON.parse(configContent)
        console.log(colors.blue('📄 Loaded existing chelonia.json'))
      } catch (error) {
        console.warn(colors.yellow(`Warning: Could not parse chelonia.json: ${error}`))
        // Use default empty config
      }
    } else {
      console.log(colors.blue('📄 Creating new chelonia.json'))
      // Will be saved when updateCheloniaConfig is called
    }

    // Ensure contracts object exists
    if (!this.cheloniaConfig.contracts) {
      this.cheloniaConfig.contracts = {}
    }
  }

  /**
   * Extract contract name from file path
   * Examples:
   * - 'frontend/model/contracts/chatroom.js' -> 'chatroom'
   * - 'contracts/identity.js' -> 'identity'
   * - 'src/contracts/group.js' -> 'group'
   */
  private extractContractName (contractPath: string): string {
    const fileName = basename(contractPath)
    // Remove .js extension and any -slim suffix
    return fileName.replace(/(-slim)?\.js$/, '')
  }

  /**
   * Show available contracts in the project
   * This helps users know what contracts they can pin
   */
  private async showAvailableContracts () {
    console.log(colors.cyan('📋 Available contracts to pin:'))
    console.log(colors.gray('Usage: chel pin <version> <contract-file-path>'))
    console.log()

    // Look for contract files in common locations
    const commonPaths = [
      'frontend/model/contracts',
      'contracts',
      'src/contracts'
    ]

    let foundContracts = false

    for (const searchPath of commonPaths) {
      const fullPath = join(this.projectRoot, searchPath)
      if (existsSync(fullPath)) {
        try {
          const files = await readdir(fullPath)
          const contractFiles = files.filter(f => f.endsWith('.js') && !f.endsWith('-slim.js'))

          if (contractFiles.length > 0) {
            console.log(colors.blue(`📁 ${searchPath}/`))
            for (const file of contractFiles) {
              const contractName = file.replace('.js', '')
              const relativePath = join(searchPath, file)
              console.log(`  ${colors.green(contractName)} - ${colors.gray(relativePath)}`)
            }
            console.log()
            foundContracts = true
          }
        } catch {
          // Ignore errors reading directories
        }
      }
    }

    if (!foundContracts) {
      console.log(colors.yellow('No contract files found in common locations.'))
      console.log(colors.gray('Make sure your contract files end with .js and are in a contracts/ directory.'))
    }

    // Show current pinned contracts if any exist
    if (Object.keys(this.cheloniaConfig.contracts).length > 0) {
      console.log(colors.cyan('📌 Currently pinned contracts:'))
      for (const [name, config] of Object.entries(this.cheloniaConfig.contracts)) {
        console.log(`  ${colors.green(name)} - ${colors.blue(config.version)} (${colors.gray(config.path)})`)
      }
    }
  }

  /**
   * Create the directory structure for a contract version
   * Structure: contracts/<contractName>/<version>/
   */
  private async createVersionDirectory (contractName: string, version: string) {
    const versionDir = join(this.projectRoot, 'contracts', contractName, version)

    console.log(colors.blue(`📁 Creating directory: contracts/${contractName}/${version}/`))
    await mkdir(versionDir, { recursive: true })
  }

  /**
   * Copy contract files to the version directory
   * This includes both the main contract and its slim version if it exists
   */
  private async copyContractFiles (contractPath: string, contractName: string, version: string) {
    const sourceDir = dirname(join(this.projectRoot, contractPath))
    const targetDir = join(this.projectRoot, 'contracts', contractName, version)

    // Copy main contract file
    const mainFile = `${contractName}.js`
    const mainSource = join(sourceDir, mainFile)
    const mainTarget = join(targetDir, mainFile)

    if (existsSync(mainSource)) {
      await copyFile(mainSource, mainTarget)
      console.log(colors.green(`✅ Copied ${mainFile}`))
    } else {
      throw new Error(`Main contract file not found: ${mainSource}`)
    }

    // Copy slim version if it exists
    const slimFile = `${contractName}-slim.js`
    const slimSource = join(sourceDir, slimFile)
    const slimTarget = join(targetDir, slimFile)

    if (existsSync(slimSource)) {
      await copyFile(slimSource, slimTarget)
      console.log(colors.green(`✅ Copied ${slimFile}`))
    } else {
      console.log(colors.yellow(`⚠️  Slim version not found: ${slimFile} (this is optional)`))
    }

    // Copy any existing manifest file
    const manifestFile = `${contractName}.manifest.json`
    const manifestSource = join(sourceDir, manifestFile)
    const manifestTarget = join(targetDir, manifestFile)

    if (existsSync(manifestSource)) {
      await copyFile(manifestSource, manifestTarget)
      console.log(colors.green(`✅ Copied ${manifestFile}`))
    }
  }

  /**
   * Update chelonia.json with the new contract version
   * This only updates the specific contract being pinned
   */
  private async updateCheloniaConfig (contractName: string, version: string, contractPath: string) {
    // Update the specific contract's configuration
    this.cheloniaConfig.contracts[contractName] = {
      version,
      path: contractPath
    }

    // Write the updated configuration back to chelonia.json
    const configPath = join(this.projectRoot, 'chelonia.json')
    const configContent = JSON.stringify(this.cheloniaConfig, null, 2) + '\n'

    await writeFile(configPath, configContent, 'utf8')
    console.log(colors.green('✅ Updated chelonia.json'))
    console.log(colors.gray(`Set ${contractName} to version ${version}`))
  }

  /**
   * Generate manifest for the specific contract version
   * This creates the .manifest.json file needed by chel deploy
   *
   * The manifest format must match what deploy.ts expects:
   * - head: JSON string with manifestVersion
   * - body: JSON string with contract details (name, version, contract.file, contractSlim.file)
   * - signature: cryptographic signature (placeholder for now)
   */
  private async generateContractManifest (contractName: string, version: string) {
    console.log(colors.blue(`📝 Generating manifest for ${contractName} v${version}`))

    const contractDir = join(this.projectRoot, 'contracts', contractName, version)
    const mainFile = join(contractDir, `${contractName}.js`)
    const slimFile = join(contractDir, `${contractName}-slim.js`)

    // Check if we have the necessary files
    if (!existsSync(mainFile)) {
      throw new Error(`Main contract file missing: ${mainFile}`)
    }

    // Create the manifest in the format expected by deploy.ts
    const head = {
      manifestVersion: '1.0.0'
    }

    const body = {
      name: `gi.contracts/${contractName}`,
      version,
      contract: {
        file: `${contractName}.js`,
        hash: 'placeholder-hash-' + Date.now() // TODO: Calculate actual hash
      },
      ...(existsSync(slimFile) && {
        contractSlim: {
          file: `${contractName}-slim.js`,
          hash: 'placeholder-slim-hash-' + Date.now() // TODO: Calculate actual hash
        }
      }),
      signingKeys: [], // TODO: Add actual signing keys
    }

    // Create the full manifest structure that deploy.ts expects
    const manifest = {
      head: JSON.stringify(head),
      body: JSON.stringify(body),
      signature: {
        keyId: 'placeholder-key-id',
        value: 'placeholder-signature-value'
      }
    }

    const manifestPath = join(contractDir, `${contractName}.manifest.json`)
    await writeFile(manifestPath, JSON.stringify(manifest) + '\n', 'utf8')

    console.log(colors.green(`✅ Generated manifest: ${contractName}.manifest.json`))
    console.log(colors.yellow('⚠️  Note: Manifest contains placeholder hashes and signatures'))
    console.log(colors.yellow('⚠️  For production use, run "chel manifest" to generate proper cryptographic signatures'))
  }

  /**
   * Update contractManifests.json to include this contract version
   * This is used by the application to know which contracts are available
   */
  private async updateContractManifests (contractName: string, version: string, manifestHash: string) {
    const manifestsPath = join(this.projectRoot, 'contractManifests.json')
    let manifests: ContractManifests = { manifests: {} }

    // Load existing manifests if the file exists
    if (existsSync(manifestsPath)) {
      try {
        const content = await readFile(manifestsPath, 'utf8')
        manifests = JSON.parse(content)
      } catch (error) {
        console.warn(colors.yellow(`Warning: Could not parse contractManifests.json: ${error}`))
      }
    }

    // Update only this contract's manifest entry
    const contractKey = `gi.contracts/${contractName}`
    manifests.manifests[contractKey] = manifestHash

    // Write back to file
    await writeFile(manifestsPath, JSON.stringify(manifests, null, 2) + '\n', 'utf8')
    console.log(colors.green('✅ Updated contractManifests.json'))
  }
}

/**
 * Main pin command function
 * Parses arguments and executes the pin operation
 */
export async function pin (args: string[]) {
  const { version, contractPath, directory, options } = parsePinArgs(args)

  try {
    const pinner = new ContractPinner(directory, options)
    await pinner.pin(version, contractPath)
  } catch (error) {
    console.error(colors.red('❌ Pin failed:'), error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

/**
 * Parse command line arguments for the pin command
 *
 * Examples:
 * - chel pin 2.0.3 frontend/model/contracts/chatroom.js
 * - chel pin 2.0.3 frontend/model/contracts/chatroom.js --overwrite
 * - chel pin 2.0.3 (shows available contracts)
 */
function parsePinArgs (args: string[]): {
  version: string
  contractPath?: string
  directory: string
  options: PinOptions
} {
  const parsed = flags.parse(args, {
    boolean: ['overwrite', 'only-changed'],
    alias: {
      o: 'overwrite',
      c: 'only-changed'
    }
  })

  // First argument is version, second is optional contract path
  const version = parsed._[0]?.toString()
  const contractPath = parsed._[1]?.toString()
  const directory = process.cwd()

  if (!version) {
    throw new Error('Usage: chel pin <version> [contract-file-path]')
  }

  const options: PinOptions = {
    overwrite: parsed.overwrite,
    'only-changed': parsed['only-changed']
  }

  return { version, contractPath, directory, options }
}

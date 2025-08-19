import { flags, colors } from './deps.ts'
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
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
 * ContractPinner class handles pinning individual contracts to specific versions
 * 1. Uses chelonia.json for Chelonia-specific configuration (separate from Node.js package.json)
 * 2. Supports independent versioning for each contract (contracts can have different versions)
 * 3. Organizes contracts in a structured directory layout: contracts/<name>/<version>/<files...>
 * 4. Performs selective updates - only modifies the specific contract being pinned
 * 5. Maintains compatibility with chel manifest and chel deploy workflows
 *
 * The pinning process copies contract files from a baseline version to create new versions,
 * allowing developers to iterate on contracts while maintaining version history.
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

    // Note: Manifests should be generated using 'chel manifest' command
    // The pin command only copies existing manifests if they exist

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
   * Show usage information and currently pinned contracts
   * Removed automatic contract discovery since contracts may need to be built first
   */
  private async showAvailableContracts () {
    console.log(colors.cyan('📋 Contract Pinning Usage:'))
    console.log(colors.gray('Usage: chel pin <version> <contract-file-path>'))
    console.log()
    console.log(colors.yellow('📝 Note: Specify the full path to your contract file.'))
    console.log(colors.gray('   Contracts may need to be built first before pinning.'))
    console.log(colors.gray('   Example: chel pin 1.0.0 dist/contracts/chatroom.js'))
    console.log()

    // Show current pinned contracts if any exist
    if (Object.keys(this.cheloniaConfig.contracts).length > 0) {
      console.log(colors.cyan('📌 Currently pinned contracts:'))
      for (const [name, config] of Object.entries(this.cheloniaConfig.contracts)) {
        console.log(`  ${colors.green(name)} - ${colors.blue(config.version)} (${colors.gray(config.path)})`)
      }
      console.log()
    } else {
      console.log(colors.gray('No contracts currently pinned.'))
      console.log()
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
   * Copy contract files from source to target directory
   * Reads file names from manifest if available, falls back to contract path
   */
  private async copyContractFiles (contractPath: string, contractName: string, version: string) {
    const sourceDir = dirname(join(this.projectRoot, contractPath))
    const targetDir = join(this.projectRoot, 'contracts', contractName, version)

    // Look for manifest file to get actual file names
    // Scan directory for manifest files matching pattern: <contractName>.*.manifest.json
    let manifestSource: string | null = null

    try {
      const { readdir } = await import('node:fs/promises')
      const files = await readdir(sourceDir)
      const manifestPattern = new RegExp(`^${contractName}\\..*\\.manifest\\.json$`)

      for (const file of files) {
        if (manifestPattern.test(file)) {
          manifestSource = join(sourceDir, file)
          break
        }
      }
    } catch (error) {
      // If we can't read the directory, manifestSource remains null
      console.log(colors.gray(`Could not scan directory for manifest files: ${error}`))
    }

    let mainFile: string
    let slimFile: string | undefined

    if (manifestSource) {
      try {
        // Read manifest to get actual file names
        const manifestContent = await readFile(manifestSource, 'utf8')
        const manifest = JSON.parse(manifestContent)
        const body = JSON.parse(manifest.body)

        mainFile = body.contract.file
        slimFile = body.contractSlim?.file

        console.log(colors.gray(`📋 Using manifest file names: ${mainFile}${slimFile ? `, ${slimFile}` : ''}`))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log(colors.yellow(`⚠️  Could not read manifest, falling back to contract path: ${errorMessage}`))
        mainFile = basename(contractPath)
      }
    } else {
      // Fallback: use the contract path basename
      mainFile = basename(contractPath)
      console.log(colors.yellow(`⚠️  No manifest found, using contract path: ${mainFile}`))
    }

    // Copy main contract file
    const mainSource = join(sourceDir, mainFile)
    const mainTarget = join(targetDir, mainFile)

    if (existsSync(mainSource)) {
      await copyFile(mainSource, mainTarget)
      console.log(colors.green(`✅ Copied ${mainFile}`))
    } else {
      throw new Error(`Main contract file not found: ${mainSource}`)
    }

    // Copy slim version if specified in manifest
    if (slimFile) {
      const slimSource = join(sourceDir, slimFile)
      const slimTarget = join(targetDir, slimFile)

      if (existsSync(slimSource)) {
        await copyFile(slimSource, slimTarget)
        console.log(colors.green(`✅ Copied ${slimFile}`))
      } else {
        console.log(colors.yellow(`⚠️  Slim file specified in manifest but not found: ${slimFile}`))
      }
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

import { flags, colors } from './deps.ts'
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, join, dirname, basename } from 'node:path'
import process from 'node:process'

/**
 * Sanitize contract name for filesystem safety
 * Replaces characters that are not allowed in directory names
 * @param contractName - Full contract name (e.g., "gi.contracts/group")
 * @returns Sanitized name safe for filesystem use
 */
function sanitizeContractName (contractName: string): string {
  return contractName.replace(/[/\\:*?"<>|]/g, '_')
}

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
      path: string // relative path to the manifest file
    }
  }
  // Future: can add other Chelonia-specific configuration here
  // like deployment targets, signing keys, etc.
}

/**
 * Contract file information extracted from manifest
 */
interface ContractFiles {
  main: string
  slim?: string
}

/**
 * ContractPinner class handles pinning individual contracts to specific versions
 * 1. Uses chelonia.json for Chelonia-specific configuration (separate from Node.js package.json)
 * 2. Supports independent versioning for each contract (contracts can have different versions)
 * 3. Organizes contracts in a structured directory layout: contracts/<name>/<version>/<files...>
 * 4. Performs selective updates - only modifies the specific contract being pinned
 * 5. Maintains compatibility with chel manifest and chel deploy workflows
 *
 * The pinning process copies contract files from manifest to create new versions,
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
   * Pin contracts with version validation - only pins if CLI version matches manifest version
   * @param version - The version to pin to (must match manifest version)
   * @param manifestPath - Path to the manifest file (required)
   */
  async pin (version: string, manifestPath?: string) {
    if (!version || typeof version !== 'string') {
      throw new Error('Usage: chel pin <version> <manifest-file-path>')
    }

    // If no manifest path provided, show usage and exit
    if (!manifestPath) {
      await this.showUsage()
      return
    }

    console.log(colors.cyan(`📌 Requesting pin to version: ${version}`))
    console.log(colors.gray(`Manifest: ${manifestPath}`))

    // Load existing chelonia.json configuration
    await this.loadCheloniaConfig()

    // Validate that the manifest file exists
    const fullManifestPath = join(this.projectRoot, manifestPath)
    if (!existsSync(fullManifestPath)) {
      throw new Error(`Manifest file not found: ${manifestPath}`)
    }

    // Parse the manifest to get contract information and version
    const { contractName, contractFiles, version: contractVersion } = await this.parseManifest(fullManifestPath)
    console.log(colors.blue(`Contract name: ${contractName}`))
    console.log(colors.blue(`Contract version: ${contractVersion}`))

    // Validate that the CLI version matches the contract version from manifest
    if (version !== contractVersion) {
      console.log(colors.red(`❌ Version mismatch: CLI version (${version}) does not match contract version (${contractVersion})`))
      console.log(colors.yellow(`💡 To pin this contract, use: chel pin ${contractVersion} ${manifestPath}`))
      return
    }

    console.log(colors.green(`✅ Version validation passed: ${version}`))

    // Check if this contract is already pinned to the same version
    const currentPinnedVersion = this.cheloniaConfig.contracts[contractName]?.version
    if (currentPinnedVersion === version) {
      console.log(colors.yellow(`✨ Contract ${contractName} is already pinned to version ${version} - no action needed`))
      return
    }

    if (currentPinnedVersion) {
      console.log(colors.cyan(`📌 Updating ${contractName} from version ${currentPinnedVersion} to ${version}`))
    } else {
      console.log(colors.cyan(`📌 Pinning ${contractName} to version ${version} (first time)`))
    }

    // Check if this version already exists for this contract
    const contractVersionDir = join(this.projectRoot, 'contracts', contractName, version)

    if (existsSync(contractVersionDir)) {
      if (!this.options.overwrite && !this.options['only-changed']) {
        throw new Error(`Version ${version} already exists for contract ${contractName}. Use --overwrite to replace it, or --only-changed to update only changed files`)
      }
      console.log(colors.yellow(`Version ${version} already exists for ${contractName} - checking files...`))
    } else {
      // Create the new version directory structure
      await this.createVersionDirectory(contractName, version)
    }

    // Copy contract files (this will handle --overwrite and --only-changed logic)
    await this.copyContractFiles(manifestPath, contractFiles, contractName, version)

    // Update chelonia.json configuration
    await this.updateCheloniaConfig(contractName, version, manifestPath)

    console.log(colors.green(`✅ Successfully pinned ${contractName} to version ${version}`))
    console.log(colors.gray(`Location: contracts/${contractName}/${version}/`))
  }

  /**
   * Parse manifest file to extract contract information
   * @param manifestPath - Path to the manifest file
   * @returns Object containing contract name, version, and file information
   */
  private async parseManifest (manifestPath: string): Promise<{ contractName: string, contractFiles: ContractFiles, version: string }> {
    try {
      const manifestContent = await readFile(manifestPath, 'utf8')
      const manifest = JSON.parse(manifestContent)
      const body = JSON.parse(manifest.body)

      const fullContractName = body.name
      const version = body.version
      const mainFile = body.contract.file
      const slimFile = body.contractSlim?.file

      if (!fullContractName || !mainFile || !version) {
        throw new Error('Invalid manifest: missing contract name, main file, or version')
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
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to parse manifest file: ${errorMessage}`)
    }
  }

  /**
   * Show usage information and currently pinned contracts
   */
  showUsage () {
    console.log(colors.cyan('📋 Contract Pinning Usage:'))
    console.log(colors.gray('Usage: chel pin <version> <manifest-file-path>'))
    console.log()
    console.log(colors.yellow('📝 Note: Specify the full path to your manifest file.'))
    console.log(colors.gray('   Generate manifests first using: chel manifest <contract-file>'))
    console.log(colors.gray('   Example: chel pin 1.0.0 ./dist/contracts/chatroom.1.0.0.manifest.json'))
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
   * Copy contract files from manifest to target directory
   * @param manifestPath - Path to the manifest file
   * @param contractFiles - Contract file information from manifest
   * @param contractName - Name of the contract
   * @param version - Version to pin to
   */
  private async copyContractFiles (manifestPath: string, contractFiles: ContractFiles, contractName: string, version: string) {
    const sourceDir = dirname(join(this.projectRoot, manifestPath))
    const targetDir = join(this.projectRoot, 'contracts', contractName, version)

    console.log(colors.gray(`📋 Copying files from manifest: ${contractFiles.main}${contractFiles.slim ? `, ${contractFiles.slim}` : ''}`))

    // Copy main contract file
    const mainSource = join(sourceDir, contractFiles.main)
    const mainTarget = join(targetDir, contractFiles.main)

    await this.copyFileIfNeeded(mainSource, mainTarget, contractFiles.main)

    // Copy slim file if it exists
    if (contractFiles.slim) {
      const slimSource = join(sourceDir, contractFiles.slim)
      const slimTarget = join(targetDir, contractFiles.slim)

      try {
        await this.copyFileIfNeeded(slimSource, slimTarget, contractFiles.slim)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log(colors.yellow(`⚠️  Could not copy slim file: ${errorMessage}`))
        // Don't fail the entire operation if slim file copy fails
      }
    }
  }

  /**
   * Copy a file only if needed based on --overwrite and --only-changed flags
   * @param sourcePath - Source file path
   * @param targetPath - Target file path
   * @param fileName - File name for logging
   */
  private async copyFileIfNeeded (sourcePath: string, targetPath: string, fileName: string) {
    const targetExists = existsSync(targetPath)

    // If target doesn't exist, always copy
    if (!targetExists) {
      console.log(colors.blue(`📄 Copying: ${fileName} (new file)`))
      await copyFile(sourcePath, targetPath)
      return
    }

    // If target exists and overwrite is false, skip
    if (targetExists && !this.options.overwrite) {
      console.log(colors.yellow(`⏭️  Skipping: ${fileName} (already exists, use --overwrite to replace)`))
      return
    }

    // If only-changed is true, check if files are different
    if (this.options['only-changed']) {
      const sourceContent = await readFile(sourcePath, 'utf8')
      const targetContent = await readFile(targetPath, 'utf8')

      if (sourceContent === targetContent) {
        console.log(colors.gray(`⏭️  Skipping: ${fileName} (unchanged)`))
        return
      } else {
        console.log(colors.blue(`📄 Copying: ${fileName} (changed)`))
        await copyFile(sourcePath, targetPath)
        return
      }
    }

    // Default case: overwrite is true and only-changed is false
    console.log(colors.blue(`📄 Copying: ${fileName} (overwriting)`))
    await copyFile(sourcePath, targetPath)
  }

  /**
   * Load chelonia.json configuration file
   * Creates a default one if it doesn't exist
   */
  async loadCheloniaConfig () {
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
   * Update chelonia.json with the new contract version
   * @param contractName - Name of the contract
   * @param version - Version being pinned
   * @param manifestPath - Path to the original manifest file
   */
  private async updateCheloniaConfig (contractName: string, version: string, manifestPath: string) {
    // Generate the output path to the pinned contract's manifest in the contracts directory
    // Structure: contracts/<contractName>/<version>/<contractName>.<version>.manifest.json
    const manifestFileName = basename(manifestPath)
    const pinnedManifestPath = `contracts/${contractName}/${version}/${manifestFileName}`

    // Update the contract configuration
    this.cheloniaConfig.contracts[contractName] = {
      version,
      path: pinnedManifestPath
    }

    // Write the updated configuration back to chelonia.json
    const configPath = join(this.projectRoot, 'chelonia.json')
    const configContent = JSON.stringify(this.cheloniaConfig, null, 2) + '\n'

    await writeFile(configPath, configContent, 'utf8')
    console.log(colors.green('✅ Updated chelonia.json'))
  }
}

/**
 * Main pin function that handles the pinning process
 * @param version - The version to pin to (must match manifest version)
 * @param manifestPath - Path to the manifest file
 * @param directory - Working directory (defaults to current directory)
 * @param options - Pin options (overwrite, only-changed)
 */
export async function pinContracts (version: string, manifestPath: string | undefined, directory: string, options: PinOptions) {
  try {
    const pinner = new ContractPinner(directory, options)
    await pinner.pin(version, manifestPath)
  } catch (error) {
    console.error(colors.red('❌ Pin failed:'), error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

/**
 * Parse command line arguments for the pin command
 *
 * Examples:
 * - chel pin 2.0.3 chatroom.2.0.3.manifest.json
 * - chel pin 2.0.3 chatroom.2.0.3.manifest.json --overwrite
 * - chel pin 2.0.3 (shows usage)
 */
function parsePinArgs (args: string[]): {
  version: string
  manifestPath?: string
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

  // First argument is version, second is optional manifest path
  const version = parsed._[0]?.toString()
  const manifestPath = parsed._[1]?.toString()
  const directory = process.cwd()

  if (!version) {
    throw new Error('Usage: chel pin <version> <manifest-file-path>')
  }

  const options: PinOptions = {
    overwrite: parsed.overwrite,
    'only-changed': parsed['only-changed']
  }

  return { version, manifestPath, directory, options }
}

export async function pin (args: string[]) {
  // If no arguments provided, show usage
  if (args.length === 0) {
    const pinner = new ContractPinner(process.cwd(), {})
    await pinner.loadCheloniaConfig()
    pinner.showUsage()
    return
  }
  const { version, manifestPath, directory, options } = parsePinArgs(args)
  await pinContracts(version, manifestPath, directory, options)
}

import { flags, colors } from './deps.ts'
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

interface PinOptions {
  overwrite?: boolean
  'only-changed'?: boolean
}

interface ProjectConfig {
  contractsVersion: string
  version: string
}

class ContractPinner {
  private projectRoot: string
  private options: PinOptions
  private projectConfig: ProjectConfig

  constructor (projectRoot: string, options: PinOptions) {
    this.projectRoot = resolve(projectRoot)
    this.options = options
    this.projectConfig = { contractsVersion: '1.0.0', version: '1.0.0' }
  }

  async pin (version: string) {
    if (!version || typeof version !== 'string') {
      throw new Error('Usage: chel pin <version>')
    }

    console.log(colors.cyan(`📌 Pinning contracts to version: ${version}`))

    // Load project configuration
    await this.loadProjectConfig()

    // Check if version already exists
    const versionDir = join(this.projectRoot, 'contracts', version)

    if (existsSync(versionDir)) {
      if (this.options['only-changed'] || this.options.overwrite) {
        // For --only-changed: allow switching to existing versions without --overwrite
        // For --overwrite: explicitly allow updating existing versions
        console.log(colors.yellow(`Version ${version} already exists - updating package.json only`))
        console.log(colors.gray('Existing version directory preserved as-is'))
        // Don't delete or modify the existing version directory!
        // Just update package.json and return
        await this.updatePackageJsonVersion(version)
        console.log(colors.green(`Package.json updated to use existing version: ${version}`))
        return
      } else {
        throw new Error(`Version ${version} already exists. Use --overwrite to replace it, or --only-changed to switch to it.`)
      }
    }

    // Build contracts if needed
    await this.buildContracts()

    // Pin contracts (improved logic for only changed contracts)
    await this.pinContracts(version)

    console.log(colors.green(`✅ Contracts pinned to version: ${version}`))
  }

  private async loadProjectConfig () {
    try {
      const packageJsonPath = join(this.projectRoot, 'package.json')
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
        this.projectConfig = {
          contractsVersion: packageJson.contractsVersion || '1.0.0',
          version: packageJson.version || '1.0.0'
        }
      }
    } catch {
      console.warn(colors.yellow('Warning: Could not load package.json, using defaults'))
    }
  }

  private async updatePackageJsonVersion (version: string) {
    console.log(colors.blue('📝 Updating package.json...'))

    const packageJsonPath = join(this.projectRoot, 'package.json')

    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
      packageJson.contractsVersion = version

      // Update environment variable for build process
      process.env.CONTRACTS_VERSION = version

      await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
      console.log(colors.green(`Updated package.json "contractsVersion" to: ${version}`))
    } else {
      throw new Error('package.json not found in project root')
    }
  }

  private async buildContracts () {
    console.log(colors.blue('🔨 Building contracts...'))

    // Run build command to ensure contracts are built
    // This is equivalent to 'grunt build' in the original Gruntfile.js
    const buildProcess = spawn('deno', ['task', 'build'], {
      cwd: this.projectRoot,
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    })

    await new Promise<void>((resolve, reject) => {
      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Build process exited with code ${code}`))
        }
      })
      buildProcess.on('error', reject)
    })
  }

  private async pinContracts (version: string) {
    const contractsDir = join(this.projectRoot, 'contracts')
    const versionDir = join(contractsDir, version)

    // Check if version directory already exists
    if (existsSync(versionDir)) {
      if (this.options['only-changed'] || this.options.overwrite) {
        // For --only-changed: allow switching to existing versions without --overwrite
        // For --overwrite: explicitly allow updating existing versions
        console.log(colors.yellow(`Version ${version} already exists - updating package.json only`))
        console.log(colors.gray('Existing version directory preserved as-is'))
        // Don't delete or modify the existing version directory!
        // Just update package.json and return
        await this.updatePackageJsonVersion(version)
        console.log(colors.green(`Package.json updated to use existing version: ${version}`))
        return
      } else {
        throw new Error(`Version ${version} already exists. Use --overwrite to replace it, or --only-changed to switch to it.`)
      }
    }

    // Ensure contracts directory exists
    if (!existsSync(contractsDir)) {
      await mkdir(contractsDir, { recursive: true })
    }

    if (this.options['only-changed']) {
      // Improved pinning: only pin changed contracts
      await this.pinOnlyChangedContracts(versionDir)
    } else {
      // Default behavior: pin all contracts (but still improved to only copy what's needed)
      await this.pinAllContracts(versionDir)
    }

    console.log(colors.green(`Version ${version} pinned to: ${versionDir}`))
  }

  private async pinOnlyChangedContracts (versionDir: string) {
    console.log(colors.blue('🔍 Analyzing contract changes (improved pinning)...'))

    // Find existing versions to copy from
    const existingVersions = await this.getExistingVersions()
    if (existingVersions.length === 0) {
      console.log(colors.yellow('No existing contract versions found.'))
      console.log(colors.gray('Make sure you have contracts in the contracts/ directory'))
      return
    }

    // Find the latest/complete version to use as baseline
    const latestVersion = this.getLatestVersion(existingVersions)
    const completeVersion = await this.getLastCompleteVersion(existingVersions)
    const baselineVersion = completeVersion || latestVersion

    console.log(colors.gray(`Using baseline version: ${baselineVersion}`))

    // Get all contract files from the baseline version
    const baselineVersionDir = join(this.projectRoot, 'contracts', baselineVersion!)
    const baselineFiles = await readdir(baselineVersionDir)
    const contractFiles = baselineFiles.filter(file => file.endsWith('.js'))
    const manifestFiles = baselineFiles.filter(file => file.endsWith('.manifest.json'))
    const allFiles = [...contractFiles, ...manifestFiles]

    if (allFiles.length === 0) {
      console.log(colors.yellow(`No contract files found in baseline version ${baselineVersion}.`))
      return
    }

    console.log(colors.gray(`Found ${allFiles.length} contract-related files in ${baselineVersion}`))

    // Check for any files in project root that might be newer builds
    const currentDirFiles = await readdir(this.projectRoot).catch(() => [])
    const currentContractFiles = currentDirFiles.filter(file =>
      file.endsWith('.js') && (file.includes('group') || file.includes('identity') || file.includes('chatroom'))
    )

    const changedFiles: string[] = []

    // Check if any current directory files are newer than baseline
    for (const file of currentContractFiles) {
      const currentFilePath = join(this.projectRoot, file)
      const baselineFilePath = join(baselineVersionDir, file)

      if (await this.hasContractChanged(currentFilePath, baselineFilePath)) {
        changedFiles.push(file)
        console.log(colors.green(`📝 Found updated contract: ${file}`))
      }
    }

    if (changedFiles.length === 0) {
      console.log(colors.blue('📋 No changes detected, copying all contracts from baseline version...'))
    } else {
      console.log(colors.blue(`📋 Found ${changedFiles.length} changed files, creating new version...`))
      changedFiles.forEach(file => console.log(colors.gray(`  - ${file}`)))
    }

    // Create version directory
    await mkdir(versionDir, { recursive: true })

    console.log(colors.blue('📋 Creating complete version with all contracts...'))

    let copiedCount = 0

    // Copy all files from baseline version
    for (const file of allFiles) {
      let srcPath: string

      // Check if we have a newer version in current directory
      if (changedFiles.includes(file)) {
        srcPath = join(this.projectRoot, file)
        console.log(colors.green(`  📌 ${file} (updated from current build)`))
      } else {
        srcPath = join(baselineVersionDir, file)
        console.log(colors.gray(`  📌 ${file} (from ${baselineVersion})`))
      }

      const destPath = join(versionDir, file)

      try {
        await copyFile(srcPath, destPath)
        copiedCount++
      } catch (error) {
        console.warn(colors.yellow(`Warning: Could not copy ${file}:`), error)
      }
    }

    console.log(colors.green(`✅ Copied ${copiedCount} files to new version`))

    // Update package.json to use the new version
    const versionName = versionDir.split('/').pop()!
    await this.updatePackageJsonVersion(versionName)
  }

  private async pinAllContracts (versionDir: string) {
    console.log(colors.blue('📋 Pinning all contracts...'))

    // Find existing versions to copy from
    const existingVersions = await this.getExistingVersions()
    if (existingVersions.length === 0) {
      console.log(colors.yellow('No existing contract versions found.'))
      console.log(colors.gray('Make sure you have contracts in the contracts/ directory'))
      return
    }

    // Find the latest/complete version to use as baseline
    const latestVersion = this.getLatestVersion(existingVersions)
    const completeVersion = await this.getLastCompleteVersion(existingVersions)
    const baselineVersion = completeVersion || latestVersion

    console.log(colors.gray(`Using baseline version: ${baselineVersion}`))

    // Get all contract files from the baseline version
    const baselineVersionDir = join(this.projectRoot, 'contracts', baselineVersion!)
    const baselineFiles = await readdir(baselineVersionDir)
    const allFiles = baselineFiles.filter(file => file.endsWith('.js') || file.endsWith('.manifest.json'))

    if (allFiles.length === 0) {
      console.log(colors.yellow(`No contract files found in baseline version ${baselineVersion}.`))
      return
    }

    console.log(colors.gray(`Found ${allFiles.length} files to pin:`))
    allFiles.forEach(file => console.log(colors.gray(`  - ${file}`)))

    // Create version directory
    await mkdir(versionDir, { recursive: true })

    // Copy all files to version directory
    let copiedCount = 0
    for (const file of allFiles) {
      const srcPath = join(baselineVersionDir, file)
      const destPath = join(versionDir, file)

      try {
        await copyFile(srcPath, destPath)
        console.log(colors.green(`📌 Pinned: ${file} (from ${baselineVersion})`))
        copiedCount++
      } catch (error) {
        console.warn(colors.yellow(`Warning: Could not copy ${file}:`), error)
      }
    }

    console.log(colors.green(`✅ Pinned ${copiedCount} files`))

    // Update package.json to use the new version
    const versionName = versionDir.split('/').pop()!
    await this.updatePackageJsonVersion(versionName)
  }

  private async getExistingVersions (): Promise<string[]> {
    const contractsDir = join(this.projectRoot, 'contracts')

    if (!existsSync(contractsDir)) {
      return []
    }

    const entries = await readdir(contractsDir, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()
  }

  private getLatestVersion (versions: string[]): string | null {
    if (versions.length === 0) return null

    // Semantic version sorting
    return versions.sort((a, b) => {
      const aParts = a.split('.').map(Number)
      const bParts = b.split('.').map(Number)

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0
        const bPart = bParts[i] || 0
        if (aPart !== bPart) return aPart - bPart
      }
      return 0
    }).pop() || null
  }

  private async getLastCompleteVersion (versions: string[]): Promise<string | null> {
    if (versions.length === 0) return null

    // Sort versions semantically and check from latest to oldest for completeness
    const sortedVersions = versions.sort((a, b) => {
      const aParts = a.split('.').map(Number)
      const bParts = b.split('.').map(Number)

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0
        const bPart = bParts[i] || 0
        if (aPart !== bPart) return aPart - bPart
      }
      return 0
    }).reverse()

    for (const version of sortedVersions) {
      const versionDir = join(this.projectRoot, 'contracts', version)
      if (existsSync(versionDir)) {
        const files = await readdir(versionDir)

        // Check if this version has all 3 main contracts (group, identity, chatroom)
        const hasGroup = files.some(f => f === 'group.js')
        const hasIdentity = files.some(f => f === 'identity.js')
        const hasChatroom = files.some(f => f === 'chatroom.js')

        if (hasGroup && hasIdentity && hasChatroom) {
          console.log(colors.gray(`Using complete version ${version} as baseline (has all contracts)`))
          return version
        }
      }
    }

    console.log(colors.yellow('Warning: No complete version found, using latest version'))
    return this.getLatestVersion(versions)
  }

  private async hasContractChanged (newFilePath: string, existingFilePath: string): Promise<boolean> {
    if (!existsSync(existingFilePath)) {
      return true // File doesn't exist in previous version, so it's "changed"
    }

    try {
      const newContent = await readFile(newFilePath, 'utf8')
      const existingContent = await readFile(existingFilePath, 'utf8')

      return newContent !== existingContent
    } catch (error) {
      console.warn(colors.yellow(`Warning: Could not compare ${newFilePath}`), error)
      return true // Assume changed if we can't compare
    }
  }
}

export async function pin (args: string[]) {
  const { version, directory, options } = parsePinArgs(args)

  if (!version) {
    console.error(colors.red('Error: Version is required'))
    console.log(colors.blue('Usage: chel pin <version> [options]'))
    process.exit(1)
  }

  const pinner = new ContractPinner(directory, options)

  try {
    await pinner.pin(version)
  } catch (error) {
    console.error(colors.red('Pin failed:'), error)
    process.exit(1)
  }
}

function parsePinArgs (args: string[]): { version: string; directory: string; options: PinOptions } {
  const parsed = flags.parse(args, {
    boolean: ['overwrite', 'only-changed'],
    default: {
      overwrite: false,
      'only-changed': true // Default to improved behavior
    },
    alias: {
      o: 'overwrite',
      c: 'only-changed'
    }
  })

  const version = parsed._[0]?.toString() || ''
  const directory = parsed._[1]?.toString() || '.'
  const options: PinOptions = {
    overwrite: parsed.overwrite,
    'only-changed': parsed['only-changed']
  }

  return { version, directory, options }
}

import { flags, colors } from './deps.ts'
import process from 'node:process'
import { deploy } from './deploy.ts'
import { readdir, mkdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

interface ServeOptions {
  dp?: number
  port?: number
  'db-type'?: string
  'db-location'?: string
}

// Dashboard server function
async function startDashboardServer (port: number) {

  // Import and start the dashboard server
  const dashboardServer = await import('./serve/dashboard-server.ts')
  await dashboardServer.startDashboard(port)
}

/**
 * Parse manifest file to extract contract information
 * @param manifestPath - Path to the manifest file
 * @returns Object containing contract name, version, and file information
 */
async function parseManifest (manifestPath: string): Promise<{ contractName: string, version: string, fullContractName: string } | null> {
  try {
    const manifestContent = await readFile(manifestPath, 'utf8')
    const manifest = JSON.parse(manifestContent)
    const body = JSON.parse(manifest.body)

    const fullContractName = body.name
    const version = body.version
    const mainFile = body.contract.file

    if (!fullContractName || !mainFile || !version) {
      return null
    }

    // Extract just the contract name part (after the last slash)
    // e.g., "gi.contracts/group" -> "group"
    const contractName = fullContractName.split('/').pop() || fullContractName

    return {
      contractName,
      version,
      fullContractName
    }
  } catch (error) {
    console.warn(colors.yellow(`⚠️  Failed to parse manifest ${manifestPath}: ${error instanceof Error ? error.message : error}`))
    return null
  }
}

/**
 * Preload all contract manifests into the database
 * This replicates the behavior of grunt serve's 'exec:chelProdDeploy'
 *
 * The purpose is to ensure that when the app processes old events that reference
 * historical contract versions, those contracts are available in the database
 * for clients to fetch and process messages with.
 */
async function preloadContracts (directory: string, dbLocation?: string): Promise<void> {
  console.log(colors.blue('📦 Preloading contract manifests into database...'))

  const contractsDir = join(directory, 'contracts')

  if (!existsSync(contractsDir)) {
    console.log(colors.yellow('⚠️  No contracts directory found, skipping contract preloading'))
    return
  }

  try {
    // Find and parse all manifest files in the contracts directory structure
    const manifestFiles: string[] = []
    const contractInfo: Array<{ path: string, contractName: string, version: string, fullContractName: string }> = []

    // New structure: contracts/<name>/<version>/*.manifest.json
    const contractNames = await readdir(contractsDir, { withFileTypes: true })

    for (const contractEntry of contractNames) {
      if (contractEntry.isDirectory()) {
        const contractPath = join(contractsDir, contractEntry.name)
        const versions = await readdir(contractPath, { withFileTypes: true })

        for (const versionEntry of versions) {
          if (versionEntry.isDirectory()) {
            const versionPath = join(contractPath, versionEntry.name)
            const files = await readdir(versionPath)

            // Find manifest files in this version directory
            const manifests = files.filter(f => f.endsWith('.manifest.json'))
            for (const manifest of manifests) {
              const manifestPath = join(versionPath, manifest)

              // Parse the manifest to extract contract information
              const parsed = await parseManifest(manifestPath)
              if (parsed) {
                manifestFiles.push(manifestPath)
                contractInfo.push({
                  path: manifestPath,
                  contractName: parsed.contractName,
                  version: parsed.version,
                  fullContractName: parsed.fullContractName
                })
              }
            }
          }
        }
      }
    }

    if (manifestFiles.length === 0) {
      console.log(colors.yellow('⚠️  No valid contract manifest files found'))
      return
    }

    console.log(colors.blue(`📋 Found ${manifestFiles.length} valid contract manifest(s) to deploy:`))

    // Log contract information for better visibility
    for (const info of contractInfo) {
      console.log(colors.gray(`   • ${info.fullContractName} v${info.version}`))
    }

    // Deploy all manifests to the database
    // Use the database location or default to 'data' directory
    // Make sure to use absolute paths to avoid URL parsing issues
    const deployTarget = dbLocation || resolve(join(directory, 'data'))

    // Ensure the target directory exists before deploying
    // This prevents the "Invalid URL" error when upload tries to determine the target type
    if (!existsSync(deployTarget)) {
      console.log(colors.blue(`📁 Creating deploy target directory: ${deployTarget}`))
      await mkdir(deployTarget, { recursive: true })
    }

    console.log(colors.gray(`Deploy target: ${deployTarget}`))
    await deploy([deployTarget, ...manifestFiles])

    console.log(colors.green(`✅ Successfully preloaded ${manifestFiles.length} contract(s) into database`))

  } catch (error) {
    console.error(colors.red('❌ Failed to preload contracts:'), error instanceof Error ? error.message : error)
    console.log(colors.yellow('⚠️  Server will continue without preloaded contracts'))
    // Don't throw - server can still start without preloaded contracts
  }
}

// Application server function
async function startApplicationServer (port: number, directory: string): Promise<void> {
  // Set environment variables that the server expects
  process.env.API_PORT = port.toString()
  process.env.CHELONIA_APP_DIR = directory

  // Import and start the application server
  const startServer = await import('./serve/index.ts')
  await startServer.default
}

export async function serve (args: string[]) {
  const { directory, options } = parseServeArgs(args)
  const {
    dp: dashboardPort = 8888,
    port: applicationPort = 8000,
    'db-type': dbType = 'mem',
    'db-location': dbLocation
  } = options

  console.log(colors.cyan('🚀 Starting Chelonia app server...'))
  console.log(colors.blue('Directory:'), directory || '')
  console.log(colors.blue('Dashboard port:'), dashboardPort)
  console.log(colors.blue('Application port:'), applicationPort)
  console.log(colors.blue('Database type:'), dbType)
  if (dbLocation) {
    console.log(colors.gray(`Database location: ${dbLocation}`))
  }

  try {
    // Step 1: Preload all contract manifests into the database
    // This replicates grunt serve's 'exec:chelProdDeploy' behavior
    console.log(colors.cyan('📦 Step 1: Preloading contracts...'))
    await preloadContracts(directory, dbLocation)

    // Step 2: Start dashboard server
    console.log(colors.cyan('🚀 Step 2: Starting dashboard server...'))
    try {
      await startDashboardServer(dashboardPort)
      console.log(colors.green(`✅ Dashboard server started on port ${dashboardPort}`))
    } catch (error) {
      console.error(colors.red('❌ Failed to start dashboard server:'), error)
      throw error
    }

    // Step 3: Start application server
    console.log(colors.cyan('🚀 Step 3: Starting application server...'))
    try {
      await startApplicationServer(applicationPort, directory)
      console.log(colors.green(`✅ Application server started on port ${applicationPort}`))
    } catch (error) {
      console.error(colors.red('❌ Failed to start application server:'), error)
      throw error
    }

    console.log(colors.green('✅ Both servers started successfully!'))
    console.log(colors.yellow(`📊 Dashboard: http://localhost:${dashboardPort}`))
    console.log(colors.yellow(`🌐 Application: http://localhost:${applicationPort}`))

    await new Promise(() => {})
  } catch (error) {
    console.error(colors.red('❌ Failed to start server:'), error)
    process.exit(1)
  }
}

export function parseServeArgs (args: string[]): { directory: string; options: ServeOptions } {
  const parsed = flags.parse(args, {
    string: ['dp', 'port', 'db-type', 'db-location'],
    default: {
      dp: '8888',
      port: '8000',
      'db-type': 'mem'
    }
  })

  const directory = parsed._[0] as string || '.'

  const options: ServeOptions = {
    dp: parseInt(parsed.dp),
    port: parseInt(parsed.port),
    'db-type': parsed['db-type'],
    'db-location': parsed['db-location']
  }

  return { directory, options }
}

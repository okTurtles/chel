import { flags, colors } from './deps.ts'
import { exit } from './utils.ts'
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import process from 'node:process'

let projectRoot: string
let cheloniaConfig: { contracts: Record<string, { version: string, path: string }> }

function sanitizeContractName (contractName: string): string {
  return contractName.replace(/[/\\:*?"<>|]/g, '_')
}

export async function pin (args: string[]): Promise<void> {
  const parsedArgs = flags.parse(args, {
    boolean: ['overwrite', 'only-changed'],
    alias: {
      o: 'overwrite',
      c: 'only-changed'
    }
  })

  const version = parsedArgs._[0]?.toString()
  const manifestPath = parsedArgs._[1]?.toString()
  projectRoot = process.cwd()

  // If no arguments, show usage
  if (!version) {
    await loadCheloniaConfig()
    showUsage()
    return
  }

  const options = {
    overwrite: parsedArgs.overwrite as boolean,
    onlyChanged: parsedArgs['only-changed'] as boolean
  }

  try {
    if (!manifestPath) {
      await loadCheloniaConfig()
      showUsage()
      return
    }

    console.log(colors.cyan(`📌 Requesting pin to version: ${version}`))
    console.log(colors.gray(`Manifest: ${manifestPath}`))

    await loadCheloniaConfig()

    const fullManifestPath = join(projectRoot, manifestPath)
    if (!existsSync(fullManifestPath)) {
      exit(`Manifest file not found: ${manifestPath}`)
    }

    const { contractName, contractFiles, manifestVersion } = await parseManifest(fullManifestPath)
    console.log(colors.blue(`Contract name: ${contractName}`))
    console.log(colors.blue(`Manifest version: ${manifestVersion}`))

    if (version !== manifestVersion) {
      console.log(colors.red(`❌ Version mismatch: CLI version (${version}) does not match manifest version (${manifestVersion})`))
      console.log(colors.yellow(`💡 To pin this contract, use: chel pin ${manifestVersion} ${manifestPath}`))
      return
    }

    console.log(colors.green(`✅ Version validation passed: ${version}`))

    const currentPinnedVersion = cheloniaConfig.contracts[contractName]?.version
    if (currentPinnedVersion === version) {
      console.log(colors.yellow(`✨ Contract ${contractName} is already pinned to version ${version} - no action needed`))
      return
    }

    if (currentPinnedVersion) {
      console.log(colors.cyan(`📌 Updating ${contractName} from version ${currentPinnedVersion} to ${version}`))
    } else {
      console.log(colors.cyan(`📌 Pinning ${contractName} to version ${version} (first time)`))
    }

    const contractVersionDir = join(projectRoot, 'contracts', contractName, version)

    if (existsSync(contractVersionDir)) {
      if (!options.overwrite && !options.onlyChanged) {
        exit(`Version ${version} already exists for contract ${contractName}. Use --overwrite to replace it, or --only-changed to update only changed files`)
      }
      console.log(colors.yellow(`Version ${version} already exists for ${contractName} - checking files...`))
    } else {
      await createVersionDirectory(contractName, version)
    }

    await copyContractFiles(manifestPath, contractFiles, contractName, version, options)
    await updateCheloniaConfig(contractName, version, manifestPath)

    console.log(colors.green(`✅ Successfully pinned ${contractName} to version ${version}`))
    console.log(colors.gray(`Location: contracts/${contractName}/${version}/`))
  } catch (error) {
    exit(error)
  }
}

async function parseManifest (manifestPath: string) {
  const manifestContent = await readFile(manifestPath, 'utf8')
  const manifest = JSON.parse(manifestContent)
  const body = JSON.parse(manifest.body)

  const fullContractName = body.name
  const manifestVersion = body.version
  const mainFile = body.contract.file
  const slimFile = body.contractSlim?.file

  if (!fullContractName || !mainFile || !manifestVersion) {
    throw new Error('Invalid manifest: missing contract name, main file, or version')
  }

  const contractName = sanitizeContractName(fullContractName)

  return {
    contractName,
    manifestVersion,
    contractFiles: {
      main: mainFile,
      slim: slimFile
    }
  }
}

function showUsage () {
  console.log(colors.cyan('📋 Contract Pinning Usage:'))
  console.log(colors.gray('Usage: chel pin <version> <manifest-file-path>'))
  console.log()
  console.log(colors.yellow('📝 Note: Specify the full path to your manifest file.'))
  console.log(colors.gray('   Generate manifests first using: chel manifest <contract-file>'))
  console.log(colors.gray('   Example: chel pin 1.0.0 ./dist/contracts/chatroom.1.0.0.manifest.json'))
  console.log()

  if (Object.keys(cheloniaConfig.contracts).length > 0) {
    console.log(colors.cyan('📌 Currently pinned contracts:'))
    for (const [name, config] of Object.entries(cheloniaConfig.contracts)) {
      console.log(`  ${colors.green(name)} - ${colors.blue(config.version)} (${colors.gray(config.path)})`)
    }
    console.log()
  } else {
    console.log(colors.gray('No contracts currently pinned.'))
    console.log()
  }
}

async function createVersionDirectory (contractName: string, version: string) {
  const versionDir = join(projectRoot, 'contracts', contractName, version)
  console.log(colors.blue(`📁 Creating directory: contracts/${contractName}/${version}/`))
  await mkdir(versionDir, { recursive: true })
}

async function copyContractFiles (
  manifestPath: string,
  contractFiles: { main: string, slim?: string },
  contractName: string,
  version: string,
  options: { overwrite: boolean, onlyChanged: boolean }
) {
  const sourceDir = dirname(join(projectRoot, manifestPath))
  const targetDir = join(projectRoot, 'contracts', contractName, version)

  console.log(colors.gray(`📋 Copying files from manifest: ${contractFiles.main}${contractFiles.slim ? `, ${contractFiles.slim}` : ''}`))

  const mainSource = join(sourceDir, contractFiles.main)
  const mainTarget = join(targetDir, contractFiles.main)
  await copyFileIfNeeded(mainSource, mainTarget, contractFiles.main, options)

  if (contractFiles.slim) {
    const slimSource = join(sourceDir, contractFiles.slim)
    const slimTarget = join(targetDir, contractFiles.slim)
    try {
      await copyFileIfNeeded(slimSource, slimTarget, contractFiles.slim, options)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.log(colors.yellow(`⚠️  Could not copy slim file: ${errorMessage}`))
    }
  }
}

async function copyFileIfNeeded (
  sourcePath: string,
  targetPath: string,
  fileName: string,
  options: { overwrite: boolean, onlyChanged: boolean }
) {
  const targetExists = existsSync(targetPath)

  if (!targetExists) {
    console.log(colors.blue(`📄 Copying: ${fileName} (new file)`))
    await copyFile(sourcePath, targetPath)
    return
  }

  if (targetExists && !options.overwrite) {
    console.log(colors.yellow(`⏭️  Skipping: ${fileName} (already exists, use --overwrite to replace)`))
    return
  }

  if (options.onlyChanged) {
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

  console.log(colors.blue(`📄 Copying: ${fileName} (overwriting)`))
  await copyFile(sourcePath, targetPath)
}

async function loadCheloniaConfig () {
  const configPath = join(projectRoot, 'chelonia.json')
  cheloniaConfig = { contracts: {} }

  if (existsSync(configPath)) {
    try {
      const configContent = await readFile(configPath, 'utf8')
      cheloniaConfig = JSON.parse(configContent)
      console.log(colors.blue('📄 Loaded existing chelonia.json'))
    } catch (error) {
      console.warn(colors.yellow(`Warning: Could not parse chelonia.json: ${error}`))
    }
  } else {
    console.log(colors.blue('📄 Creating new chelonia.json'))
  }

  if (!cheloniaConfig.contracts) {
    cheloniaConfig.contracts = {}
  }
}

async function updateCheloniaConfig (contractName: string, version: string, manifestPath: string) {
  const manifestFileName = basename(manifestPath)
  const pinnedManifestPath = `contracts/${contractName}/${version}/${manifestFileName}`

  cheloniaConfig.contracts[contractName] = {
    version,
    path: pinnedManifestPath
  }

  const configPath = join(projectRoot, 'chelonia.json')
  const configContent = JSON.stringify(cheloniaConfig, null, 2) + '\n'

  await writeFile(configPath, configContent, 'utf8')
  console.log(colors.green('✅ Updated chelonia.json'))
}

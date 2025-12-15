import * as colors from 'jsr:@std/fmt/colors'
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import process from 'node:process'
import type { ArgumentsCamelCase, CommandModule } from './commands.ts'
import { exit } from './utils.ts'

type Params = { overwrite: boolean, 'dir'?: string, 'manifest-version'?: string, manifest: string }

let projectRoot: string
let cheloniaConfig: { contracts: Record<string, { version: string, path: string }> }

function sanitizeContractName (contractName: string): string {
  return contractName.replace(/[/\\:*?"<>|]/g, '_').replace(/\.\./g, '__')
}

export async function pin (args: ArgumentsCamelCase<Params>): Promise<void> {
  const version = args['manifest-version']
  const manifestPath = args.manifest
  projectRoot = args['dir'] || process.cwd()

  try {
    if (!manifestPath) {
      await loadCheloniaConfig()
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

    if (version) {
      if (version !== manifestVersion) {
        console.error(colors.red(`❌ Version mismatch: CLI version (${version}) does not match manifest version (${manifestVersion})`))
        console.error(colors.yellow(`💡 To pin this contract, use: chel pin ${manifestVersion} ${manifestPath}`))
        exit('Version mismatch between CLI and manifest')
      }

      console.log(colors.green(`✅ Version validation passed: ${version}`))
    }

    const currentPinnedVersion = cheloniaConfig.contracts[contractName]?.version
    if (currentPinnedVersion === manifestVersion) {
      console.log(colors.yellow(`✨ Contract ${contractName} is already pinned to version ${manifestVersion} - no action needed`))
      return
    }

    if (currentPinnedVersion) {
      console.log(colors.cyan(`📌 Updating ${contractName} from version ${currentPinnedVersion} to ${manifestVersion}`))
    } else {
      console.log(colors.cyan(`📌 Pinning ${contractName} to version ${manifestVersion} (first time)`))
    }

    const contractVersionDir = join(projectRoot, 'contracts', contractName, manifestVersion)

    if (existsSync(contractVersionDir)) {
      if (!args.overwrite) {
        exit(`Version ${manifestVersion} already exists for contract ${contractName}. Use --overwrite to replace it.`)
      }
      console.log(colors.yellow(`Version ${manifestVersion} already exists for ${contractName} - checking files...`))
    } else {
      await createVersionDirectory(contractName, manifestVersion)
    }

    await copyContractFiles(contractFiles, manifestPath, contractName, manifestVersion, args)
    await updateCheloniaConfig(contractName, manifestVersion, manifestPath)

    console.log(colors.green(`✅ Successfully pinned ${contractName} to version ${version}`))
    console.log(colors.gray(`Location: contracts/${contractName}/${manifestVersion}/`))
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
    console.error(colors.red('❌ Invalid manifest: missing contract name, main file, or version'))
    exit('Invalid manifest: missing contract name, main file, or version')
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

async function createVersionDirectory (contractName: string, version: string) {
  const versionDir = join(projectRoot, 'contracts', contractName, version)
  console.log(colors.blue(`📁 Creating directory: contracts/${contractName}/${version}/`))
  await mkdir(versionDir, { recursive: true })
}

async function copyContractFiles (
  contractFiles: { main: string, slim?: string },
  manifestPath: string,
  contractName: string,
  version: string,
  args: ArgumentsCamelCase<Params>
) {
  const sourceDir = dirname(join(projectRoot, manifestPath))
  const targetDir = join(projectRoot, 'contracts', contractName, version)

  console.log(colors.gray(`📋 Copying files from manifest: ${contractFiles.main}${contractFiles.slim ? `, ${contractFiles.slim}` : ''}, manifest`))

  // First, copy the contract files to the target directory
  const mainSource = join(sourceDir, contractFiles.main)
  const mainTarget = join(targetDir, contractFiles.main)
  await copyFileIfNeeded(mainSource, mainTarget, contractFiles.main, args)

  if (contractFiles.slim) {
    const slimSource = join(sourceDir, contractFiles.slim)
    const slimTarget = join(targetDir, contractFiles.slim)
    try {
      await copyFileIfNeeded(slimSource, slimTarget, contractFiles.slim, args)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(colors.yellow(`⚠️  Could not copy slim file: ${errorMessage}`))
    }
  }

  // Then, copy or re-sign the manifest file (after contract files are in place)
  const manifestSource = join(projectRoot, manifestPath)
  const manifestTarget = join(targetDir, basename(manifestPath))

  await copyFileIfNeeded(manifestSource, manifestTarget, basename(manifestPath), args)
}

async function copyFileIfNeeded (
  sourcePath: string,
  targetPath: string,
  fileName: string,
  args: ArgumentsCamelCase<Params>
) {
  const targetExists = existsSync(targetPath)

  if (!targetExists) {
    console.log(colors.blue(`📄 Copying: ${fileName} (new file)`))
    await copyFile(sourcePath, targetPath)
    return
  }

  if (targetExists && !args.overwrite) {
    console.log(colors.yellow(`⏭️  Skipping: ${fileName} (already exists, use --overwrite to replace)`))
    return
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
    console.log(colors.blue('📄 No existing chelonia.json found'))
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
  console.log(colors.green('✅ Saved chelonia.json'))
}

export const module = {
  builder: (yargs) => {
    return yargs
      .option('overwrite', {
        default: false,
        describe: 'Overwrite existing files',
        requiresArg: false,
        boolean: true
      })
      .alias('o', 'overwrite')
      .option('dir', {
        default: false,
        describe: 'Output directory',
        requiresArg: false,
        string: true
      })
      .alias('d', 'dir')
      .positional('manifest', {
        describe: 'Manifest file path',
        demandOption: true,
        type: 'string'
      })
      .positional('manifest-version', {
        describe: 'Manifest version',
        demandOption: false,
        type: 'string'
      })
  },
  command: 'pin <manifest> [<manifest-version>]',
  describe: 'Pin a manifest version',
  postHandler: (argv) => {
    return pin(argv)
  }
} as CommandModule<object, Params>

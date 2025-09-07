// Node.js-based dashboard build using Group Income's Vue esbuild plugin approach
// Uses Node.js to avoid Deno compatibility issues with @vue/component-compiler

import { sassPlugin } from 'npm:esbuild-sass-plugin@3.3.1'
import fs from 'node:fs'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import componentCompiler, { type SFCCompiler, type StyleCompileResult, type DescriptorCompileResult } from 'npm:@vue/component-compiler'
import esbuild from 'npm:esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Environment variables setup (following Group Income pattern)
const {
  CI = '',
  LIGHTWEIGHT_CLIENT = 'true',
  NODE_ENV = 'development',
  EXPOSE_SBP = '',
  ENABLE_UNSAFE_NULL_CRYPTO = 'false',
  UNSAFE_TRUST_ALL_MANIFEST_SIGNING_KEYS = 'false'
} = process.env

// Read package.json for version info
const packageJSON = JSON.parse(fs.readFileSync(join(__dirname, '../package.json'), 'utf8'))
const CONTRACTS_VERSION = packageJSON.contractsVersion || '2.0.0'
const CHEL_VERSION = packageJSON.version

// Fix for __proto__ issue with buble (used by @vue/component-compiler)
// See: https://github.com/denoland/deno/issues/20618
if (({} as Record<PropertyKey, unknown>).__proto__ !== Object.prototype) {
  Object.defineProperty(Object.prototype, '__proto__', {
    get () {
      return Object.getPrototypeOf(this)
    },
    set (v) {
      Object.setPrototypeOf(this, v)
    }
  })
}

// Alias replacer function (adapted from Group Income's utils.js)
function createAliasReplacer (aliases: Record<string, string>) {
  if (Object.keys(aliases).some(alias => alias.includes('/'))) {
    throw new Error('Path aliases may not include slash characters.')
  }

  const cwd = process.cwd()
  const escapeForRegExp = (string: string) => string.replace(/[.*+?^${}()|\\[\]]/g, '\\$&')
  const escapedAndSortedAliases = Object.keys(aliases).map(escapeForRegExp).sort().reverse()
  const re = new RegExp(
    `(?:^import[ (]|\\bimport[ (]|import .+? from |^\\} from )['"](${ escapedAndSortedAliases.join('|')})(?:['"]|/[^'"]+?['"])`,
    'gm'
  )

  return function aliasReplacer ({ path, source }: { path: string, source: string }) {
    const relativeDirPath = relative(dirname(path), cwd)

    return source.replace(re, (match, capture) => {
      const resolvedPathSegment = aliases[capture]
      const replacement = join(relativeDirPath, resolvedPathSegment)
        .replace(/\\/g, '/')

      return match.replace(capture, replacement)
    })
  }
}

// Copy index.html to output directory
async function copyIndexHtml (outDir: string) {
  try {
    const sourceHtml = join(__dirname, '../src/serve/dashboard/index.html')
    const targetHtml = join(outDir, 'index.html')

    // Read the source HTML
    const htmlContent = await readFile(sourceHtml, 'utf8')

    // Write the HTML to output directory
    await writeFile(targetHtml, htmlContent, 'utf8')
    console.log('📄 index.html copied')
  } catch (error) {
    console.error('❌ Failed to copy index.html:', error)
    throw error
  }
}

// Vue plugin adapted from Group Income's approach with proper SCSS extraction
function vuePlugin ({ aliases = {} } = {}) {
  const aliasReplacer = Object.keys(aliases).length > 0 ? createAliasReplacer(aliases) : null
  const extractedStyles: string[] = []
  const compiler = componentCompiler.createDefaultCompiler()

  return {
    name: 'vue',
    setup (build) {
      build.onLoad({ filter: /[^/]\.vue$/ }, async ({ path }) => {
        let source = await readFile(path, 'utf8')

        if (aliasReplacer) {
          source = aliasReplacer({ path, source })
        }

        // Handle @assets alias in SCSS imports with context-aware relative paths
        const assetsPath = resolve(__dirname, '../src/serve/dashboard/assets')
        const componentDir = dirname(path)
        const relativePath = relative(componentDir, assetsPath).replace(/\\/g, '/')
        source = source.replace(/@import\s+["']@assets\//g, `@import "${relativePath}/`)

        try {
          const result = await compile({ filename: path, source, compiler, extractedStyles })

          return { contents: result.contents }
        } catch (error) {
          return { errors: [convertError(error)] }
        }
      })
    }
  } as esbuild.Plugin
}

// Helper function to find all Vue files
async function findVueFiles (dir: string) {
  const files: string[] = []

  async function walk (currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith('.vue')) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

function compile ({ filename, source, compiler }: { filename: string, source: string, compiler: SFCCompiler, extractedStyles?: string[] }) {
  try {
    if (/^\s*$/.test(source)) {
      throw new Error('File is empty')
    }

    const descriptor = compiler.compileToDescriptor(filename, source)
    const errors = combineErrors(descriptor.template, ...descriptor.styles)

    if (errors.length > 0) {
      return { errors }
    }

    const output = componentCompiler.assemble(compiler, source, descriptor, {})
    return { contents: output.code }
  } catch (error) {
    return {
      errors: [
        {
          text: `Could not compile Vue single-file component: ${error}`,
          detail: error
        }
      ]
    }
  }
}

function combineErrors (...outputs: (DescriptorCompileResult['template'] | StyleCompileResult)[]) {
  return outputs.map((output) => {
    if (!output || !output.errors) {
      return []
    }
    return output.errors.map((error) => convertError(error))
  }).flat()
}

function convertError (error: unknown) {
  if (typeof error === 'string') {
    return { text: error }
  }
  if (error instanceof Error) {
    return { text: error.message }
  }
  throw new Error(`Cannot convert Vue compiler error: ${error}`)
}

const dashboardDir = 'src/serve/dashboard'
const outDir = 'dist-dashboard'

// Path aliases are defined inline in the esbuild config

async function build () {
  console.log('🚀 Starting dashboard build...')

  const mainScssPath = join(dashboardDir, 'assets/style/main.scss')

  const entryPoints = [
    join(dashboardDir, 'main.ts'),
    mainScssPath
  ]

  try {
    const result = await esbuild.build({
      entryPoints,
      bundle: true,
      outdir: outDir,
      format: 'esm',
      target: 'es2020',
      platform: 'browser',
      splitting: true,
      chunkNames: 'assets/js/[name]-[hash]',
      entryNames: 'assets/js/[name]',
      assetNames: 'assets/fonts/[name]',
      sourcemap: false,
      minify: false,
      define: {
        'process.env.BUILD': 'web', // Required by Vuelidate
        'process.env.CI': `'${CI}'`,
        'process.env.CONTRACTS_VERSION': `'${CONTRACTS_VERSION}'`,
        'process.env.CHEL_VERSION': `'${CHEL_VERSION}'`,
        'process.env.LIGHTWEIGHT_CLIENT': `'${LIGHTWEIGHT_CLIENT}'`,
        'process.env.NODE_ENV': `'${NODE_ENV}'`,
        'process.env.EXPOSE_SBP': `'${EXPOSE_SBP}'`,
        'process.env.ENABLE_UNSAFE_NULL_CRYPTO': `'${ENABLE_UNSAFE_NULL_CRYPTO}'`,
        'process.env.UNSAFE_TRUST_ALL_MANIFEST_SIGNING_KEYS': `'${UNSAFE_TRUST_ALL_MANIFEST_SIGNING_KEYS}'`,
        // Define NODE_ENV directly for router.ts
        'NODE_ENV': `'${NODE_ENV}'`
      },
      alias: {
        '@common': './src/serve/dashboard/common',
        '@model': './src/serve/dashboard/model',
        '@controller': './src/serve/dashboard/controller',
        '@view-utils': './src/serve/dashboard/views/utils',
        '@views': './src/serve/dashboard/views',
        '@components': './src/serve/dashboard/views/components',
        '@containers': './src/serve/dashboard/views/containers',
        '@pages': './src/serve/dashboard/views/pages',
        '@forms': './src/serve/dashboard/views/components/forms',
        '@validators': './src/serve/dashboard/views/utils/validators',
        '@assets': './src/serve/dashboard/assets'
      },
      loader: {
        '.vue': 'js', // Will be handled by our Vue plugin
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.svg': 'file',
        '.woff': 'file',
        '.woff2': 'file',
        '.ttf': 'file',
        '.eot': 'file'
      },
      external: [

      ],
      plugins: [
        sassPlugin({
          type: 'css',
        }),
        vuePlugin({ aliases: {} }),
        // Plugin to resolve npm: prefixes (as suggested by @corrideat)
        {
          name: 'npm-prefix-resolver',
          setup (build) {
            build.onResolve({ filter: /^npm:/ }, args => {
              if (args.namespace !== 'file') return
              const { path, ...extra } = args
              return build.resolve(path.slice(4), extra)
            })
          }
        } as esbuild.Plugin
      ]
    })

    if (result.errors.length > 0) {
      console.error('❌ Build errors:', result.errors)
      return false
    }

    if (result.warnings.length > 0) {
      console.warn('⚠️ Build warnings:', result.warnings)
    }

    // Move CSS files from assets/js/ to assets/css/
    const jsDir = join(outDir, 'assets', 'js')
    const cssDir = join(outDir, 'assets', 'css')

    // Ensure CSS directory exists
    await mkdir(cssDir, { recursive: true })

    // Move CSS files
    if (fs.existsSync(jsDir)) {
      const files = fs.readdirSync(jsDir)
      for (const file of files) {
        if (file.endsWith('.css')) {
          const srcPath = join(jsDir, file)
          const destPath = join(cssDir, file)
          fs.renameSync(srcPath, destPath)
          console.log(`📄 Moved ${file} from assets/js/ to assets/css/`)
        }
      }
    }

    // Copy and update index.html
    await copyIndexHtml(outDir)

    console.log('✅ Dashboard build completed successfully!')
    console.log(`📦 Output directory: ${outDir}`)

    // Log bundle analysis
    if (result.metafile) {
      const analysis = await esbuild.analyzeMetafile(result.metafile)
      console.log('📊 Bundle analysis:')
      console.log(analysis)
    }

    return true
  } catch (error) {
    console.error('❌ Dashboard build failed:', error)
    return false
  }
}

await build()

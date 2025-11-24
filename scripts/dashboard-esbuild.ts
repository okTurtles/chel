// Node.js-based dashboard build using Group Income's Vue esbuild plugin approach
// Uses Node.js to avoid Deno compatibility issues with @vue/component-compiler

import { sassPlugin } from 'npm:esbuild-sass-plugin@3.3.1'
import fs from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import esbuild from 'npm:esbuild'
import { vuePlugin } from './esbuild-plugins/vue-plugin.ts'

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

const dashboardDir = 'src/serve/dashboard'
const outDir = 'build/dist-dashboard'

// Path aliases are defined inline in the esbuild config

async function build () {
  console.log('🚀 Starting dashboard build...')

  const mainScssPath = join(dashboardDir, 'assets/style/main.scss')

  const entryPoints = [
    join(dashboardDir, 'main.ts'),
    mainScssPath
  ]

  const alias = {
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
  }

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
        'process.env.LIGHTWEIGHT_CLIENT': `'${LIGHTWEIGHT_CLIENT}'`,
        'process.env.NODE_ENV': `'${NODE_ENV}'`,
        'process.env.EXPOSE_SBP': `'${EXPOSE_SBP}'`,
        'process.env.ENABLE_UNSAFE_NULL_CRYPTO': `'${ENABLE_UNSAFE_NULL_CRYPTO}'`,
        'process.env.UNSAFE_TRUST_ALL_MANIFEST_SIGNING_KEYS': `'${UNSAFE_TRUST_ALL_MANIFEST_SIGNING_KEYS}'`
      },
      alias,
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
          type: 'css'
        }),
        vuePlugin({ aliases: alias }),
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

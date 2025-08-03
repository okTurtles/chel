#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env --allow-net --unstable

/**
 * Dashboard build script
 * Re-implements the logic of the old Gruntfile.dashboard.js in a Deno-native way.
 * - Bundles the Vue 2 SPA that lives under src/serve/dashboard/
 * - Emits JS + CSS + static assets into build/dashboard/**
 *   so they can later be copied into the release tar during scripts/compile.ts
 *
 * Usage:
 *   deno run --allow-read --allow-write --allow-run --allow-env --allow-net scripts/dashboard-build.ts [--watch]
 */

import { join, dirname, fromFileUrl } from 'jsr:@std/path@1.1.1'
import { copy, emptyDir, ensureDir } from 'jsr:@std/fs@1.0.19'
import * as esbuild from 'npm:esbuild@0.25.6'
import { precompileVueFiles } from './vue-precompile.ts'

const projectRoot = dirname(dirname(fromFileUrl(import.meta.url))) // /Users/.../chel
const dashboardRoot = join(projectRoot, 'src', 'serve', 'dashboard')
const vueCompiledDir = join(projectRoot, '.vue-compiled')
const buildDir = join(projectRoot, 'dist-dashboard')
const distAssetsDir = join(buildDir, 'assets')
const distJSDir = join(distAssetsDir, 'js')
const distCSSDir = join(distAssetsDir, 'css')

await emptyDir(buildDir)
await ensureDir(distJSDir)
await ensureDir(distCSSDir)

// Step 1: Precompile Vue SFCs
log('🔄 Precompiling Vue single-file components...')
await precompileVueFiles()

const isWatch = Deno.args.includes('--watch')
const NODE_ENV = Deno.env.get('NODE_ENV') || (isWatch ? 'development' : 'production')

// Helpers ---------------------------------------------------------
function log (...args: unknown[]) {
  console.log('[dashboard-build]', ...args)
}

// Copy static assets & index.html --------------------------------
async function copyStatic () {
  await copy(join(dashboardRoot, 'index.html'), join(buildDir, 'index.html'), { overwrite: true })
  // copy everything in assets except style (scss will be compiled)
  await copy(join(dashboardRoot, 'assets'), distAssetsDir, {
    overwrite: true,
    filter: (src: string) => {
      const rel = src.replace(dashboardRoot + '/', '')
      // Skip style directory – scss handled separately
      return !rel.startsWith('assets/style/')
    },
  })
}
await copyStatic()

// esbuild bundling ------------------------------------------------
const buildOptions: Parameters<typeof esbuild.build>[0] = {
  entryPoints: [
    join(vueCompiledDir, 'main.js'), // Use precompiled entry point
    join(dashboardRoot, 'assets', 'style', 'main.scss') // SCSS entry point for CSS generation
  ],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  sourcemap: NODE_ENV === 'development',
  minify: NODE_ENV === 'production',
  target: ['es2020'],
  outdir: buildDir, // Use outdir instead of outfile to allow multiple outputs
  entryNames: 'assets/js/[name]', // JS files go to assets/js/
  assetNames: 'assets/fonts/[name]', // Assets like fonts go to assets/fonts/
  chunkNames: 'assets/js/[name]-[hash]', // Chunk files
  define: { 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) },
  // Only mark dependencies as external if they are provided via CDN in index.html import map
  external: [
    // These are provided via CDN in index.html import map
    'vue',
    'vuex',
    'vue-router',
    'three',
    'vue-clickaway',
    '@sbp/sbp',
    'dompurify',
    'vuelidate',
    'pug'
    // All other dependencies (npm:, jsr:, etc.) will be bundled by esbuild
  ],
  alias: {
    // Dashboard-specific path aliases (pointing to precompiled versions)
    '@common': join(vueCompiledDir, 'common'),
    '@pages': join(vueCompiledDir, 'views', 'pages'),
    '@containers': join(vueCompiledDir, 'views', 'containers'),
    '@components': join(vueCompiledDir, 'views', 'components'),
    '@utils': join(vueCompiledDir, 'views', 'utils'),
    '@forms': join(vueCompiledDir, 'views', 'components', 'forms'),
    '@validators': join(vueCompiledDir, 'views', 'utils', 'validators.js'),
    '@assets': join(dashboardRoot, 'assets'), // Assets stay in original location
    '~/deps.js': join(vueCompiledDir, 'deps.js'), // Point to dashboard deps.js
    '~': join(projectRoot, 'src')
  },
  loader: {
    // Vue files are now precompiled to .js, no special handling needed
    '.eot': 'file',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.svg': 'file'
  },
  plugins: [
    // Handle node:process imports with browser-compatible shim
    {
      name: 'node-process-shim',
      setup (build: esbuild.PluginBuild) {
        build.onResolve({ filter: /^node:process$/ }, () => {
          return { path: 'process-shim', namespace: 'node-shim' }
        })
        build.onLoad({ filter: /.*/, namespace: 'node-shim' }, () => {
          return {
            contents: 'export default { env: {} }; export const env = {};',
            loader: 'js'
          }
        })
      }
    },
    // Warn about other server-side imports in dashboard code
    {
      name: 'server-import-warning',
      setup (build: esbuild.PluginBuild) {
        build.onResolve({ filter: /^(jsr:|npm:|@std\/|@hapi\/|@chelonia\/)/ }, (args: any) => {
          console.warn(`⚠️  Dashboard code is importing server-side dependency: ${args.path} in ${args.importer}`)
          return { path: args.path, external: true }
        })
      }
    },
    // SCSS -> CSS
    (await import('npm:esbuild-sass-plugin@3.3.1')).sassPlugin({
      sourceMap: NODE_ENV === 'development',
      outputStyle: NODE_ENV === 'development' ? 'expanded' : 'compressed',
      loadPaths: [join(dashboardRoot, 'assets', 'style')]
    })
  ],
  logLevel: 'warning'
}

if (isWatch) {
  // @ts-expect-error: esbuild types missing watch
  (buildOptions as any).watch = {
    onRebuild (error: any) {
      if (error) console.error('[dashboard] rebuild failed:', error)
      else {
        console.log('[dashboard] rebuild succeeded')
        copyStatic()
      }
    }
  }
}

try {
  const result = await esbuild.build(buildOptions)

  // Post-build: Move CSS file from js/ to css/ folder
  const cssInJsPath = join(buildDir, 'assets', 'js', 'main.css')
  const cssInCssPath = join(buildDir, 'assets', 'css', 'main.css')

  try {
    await Deno.stat(cssInJsPath)
    await Deno.rename(cssInJsPath, cssInCssPath)
    log('✅ Moved main.css from assets/js/ to assets/css/')
  } catch (error) {
    // CSS file might not exist or already be in the right place
    log('ℹ️  CSS file not found in js folder or already in correct location')
  }

  if (result.outputFiles && result.outputFiles.length > 0) {
    log('Dashboard build completed with output files:')
    result.outputFiles.forEach((file: any) => console.log(`  - ${file.path}`))
  } else {
    log('Dashboard build completed - no output files')
  }
} catch (error) {
  console.error('Dashboard build failed:', error)
  Deno.exit(1)
} finally {
  if (!isWatch) {
    esbuild.stop()
  }
}

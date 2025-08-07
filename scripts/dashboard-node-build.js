#!/usr/bin/env node

/**
 * Dashboard build script
 */

const esbuild = require('esbuild')
const { sassPlugin } = require('esbuild-sass-plugin')
const path = require('path')
const fs = require('fs')
const process = require('process')

const projectRoot = path.dirname(__dirname)
const dashboardRoot = path.join(projectRoot, 'src', 'serve', 'dashboard')
const buildDir = path.join(projectRoot, 'dist-dashboard')
const vueCompiledDir = path.join(projectRoot, '.vue-compiled')

const NODE_ENV = process.env.NODE_ENV || 'development'

console.log('🔧 Building dashboard with Node.js + esbuild...')
console.log(`📁 Dashboard root: ${dashboardRoot}`)
console.log(`📦 Build directory: ${buildDir}`)
console.log(`🌍 Environment: ${NODE_ENV}`)

// Clean and prepare directories
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true })
}
fs.mkdirSync(path.join(buildDir, 'assets', 'js'), { recursive: true })
fs.mkdirSync(path.join(buildDir, 'assets', 'css'), { recursive: true })
fs.mkdirSync(path.join(buildDir, 'assets', 'fonts'), { recursive: true })

// Copy static assets
function copyStatic() {
  const assetsDir = path.join(dashboardRoot, 'assets')
  const targetAssetsDir = path.join(buildDir, 'assets')
  
  if (fs.existsSync(assetsDir)) {
    fs.cpSync(assetsDir, targetAssetsDir, { recursive: true })
    console.log('✅ Static assets copied')
  }
  
  // Copy index.html
  const indexHtml = path.join(dashboardRoot, 'index.html')
  const targetIndex = path.join(buildDir, 'index.html')
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, targetIndex)
    console.log('✅ index.html copied')
  }
}

copyStatic()

// esbuild configuration
const buildOptions = {
  entryPoints: [
    path.join(vueCompiledDir, 'main.js'),
    path.join(dashboardRoot, 'assets', 'style', 'main.scss'),
    path.join(vueCompiledDir, 'combined-styles.scss') // Include extracted Vue component styles
  ],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  sourcemap: NODE_ENV === 'development',
  minify: NODE_ENV === 'production',
  target: ['es2020'],
  outdir: buildDir,
  entryNames: 'assets/js/[name]',
  assetNames: 'assets/fonts/[name]',
  chunkNames: 'assets/js/[name]-[hash]',
  define: { 
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'process.env': '{}' // Provide empty process.env for browser
  },
  // External dependencies (build-time only, not needed in browser)
  external: [
    'pug', // Build-time template compiler
    'fs', 'path', 'assert', 'os' // Node.js built-ins that shouldn't be in browser bundle
  ],
  alias: {
    // Dashboard-specific path aliases (pointing to precompiled versions)
    '@common': path.join(vueCompiledDir, 'common'),
    '@pages': path.join(vueCompiledDir, 'views', 'pages'),
    '@containers': path.join(vueCompiledDir, 'views', 'containers'),
    '@components': path.join(vueCompiledDir, 'views', 'components'),
    '@utils': path.join(vueCompiledDir, 'views', 'utils'),
    '@forms': path.join(vueCompiledDir, 'views', 'components', 'forms'),
    '@validators': path.join(vueCompiledDir, 'views', 'utils', 'validators.js'),
    '@assets': path.join(dashboardRoot, 'assets'),
    '~/deps.js': path.join(vueCompiledDir, 'deps.js'),
    '~': path.join(projectRoot, 'src')
  },
  loader: {
    '.eot': 'file',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.svg': 'file'
  },
  plugins: [
    // SCSS compilation plugin with proper import resolution
    sassPlugin({
      loadPaths: [path.join(dashboardRoot, 'assets', 'style')], // Allow SCSS to find _variables.scss
      importer: [
        // Custom importer to handle @assets alias
        function(url) {
          if (url.startsWith('@assets/')) {
            const resolvedPath = url.replace('@assets/', path.join(dashboardRoot, 'assets') + '/')
            return { file: resolvedPath }
          }
          return null
        }
      ]
    }),
    // Handle npm: imports by converting to regular npm package names
    {
      name: 'npm-import-resolver',
      setup(build) {
        build.onResolve({ filter: /^npm:/ }, (args) => {
          // Convert npm:package@version to just package
          const packageName = args.path.replace(/^npm:/, '').split('@')[0]
          return { path: packageName, external: false }
        })
      }
    },
    // Handle node:process imports
    {
      name: 'node-process-shim',
      setup(build) {
        build.onResolve({ filter: /^node:process$/ }, () => {
          return { path: 'process-shim', namespace: 'node-shim' }
        })
        
        build.onLoad({ filter: /.*/, namespace: 'node-shim' }, (args) => {
          if (args.path === 'process-shim') {
            return {
              contents: `
                export const env = ${JSON.stringify(process.env)};
                export default { env };
              `,
              loader: 'js'
            }
          }
        })
      }
    }
  ]
}

// Build with esbuild
async function build() {
  try {
    console.log('📦 Building with esbuild...')
    await esbuild.build(buildOptions)
    
    console.log('✅ Build completed successfully!')
    
    // Move CSS files to correct location
    const mainCssInJsPath = path.join(buildDir, 'assets', 'js', 'main.css')
    const mainCssInCssPath = path.join(buildDir, 'assets', 'css', 'main.css')
    const combinedCssInJsPath = path.join(buildDir, 'assets', 'js', 'combined-styles.css')
    const combinedCssInCssPath = path.join(buildDir, 'assets', 'css', 'combined-styles.css')
    
    // Ensure css directory exists
    const cssDir = path.join(buildDir, 'assets', 'css')
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true })
    }
    
    // Move main.css
    if (fs.existsSync(mainCssInJsPath)) {
      fs.renameSync(mainCssInJsPath, mainCssInCssPath)
      console.log('✅ Moved main.css from assets/js/ to assets/css/')
    }
    
    // Move combined-styles.css
    if (fs.existsSync(combinedCssInJsPath)) {
      fs.renameSync(combinedCssInJsPath, combinedCssInCssPath)
      console.log('✅ Moved combined-styles.css from assets/js/ to assets/css/')
    }
    
    // Verify bundle is clean
    const mainJsPath = path.join(buildDir, 'assets', 'js', 'main.js')
    if (fs.existsSync(mainJsPath)) {
      const bundleContent = fs.readFileSync(mainJsPath, 'utf8')
      const hasExternalUrls = bundleContent.includes('npm:') || bundleContent.includes('jsr:')
      
      if (hasExternalUrls) {
        console.warn('⚠️ Warning: Bundle still contains npm: or jsr: URLs')
      } else {
        console.log('✅ Bundle is clean - no external URLs found')
      }
      
      console.log(`📊 Bundle size: ${(bundleContent.length / 1024).toFixed(1)}KB`)
    }
    
    console.log('🎉 Dashboard build complete!')
    console.log(`📦 Output directory: ${buildDir}`)
    
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

build()

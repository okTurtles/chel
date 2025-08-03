#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net

/**
 * Vue 2 SFC Precompiler
 *
 * Transforms .vue single-file components into .js files using vue-template-compiler
 * This matches the approach used by Group Income's Grunt-based build system.
 *
 * Usage:
 *   deno run --allow-read --allow-write --allow-env --allow-net scripts/vue-precompile.ts
 */

import { join, dirname, relative } from 'jsr:@std/path@1.1.1'
import { walk, ensureDir } from 'jsr:@std/fs@1.0.19'
import * as vueCompiler from 'npm:vue-template-compiler@2.7.16'
const { compile, parseComponent } = await import('npm:vue-template-compiler@2.7.16')
import { pug } from '~/deps.ts'
import * as esbuild from 'npm:esbuild@0.25.6'

const projectRoot = dirname(dirname(new URL(import.meta.url).pathname))
const dashboardRoot = join(projectRoot, 'src', 'serve', 'dashboard')
const tempDir = join(projectRoot, '.vue-compiled')

// Ensure temp directory exists
await Deno.mkdir(tempDir, { recursive: true })

interface VueDescriptor {
  template?: {
    content: string
    attrs: Record<string, string>
  }
  script?: {
    content: string
    attrs: Record<string, string>
  }
  styles: Array<{
    content: string
    attrs: Record<string, string>
  }>
}

/**
 * Compile a single Vue SFC to JavaScript
 */
async function compileVueFile (vueFilePath: string): Promise<void> {
  console.log(`Compiling: ${vueFilePath}`)

  const vueSource = await Deno.readTextFile(vueFilePath)
  const descriptor: VueDescriptor = vueCompiler.parseComponent(vueSource)

  let jsOutput = ''

  // Handle script block
  if (descriptor.script) {
    jsOutput += descriptor.script.content + '\n\n'
  } else {
    // Default export if no script block
    jsOutput += 'export default {}\n\n'
  }

  // Handle template block
  if (descriptor.template) {
    let templateContent = descriptor.template.content.trim()
    const templateLang = descriptor.template.attrs?.lang || 'html'

    // Skip empty templates but continue with script-only component
    if (!templateContent) {
      console.warn(`Empty template in ${vueFilePath}, using script-only component`)
    } else {
      // Preprocess Pug templates to HTML
      if (templateLang === 'pug') {
        try {
          templateContent = pug.render(templateContent, {
            filename: vueFilePath,
            pretty: false
          })
        } catch (pugError) {
          console.error(`Pug compilation error in ${vueFilePath}:`, pugError)
          console.warn(`Continuing with script-only component for ${vueFilePath}`)
          templateContent = ''
        }
      }

      if (templateContent) {
        // Generate ESM-compatible render function
        try {
          // Compile template with stripWith option for ESM compatibility
          const compiled = compile(templateContent, {
            preserveWhitespace: false,
            transforms: {
              stripWith: true // Remove 'with' statements for ESM compatibility
            }
          })

          if (compiled.errors && compiled.errors.length > 0) {
            console.warn(`Template compilation errors for ${vueFilePath}:`, compiled.errors)
            // Fall back to script-only mode on errors
            jsOutput += `
// Template compilation failed, using script-only mode
`
          } else {
            // Create ESM-compatible render function
            let renderCode = compiled.render

            // Transform render function to be ESM-compatible
            // Replace 'with' statements and fix variable scoping
            renderCode = renderCode
              .replace(/^function render\s*\(/m, 'function render(')
              .replace(/with\s*\([^)]+\)\s*\{/g, '{')
              .replace(/\b_c\b/g, 'this.$createElement')
              .replace(/\b_v\b/g, 'this._v')
              .replace(/\b_s\b/g, 'this._s')
              .replace(/\b_l\b/g, 'this._l')
              .replace(/\b_t\b/g, 'this._t')
              .replace(/\b_q\b/g, 'this._q')
              .replace(/\b_i\b/g, 'this._i')
              .replace(/\b_m\b/g, 'this._m')
              .replace(/\b_f\b/g, 'this._f')
              .replace(/\b_k\b/g, 'this._k')
              .replace(/\b_b\b/g, 'this._b')
              .replace(/\b_g\b/g, 'this._g')
              .replace(/\b_e\b/g, 'this._e')
              .replace(/\b_n\b/g, 'this._n')
              .replace(/\b_p\b/g, 'this._p')

            // Ensure render function has proper function wrapper
            if (!renderCode.startsWith('function')) {
              // Remove any existing braces and add proper function wrapper
              const cleanCode = renderCode.replace(/^\{(.*)\}$/, '$1')
              renderCode = `function() { ${cleanCode} }`
            }

            // Insert render function into the export default object
            // Find the last closing brace of the export default object and insert render function before it
            const lines = jsOutput.split('\n')
            let lastBraceIndex = -1

            // Find the last standalone closing brace (end of export default object)
            for (let i = lines.length - 1; i >= 0; i--) {
              if (lines[i].trim() === '}' && !lines[i].includes('//')) {
                lastBraceIndex = i
                break
              }
            }

            if (lastBraceIndex !== -1) {
              // Check if the line before the closing brace needs a comma
              const lineBeforeBrace = lines[lastBraceIndex - 1]
              if (lineBeforeBrace && !lineBeforeBrace.trim().endsWith(',') && !lineBeforeBrace.trim().endsWith('{')) {
                lines[lastBraceIndex - 1] = lineBeforeBrace + ','
              }
              // Insert render function before the closing brace
              lines.splice(lastBraceIndex, 0, `  render: ${renderCode},`)
              jsOutput = lines.join('\n')
            } else {
              // Fallback: append render function assignment
              jsOutput += `\n\n// Compiled template render function\nif (typeof exports !== 'undefined' && exports.default) {\n  exports.default.render = ${renderCode};\n}\n`
            }

            // Add static render functions if any
            if (compiled.staticRenderFns && compiled.staticRenderFns.length > 0) {
              const staticFunctions = compiled.staticRenderFns.map((fn: string) => {
                let staticFn = fn
                  .replace(/^function\s*\(/m, 'function(')
                  .replace(/with\s*\([^)]+\)\s*\{/g, '{')
                  .replace(/\b_c\b/g, 'this.$createElement')
                  .replace(/\b_v\b/g, 'this._v')
                  .replace(/\b_s\b/g, 'this._s')
                  .replace(/\b_l\b/g, 'this._l')
                  .replace(/\b_t\b/g, 'this._t')
                  .replace(/\b_q\b/g, 'this._q')
                  .replace(/\b_i\b/g, 'this._i')
                  .replace(/\b_m\b/g, 'this._m')
                  .replace(/\b_f\b/g, 'this._f')
                  .replace(/\b_k\b/g, 'this._k')
                  .replace(/\b_b\b/g, 'this._b')
                  .replace(/\b_g\b/g, 'this._g')
                  .replace(/\b_e\b/g, 'this._e')
                  .replace(/\b_n\b/g, 'this._n')
                  .replace(/\b_p\b/g, 'this._p')

                // Ensure static render function has proper function wrapper
                if (!staticFn.startsWith('function')) {
                  // Remove any existing braces and add proper function wrapper
                  const cleanStaticCode = staticFn.replace(/^\{(.*)\}$/, '$1')
                  staticFn = `function() { ${cleanStaticCode} }`
                }

                return staticFn
              })

              // Insert static render functions into the export default object
              const lines = jsOutput.split('\n')
              let lastBraceIndex = -1

              // Find the last standalone closing brace (end of export default object)
              for (let i = lines.length - 1; i >= 0; i--) {
                if (lines[i].trim() === '}' && !lines[i].includes('//')) {
                  lastBraceIndex = i
                  break
                }
              }

              if (lastBraceIndex !== -1) {
                // Check if the line before the closing brace needs a comma
                const lineBeforeBrace = lines[lastBraceIndex - 1]
                if (lineBeforeBrace && !lineBeforeBrace.trim().endsWith(',') && !lineBeforeBrace.trim().endsWith('{')) {
                  lines[lastBraceIndex - 1] = lineBeforeBrace + ','
                }
                // Insert static render functions before the closing brace
                const staticRenderFnsCode = `  _staticRenderFns: [\n    ${staticFunctions.join(',\n    ')}\n  ],`
                lines.splice(lastBraceIndex, 0, staticRenderFnsCode)
                jsOutput = lines.join('\n')
              } else {
                // Fallback: append static render functions assignment
                jsOutput += `\n\n// Static render functions\nif (typeof exports !== 'undefined' && exports.default) {\n  exports.default._staticRenderFns = [${staticFunctions.join(', ')}];\n}\n`
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to compile template for ${vueFilePath}:`, error)
          jsOutput += `
// Template compilation failed, using script-only mode
`
        }
      }
    }
  }

  // Handle style blocks (for now, just add as comments - SCSS will be handled separately)
  if (descriptor.styles && descriptor.styles.length > 0) {
    jsOutput += '\n// Styles (handled separately by SCSS compiler):\n'
    descriptor.styles.forEach((style, index) => {
      jsOutput += `/* Style block ${index + 1}:\n${style.content}\n*/\n`
    })
  }

  // Determine current file depth relative to dashboard root for alias rewriting
  const relPath = vueFilePath.replace(dashboardRoot + '/', '')
  const depthSegments = relPath.split('/')
  const depthUp = depthSegments.length > 1 ? '../'.repeat(depthSegments.length - 1) : './'

  // Rewrite import paths inside this Vue component output
  jsOutput = jsOutput
    // Redirect server deps to browser-compatible deps (use depth-aware path)
    .replace(/from '~\/deps(?:\.ts)?'/g, `from '${depthUp}deps.js'`)
    .replace(/import '~\/deps(?:\.ts)?'/g, `import '${depthUp}deps.js'`)
    .replace(/from '\.\.\.\/deps(?:\.ts)?'/g, `from '${depthUp}deps.js'`)
    .replace(/import '\.\.\.\/deps(?:\.ts)?'/g, `import '${depthUp}deps.js'`)
    // extensions
    .replace(/from '([^']+)\.vue'/g, 'from \'$1.js\'')
    .replace(/import\((['"])([^'"]+)\.vue\)/g, 'import($1$2.js)')
    .replace(/from '([^']+)\.ts'/g, 'from \'$1.js\'')
    .replace(/import '([^']+)\.ts'/g, 'import \'$1.js\'')
    // dynamically rewrite alias prefixes to proper relative paths based on depth
    .replace(/from ['"]@([a-z-]+)\//g, (_m, alias) => {
      const map = {
        'pages': 'views/pages/',
        'containers': 'views/containers/',
        'components': 'views/components/',
        'view-utils': 'views/utils/',
        'model': 'model/',
        'common': 'common/'
      } as Record<string, string>
      const target = map[alias]
      if (!target) return _m // unknown alias, leave unchanged
      return `from '${depthUp}${target}`
    })
    .replace(/import\((['"])@([a-z-]+)\//g, (_m, quote, alias) => {
      const map = {
        'pages': 'views/pages/',
        'containers': 'views/containers/',
        'components': 'views/components/',
        'view-utils': 'views/utils/',
        'model': 'model/',
        'common': 'common/'
      } as Record<string, string>
      const target = map[alias]
      if (!target) return _m
      return `import(${quote}${depthUp}${target}`
    })

  // Determine destination path inside .vue-compiled keeping original folder structure
  const destPath = join(tempDir, relPath).replace(/\.vue$/, '.js')
  await ensureDir(dirname(destPath))
  await Deno.writeTextFile(destPath, jsOutput)
}

/**
 * Process a TypeScript file to rewrite alias imports and transpile to JavaScript
 */
async function processTypeScriptFile (tsFilePath: string): Promise<void> {
  console.log(`Processing TypeScript file: ${tsFilePath}`)

  // Read the original TypeScript file
  let tsContent = await Deno.readTextFile(tsFilePath)

  // Determine current file depth relative to dashboard root for alias rewriting
  const relPath = tsFilePath.replace(dashboardRoot + '/', '')
  const depthSegments = relPath.split('/')
  const depthUp = depthSegments.length > 1 ? '../'.repeat(depthSegments.length - 1) : './'

  // First rewrite import paths before transpilation
  tsContent = tsContent
    // Redirect server deps to browser-compatible deps (use depth-aware path)
    .replace(/from '~\/deps(?:\.ts)?'/g, `from '${depthUp}deps.js'`)
    .replace(/import '~\/deps(?:\.ts)?'/g, `import '${depthUp}deps.js'`)
    .replace(/from '\.\.\.\/deps(?:\.ts)?'/g, `from '${depthUp}deps.js'`)
    .replace(/import '\.\.\.\/deps(?:\.ts)?'/g, `import '${depthUp}deps.js'`)
    // extensions
    .replace(/from '([^']+)\.vue'/g, 'from \'$1.js\'')
    .replace(/import\((['"])([^'"]+)\.vue\1\)/g, 'import($1$2.js$1)')
    .replace(/from '([^']+)\.ts'/g, 'from \'$1.js\'')
    .replace(/import '([^']+)\.ts'/g, 'import \'$1.js\'')
    // dynamically rewrite alias prefixes to proper relative paths based on depth
    .replace(/from ['"]@([a-z-]+)\//g, (_m: string, alias: string) => {
      const map = {
        'pages': 'views/pages/',
        'containers': 'views/containers/',
        'components': 'views/components/',
        'view-utils': 'views/utils/',
        'model': 'model/',
        'common': 'common/',
        'forms': 'views/components/forms/',
        'validators': 'views/utils/'
      } as Record<string, string>
      const target = map[alias]
      if (!target) return _m // unknown alias, leave unchanged
      return `from '${depthUp}${target}`
    })
    .replace(/import\((['"])@([a-z-]+)\//g, (_m: string, quote: string, alias: string) => {
      const map = {
        'pages': 'views/pages/',
        'containers': 'views/containers/',
        'components': 'views/components/',
        'view-utils': 'views/utils/',
        'model': 'model/',
        'common': 'common/',
        'forms': 'views/components/forms/',
        'validators': 'views/utils/'
      } as Record<string, string>
      const target = map[alias]
      if (!target) return _m
      return `import(${quote}${depthUp}${target}`
    })

  // Transpile TypeScript to JavaScript using esbuild
  const transformed = await esbuild.transform(tsContent, {
    loader: 'ts',
    target: 'esnext',
    format: 'esm'
  })

  const jsContent = transformed.code

  // Determine destination path inside .vue-compiled keeping original folder structure
  const destPath = join(tempDir, relPath).replace(/\.ts$/, '.js')
  await ensureDir(dirname(destPath))
  await Deno.writeTextFile(destPath, jsContent)
}

/**
 * Find all .vue and .ts files in the dashboard directory
 */
async function findVueAndTsFiles (): Promise<{vueFiles: string[], tsFiles: string[]}> {
  const vueFiles: string[] = []
  const tsFiles: string[] = []

  for await (const entry of walk(dashboardRoot, {
    exts: ['.vue', '.ts'],
    includeDirs: false
  })) {
    if (entry.path.endsWith('.vue')) {
      vueFiles.push(entry.path)
    } else if (entry.path.endsWith('.ts')) {
      tsFiles.push(entry.path)
    }
  }

  return { vueFiles, tsFiles }
}

/**
 * Main precompilation process
 */
export async function precompileVueFiles () {
  console.log('🔄 Starting Vue SFC precompilation...')

  // Find all .vue files
  const { vueFiles, tsFiles } = await findVueAndTsFiles()
  console.log(`Found ${vueFiles.length} Vue files and ${tsFiles.length} TypeScript files to process`)

  // Process each Vue file
  for (const vueFile of vueFiles) {
    await compileVueFile(vueFile)
  }

  // Process each TypeScript file
  for (const tsFile of tsFiles) {
    await processTypeScriptFile(tsFile)
  }

  // Also compile main.ts to main.js
  console.log('🔄 Compiling main.ts entry point...')
  const mainTsPath = join(dashboardRoot, 'main.ts')
  const mainJsPath = join(tempDir, 'main.js')

  try {
    const mainContent = await Deno.readTextFile(mainTsPath)

    // Transform imports to use compiled .js files and fix paths
    const transformedContent = mainContent
      // First, handle .vue file imports
      .replace(/from '([^']+)\.vue'/g, 'from \'$1.js\'')
      .replace(/import '([^']+)\.vue'/g, 'import \'$1.js\'')

      // Convert .ts imports to .js
      .replace(/from '([^']+)\.ts'/g, 'from \'$1.js\'')
      .replace(/import '([^']+)\.ts'/g, 'import \'$1.js\'')

      // Redirect server deps to browser-compatible deps (main.ts is at root, so use relative path)
      .replace(/from '~\/deps(?:\.ts)?'/g, 'from \'./deps.js\'')
      .replace(/import '~\/deps(?:\.ts)?'/g, 'import \'./deps.js\'')
      .replace(/from '\.\.\/\.\.\/deps(?:\.ts)?'/g, 'from \'./deps.js\'')
      .replace(/import '\.\.\/\.\.\/\.\.\/deps(?:\.ts)?'/g, 'import \'./deps.js\'')

      // Handle path aliases - convert to relative paths in compiled output
      .replace(/from '@([^']+)'/g, (match: string, path: string) => {
        if (path.startsWith('containers/')) return `from './views/${path}.js'`
        if (path.startsWith('components/')) return `from './views/${path}.js'`
        if (path.startsWith('common/')) return `from './common/${path.replace('common/', '')}.js'`
        return match
      })
      .replace(/import '@([^']+)'/g, (match: string, path: string) => {
        if (path.startsWith('containers/')) return `import './views/${path}.js'`
        if (path.startsWith('components/')) return `import './views/${path}.js'`
        if (path.startsWith('common/')) return `import './common/${path.replace('common/', '')}.js'`
        return match
      })

      // Fix double .js.js extensions
      .replace(/\.js\.js'/g, '.js\'')

    // Transpile TS with esbuild
    const transformed = await esbuild.transform(transformedContent, {
      loader: 'ts',
      target: 'esnext',
    })
    let finalContent = transformed.code

    // Global stripping of leftover TS constructs
    finalContent = finalContent
      // Interfaces & type exports
      .replace(/export?\s+interface\s+\w+\s*{[\s\S]*?}\s*/g, '')
      .replace(/export?\s+type\s+\w+[^=]*=[\s\S]*?;\s*/g, '')
      .replace(/interface\s+\w+\s*{[\s\S]*?}\s*/g, '')
      // Parameter object annotations (single line only)
      .replace(/:\s*\{[^}\n]*\}(?=[,)]?)/g, '')
      // Complex type annotations including generics and function types
      .replace(/:\s*[^,){}=;\n]+(?=\s*[,){}=;])/g, '')
      // Rest parameter type annotations
      .replace(/\(([^)]*?)\s*}\s*,/g, '($1, ')
      // Remove leftover generics
      .replace(/<[^>]+>\s*(?=\()/g, '')
    // Final fixes for all remaining syntax errors
    // 1. Ensure the Vue error handler template literal is intact
    finalContent = finalContent.replace(/console\.error\([^\n]*uncaught Vue error in[^\n]*\)/g, 'console.error(`uncaught Vue error in ${info}:`, err)')
    // 2. Fix malformed inline TODO comment - close the parenthesis and comment
    finalContent = finalContent.replace(/await sbp\('translations\/init', 'en-US' \/\* TODO!\)/g, 'await sbp(\'translations/init\', \'en-US\') /* TODO */')
    finalContent = finalContent.replace(/await sbp\('translations\/init', 'en-US' \/\* TODO \*\//g, 'await sbp(\'translations/init\', \'en-US\') /* TODO */')
    // 3. Fix missing closing brace for components object
    finalContent = finalContent.replace(/Modal,\s*data \(/g, 'Modal\n    },\n    data (')
    // 4. Fix missing variable declaration
    finalContent = finalContent.replace(/return {\s*isNavOpen\s*}/g, 'return {\n        isNavOpen: false\n      }')
    // 5. Fix remaining property colons for all Vue object properties
    finalContent = finalContent.replace(/^(\s*)(components|computed|methods|data)\s*\{/gm, '$1$2: {')
    // Also handle cases where there might be extra whitespace
    finalContent = finalContent.replace(/(components|computed|methods|data)\s*\{/g, '$1: {')
    // 5b. Fix missing closing brace/comma after Modal component
    finalContent = finalContent.replace(/Modal,\s*\n\s*data\(/, 'Modal,\n      },\n      data(')
    // 6. Ensure proper indentation and structure
    finalContent = finalContent.replace(/\}\s*\}\s*\)\s*\$mount\('#app'\)/g, '    }\n  }).$mount(\'#app\')')

    await Deno.writeTextFile(mainJsPath, finalContent)
    console.log('✅ Compiled: main.ts -> main.js (manual TS->JS conversion)')
  } catch (error) {
    console.error('❌ Failed to compile main.ts:', error)
    throw error
  }

  // Copy dashboard-specific deps file to compiled directory
  const dashboardDepsPath = join(dashboardRoot, 'deps.ts')
  const compiledDepsPath = join(tempDir, 'deps.js')

  try {
    const depsContent = await Deno.readTextFile(dashboardDepsPath)
    // Convert TypeScript to JavaScript for the deps file
    const transformed = await esbuild.transform(depsContent, {
      loader: 'ts',
      target: 'esnext',
    })
    await Deno.writeTextFile(compiledDepsPath, transformed.code)
    console.log('✅ Copied and compiled dashboard deps.ts -> deps.js')
  } catch (error) {
    console.error('❌ Failed to copy dashboard deps file:', error)
  }

  console.log(`🎉 Successfully precompiled ${vueFiles.length} Vue files + main.js + ${tsFiles.length} TS files (JS-compatible)`)
  console.log(`📁 Compiled files available in: ${tempDir}`)
}

// Run precompilation if this script is executed directly
if (import.meta.main) {
  try {
    await precompileVueFiles()
  } catch (error) {
    console.error('Vue precompilation failed:', error)
    Deno.exit(1)
  }
}

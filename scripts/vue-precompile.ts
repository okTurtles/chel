/**
 * Vue 2 SFC Precompiler for Chelonia Dashboard
 */

import { dirname, join, relative } from 'jsr:@std/path@1.1.1'
import { ensureDir, exists } from 'jsr:@std/fs@1.0.19'
import { esbuild } from '~/deps.ts'

// Vue template compiler for proper SFC parsing
import * as vueTemplateCompiler from 'npm:vue-template-compiler@2.7.16'

// Configuration
const dashboardRoot = join(Deno.cwd(), 'src/serve/dashboard')
const tempDir = join(Deno.cwd(), '.vue-compiled')

interface VueDescriptor {
  template?: { content: string; attrs: Record<string, string> }
  script?: { content: string; attrs: Record<string, string> }
  styles: Array<{ content: string; attrs: Record<string, string> }>
  customBlocks: Array<{ type: string; content: string; attrs: Record<string, string> }>
}

interface CompileOptions {
  filename: string
  sourceRoot: string
  outputDir: string
  extractedStyles?: string[] // For collecting styles from all components
}

/**
 * Parse Vue SFC
 */
function parseVueSFC (source: string, filename: string): VueDescriptor {
  try {
    return vueTemplateCompiler.parseComponent(source, { pad: 'line' })
  } catch (error) {
    console.error(`❌ Failed to parse Vue SFC ${filename}:`, error)
    throw error
  }
}

/**
 * Strip 'with(this)' statement from render functions
 */
function stripWithStatement (renderFn: string): string {
  if (!renderFn) return renderFn

  // Remove 'with(this){' at the beginning and matching '}' at the end
  // Pattern: with(this){...code...}
  const withPattern = /^with\(this\)\{([\s\S]*)\}$/
  const match = renderFn.match(withPattern)

  if (match) {
    // Extract the inner code and wrap it in a proper function with Vue context binding
    const innerCode = match[1]

    // Extract variable names used in the render function that need to be bound from component context
    // This includes computed properties, data, props, methods, etc.
    const variablePattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*[.[]|\s*\(|\s*$|\s*[^a-zA-Z0-9_$])/g
    const variables = new Set<string>()
    let varMatch

    // Find all variable references in the render function
    while ((varMatch = variablePattern.exec(innerCode)) !== null) {
      const varName = varMatch[1]
      // Skip Vue render helpers, JavaScript keywords, reserved words, and common globals
      if (
        !varName.startsWith('_') &&
        ![
          'return',
          'var',
          'let',
          'const',
          'function',
          'if',
          'else',
          'for',
          'while',
          'do',
          'switch',
          'case',
          'break',
          'continue',
          'try',
          'catch',
          'finally',
          'throw',
          'new',
          'this',
          'true',
          'false',
          'null',
          'undefined',
          'typeof',
          'instanceof',
          'in',
          'of',
          'delete',
          'void',
          'Array',
          'Object',
          'String',
          'Number',
          'Boolean',
          'Date',
          'RegExp',
          'Math',
          'JSON',
          'console',
          'window',
          'document',
          'global',
          'process',
          'class',
          'default',
          'with',
          'export',
          'import',
          'extends',
          'implements',
          'interface',
          'enum',
          'type',
          'namespace',
          'module',
          'declare',
          'abstract',
          'static',
          'readonly',
          'private',
          'protected',
          'public',
          'async',
          'await',
          'yield',
          'debugger',
          'super',
          'arguments',
          'eval',
        ].includes(varName)
      ) {
        variables.add(varName)
      }
    }

    // Create variable bindings for component properties
    const variableBindings = Array.from(variables).map((varName) => `${varName}=this.${varName}`)
      .join(',')

    // Bind Vue's render helpers and ensure all Vue instance properties are available
    // The key fix is to bind render helpers to the Vue instance context so they can access this.$scopedSlots
    const vueContextBinding =
      'var _c=this.$createElement,_v=this._v,_s=this._s,_e=this._e,_m=this._m,_f=this._f,_k=this._k,_b=this._b,_g=this._g,_l=this._l,_t=this._t.bind(this),_n=this._n,_q=this._q,_i=this._i,_o=this._o,_u=this._u;'
    const vueInstanceBinding =
      'var $v=this.$v||{},$emit=this.$emit,$scopedSlots=this.$scopedSlots||{},$slots=this.$slots||{},$attrs=this.$attrs||{},$listeners=this.$listeners||{},$set=this.$set,$delete=this.$delete,$watch=this.$watch,$nextTick=this.$nextTick,$router=this.$router,$route=this.$route,_events=this._events||{};'
    const componentBinding = variables.size > 0 ? `var ${variableBindings};` : ''

    return `function(){${vueContextBinding}${vueInstanceBinding}${componentBinding}${innerCode}}`
  }

  return renderFn
}

/**
 * Compile Vue template to render function
 */
async function compileTemplate (template: string, filename: string, lang?: string): Promise<{ render: string; staticRenderFns: string[] }> {
  try {
    // Process Pug templates first
    let processedTemplate = template
    if (lang === 'pug') {
      try {
        const pug = await import('npm:pug@3.0.2')
        processedTemplate = pug.render(template, { filename })
        console.log(`🔄 Processed Pug template for ${filename}`)
      } catch (pugError) {
        console.warn(`⚠️  Pug processing failed for ${filename}:`, pugError)
        // Fall back to original template
      }
    }

    const compiled = vueTemplateCompiler.compile(processedTemplate, {
      filename,
      preserveWhitespace: false,
      modules: [],
      directives: {},
      isReservedTag: (tag: string) => /^[a-z]/.test(tag),
      isUnaryTag: () => false,
      mustUseProp: () => false,
      canBeLeftOpenTag: () => false,
      isPreTag: () => false,
      getTagNamespace: () => undefined,
      expectHTML: true,
      isFromDOM: false,
      shouldDecodeTags: true,
      shouldDecodeNewlines: false,
      shouldDecodeNewlinesForHref: false,
      outputSourceRange: false,
    })

    if (compiled.errors && compiled.errors.length > 0) {
      console.warn(`⚠️  Template compilation warnings for ${filename}:`, compiled.errors)
    }

    // Post-process render functions to remove 'with(this)' for strict mode compatibility
    const processedRender = compiled.render ? stripWithStatement(compiled.render) : ''
    const processedStaticRenderFns = (compiled.staticRenderFns || []).map((fn: string) =>
      stripWithStatement(fn)
    )

    return {
      render: processedRender,
      staticRenderFns: processedStaticRenderFns,
    }
  } catch (error) {
    console.error(`❌ Failed to compile template for ${filename}:`, error)
    // Return fallback render function
    return {
      render:
        'function render() { return this.$createElement("div", "Template compilation failed") }',
      staticRenderFns: [],
    }
  }
}

/**
 * Transform TypeScript to JavaScript
 */
async function transformTypeScript (code: string, filename: string): Promise<string> {
  try {
    const result = await esbuild.transform(code, {
      loader: 'ts',
      target: 'es2020',
      format: 'esm',
      sourcefile: filename,
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: false,
          useDefineForClassFields: false,
        },
      },
    })
    return result.code
  } catch (error) {
    console.error(`❌ Failed to transform TypeScript for ${filename}:`, error)
    throw error
  }
}

/**
 * Resolve import paths
 */
function resolveImportPath (importPath: string, sourceFile: string, dashboardRoot: string): string {
  const sourceDir = dirname(sourceFile)
  const relativeToRoot = relative(dashboardRoot, sourceDir)

  // External imports - keep as-is
  if (
    importPath.startsWith('npm:') || importPath.startsWith('jsr:') || importPath.startsWith('http')
  ) {
    return importPath
  }

  // Node.js built-ins - keep as-is (don't add .js)
  if (importPath.startsWith('node:')) {
    return importPath
  }

  // External packages (vue-router, vuex, etc.) - keep as-is
  const externalPackages = [
    'vue',
    'vue-router',
    'vuex',
    'vue-clickaway',
    'vuelidate',
    'dompurify',
    'pug',
    'three',
    '@sbp/sbp',
    '@sbp/okturtles.data',
    '@sbp/okturtles.events',
    '@sbp/okturtles.eventqueue',
  ]
  if (externalPackages.some((pkg) => importPath === pkg || importPath.startsWith(pkg + '/'))) {
    return importPath
  }

  // Handle ~/deps alias - calculate correct relative path to deps.js
  if (importPath === '~/deps.ts' || importPath === '~/deps.js') {
    // Calculate relative path from current file to deps.js in compiled root
    const compiledRoot = join(dirname(dashboardRoot), '.vue-compiled')
    const compiledSourceDir = join(compiledRoot, relativeToRoot)
    const depsPath = join(compiledRoot, 'deps.js')
    const relativePath = relative(compiledSourceDir, depsPath)
    return relativePath.startsWith('.') ? relativePath : './' + relativePath
  }

  // Handle path aliases - resolve to correct nested paths
  if (importPath.startsWith('@')) {
    const resolved = resolveAlias(importPath, relativeToRoot)
    if (resolved) {
      // Keep the nested structure but convert extensions
      return resolved.replace(/\.(ts|vue)$/, '.js')
    }
    // If alias resolution fails, return as-is to avoid breaking
    return importPath
  }

  // Relative imports - convert .ts/.vue to .js but maintain relative paths
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    if (importPath.endsWith('.ts') || importPath.endsWith('.vue')) {
      return importPath.replace(/\.(ts|vue)$/, '.js')
    }
    // Add .js if no extension
    if (!importPath.includes('.')) {
      return importPath + '.js'
    }
    return importPath
  }

  // Handle bare imports (like 'deps' -> './deps.js')
  if (!importPath.includes('/') && !importPath.includes('.')) {
    return './' + importPath + '.js'
  }

  return importPath
}

function transformImports (code: string, sourceFile: string, dashboardRoot: string): string {
  const sourceDir = dirname(sourceFile)
  const relativeToRoot = relative(dashboardRoot, sourceDir)

  let result = code

  result = result.replace(/from\s+['"]([^'"]+)['"]/g, (match, importPath) => {
    const resolved = resolveImportPath(importPath, sourceFile, dashboardRoot)
    return match.replace(importPath, resolved)
  })

  result = result.replace(/import\s+['"]([^'"]+)['"]/g, (match, importPath) => {
    const resolved = resolveImportPath(importPath, sourceFile, dashboardRoot)
    return match.replace(importPath, resolved)
  })

  result = result.replace(
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    (match: string, importPath: string) => {
      const resolved = resolveImportPath(importPath, sourceFile, dashboardRoot)
      return match.replace(importPath, resolved)
    },
  )

  return result
}

/**
 * Resolve alias paths
 */
function resolveAlias (importPath: string, relativeToRoot: string): string | null {
  // Remove any existing .js extension to prevent double extensions
  // Also handle .vue extensions - they should become .js
  const cleanPath = importPath.replace(/\.(js|vue)$/, '')

  const aliases: Record<string, string> = {
    '@sbp': 'deps',
    '@common': '../common',
    '@model': '../model',
    '@controller': '../controller',
    '@view-utils': '../views/utils',
    '@views': '../views',
    '@components': '../views/components',
    '@containers': '../views/containers',
    '@pages': '../views/pages',
    '@forms': '../views/components/forms',
    '@validators': '../views/utils/validators',
  }

  for (const [alias, target] of Object.entries(aliases)) {
    if (cleanPath.startsWith(alias)) {
      const remainder = cleanPath.slice(alias.length)
      const depth = relativeToRoot.split('/').filter((p) => p.length > 0).length
      const prefix = depth > 0 ? '../'.repeat(depth) : './'

      // Build the resolved path
      let resolvedPath: string

      if (alias === '@sbp') {
        // Special case for @sbp - it should resolve directly to deps.js
        resolvedPath = prefix + target
      } else {
        resolvedPath = prefix + target.replace('../', '')

        // Add remainder (like /events from @view-utils/events)
        if (remainder) {
          resolvedPath += remainder
        }
      }

      // Add .js extension only once
      if (!resolvedPath.endsWith('.js')) {
        resolvedPath += '.js'
      }

      return resolvedPath
    }
  }

  return null
}

/**
 * Compile a single Vue SFC file
 */
async function compileVueSFC (sourceFile: string, options: CompileOptions): Promise<void> {
  const source = await Deno.readTextFile(sourceFile)
  const descriptor = parseVueSFC(source, sourceFile)

  // Calculate output path
  const relativePath = relative(options.sourceRoot, sourceFile)
  const outputPath = join(options.outputDir, relativePath.replace(/\.vue$/, '.js'))

  await ensureDir(dirname(outputPath))

  let scriptContent = ''
  let hasExportDefault = false

  // Process script block if present
  if (descriptor.script?.content) {
    scriptContent = descriptor.script.content.trim()
    hasExportDefault = /export\s+default\s+/.test(scriptContent)

    // Transform TypeScript to JavaScript properly
    scriptContent = await transformTypeScript(scriptContent, sourceFile)

    // Transform imports to use relative paths and correct extensions
    scriptContent = transformImports(scriptContent, sourceFile, dashboardRoot)
  }

  // Process template block if present
  let renderFunction = ''
  let staticRenderFns: string[] = []

  if (descriptor.template?.content) {
    const templateLang = descriptor.template.attrs?.lang || 'html'
    console.log(`🔍 Processing template for ${sourceFile}, lang: ${templateLang}`)
    const compiled = await compileTemplate(descriptor.template.content, sourceFile, templateLang)
    renderFunction = compiled.render
    staticRenderFns = compiled.staticRenderFns
    console.log(`🔍 Render function generated: ${renderFunction ? 'YES' : 'NO'}`)
  }

  // Process style blocks and extract them for CSS compilation
  if (descriptor.styles && descriptor.styles.length > 0 && options.extractedStyles) {
    console.log(`🎨 Processing ${descriptor.styles.length} style blocks for ${sourceFile}`)
    for (const styleBlock of descriptor.styles) {
      if (styleBlock.content.trim()) {
        // Add component-specific comment for debugging
        const componentName = sourceFile.split('/').pop()?.replace('.vue', '') || 'unknown'
        const styleWithComment = `/* Styles from ${componentName}.vue */\n${styleBlock.content}\n`
        options.extractedStyles.push(styleWithComment)
        console.log(
          `✅ Extracted styles from ${componentName}.vue (${styleBlock.content.length} chars)`,
        )
      }
    }
  }

  // Generate clean output without text manipulation
  let output = ''

  if (scriptContent && hasExportDefault) {
    // Script has export default - inject render functions properly
    // Handle both "export default { ... }" and "var X_default = { ... }; export { X_default as default };" patterns
    const exportDefaultRegex = /export\s+default\s+(\{[\s\S]*\})/
    // Improved regex to match complete component object with balanced braces
    const varExportRegex =
      /var\s+(\w+)_default\s*=\s*(\{[\s\S]*\});[\s\S]*export\s*\{[\s\S]*\1_default\s+as\s+default[\s\S]*\}/

    const directMatch = scriptContent.match(exportDefaultRegex)
    const varMatch = scriptContent.match(varExportRegex)

    if (directMatch) {
      const componentObject = directMatch[1]
      // Remove the export default part
      const scriptWithoutExport = scriptContent.replace(exportDefaultRegex, '')

      output = scriptWithoutExport + '\n\n'
      output += 'const component = ' + componentObject + '\n\n'

      if (renderFunction) {
        console.log(`🔧 Injecting render function for ${sourceFile} (direct export)`)
        output += `component.render = ${renderFunction}\n`
      } else {
        console.log(`❌ No render function to inject for ${sourceFile} (direct export)`)
      }

      if (staticRenderFns.length > 0) {
        output += `component.staticRenderFns = [${staticRenderFns.join(',\n  ')}]\n`
      }

      output += '\nexport default component\n'
    } else if (varMatch) {
      const componentObject = varMatch[2]
      // Remove the var declaration and export
      const scriptWithoutExport = scriptContent.replace(varMatch[0], '')

      output = scriptWithoutExport + '\n\n'
      output += 'const component = ' + componentObject + '\n\n'

      if (renderFunction) {
        console.log(`🔧 Injecting render function for ${sourceFile} (var export)`)
        output += `component.render = ${renderFunction}\n`
      } else {
        console.log(`❌ No render function to inject for ${sourceFile} (var export)`)
      }

      if (staticRenderFns.length > 0) {
        output += `component.staticRenderFns = [${staticRenderFns.join(',\n  ')}]\n`
      }

      output += '\nexport default component\n'
    } else {
      // Fallback - keep original script
      console.log(`⚠️ Could not match export pattern for ${sourceFile}, keeping original`)
      output = scriptContent
    }
  } else if (scriptContent) {
    // Script without export default
    output = scriptContent + '\n\n'
    output += 'const component = {}\n'

    if (renderFunction) {
      output += `component.render = ${renderFunction}\n`
    }

    if (staticRenderFns.length > 0) {
      output += `component.staticRenderFns = [${staticRenderFns.join(',\n  ')}]\n`
    }

    output += '\nexport default component\n'
  } else {
    // Template-only component
    output = 'const component = {}\n'

    if (renderFunction) {
      output += `component.render = ${renderFunction}\n`
    }

    if (staticRenderFns.length > 0) {
      output += `component.staticRenderFns = [${staticRenderFns.join(',\n  ')}]\n`
    }

    output += '\nexport default component\n'
  }

  await Deno.writeTextFile(outputPath, output)
  console.log(
    `✅ Compiled: ${relative(Deno.cwd(), sourceFile)} -> ${relative(Deno.cwd(), outputPath)}`,
  )
}

/**
 * Transform TypeScript files
 */
async function transformTSFile (sourceFile: string, options: CompileOptions): Promise<void> {
  const source = await Deno.readTextFile(sourceFile)
  const relativePath = relative(options.sourceRoot, sourceFile)
  const outputPath = join(options.outputDir, relativePath.replace(/\.ts$/, '.js'))

  await ensureDir(dirname(outputPath))

  // Transform with esbuild (proper way)
  let transformedCode = await transformTypeScript(source, sourceFile)

  // Transform imports to use relative paths and correct extensions
  transformedCode = transformImports(transformedCode, sourceFile, dashboardRoot)

  await Deno.writeTextFile(outputPath, transformedCode)
  console.log(
    `✅ Transformed: ${relative(Deno.cwd(), sourceFile)} -> ${relative(Deno.cwd(), outputPath)}`,
  )
}

/**
 * Find all Vue and TypeScript files
 */
async function findSourceFiles (dir: string): Promise<{ vueFiles: string[]; tsFiles: string[] }> {
  const vueFiles: string[] = []
  const tsFiles: string[] = []

  async function walk (currentDir: string) {
    for await (const entry of Deno.readDir(currentDir)) {
      const fullPath = join(currentDir, entry.name)

      if (entry.isDirectory && !entry.name.startsWith('.')) {
        await walk(fullPath)
      } else if (entry.isFile) {
        if (entry.name.endsWith('.vue')) {
          vueFiles.push(fullPath)
        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
          tsFiles.push(fullPath)
        }
      }
    }
  }

  await walk(dir)
  return { vueFiles, tsFiles }
}

/**
 * Main precompilation function
 */
export async function precompileVueFiles (): Promise<void> {
  console.log('🔄 Starting Vue SFC precompilation (robust implementation)...')

  // Ensure output directory exists
  await ensureDir(tempDir)

  const options: CompileOptions = {
    filename: '',
    sourceRoot: dashboardRoot,
    outputDir: tempDir,
    extractedStyles: [], // Collect all styles from Vue components
  }

  // Find all source files
  const { vueFiles, tsFiles } = await findSourceFiles(dashboardRoot)
  console.log(`Found ${vueFiles.length} Vue files and ${tsFiles.length} TypeScript files`)
  console.log('Vue files found:', vueFiles.map((f) => f.replace(dashboardRoot, '')).sort())

  // Compile Vue SFCs properly
  for (const vueFile of vueFiles) {
    await compileVueSFC(vueFile, { ...options, filename: vueFile })
  }

  // Transform TypeScript files
  for (const tsFile of tsFiles) {
    await transformTSFile(tsFile, { ...options, filename: tsFile })
  }

  // Write all extracted styles to a combined CSS file
  if (options.extractedStyles && options.extractedStyles.length > 0) {
    let combinedStyles = options.extractedStyles.join('\n\n')

    // Fix @assets imports to use relative paths for SCSS compilation
    combinedStyles = combinedStyles.replace(
      /@import "@assets\/style\/_variables\.scss";/g,
      `@import "${join(dashboardRoot, 'assets', 'style', '_variables.scss').replace(/\\/g, '/')}";`,
    )

    const stylesOutputPath = join(tempDir, 'combined-styles.scss')
    await Deno.writeTextFile(stylesOutputPath, combinedStyles)
    console.log(
      `🎨 Combined ${options.extractedStyles.length} style blocks into: ${stylesOutputPath}`,
    )
    console.log(`📊 Total styles: ${combinedStyles.length} characters`)
    console.log('🔧 Fixed @assets imports to use absolute paths')
  } else {
    console.log('⚠️  No styles extracted from Vue components')
  }

  console.log(
    `🎉 Successfully precompiled ${vueFiles.length} Vue files + ${tsFiles.length} TS files`,
  )
  console.log(`📁 Compiled files available in: ${tempDir}`)
}

// Run if called directly
if (import.meta.main) {
  await precompileVueFiles()
}

// Adapted from Group Income's vue-plugin.js for Deno/TypeScript compatibility
// Original: https://github.com/okTurtles/group-income/blob/93de1fea25b9775499a6e7ce5cc00a3c747e4ece/scripts/esbuild-plugins/vue-plugin.js

// Fix for Deno's __proto__ issue with buble (used by @vue/component-compiler)
// See: https://github.com/denoland/deno/issues/20618
if (({} as Record<string, unknown>).__proto__ !== Object.prototype) {
  Object.defineProperty(Object.prototype, '__proto__', {
    get () {
      return Object.getPrototypeOf(this)
    },
    set (v) {
      Object.setPrototypeOf(this, v)
    }
  })
}

import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'
import process from 'node:process'
import { createAliasReplacer } from './utils.ts'

// @vue/component-compiler for Vue 2 SFC compilation
import * as componentCompiler from 'npm:@vue/component-compiler@4.2.4'
import type * as esbuild from 'npm:esbuild@0.25.6'

interface VuePluginOptions {
  aliases?: Record<string, string>
  cache?: Map<string, esbuild.OnLoadResult> | null
  debug?: boolean
  flowtype?: unknown
}

interface CompileOptions {
  filename: string
  source: string
  options: { flowtype?: unknown }
}

export function vuePlugin ({ aliases = {}, cache = null, debug = false, flowtype = null }: VuePluginOptions = {}) {
  const aliasReplacer = Object.keys(aliases).length > 0 ? createAliasReplacer(aliases) : null

  return {
    name: 'vue',
    setup (build) {
      build.onLoad({ filter: /[^/]\.vue$/ }, async ({ path }) => {
        const filename = relative(process.cwd(), path)
        if (cache && cache.has(filename)) {
          if (debug) console.log('vue plugin: reading from cache:', filename)
          return cache.get(filename)
        }

        let source = await readFile(path, 'utf8')
        if (aliasReplacer) {
          source = aliasReplacer({ path, source })
        }

        if (debug) console.log('vue plugin: compiling', filename)
        const result = compile({ filename, source, options: { flowtype } })

        if (cache && result.contents) cache.set(filename, result)
        return result
      })
    }
  } satisfies esbuild.Plugin
}

const compiler = componentCompiler.createDefaultCompiler()

function compile ({ filename, source, options }: CompileOptions): esbuild.OnLoadResult {
  try {
    if (/^\s*$/.test(source)) {
      throw new Error('File is empty')
    }

    const descriptor = compiler.compileToDescriptor(filename, source)
    const errors = combineErrors(descriptor.template || { errors: [] }, ...descriptor.styles)
    if (errors.length > 0) {
      return { errors }
    }

    if (options.flowtype && descriptor.script) {
      // Flow type removal would go here if needed
      // descriptor.script.code = flowRemoveTypes(descriptor.script.code, options.flowtype).toString()
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

function combineErrors (...outputs: Array<{ errors?: unknown[] }>) {
  return outputs.map((output) => {
    if (!output || !output.errors) {
      return []
    }
    return output.errors.map((error: unknown) => convertError(error))
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

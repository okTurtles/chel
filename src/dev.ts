import { flags, colors } from './deps.ts'
import { readFile, mkdir, stat, readdir } from 'node:fs/promises'
import { existsSync, watch } from 'node:fs'
import { resolve, join } from 'node:path'
import process from 'node:process'
import vm from 'node:vm'

interface DevOptions {
  port?: number
  dashboardPort?: number
  'watch-contracts'?: boolean
  'health-check'?: boolean
  'performance'?: boolean
  'interactive'?: boolean
  debug?: boolean
}

interface ProjectConfig {
  contractsVersion: string
  version: string
}

interface ContractHealth {
  name: string
  status: 'healthy' | 'warning' | 'error'
  lastModified: Date
  size: number
  issues: string[]
  dependencies: string[]
}

interface DevMetrics {
  contractsWatched: number
  changesDetected: number
  healthChecks: number
  uptime: number
}

// Interactive Development Dashboard
class DevDashboard {
  private watchers: unknown[] = []
  private backendProcess?: unknown
  private browserSync?: unknown
  private projectConfig: ProjectConfig
  private options: DevOptions
  private projectRoot: string
  private contractsHealth: Map<string, ContractHealth> = new Map()
  private metrics: DevMetrics
  private startTime: Date

  constructor (projectRoot: string, options: DevOptions) {
    this.projectRoot = resolve(projectRoot)
    this.options = options
    this.projectConfig = { contractsVersion: '1.0.0', version: '1.0.0' }
    this.startTime = new Date()
    this.metrics = {
      contractsWatched: 0,
      changesDetected: 0,
      healthChecks: 0,
      uptime: 0
    }
  }

  // Simple fast non-crypto hash for content (djb2)
  private hashContent (str: string): string {
    let h = 5381
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i)
    // force to unsigned 32-bit and to hex
    return (h >>> 0).toString(16)
  }

  async init () {
    this.printWelcomeBanner()

    // Load project configuration
    await this.loadProjectConfig()

    // Initialize contract health monitoring
    await this.initializeContractHealth()

    // Setup intelligent file watching
    this.setupWatchers()

    // Start interactive dashboard
    if (this.options.interactive !== false) {
      this.startInteractiveDashboard()
    }

    // Start performance monitoring
    if (this.options.performance) {
      this.startPerformanceMonitoring()
    }

    this.printDashboardStatus()

    // Keep the process alive and handle graceful shutdown
    this.setupGracefulShutdown()
  }

  private async loadProjectConfig () {
    try {
      const packageJsonPath = join(this.projectRoot, 'package.json')
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
        this.projectConfig = {
          contractsVersion: packageJson.contractsVersion || '1.0.0',
          version: packageJson.version || '1.0.0'
        }
      }
    } catch {
      console.warn(colors.yellow('Warning: Could not load package.json, using defaults'))
    }
  }

  private printWelcomeBanner () {
    console.log(colors.cyan('╔══════════════════════════════════════════════════════════════╗'))
    console.log(colors.cyan('║') + colors.bold(colors.white('                🚀 CHEL DEVELOPMENT DASHBOARD                ')) + colors.cyan('║'))
    console.log(colors.cyan('║') + colors.white('              Interactive Contract Development               ') + colors.cyan('║'))
    console.log(colors.cyan('╚══════════════════════════════════════════════════════════════╝'))
    console.log()
  }

  // Track last content hashes to ignore no-op saves
  private lastHashes: Map<string, string> = new Map()

  private async initializeContractHealth () {
    console.log(colors.blue('🔍 Scanning contracts...'))
    const contractsDir = join(this.projectRoot, 'contracts')
    if (!existsSync(contractsDir)) {
      console.log(colors.yellow('⚠️  No contracts directory found, creating one...'))
      await mkdir(contractsDir, { recursive: true })
      return
    }
    try {
      const entries = await readdir(contractsDir, { recursive: true })
      const files = (entries as unknown as string[]).filter((f) => typeof f === 'string' && f.endsWith('.js'))
      // Reset maps and count on each full scan to prevent duplication
      this.contractsHealth.clear()
      this.lastHashes.clear()
      this.metrics.contractsWatched = files.length
      for (const file of files) {
        await this.updateContractHealth(file)
      }
      console.log(colors.green(`✅ Found ${files.length} contracts`))
    } catch (error) {
      console.error(colors.red('❌ Error scanning contracts:'), error)
    }
  }

  private analyzeContractHealth (content: string): 'healthy' | 'warning' | 'error' {
    const issues = this.findContractIssues(content)
    // Errors only for structural syntax-like problems; everything else is a warning
    const isStructuralError = issues.some(i => (
      i === 'Unmatched braces' ||
      i === 'Unmatched parentheses' ||
      i === 'Unmatched brackets' ||
      i.startsWith('Syntax error: ')
    ))
    if (isStructuralError) return 'error'
    return issues.length > 0 ? 'warning' : 'healthy'
  }

  // Split issues into error vs warning categories for accurate counting
  private splitIssueTypes (issues: string[]): { errorIssues: string[]; warningIssues: string[] } {
    const errorIssues: string[] = []
    const warningIssues: string[] = []
    for (const i of issues) {
      if (
        i === 'Unmatched braces' ||
        i === 'Unmatched parentheses' ||
        i === 'Unmatched brackets' ||
        i.startsWith('Syntax error: ')
      ) errorIssues.push(i)
      else warningIssues.push(i)
    }
    return { errorIssues, warningIssues }
  }

  private findContractIssues (content: string): string[] {
    const issues: string[] = []

    // Real syntax errors (parse only, do not execute)
    try {
      // Use Node's parser to validate syntax without running code
      new vm.Script(content)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      issues.push('Syntax error: ' + msg)
    }
    // Structural sanity checks only (avoid false positives from string contents)
    const openBraces = (content.match(/\{/g) || []).length
    const closeBraces = (content.match(/\}/g) || []).length
    if (openBraces !== closeBraces) issues.push('Unmatched braces')

    const openParens = (content.match(/\(/g) || []).length
    const closeParens = (content.match(/\)/g) || []).length
    if (openParens !== closeParens) issues.push('Unmatched parentheses')

    const openBrackets = (content.match(/\[/g) || []).length
    const closeBrackets = (content.match(/\]/g) || []).length
    if (openBrackets !== closeBrackets) issues.push('Unmatched brackets')

    // Contract-specific checks
    if (!content.includes('actions:')) issues.push('Missing actions object')
    if (!content.includes('getters:')) issues.push('Missing getters object')
    if (!content.includes('methods:')) issues.push('Missing methods object')
    if (content.length < 100) issues.push('Contract appears incomplete (too short)')

    return issues
  }

  private extractDependencies (content: string): string[] {
    const deps: string[] = []
    const matches = content.match(/from\s+['"]([^'"]+)['"]/g)
    if (matches) for (const m of matches) {
      const mm = m.match(/from\s+['"]([^'"]+)['"]/)
      if (mm && mm[1]) deps.push(mm[1])
    }
    return [...new Set(deps)]
  }

  private setupWatchers () {
    console.log(colors.blue('👁️  Setting up intelligent file watching...'))
    const contractsDir = join(this.projectRoot, 'contracts')
    if (!existsSync(contractsDir)) return
    const debounced: Record<string, number> = {}
    const watcher = watch(contractsDir, { recursive: true }, async (event: string, filename: string | null) => {
      if (this.options.debug) console.log(colors.gray(`🔍 File event: ${event} on ${filename}`))
      if (!filename || !filename.endsWith('.js')) {
        if (this.options.debug) console.log(colors.gray(`⏭️  Skipping non-JS file: ${filename}`))
        return
      }

      // Normalize to unique relative path (choose most recently modified on ambiguity)
      const normalizedKey = await this.normalizeContractKey(filename)
      if (this.options.debug) console.log(colors.gray(`🔑 Using key: ${normalizedKey}`))

      // Debounce duplicate events for the same file within 300ms
      const now = Date.now()
      if (debounced[normalizedKey] && now - debounced[normalizedKey] < 800) return
      debounced[normalizedKey] = now

      // Allow file system to settle to avoid stale reads
      await new Promise((r) => setTimeout(r, 120))

      const changed = await this.updateContractHealth(normalizedKey)
      if (this.options.debug) console.log(colors.gray(`📝 Content changed: ${changed}`))
      if (!changed) {
        if (this.options.debug) console.log(colors.gray('⏭️  No content change detected, skipping'))
        return // no real content change
      }

      this.metrics.changesDetected++
      console.log(colors.yellow(`🔄 Contract changed: ${normalizedKey}`))

      // Show immediate feedback about contract health
      const health = this.contractsHealth.get(normalizedKey)
      if (health) {
        if (health.status === 'error') {
          console.log(colors.red(`❌ ${normalizedKey} has ${health.issues.length} issue(s): ${health.issues.join(', ')}`))
        } else if (health.status === 'warning') {
          console.log(colors.yellow(`⚠️  ${normalizedKey} has ${health.issues.length} warning(s): ${health.issues.join(', ')}`))
        } else {
          console.log(colors.green(`✅ ${normalizedKey} is healthy`))
        }
      }

      if (this.options.interactive !== false) this.refreshDashboard()
    })
    this.watchers.push(watcher)
    console.log(colors.green('✅ File watching active'))
  }

  private async updateContractHealth (filename: string): Promise<boolean> {
    try {
      // Handle both direct files and files in subdirectories
      const contractsDir = join(this.projectRoot, 'contracts')
      let filePath = join(contractsDir, filename)

      // If the direct path doesn't exist, search in subdirectories
      if (!existsSync(filePath)) {
        const entries = await readdir(contractsDir, { recursive: true })
        const foundFile = (entries as unknown as string[]).find(entry =>
          typeof entry === 'string' && entry.endsWith(filename)
        )
        if (foundFile) {
          filePath = join(contractsDir, foundFile)
        } else {
          throw new Error(`Contract file ${filename} not found`)
        }
      }

      const stats = await stat(filePath)
      // small guard for editors writing in multiple passes
      await new Promise((r) => setTimeout(r, 50))
      const content = await readFile(filePath, 'utf8')
      // Normalize the key to be relative to contracts dir (e.g., "2.0.0/chatroom.js")
      const normalizedKey = filePath.startsWith(contractsDir)
        ? filePath.slice(contractsDir.length + 1)
        : filename

      // Ignore no-op saves by hashing content
      const hash = this.hashContent(content)
      const prev = this.lastHashes.get(normalizedKey)
      if (this.options.debug) console.log(colors.gray(`🔍 Hash check: ${normalizedKey} - prev: ${prev}, new: ${hash}`))
      if (prev === hash) {
        if (this.options.debug) console.log(colors.gray('⏭️  Same content hash, ignoring save'))
        return false
      }
      this.lastHashes.set(normalizedKey, hash)

      const health: ContractHealth = {
        name: normalizedKey.replace('.js', ''),
        status: this.analyzeContractHealth(content),
        lastModified: stats.mtime,
        size: stats.size,
        issues: this.findContractIssues(content),
        dependencies: this.extractDependencies(content)
      }
      this.contractsHealth.set(normalizedKey, health)
      this.metrics.healthChecks++
      return true
    } catch (error) {
      console.error(colors.red(`❌ Error updating health for ${filename}:`), error)
      return false
    }
  }

  // Normalize file key to a stable relative path inside contracts dir.
  // If multiple files match the basename, pick the most recently modified one.
  private async normalizeContractKey (filename: string): Promise<string> {
    const contractsDir = join(this.projectRoot, 'contracts')
    const candidate = join(contractsDir, filename)
    if (existsSync(candidate)) {
      return candidate.slice(contractsDir.length + 1)
    }
    const entries = await readdir(contractsDir, { recursive: true })
    const matches = (entries as unknown as string[]).filter(entry =>
      typeof entry === 'string' && (entry === filename || entry.endsWith('/' + filename))
    )
    if (matches.length === 0) return filename
    if (matches.length === 1) return matches[0]
    // choose by latest mtime
    let best = matches[0]
    let bestTime = 0
    for (const m of matches) {
      try {
        const st = await stat(join(contractsDir, m))
        const t = st.mtime?.getTime?.() ?? 0
        if (t > bestTime) { best = m; bestTime = t }
      } catch {
        // Ignore stat errors for missing files
      }
    }
    return best
  }

  private startInteractiveDashboard () {
    console.log(colors.blue('🎛️  Starting interactive dashboard...'))
    setInterval(() => this.refreshDashboard(), 5000)
    this.setupKeyboardShortcuts()
    console.log(colors.green('✅ Interactive dashboard ready'))
    console.log(colors.gray('Press [h] for help, [q] to quit'))
  }

  private refreshDashboard () {
    if (this.options.debug) this.printDashboardStatus()
  }

  private setupKeyboardShortcuts () {
    if (!process.stdin.isTTY) return
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', async (key: string) => {
      switch (key) {
        case 'h': this.showHelp(); break
        case 'r': await this.refreshContractHealth(); break
        case 's': this.showDetailedStatus(); break
        case 'q':
        case '\u0003': this.gracefulShutdown(); break // Ctrl+C
      }
    })
  }

  private showDetailedStatus () {
    console.log()
    console.log(colors.bold(colors.cyan('🧩 Contracts Status')))
    for (const [file, h] of this.contractsHealth.entries()) {
      console.log(`- ${file}: ${h.status} (${h.size}B, updated ${h.lastModified?.toISOString?.() || h.lastModified})`)
      if (h.issues.length) console.log('  issues:', h.issues.join('; '))
      if (h.dependencies.length) console.log('  deps:', h.dependencies.join(', '))
    }
  }

  private startPerformanceMonitoring () {
    setInterval(() => { this.metrics.uptime = Math.floor((Date.now() - this.startTime.getTime()) / 1000) }, 1000)
  }

  private printDashboardStatus () {
    console.log()
    console.log(colors.bold(colors.cyan('📊 DEVELOPMENT DASHBOARD STATUS')))
    console.log(colors.gray('═'.repeat(50)))
    const counts = { healthyFiles: 0, warningFiles: 0, errorFiles: 0, errors: 0, warnings: 0 }
    for (const h of this.contractsHealth.values()) {
      if (h.status === 'healthy') counts.healthyFiles++
      else if (h.status === 'warning') counts.warningFiles++
      else counts.errorFiles++
      const { errorIssues, warningIssues } = this.splitIssueTypes(h.issues)
      counts.errors += errorIssues.length
      counts.warnings += warningIssues.length
    }
    console.log(
      colors.green(`✅ Healthy files: ${counts.healthyFiles}`),
      colors.yellow(`⚠️  Warning files: ${counts.warningFiles}`),
      colors.red(`❌ Error files: ${counts.errorFiles}`)
    )
    console.log(
      colors.red(`Errors: ${counts.errors}`),
      colors.yellow(`Warnings: ${counts.warnings}`)
    )
    console.log()
    console.log(colors.bold('📈 Metrics:'))
    console.log(`   Contracts Watched: ${this.metrics.contractsWatched}`)
    console.log(`   Changes Detected: ${this.metrics.changesDetected}`)
    console.log(`   Health Checks: ${this.metrics.healthChecks}`)
    console.log(`   Uptime: ${this.formatUptime(this.metrics.uptime)}`)
    console.log(colors.gray('═'.repeat(50)))
  }

  private formatUptime (seconds: number): string { const h = Math.floor(seconds/3600); const m = Math.floor((seconds%3600)/60); const s = seconds%60; return `${h}h ${m}m ${s}s` }

  private setupGracefulShutdown () { process.on('SIGINT', () => this.gracefulShutdown()); process.on('SIGTERM', () => this.gracefulShutdown()) }

  private gracefulShutdown () {
    console.log(colors.yellow('\n🛑 Shutting down development dashboard...'))
    for (const w of this.watchers) { if (w && typeof w === 'object' && 'close' in w && typeof w.close === 'function') w.close() }
    console.log(colors.cyan('📊 Final: changes=' + this.metrics.changesDetected + ', uptime=' + this.formatUptime(this.metrics.uptime)))
    console.log(colors.green('✅ Development dashboard stopped'))
    process.exit(0)
  }

  private async refreshContractHealth () { await this.initializeContractHealth(); this.printDashboardStatus() }

  private showHelp () {
    console.log()
    console.log(colors.bold(colors.cyan('🎛️  CHEL DEV DASHBOARD - SHORTCUTS')))
    console.log(colors.gray('═'.repeat(50)))
    console.log(colors.white('[h]') + ' help   ' + colors.white('[r]') + ' refresh   ' + colors.white('[s]') + ' status   ' + colors.white('[q]') + ' quit')
    console.log(colors.gray('═'.repeat(50)))
  }

  stop () {
    console.log(colors.yellow('🛑 Stopping development dashboard...'))

    // Stop file watchers
    for (const watcher of this.watchers) {
      if (watcher && typeof watcher === 'object' && 'close' in watcher && typeof watcher.close === 'function') {
        watcher.close()
      }
    }

    console.log(colors.green('✅ Development dashboard stopped'))
  }
}

export async function dev (args: string[]) {
  const { directory, options } = parseDevArgs(args)

  const dashboard = new DevDashboard(directory, options)

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await dashboard.stop()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    await dashboard.stop()
    process.exit(0)
  })

  try {
    await dashboard.init()

    // Keep the process alive
    await new Promise(() => {}) // Never resolves
  } catch (error) {
    console.error(colors.red('Development server error:'), error)
    await dashboard.stop()
    process.exit(1)
  }
}

function parseDevArgs (args: string[]): { directory: string; options: DevOptions } {
  const parsed = flags.parse(args, {
    string: ['port', 'dashboard-port'],
    boolean: ['performance', 'interactive', 'debug'],
    default: {
      port: '8000',
      'dashboard-port': '3000',
      performance: true,
      interactive: true,
      debug: false
    },
    alias: {
      p: 'port',
      dp: 'dashboard-port',
      d: 'debug'
    }
  })

  const directory = parsed._[0]?.toString() || '.'
  const options: DevOptions = {
    port: parsed.port ? parseInt(parsed.port as string, 10) : undefined,
    dashboardPort: parsed['dashboard-port'] ? parseInt(parsed['dashboard-port'] as string, 10) : undefined,
    performance: parsed.performance as boolean,
    interactive: parsed.interactive as boolean,
    debug: parsed.debug as boolean
  }

  return { directory, options }
}

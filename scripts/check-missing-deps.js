#!/usr/bin/env node

/**
 * Script to check for missing dependencies in built files
 * This helps identify packages that need to be added to externals.inline
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const OUTPUT_FILE = join(process.cwd(), '.output/server/chunks/nitro/nitro.mjs')

if (!existsSync(OUTPUT_FILE)) {
  console.error('❌ Build file not found. Please run "bun run build" first.')
  process.exit(1)
}

console.log('📦 Scanning built file for dependencies...\n')

const content = readFileSync(OUTPUT_FILE, 'utf-8')

// Extract all imports
const importRegex = /from\s+['"]([^'"]+)['"]/g
const requireRegex = /require\(['"]([^'"]+)['"]\)/g

const imports = new Set()

let match
while ((match = importRegex.exec(content)) !== null) {
  imports.add(match[1])
}

while ((match = requireRegex.exec(content)) !== null) {
  imports.add(match[1])
}

// Filter out Node.js built-ins and relative imports
const nodeBuiltins = new Set([
  'fs', 'path', 'crypto', 'http', 'https', 'net', 'tls', 'stream', 'util',
  'events', 'buffer', 'url', 'querystring', 'zlib', 'timers',
  'node:fs', 'node:path', 'node:crypto', 'node:http', 'node:https',
  'node:net', 'node:tls', 'node:stream', 'node:util', 'node:events',
  'node:buffer', 'node:url', 'node:querystring', 'node:zlib', 'node:timers'
])

const externalDeps = Array.from(imports)
  .filter(dep => {
    // Skip Node.js built-ins
    if (nodeBuiltins.has(dep)) return false
    // Skip relative imports
    if (dep.startsWith('.')) return false
    // Skip internal aliases
    if (dep.startsWith('#')) return false
    // Skip already handled packages
    if (dep === 'utf-8-validate' || dep === 'bufferutil') return false
    return true
  })
  .sort()

console.log('📋 External dependencies found in build:\n')
externalDeps.forEach(dep => {
  console.log(`  - ${dep}`)
})

console.log(`\n✅ Found ${externalDeps.length} external dependencies`)
console.log('\n💡 Add missing packages to externals.inline in nuxt.config.ts')


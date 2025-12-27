import { copyFileSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

// Copy shared directory to .output/shared
const sharedSrc = join(rootDir, 'shared')
const sharedDest = join(rootDir, '.output', 'shared')

try {
  console.log('📁 Copying shared directory to .output/shared...')
  copyDir(sharedSrc, sharedDest)
  console.log('✅ Successfully copied shared directory')
} catch (error) {
  console.error('❌ Error copying shared directory:', error)
  process.exit(1)
}

// Fix EventEmitter import issue in bundle
const indexPath = join(rootDir, '.output', 'server', 'index.mjs')

try {
  if (existsSync(indexPath)) {
    console.log('🔧 Fixing EventEmitter imports in bundle...')
    let content = readFileSync(indexPath, 'utf8')
    
    // Fix EventEmitter imports - replace bundled events with node:events
    // Pattern: const EventEmitter$a = require$$0$7;
    // Replace with: import { EventEmitter as EventEmitter$a } from 'node:events';
    
    // First, find all EventEmitter assignments and collect variable names
    const eventEmitterPattern = /const (EventEmitter\$[a-z0-9]+) = (require\$\$0\$[0-9]+);/g
    const eventEmitterMatches = [...content.matchAll(eventEmitterPattern)]
    
    // Collect all EventEmitter variable names and their require variables
    const eventEmitterVars = new Map()
    for (const match of eventEmitterMatches) {
      eventEmitterVars.set(match[1], match[2])
    }
    
    // Replace EventEmitter assignments with imports at the top
    if (eventEmitterVars.size > 0) {
      // Remove old const assignments first - need to escape $ in regex
      for (const [varName, requireVar] of eventEmitterVars) {
        // Escape special characters in variable names for regex
        const escapedVarName = varName.replace(/\$/g, '\\$')
        const escapedRequireVar = requireVar.replace(/\$/g, '\\$')
        // Remove the const declaration line (with optional newline)
        const pattern = new RegExp(`const ${escapedVarName} = ${escapedRequireVar};\\n?`, 'g')
        content = content.replace(pattern, '')
      }
      
      // Add import statements at the top (after existing imports)
      const importStatements = Array.from(eventEmitterVars.keys()).map(varName => {
        return `import { EventEmitter as ${varName} } from 'node:events';`
      }).join('\n')
      
      // Find the last import statement and add after it
      const importLines = content.split('\n')
      let lastImportIndex = -1
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i
        }
      }
      
      if (lastImportIndex >= 0) {
        // Insert after last import
        importLines.splice(lastImportIndex + 1, 0, importStatements)
        content = importLines.join('\n')
      } else {
        // If no imports, add at the beginning
        content = importStatements + '\n' + content
      }
    }
    
    // Also fix default imports from 'events'
    content = content.replace(
      /import (require\$\$0\$[0-9]+__default) from 'events';/g,
      "import { EventEmitter as $1 } from 'node:events';"
    )
    content = content.replace(
      /import \* as (require\$\$0\$[0-9]+\$[0-9]+) from 'events';/g,
      "import * as $1 from 'node:events';"
    )
    
    // Fix debug module issue - replace getDefaultExportFromNamespaceIfNotNamed with direct import
    // Pattern: const require$$13 = getDefaultExportFromNamespaceIfNotNamed(debug$i);
    // Replace with: import debugModule from 'debug'; const require$$13 = debugModule;
    const debugPattern = /const (require\$\$[0-9]+) = \/\*@__PURE__\*\/getDefaultExportFromNamespaceIfNotNamed\(debug\$[a-z0-9]+\);/g
    const debugMatches = [...content.matchAll(debugPattern)]
    
    if (debugMatches.length > 0) {
      // Find all debug require variables
      const debugRequires = new Map()
      for (const match of debugMatches) {
        debugRequires.set(match[1], match[0])
      }
      
      // Also find and remove const debugModule = require$$13; declarations
      const debugModulePattern = /const debugModule = (require\$\$[0-9]+);/g
      const debugModuleMatches = [...content.matchAll(debugModulePattern)]
      for (const match of debugModuleMatches) {
        const requireVar = match[1]
        // Remove the const debugModule declaration
        content = content.replace(
          new RegExp(`const debugModule = ${requireVar.replace(/\$/g, '\\$')};\\n?`, 'g'),
          ''
        )
      }
      
      // Remove old assignments first - need to escape all special regex characters
      for (const [requireVar, fullMatch] of debugRequires) {
        // Escape all special regex characters
        const escapedMatch = fullMatch
          .replace(/\\/g, '\\\\')
          .replace(/\$/g, '\\$')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/\*/g, '\\*')
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')
          .replace(/\{/g, '\\{')
          .replace(/\}/g, '\\}')
          .replace(/\?/g, '\\?')
          .replace(/\+/g, '\\+')
          .replace(/\|/g, '\\|')
          .replace(/\^/g, '\\^')
        // Remove with optional newline
        content = content.replace(new RegExp(escapedMatch + '\\n?', 'g'), '')
      }
      
      // Add import statement and assignments
      // Use a single import and assign to all require variables
      const requireVars = Array.from(debugRequires.keys())
      const debugImport = `import debugModule from 'debug';` + '\n' + 
        requireVars.map(reqVar => `const ${reqVar} = debugModule;`).join('\n')
      
      // Insert after last import
      const importLines = content.split('\n')
      let lastImportIndex = -1
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i
        }
      }
      
      if (lastImportIndex >= 0) {
        importLines.splice(lastImportIndex + 1, 0, debugImport)
        content = importLines.join('\n')
      } else {
        content = debugImport + '\n' + content
      }
    }
    
    // Fix util module issue - replace bundled util with node:util
    // Pattern: var util$a = require$$0$3; or util$a.inherits(...) or util.inherits(...)
    // Replace with: import { inherits } from 'node:util'; const util$a = { inherits };
    
    // First, find and remove old util variable declarations
    const utilVarPattern = /(var|const|let)\s+(util\$[a-z0-9]+)\s*=\s*(require\$\$[0-9]+\$[0-9]+|require\$\$[0-9]+);/g
    const utilVarMatches = [...content.matchAll(utilVarPattern)]
    
    const utilVars = new Set()
    for (const match of utilVarMatches) {
      utilVars.add(match[2]) // variable name
      // Remove the declaration
      const escapedMatch = match[0].replace(/\$/g, '\\$').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
      content = content.replace(new RegExp(escapedMatch + '\\n?', 'g'), '')
    }
    
    // Also find util variables used in .inherits calls
    const utilPattern = /(util\$[a-z0-9]+)\.inherits|util\.inherits/g
    const utilMatches = [...content.matchAll(utilPattern)]
    
    for (const match of utilMatches) {
      if (match[1]) {
        utilVars.add(match[1])
      }
    }
    
    if (utilVars.size > 0 || utilMatches.length > 0) {
      // Add import for inherits from node:util
      const utilImports = []
      utilImports.push(`import { inherits } from 'node:util';`)
      
      // Assign inherits to all util variables
      for (const utilVar of utilVars) {
        utilImports.push(`const ${utilVar} = { inherits };`)
      }
      
      // Also replace plain util.inherits with utilInherits
      if (content.includes('util.inherits(')) {
        utilImports.push(`import { inherits as utilInherits } from 'node:util';`)
        content = content.replace(/util\.inherits\(/g, 'utilInherits(')
      }
      
      // Insert after last import
      const importLines = content.split('\n')
      let lastImportIndex = -1
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i
        }
      }
      
      if (lastImportIndex >= 0) {
        importLines.splice(lastImportIndex + 1, 0, ...utilImports)
        content = importLines.join('\n')
      } else {
        content = utilImports.join('\n') + '\n' + content
      }
    }
    
    // Fix stream module issue - replace require$$2$2 with node:stream
    // Pattern: var Stream$2 = require$$2$2; or var Stream = require$$2$2;
    // Replace with: import { Stream } from 'node:stream'; const Stream$2 = Stream;
    const streamPattern = /(var|const|let)\s+(Stream\$?[a-z0-9]*)\s*=\s*(require\$\$[0-9]+\$[0-9]+);/g
    const streamMatches = [...content.matchAll(streamPattern)]
    
    if (streamMatches.length > 0) {
      const streamVars = new Map()
      for (const match of streamMatches) {
        streamVars.set(match[2], match[3]) // variable name, require variable
        // Remove the declaration
        const escapedMatch = match[0].replace(/\$/g, '\\$')
        content = content.replace(new RegExp(escapedMatch + '\\n?', 'g'), '')
      }
      
      // Add import statements
      const streamImports = []
      streamImports.push(`import { Stream as StreamBase } from 'node:stream';`)
      for (const [streamVar, requireVar] of streamVars) {
        streamImports.push(`const ${streamVar} = StreamBase;`)
      }
      
      // Insert after last import
      const importLines = content.split('\n')
      let lastImportIndex = -1
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i
        }
      }
      
      if (lastImportIndex >= 0) {
        importLines.splice(lastImportIndex + 1, 0, ...streamImports)
        content = importLines.join('\n')
      } else {
        content = streamImports.join('\n') + '\n' + content
      }
    }
    
    // Fix buffer module issue - replace buffer.hasOwnProperty with Object.prototype.hasOwnProperty.call
    // Pattern: buffer.hasOwnProperty(key)
    // Replace with: Object.prototype.hasOwnProperty.call(buffer, key)
    content = content.replace(
      /buffer\.hasOwnProperty\(([^)]+)\)/g,
      'Object.prototype.hasOwnProperty.call(buffer, $1)'
    )
    
    // Fix ws module issue - replace ws_1.Server with WebSocketServer from ws
    // Pattern: wsEngine: ws_1.Server
    // Replace with: import { WebSocketServer as WsServer } from 'ws'; wsEngine: WsServer
    const wsPattern = /wsEngine:\s*ws_1\.Server/g
    if (wsPattern.test(content)) {
      // Check if WsServer is already imported
      if (!content.includes('import { WebSocketServer as WsServer }')) {
        // Add import
        const importLines = content.split('\n')
        let lastImportIndex = -1
        for (let i = 0; i < importLines.length; i++) {
          if (importLines[i].trim().startsWith('import ')) {
            lastImportIndex = i
          }
        }
        
        if (lastImportIndex >= 0) {
          importLines.splice(lastImportIndex + 1, 0, `import { WebSocketServer as WsServer } from 'ws';`)
          content = importLines.join('\n')
        } else {
          content = `import { WebSocketServer as WsServer } from 'ws';\n` + content
        }
      }
      // Replace ws_1.Server with WsServer
      content = content.replace(/wsEngine:\s*ws_1\.Server/g, 'wsEngine: WsServer')
      // Also fix const ws_1 = require$$8; if it exists
      content = content.replace(/const ws_1 = require\$\$[0-9]+;/g, '')
    }
    
    writeFileSync(indexPath, content, 'utf8')
    console.log('✅ Fixed EventEmitter, debug, util, stream, buffer, and ws imports in bundle')
  }
} catch (error) {
  console.warn('⚠️ Could not fix imports:', error)
}


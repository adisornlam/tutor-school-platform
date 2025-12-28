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
    // Pattern 1: const EventEmitter$a = require$$0$7;
    const eventEmitterPattern1 = /const (EventEmitter\$[a-z0-9]+) = (require\$\$0\$[0-9]+);/g
    const eventEmitterMatches1 = [...content.matchAll(eventEmitterPattern1)]
    
    // Pattern 2: const EventEmitter$a = require$$0$b; (namespace import)
    const eventEmitterPattern2 = /const (EventEmitter\$[a-z0-9]+) = (require\$\$0\$[a-z0-9]+);/g
    const eventEmitterMatches2 = [...content.matchAll(eventEmitterPattern2)]
    
    // Combine all matches
    const allEventEmitterMatches = [...eventEmitterMatches1, ...eventEmitterMatches2]
    
    // Collect all EventEmitter variable names and their require variables
    const eventEmitterVars = new Map()
    for (const match of allEventEmitterMatches) {
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
    
    // Fix: const EventEmitter = require$$0$3__default;
    // Replace with: const EventEmitter = EventEmitter$b; (using the imported one)
    const defaultEventEmitterPattern = /const EventEmitter = (require\$\$0\$[0-9]+__default);/g
    const defaultEventEmitterMatches = [...content.matchAll(defaultEventEmitterPattern)]
    
    if (defaultEventEmitterMatches.length > 0) {
      // Find the first imported EventEmitter variable
      const importedEventEmitterMatch = content.match(/import \{ EventEmitter as (EventEmitter\$[a-z0-9]+) \} from 'node:events';/)
      if (importedEventEmitterMatch) {
        const importedVarName = importedEventEmitterMatch[1]
        for (const match of defaultEventEmitterMatches) {
          const escapedRequireVar = match[1].replace(/\$/g, '\\$')
          content = content.replace(
            new RegExp(`const EventEmitter = ${escapedRequireVar};`, 'g'),
            `const EventEmitter = ${importedVarName};`
          )
        }
      }
    }
    content = content.replace(
      /import \* as (require\$\$0\$[0-9]+\$[0-9]+) from 'events';/g,
      "import * as $1 from 'node:events';"
    )
    
    // Fix debug module issue
    // Find the bundled debug module variable - look for debug$n = Object.assign(createDebug, {
    const bundledDebugVarMatch = content.match(/const (debug\$[a-z0-9]+) = Object\.assign\(createDebug, \{/)
    let bundledDebugVar = bundledDebugVarMatch ? bundledDebugVarMatch[1] : null
    
    // If not found, try to find any debug$ variable
    if (!bundledDebugVar) {
      const debugModuleVarPattern = /const (debug\$[a-z0-9]+)\s*=/g
      const debugModuleVarMatches = [...content.matchAll(debugModuleVarPattern)]
      if (debugModuleVarMatches.length > 0) {
        // Use the first bundled debug module (usually debug$h or debug$n)
        bundledDebugVar = debugModuleVarMatches[0][1]
      }
    }
    
    if (bundledDebugVar) {
      // Find and replace ALL const debugModule = require$$...; declarations
      // Pattern 1: const debugModule = require$$0$a; (with $a suffix)
      const debugModulePattern1 = /const debugModule = (require\$\$[0-9]+\$[a-z0-9]+);/g
      const debugModuleMatches1 = [...content.matchAll(debugModulePattern1)]
      
      // Pattern 2: const debugModule = require$$0; (without suffix)
      const debugModulePattern2 = /const debugModule = (require\$\$[0-9]+);/g
      const debugModuleMatches2 = [...content.matchAll(debugModulePattern2)]
      
      // Combine all matches
      const allDebugModuleMatches = [...debugModuleMatches1, ...debugModuleMatches2]
      
      for (const match of allDebugModuleMatches) {
        const requireVar = match[1]
        // Replace with bundled debug module
        const escapedRequireVar = requireVar.replace(/\$/g, '\\$')
        content = content.replace(
          new RegExp(`const debugModule = ${escapedRequireVar};`, 'g'),
          `const debugModule = ${bundledDebugVar};`
        )
      }
      
      // Also replace patterns like: const require$$13 = getDefaultExportFromNamespaceIfNotNamed(debug$i);
      const debugPattern = /const (require\$\$[0-9]+) = \/\*@__PURE__\*\/getDefaultExportFromNamespaceIfNotNamed\(debug\$[a-z0-9]+\);/g
      const debugMatches = [...content.matchAll(debugPattern)]
      
      for (const match of debugMatches) {
        const requireVar = match[1]
        const escapedRequireVar = requireVar.replace(/\$/g, '\\$')
        content = content.replace(
          new RegExp(`const ${escapedRequireVar} = /\\*@__PURE__\\*/getDefaultExportFromNamespaceIfNotNamed\\(debug\\$[a-z0-9]+\\);`, 'g'),
          `const ${requireVar} = ${bundledDebugVar};`
        )
      }
      
      // Find all debug require variables for later use
      const debugRequires = new Map()
      for (const match of debugMatches) {
        debugRequires.set(match[1], match[0])
      }
      
      if (bundledDebugVar) {
        // Replace patterns like: (0, debug_1$4.default)("socket.io:socket")
        // with: debug$n("socket.io:socket")
        content = content.replace(
          /\(0, (debug_[0-9]+\$?[a-z0-9]*)\.default\)\("([^"]+)"\)/g,
          `${bundledDebugVar}("$2")`
        )
        
        // Replace patterns like: const debug$b = (0, debug_1$4.default)("socket.io:socket");
        // with: const debug$b = debug$n("socket.io:socket");
        content = content.replace(
          /const (debug\$[a-z0-9]+) = \(0, (debug_[0-9]+\$?[a-z0-9]*)\.default\)\("([^"]+)"\);/g,
          `const $1 = ${bundledDebugVar}("$3");`
        )
        
        // Replace patterns like: const debug = (0, debug_1.default)("socket.io:namespace");
        // with: const debug = debug$n("socket.io:namespace");
        content = content.replace(
          /const (debug) = \(0, (debug_[0-9]+\$?[a-z0-9]*)\.default\)\("([^"]+)"\);/g,
          `const $1 = ${bundledDebugVar}("$3");`
        )
        
        // Also replace all .default accesses on debug variables
        // Pattern: debug_1$4.default or debug_1.default -> debug$n
        const debugDefaultPattern = /(debug_[0-9]+\$?[a-z0-9]*)\.default/g
        content = content.replace(debugDefaultPattern, bundledDebugVar)
        
        // Replace (0, debug_1$4) or (0, debug_1) pattern with just debug$n
        content = content.replace(
          /\(0, (debug_[0-9]+\$?[a-z0-9]*)\)/g,
          bundledDebugVar
        )
        // Replace old assignments with assignments to bundled debug module
        for (const [requireVar, fullMatch] of debugRequires) {
          // Replace the assignment
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
          // Replace with assignment to bundled debug
          content = content.replace(
            new RegExp(escapedMatch, 'g'),
            `const ${requireVar} = ${bundledDebugVar};`
          )
        }
        
        // Also replace any remaining uses of require$$ variables that reference debug
        // Pattern: const debug_1$c = require$$13; or const debug_1$3 = __importDefault$2(require$$13);
        const debugVarPattern = /const (debug_[a-z0-9]+\$[a-z0-9]+)\s*=\s*(__importDefault[^\(]*\()?(require\$\$[0-9]+)(\))?;/g
        const debugVarMatches = [...content.matchAll(debugVarPattern)]
        for (const match of debugVarMatches) {
          const varName = match[1]
          const importDefault = match[2] || ''
          const requireVar = match[3]
          const closingParen = match[4] || ''
          // Check if this requireVar is one we're replacing
          if (debugRequires.has(requireVar)) {
            // Replace with bundled debug module (remove __importDefault wrapper)
            content = content.replace(
              new RegExp(`const ${varName.replace(/\$/g, '\\$')}\\s*=\\s*${importDefault.replace(/[()]/g, '\\$&')}${requireVar.replace(/\$/g, '\\$')}${closingParen.replace(/[()]/g, '\\$&')};`, 'g'),
              `const ${varName} = ${bundledDebugVar};`
            )
            // Also replace .default access and function calls
            // debug$h is a function, so we can use it directly
            content = content.replace(
              new RegExp(`${varName.replace(/\$/g, '\\$')}\\.default`, 'g'),
              bundledDebugVar
            )
            // Replace (0, debug_1$3) pattern with just debug$h
            content = content.replace(
              new RegExp(`\\(0\\s*,\\s*${varName.replace(/\$/g, '\\$')}\\)`, 'g'),
              bundledDebugVar
            )
          }
        }
        
        // Also replace any direct uses of require$$13 that we're tracking
        for (const requireVar of debugRequires.keys()) {
          // Replace standalone require$$13 with bundled debug
          content = content.replace(
            new RegExp(`\\b${requireVar.replace(/\$/g, '\\$')}\\b`, 'g'),
            bundledDebugVar
          )
        }
        
        // Replace debug_1.debug pattern with debug$h
        if (bundledDebugVar) {
          content = content.replace(
            /debug_1\$?[a-z0-9]*\.debug/g,
            bundledDebugVar
          )
        }
      } else {
        // If debug is not bundled, don't remove the assignments
        // Just leave them as is - they should work if debug is in externals.inline
        console.warn('⚠️ Warning: debug module variable not found in bundle, leaving original assignments')
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
    
    // Fix ws module issue - replace ws_1.Server with bundled WebSocketServer
    // Pattern: wsEngine: ws_1.Server
    // ws should be bundled via externals.inline, so find the bundled WebSocketServer
    const wsPattern = /wsEngine:\s*ws_1\.Server/g
    if (wsPattern.test(content)) {
      // Find bundled WebSocketServer class
      // Look for: class WebSocketServer extends EventEmitter
      const bundledWsPattern = /class (WebSocketServer\$?[a-z0-9]*) extends EventEmitter/g
      const bundledWsMatches = [...content.matchAll(bundledWsPattern)]
      
      let bundledWsServer = null
      if (bundledWsMatches.length > 0) {
        // Use the first WebSocketServer class found
        bundledWsServer = bundledWsMatches[0][1]
      } else {
        // Try to find WebSocketServer variable
        const wsVarPattern = /(WebSocketServer\$?[a-z0-9]*)\s*=\s*class WebSocketServer/g
        const wsVarMatches = [...content.matchAll(wsVarPattern)]
        if (wsVarMatches.length > 0) {
          bundledWsServer = wsVarMatches[0][1]
        }
      }
      
      if (bundledWsServer) {
        // Replace ws_1.Server with bundled WebSocketServer
        content = content.replace(/wsEngine:\s*ws_1\.Server/g, `wsEngine: ${bundledWsServer}`)
        // Also fix const ws_1 = require$$8; if it exists
        content = content.replace(/const ws_1 = require\$\$[0-9]+;/g, '')
        // Remove any import statements for ws that we might have added
        content = content.replace(/import\s+\{\s*WebSocketServer\s+as\s+WsServer\s*\}\s+from\s+['"]ws['"];\s*\n?/g, '')
      } else {
        console.warn('⚠️ Warning: WebSocketServer not found in bundle, leaving original code')
      }
    }
    
    // Remove any remaining import statements for ws (ws should be bundled)
    // Remove all import statements that import from 'ws'
    const lines = content.split('\n')
    const filteredLines = lines.filter(line => {
      // Skip lines that import from 'ws'
      if (line.trim().startsWith('import ') && line.includes("from 'ws'") || line.includes('from "ws"')) {
        return false
      }
      return true
    })
    content = filteredLines.join('\n')
    
    writeFileSync(indexPath, content, 'utf8')
    console.log('✅ Fixed EventEmitter, debug, util, stream, buffer, and ws imports in bundle')
  }
} catch (error) {
  console.warn('⚠️ Could not fix imports:', error)
}


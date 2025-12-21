import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
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


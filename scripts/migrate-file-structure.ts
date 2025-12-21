import mysql from 'mysql2/promise'
import { readdir, stat, mkdir, rename, access } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * Migration script to reorganize uploaded files from flat structure to entity-based structure
 * 
 * OLD: public/uploads/courses/{filename}
 * NEW: public/uploads/courses/{courseId}/{filename}
 * 
 * This script:
 * 1. Reads all files from public/uploads/courses/
 * 2. For each file, tries to find the corresponding course by thumbnail_url in database
 * 3. Moves files to the new structure: public/uploads/courses/{courseId}/
 * 4. Files that can't be mapped are moved to public/uploads/courses/_unmapped/
 */

// Load .env file if exists
try {
  const { readFileSync } = await import('fs')
  const envContent = readFileSync('.env', 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
    if (key && value && !process.env[key.trim()]) {
      process.env[key.trim()] = value
    }
  })
} catch (error) {
  // .env file not found, use defaults
}

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

const UPLOADS_BASE = join(process.cwd(), 'public', 'uploads')
const COURSES_OLD_DIR = join(UPLOADS_BASE, 'courses')
const COURSES_NEW_BASE = join(UPLOADS_BASE, 'courses')

async function main() {
  console.log('🚀 Starting file structure migration...\n')

  // Check if old directory exists
  if (!existsSync(COURSES_OLD_DIR)) {
    console.log('✅ No old uploads directory found. Migration not needed.')
    return
  }

  let connection: mysql.Connection | null = null

  try {
    // Connect to database
    console.log('📦 Connecting to database...')
    connection = await mysql.createConnection(DB_CONFIG)
    console.log('✅ Connected to database\n')

    // Get all files from old directory (excluding directories)
    console.log('📂 Reading files from old directory...')
    const files = await readdir(COURSES_OLD_DIR)
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = join(COURSES_OLD_DIR, file)
        const stats = await stat(filePath)
        return { name: file, path: filePath, isFile: stats.isFile() }
      })
    )
    const imageFiles = fileStats.filter(f => f.isFile && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
    
    console.log(`Found ${imageFiles.length} image files\n`)

    if (imageFiles.length === 0) {
      console.log('✅ No files to migrate.')
      return
    }

    // Track migration results
    let migratedCount = 0
    let unmappedCount = 0
    const unmappedFiles: string[] = []

    // Create unmapped directory
    const unmappedDir = join(COURSES_NEW_BASE, '_unmapped')
    if (!existsSync(unmappedDir)) {
      await mkdir(unmappedDir, { recursive: true })
    }

    // Process each file
    for (const file of imageFiles) {
      const filename = file.name
      const publicUrl = `/uploads/courses/${filename}`

      try {
        // Try to find course by thumbnail_url
        const [rows] = await connection.query<any[]>(
          'SELECT id, thumbnail_url FROM courses WHERE thumbnail_url = ? OR thumbnail_url LIKE ?',
          [publicUrl, `%${filename}%`]
        )

        if (rows.length > 0) {
          // Found matching course(s) - use the first one
          const courseId = rows[0].id
          const newDir = join(COURSES_NEW_BASE, courseId.toString())

          // Create course directory if it doesn't exist
          if (!existsSync(newDir)) {
            await mkdir(newDir, { recursive: true })
          }

          // Determine new filename based on what it is
          // If it matches thumbnail_url exactly, it's likely a thumbnail
          // Otherwise, treat as content image
          let newFilename = filename
          if (rows[0].thumbnail_url === publicUrl) {
            // This is a thumbnail - rename to thumbnail.{ext}
            const ext = filename.split('.').pop()
            newFilename = `thumbnail.${ext}`
          } else {
            // Content image - keep original name or rename with timestamp
            const timestamp = Date.now()
            const ext = filename.split('.').pop()
            newFilename = `content-${timestamp}.${ext}`
          }

          const newPath = join(newDir, newFilename)

          // Check if destination file already exists
          try {
            await access(newPath)
            console.log(`⚠️  File already exists: ${newPath}, skipping...`)
            continue
          } catch {
            // File doesn't exist, safe to move
          }

          // Move file
          await rename(file.path, newPath)
          console.log(`✅ Migrated: ${filename} -> courses/${courseId}/${newFilename}`)
          migratedCount++

          // Update database thumbnail_url if this is a thumbnail
          if (rows[0].thumbnail_url === publicUrl && newFilename.startsWith('thumbnail.')) {
            const newUrl = `/uploads/courses/${courseId}/${newFilename}`
            await connection.query(
              'UPDATE courses SET thumbnail_url = ? WHERE id = ?',
              [newUrl, courseId]
            )
            console.log(`   Updated database thumbnail_url to: ${newUrl}`)
          }
        } else {
          // No matching course found - move to unmapped
          const unmappedPath = join(unmappedDir, filename)
          await rename(file.path, unmappedPath)
          console.log(`❓ Unmapped: ${filename} -> courses/_unmapped/${filename}`)
          unmappedCount++
          unmappedFiles.push(filename)
        }
      } catch (error: any) {
        console.error(`❌ Error processing ${filename}:`, error.message)
        unmappedCount++
        unmappedFiles.push(filename)
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary:')
    console.log('='.repeat(50))
    console.log(`✅ Migrated: ${migratedCount} files`)
    console.log(`❓ Unmapped: ${unmappedCount} files`)
    if (unmappedFiles.length > 0) {
      console.log('\nUnmapped files (moved to courses/_unmapped/):')
      unmappedFiles.forEach(f => console.log(`  - ${f}`))
      console.log('\n💡 Please review unmapped files and manually organize them if needed.')
    }
    console.log('='.repeat(50))

  } catch (error: any) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
      console.log('\n✅ Database connection closed')
    }
  }
}

// Run migration
main().catch(console.error)


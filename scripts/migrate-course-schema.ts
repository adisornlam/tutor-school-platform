import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { join } from 'path'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

async function migrateCourseSchema() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating course schema...')
    console.log('')
    
    // Check if columns already exist
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses'`,
      [config.database]
    ) as any[]
    
    const existingColumns = columns.map((c: any) => c.COLUMN_NAME)
    
    // 1. Add new columns to courses table
    console.log('📝 Adding new columns to courses table...')
    
    const newColumns = [
      { name: 'thumbnail_url', sql: 'ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER description' },
      { name: 'code', sql: 'ADD COLUMN code VARCHAR(50) UNIQUE NULL AFTER id' },
      { name: 'slug', sql: 'ADD COLUMN slug VARCHAR(200) UNIQUE NULL AFTER code' },
      { name: 'short_description', sql: 'ADD COLUMN short_description VARCHAR(500) NULL AFTER description' },
      { name: 'grade_from', sql: 'ADD COLUMN grade_from VARCHAR(20) NULL AFTER level' },
      { name: 'grade_to', sql: 'ADD COLUMN grade_to VARCHAR(20) NULL AFTER grade_from' },
      { name: 'course_category', sql: "ADD COLUMN course_category ENUM('regular', 'entrance_exam', 'special', 'intensive') DEFAULT 'regular' AFTER grade_to" },
      { name: 'academic_year', sql: 'ADD COLUMN academic_year INT NULL AFTER course_category' },
      { name: 'semester', sql: "ADD COLUMN semester ENUM('1', '2', 'summer', 'all') DEFAULT 'all' AFTER academic_year" },
      { name: 'objectives', sql: 'ADD COLUMN objectives TEXT NULL AFTER description' },
      { name: 'prerequisites', sql: 'ADD COLUMN prerequisites TEXT NULL AFTER objectives' },
      { name: 'target_audience', sql: 'ADD COLUMN target_audience TEXT NULL AFTER prerequisites' },
      { name: 'average_rating', sql: 'ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.00 AFTER price' },
      { name: 'review_count', sql: 'ADD COLUMN review_count INT DEFAULT 0 AFTER average_rating' }
    ]
    
    for (const column of newColumns) {
      if (existingColumns.includes(column.name)) {
        console.log(`   ⚠️  Column "${column.name}" already exists, skipping...`)
        continue
      }
      
      try {
        await connection.execute(`ALTER TABLE courses ${column.sql}`)
        console.log(`   ✅ Added column: ${column.name}`)
      } catch (error: any) {
        console.log(`   ❌ Error adding column ${column.name}: ${error.message}`)
      }
    }
    
    // Add indexes
    console.log('')
    console.log('📊 Adding indexes...')
    
    const indexes = [
      { name: 'idx_code', sql: 'ADD INDEX idx_code (code)' },
      { name: 'idx_slug', sql: 'ADD INDEX idx_slug (slug)' },
      { name: 'idx_grade_from', sql: 'ADD INDEX idx_grade_from (grade_from)' },
      { name: 'idx_grade_to', sql: 'ADD INDEX idx_grade_to (grade_to)' },
      { name: 'idx_academic_year', sql: 'ADD INDEX idx_academic_year (academic_year)' },
      { name: 'idx_course_category', sql: 'ADD INDEX idx_course_category (course_category)' },
      { name: 'idx_rating', sql: 'ADD INDEX idx_rating (average_rating)' }
    ]
    
    for (const index of indexes) {
      try {
        await connection.execute(`ALTER TABLE courses ${index.sql}`)
        console.log(`   ✅ Added index: ${index.name}`)
      } catch (error: any) {
        if (error.message.includes('Duplicate key name')) {
          console.log(`   ⚠️  Index "${index.name}" already exists, skipping...`)
        } else {
          console.log(`   ❌ Error adding index ${index.name}: ${error.message}`)
        }
      }
    }
    
    // 2. Create course_images table
    console.log('')
    console.log('🖼️  Creating course_images table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        image_type ENUM('thumbnail', 'cover', 'gallery') DEFAULT 'gallery',
        display_order INT DEFAULT 0,
        alt_text VARCHAR(200),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        INDEX idx_course_type (course_id, image_type),
        INDEX idx_display_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_images table')
    
    // 3. Create tags table
    console.log('')
    console.log('🏷️  Creating tags table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created tags table')
    
    // 4. Create course_tags table
    console.log('')
    console.log('🔗 Creating course_tags table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        UNIQUE KEY unique_course_tag (course_id, tag_id),
        INDEX idx_course (course_id),
        INDEX idx_tag (tag_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_tags table')
    
    // 5. Create course_reviews table (optional)
    console.log('')
    console.log('⭐ Creating course_reviews table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        user_id INT NOT NULL,
        enrollment_id INT,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL,
        UNIQUE KEY unique_course_user_review (course_id, user_id),
        INDEX idx_course_rating (course_id, rating),
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_reviews table')
    
    console.log('')
    console.log('✅ Course schema migration completed!')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error migrating course schema:', error.message)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

// Load .env if exists
try {
  const envPath = join(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=')
    if (key && values.length) {
      const value = values.join('=').trim()
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value
      }
    }
  })
} catch (error) {
  // .env file not found, use defaults
}

migrateCourseSchema()


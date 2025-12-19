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

async function migrateCourseSchemaEnhanced() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating enhanced course schema...')
    console.log('')
    
    // ============================================
    // 1. GRADE LEVELS MODULE
    // ============================================
    console.log('📚 Creating grade_levels module...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS grade_levels (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        level_type ENUM('elementary', 'secondary') NOT NULL,
        grade_number INT NOT NULL,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_code (code),
        INDEX idx_type_grade (level_type, grade_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created grade_levels table')
    
    // Insert grade levels
    const gradeLevels = [
      { code: 'P1', name: 'ประถมศึกษาปีที่ 1', type: 'elementary', number: 1, order: 1 },
      { code: 'P2', name: 'ประถมศึกษาปีที่ 2', type: 'elementary', number: 2, order: 2 },
      { code: 'P3', name: 'ประถมศึกษาปีที่ 3', type: 'elementary', number: 3, order: 3 },
      { code: 'P4', name: 'ประถมศึกษาปีที่ 4', type: 'elementary', number: 4, order: 4 },
      { code: 'P5', name: 'ประถมศึกษาปีที่ 5', type: 'elementary', number: 5, order: 5 },
      { code: 'P6', name: 'ประถมศึกษาปีที่ 6', type: 'elementary', number: 6, order: 6 },
      { code: 'M1', name: 'มัธยมศึกษาปีที่ 1', type: 'secondary', number: 1, order: 7 },
      { code: 'M2', name: 'มัธยมศึกษาปีที่ 2', type: 'secondary', number: 2, order: 8 },
      { code: 'M3', name: 'มัธยมศึกษาปีที่ 3', type: 'secondary', number: 3, order: 9 },
      { code: 'M4', name: 'มัธยมศึกษาปีที่ 4', type: 'secondary', number: 4, order: 10 },
      { code: 'M5', name: 'มัธยมศึกษาปีที่ 5', type: 'secondary', number: 5, order: 11 },
      { code: 'M6', name: 'มัธยมศึกษาปีที่ 6', type: 'secondary', number: 6, order: 12 }
    ]
    
    for (const grade of gradeLevels) {
      try {
        await connection.execute(
          `INSERT IGNORE INTO grade_levels (code, name, level_type, grade_number, display_order)
           VALUES (?, ?, ?, ?, ?)`,
          [grade.code, grade.name, grade.type, grade.number, grade.order]
        )
      } catch (error: any) {
        // Ignore duplicate errors
      }
    }
    console.log('   ✅ Inserted grade levels')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_grade_levels (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        grade_level_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (grade_level_id) REFERENCES grade_levels(id) ON DELETE CASCADE,
        UNIQUE KEY unique_course_grade (course_id, grade_level_id),
        INDEX idx_course (course_id),
        INDEX idx_grade (grade_level_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_grade_levels table')
    
    // ============================================
    // 2. PRICING ENHANCEMENT
    // ============================================
    console.log('')
    console.log('💰 Adding pricing columns...')
    
    const [columns] = await connection.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses'`,
      [config.database]
    ) as any[]
    
    const existingColumns = columns.map((c: any) => c.COLUMN_NAME)
    
    // First, add basic columns that might be missing
    const basicColumns = [
      { name: 'code', sql: 'ADD COLUMN code VARCHAR(50) UNIQUE NULL AFTER id' },
      { name: 'slug', sql: 'ADD COLUMN slug VARCHAR(191) NULL AFTER code' },
      { name: 'thumbnail_url', sql: 'ADD COLUMN thumbnail_url VARCHAR(500) NULL AFTER description' },
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
    
    for (const column of basicColumns) {
      if (existingColumns.includes(column.name)) {
        continue
      }
      
      try {
        await connection.execute(`ALTER TABLE courses ${column.sql}`)
        console.log(`   ✅ Added basic column: ${column.name}`)
        existingColumns.push(column.name) // Update list
      } catch (error: any) {
        if (error.code !== 'ER_DUP_FIELDNAME') {
          console.log(`   ⚠️  Error adding basic column ${column.name}: ${error.message}`)
        }
      }
    }
    
    // Refresh columns list
    const [updatedColumns] = await connection.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses'`,
      [config.database]
    ) as any[]
    const updatedExistingColumns = updatedColumns.map((c: any) => c.COLUMN_NAME)
    
    const pricingColumns = [
      { name: 'onsite_price', sql: 'ADD COLUMN onsite_price DECIMAL(10, 2) NULL AFTER price' },
      { name: 'online_price', sql: 'ADD COLUMN online_price DECIMAL(10, 2) NULL AFTER onsite_price' },
      { name: 'exam_date', sql: 'ADD COLUMN exam_date DATETIME NULL AFTER academic_year' },
      { name: 'class_type', sql: "ADD COLUMN class_type ENUM('regular', 'gifted', 'iep', 'ep', 'special', 'foundation') DEFAULT 'regular' AFTER course_category" },
      { name: 'set_number', sql: 'ADD COLUMN set_number VARCHAR(20) NULL AFTER class_type' },
      { name: 'total_sets', sql: 'ADD COLUMN total_sets INT NULL AFTER set_number' },
      { name: 'target_school', sql: 'ADD COLUMN target_school VARCHAR(200) NULL AFTER total_sets' }
    ]
    
    for (const column of pricingColumns) {
      if (updatedExistingColumns.includes(column.name)) {
        console.log(`   ⚠️  Column "${column.name}" already exists, skipping...`)
        continue
      }
      
      try {
        await connection.execute(`ALTER TABLE courses ${column.sql}`)
        console.log(`   ✅ Added column: ${column.name}`)
      } catch (error: any) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ⚠️  Column "${column.name}" already exists, skipping...`)
        } else {
          console.log(`   ❌ Error adding column ${column.name}: ${error.message}`)
        }
      }
    }
    
    // Refresh columns list again for index check
    const [finalColumns] = await connection.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses'`,
      [config.database]
    ) as any[]
    const finalExistingColumns = finalColumns.map((c: any) => c.COLUMN_NAME)
    
    // Add index for class_type if column exists
    if (finalExistingColumns.includes('class_type')) {
      try {
        const [indexes] = await connection.execute(
          `SELECT INDEX_NAME 
           FROM INFORMATION_SCHEMA.STATISTICS 
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'courses' AND INDEX_NAME = 'idx_class_type'`,
          [config.database]
        ) as any[]
        
        if (indexes.length === 0) {
          await connection.execute('ALTER TABLE courses ADD INDEX idx_class_type (class_type)')
          console.log('   ✅ Added index: idx_class_type')
        }
      } catch (error: any) {
        // Index might already exist, ignore
      }
    }
    
    // ============================================
    // 3. INCLUSIONS MODULE
    // ============================================
    console.log('')
    console.log('🎁 Creating inclusions module...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS inclusions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created inclusions table')
    
    const inclusions = [
      { code: 'TEXTBOOK', name: 'ตำรา', description: 'ตำราหรือเอกสารประกอบการเรียน' },
      { code: 'BAG', name: 'กระเป๋า', description: 'กระเป๋าใส่หนังสือ' },
      { code: 'VIDEO_REPLAY', name: 'วิดีโอย้อนหลัง', description: 'วิดีโอย้อนหลังสำหรับทบทวน' },
      { code: 'FREE_DELIVERY', name: 'ส่งตำราฟรีถึงบ้าน', description: 'บริการส่งตำราฟรีถึงบ้าน' },
      { code: 'MATERIALS', name: 'เอกสารประกอบ', description: 'เอกสารประกอบการเรียน' }
    ]
    
    for (const inclusion of inclusions) {
      try {
        await connection.execute(
          `INSERT IGNORE INTO inclusions (code, name, description)
           VALUES (?, ?, ?)`,
          [inclusion.code, inclusion.name, inclusion.description]
        )
      } catch (error: any) {
        // Ignore duplicate errors
      }
    }
    console.log('   ✅ Inserted inclusions')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_inclusions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        inclusion_id INT NOT NULL,
        enrollment_type ENUM('onsite', 'online', 'both') DEFAULT 'both',
        quantity INT DEFAULT 1,
        description VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (inclusion_id) REFERENCES inclusions(id) ON DELETE CASCADE,
        INDEX idx_course (course_id),
        INDEX idx_inclusion (inclusion_id),
        INDEX idx_enrollment_type (enrollment_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_inclusions table')
    
    // ============================================
    // 4. COURSE ROUNDS MODULE
    // ============================================
    console.log('')
    console.log('🔄 Creating course_rounds module...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_rounds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        round_number INT NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        schedule_days VARCHAR(100),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        onsite_price DECIMAL(10, 2),
        online_price DECIMAL(10, 2),
        seat_limit INT,
        current_enrollments INT DEFAULT 0,
        status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE KEY unique_course_round (course_id, round_number),
        INDEX idx_course (course_id),
        INDEX idx_dates (start_date, end_date),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_rounds table')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_round_schedules (
        id INT PRIMARY KEY AUTO_INCREMENT,
        round_id INT NOT NULL,
        session_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        session_number INT,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        FOREIGN KEY (round_id) REFERENCES course_rounds(id) ON DELETE CASCADE,
        INDEX idx_round_date (round_id, session_date),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_round_schedules table')
    
    // ============================================
    // 5. SUBJECTS MODULE
    // ============================================
    console.log('')
    console.log('📖 Creating subjects module...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        short_name VARCHAR(50),
        description TEXT,
        icon VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created subjects table')
    
    const subjects = [
      { code: 'MATH', name: 'คณิตศาสตร์', short_name: 'คณิต' },
      { code: 'SCIENCE', name: 'วิทยาศาสตร์', short_name: 'วิทย์' },
      { code: 'ENGLISH', name: 'ภาษาอังกฤษ', short_name: 'อังกฤษ' },
      { code: 'THAI', name: 'ภาษาไทย', short_name: 'ไทย' },
      { code: 'SOCIAL', name: 'สังคมศึกษา', short_name: 'สังคม' },
      { code: 'PHYSICS', name: 'ฟิสิกส์', short_name: 'ฟิสิกส์' },
      { code: 'CHEMISTRY', name: 'เคมี', short_name: 'เคมี' },
      { code: 'BIOLOGY', name: 'ชีววิทยา', short_name: 'ชีวะ' }
    ]
    
    for (const subject of subjects) {
      try {
        await connection.execute(
          `INSERT IGNORE INTO subjects (code, name, short_name)
           VALUES (?, ?, ?)`,
          [subject.code, subject.name, subject.short_name]
        )
      } catch (error: any) {
        // Ignore duplicate errors
      }
    }
    console.log('   ✅ Inserted subjects')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_subjects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        subject_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        UNIQUE KEY unique_course_subject (course_id, subject_id),
        INDEX idx_course (course_id),
        INDEX idx_subject (subject_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created course_subjects table')
    
    console.log('')
    console.log('✅ Enhanced course schema migration completed!')
    console.log('')
    
    // Display summary
    const [gradeCount] = await connection.execute('SELECT COUNT(*) as count FROM grade_levels') as any[]
    const [subjectCount] = await connection.execute('SELECT COUNT(*) as count FROM subjects') as any[]
    const [inclusionCount] = await connection.execute('SELECT COUNT(*) as count FROM inclusions') as any[]
    
    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Grade Levels: ${gradeCount[0].count}`)
    console.log(`   Subjects: ${subjectCount[0].count}`)
    console.log(`   Inclusions: ${inclusionCount[0].count}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error migrating enhanced course schema:', error.message)
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

migrateCourseSchemaEnhanced()


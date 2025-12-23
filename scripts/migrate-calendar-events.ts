import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

async function migrateCalendarEvents() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating calendar events schema...')
    console.log('')
    
    // ============================================
    // 1. CALENDAR EVENTS TABLE
    // ============================================
    console.log('📅 Creating calendar_events table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        start_datetime DATETIME NOT NULL,
        end_datetime DATETIME NOT NULL,
        location VARCHAR(500),
        color VARCHAR(7) DEFAULT '#3B82F6',
        is_all_day BOOLEAN DEFAULT FALSE,
        reminder_minutes INT DEFAULT NULL,
        is_shared BOOLEAN DEFAULT FALSE,
        shared_scope ENUM('private', 'tutors', 'students', 'parents', 'admins', 'branch_admins', 'branch_students', 'branch_parents', 'public') DEFAULT 'private',
        shared_branch_id INT NULL,
        event_type ENUM('personal', 'meeting', 'holiday', 'announcement', 'other') DEFAULT 'personal',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (shared_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
        INDEX idx_user_datetime (user_id, start_datetime),
        INDEX idx_shared_scope (is_shared, shared_scope, shared_branch_id),
        INDEX idx_datetime (start_datetime),
        INDEX idx_event_type (event_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created calendar_events table')
    
    // ============================================
    // 2. CALENDAR EVENT SHARED WITH TABLE
    // ============================================
    console.log('')
    console.log('👥 Creating calendar_event_shared_with table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calendar_event_shared_with (
        id INT PRIMARY KEY AUTO_INCREMENT,
        event_id INT NOT NULL,
        shared_with_user_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES calendar_events(id) ON DELETE CASCADE,
        FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_event_user (event_id, shared_with_user_id),
        INDEX idx_event (event_id),
        INDEX idx_user (shared_with_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created calendar_event_shared_with table')
    
    console.log('')
    console.log('✅ Calendar events migration completed successfully!')
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

// Run migration
migrateCalendarEvents()
  .then(() => {
    console.log('')
    console.log('🎉 Migration completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })


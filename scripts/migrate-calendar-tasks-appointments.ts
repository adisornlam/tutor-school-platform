import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

async function migrateCalendarTasksAndAppointments() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating calendar tasks and appointments schema...')
    console.log('')
    
    // ============================================
    // 1. CALENDAR TASKS TABLE
    // ============================================
    console.log('✅ Creating calendar_tasks table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calendar_tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        due_date DATE,
        start_date DATE,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('not_started', 'in_progress', 'completed', 'cancelled') DEFAULT 'not_started',
        color VARCHAR(7) DEFAULT '#10B981',
        is_shared BOOLEAN DEFAULT FALSE,
        shared_scope ENUM('private', 'tutors', 'students', 'parents', 'admins', 'branch_admins', 'public') DEFAULT 'private',
        shared_branch_id INT NULL,
        category VARCHAR(100),
        completed_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (shared_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
        INDEX idx_user_due_date (user_id, due_date),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_user_start_date (user_id, start_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created calendar_tasks table')
    
    // ============================================
    // 2. CALENDAR TASK SHARED WITH TABLE
    // ============================================
    console.log('')
    console.log('👥 Creating calendar_task_shared_with table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calendar_task_shared_with (
        id INT PRIMARY KEY AUTO_INCREMENT,
        task_id INT NOT NULL,
        shared_with_user_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES calendar_tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_task_user (task_id, shared_with_user_id),
        INDEX idx_task (task_id),
        INDEX idx_user (shared_with_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created calendar_task_shared_with table')
    
    // ============================================
    // 3. CALENDAR APPOINTMENTS TABLE
    // ============================================
    console.log('')
    console.log('📅 Creating calendar_appointments table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calendar_appointments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        start_datetime DATETIME NOT NULL,
        end_datetime DATETIME NOT NULL,
        appointment_type ENUM('student', 'meeting', 'parent', 'staff', 'other') DEFAULT 'student',
        location VARCHAR(500),
        meeting_link VARCHAR(500),
        status ENUM('scheduled', 'confirmed', 'cancelled', 'completed') DEFAULT 'scheduled',
        color VARCHAR(7) DEFAULT '#3B82F6',
        reminder_minutes INT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_datetime (user_id, start_datetime),
        INDEX idx_status (status),
        INDEX idx_type (appointment_type),
        INDEX idx_datetime (start_datetime)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created calendar_appointments table')
    
    // ============================================
    // 4. CALENDAR APPOINTMENT PARTICIPANTS TABLE
    // ============================================
    console.log('')
    console.log('👥 Creating calendar_appointment_participants table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calendar_appointment_participants (
        id INT PRIMARY KEY AUTO_INCREMENT,
        appointment_id INT NOT NULL,
        user_id INT NOT NULL,
        participant_type ENUM('student', 'parent', 'tutor', 'admin', 'other') NOT NULL,
        status ENUM('pending', 'accepted', 'declined', 'maybe') DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES calendar_appointments(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_appointment_user (appointment_id, user_id),
        INDEX idx_appointment (appointment_id),
        INDEX idx_user (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created calendar_appointment_participants table')
    
    console.log('')
    console.log('✅ Calendar tasks and appointments migration completed successfully!')
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

// Run migration
migrateCalendarTasksAndAppointments()
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


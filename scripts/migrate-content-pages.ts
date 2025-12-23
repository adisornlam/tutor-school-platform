import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

async function migrateContentPages() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Migrating content_pages schema...')
    console.log('')
    
    // ============================================
    // 1. CONTENT PAGES TABLE
    // ============================================
    console.log('✅ Creating content_pages table...')
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS content_pages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(300) NOT NULL,
        content TEXT,
        meta_title VARCHAR(300),
        meta_description TEXT,
        meta_keywords VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_by INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
        INDEX idx_slug (slug),
        INDEX idx_active (is_active),
        INDEX idx_display_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    console.log('   ✅ Created content_pages table')
    
    // Get admin user ID for created_by
    const [adminUsers] = await connection.execute(
      'SELECT id FROM users ORDER BY id LIMIT 1'
    ) as any[]
    
    const adminUserId = adminUsers.length > 0 ? adminUsers[0].id : 1
    
    // ============================================
    // 2. INSERT DEFAULT CONTENT PAGES
    // ============================================
    console.log('')
    console.log('📝 Inserting default content pages...')
    
    const defaultPages = [
      {
        slug: 'about',
        title: 'เกี่ยวกับเรา',
        content: '<h1>เกี่ยวกับเรา</h1><p>ใส่เนื้อหาที่นี่...</p>',
        meta_title: 'เกี่ยวกับเรา - KDC Tutor School',
        meta_description: 'เรียนรู้เกี่ยวกับ KDC Tutor School',
        display_order: 1
      },
      {
        slug: 'contact',
        title: 'ติดต่อเรา',
        content: '<h1>ติดต่อเรา</h1><p><strong>ที่อยู่:</strong><br>ใส่ที่อยู่ที่นี่</p><p><strong>เบอร์โทร:</strong><br>0XX-XXX-XXXX</p><p><strong>อีเมล์:</strong><br>info@kdcschool.com</p>',
        meta_title: 'ติดต่อเรา - KDC Tutor School',
        meta_description: 'ติดต่อ KDC Tutor School',
        display_order: 2
      },
      {
        slug: 'careers',
        title: 'งาน/โอกาสการทำงาน',
        content: '<h1>งาน/โอกาสการทำงาน</h1><p>กำลังรับสมัคร...</p>',
        meta_title: 'งาน/โอกาสการทำงาน - KDC Tutor School',
        meta_description: 'โอกาสการทำงานที่ KDC Tutor School',
        display_order: 3
      },
      {
        slug: 'help',
        title: 'ความช่วยเหลือ',
        content: '<h1>ความช่วยเหลือ</h1><h2>คำถามที่พบบ่อย</h2><p>ใส่ FAQ ที่นี่...</p>',
        meta_title: 'ความช่วยเหลือ - KDC Tutor School',
        meta_description: 'ความช่วยเหลือและคำถามที่พบบ่อย',
        display_order: 4
      },
      {
        slug: 'support',
        title: 'สนับสนุน',
        content: '<h1>สนับสนุน</h1><p>ข้อมูลการสนับสนุน...</p>',
        meta_title: 'สนับสนุน - KDC Tutor School',
        meta_description: 'สนับสนุน KDC Tutor School',
        display_order: 5
      }
    ]
    
    for (const page of defaultPages) {
      try {
        await connection.execute(
          `INSERT INTO content_pages (slug, title, content, meta_title, meta_description, display_order, created_by, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
           ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           content = COALESCE(content, VALUES(content)),
           meta_title = VALUES(meta_title),
           meta_description = VALUES(meta_description),
           display_order = VALUES(display_order)`,
          [
            page.slug,
            page.title,
            page.content,
            page.meta_title,
            page.meta_description,
            page.display_order,
            adminUserId
          ]
        )
        console.log(`   ✅ Created/Updated page: ${page.title} (${page.slug})`)
      } catch (error: any) {
        console.log(`   ⚠️  Error creating page ${page.slug}: ${error.message}`)
      }
    }
    
    console.log('')
    console.log('✅ Content pages migration completed successfully!')
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await connection.end()
  }
}

// Run migration
migrateContentPages()
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


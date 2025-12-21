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

interface MenuItem {
  code: string
  name: string
  name_en: string
  icon?: string
  href?: string
  parent_code?: string
  display_order: number
  is_active: boolean
  roles?: string[] // Roles that can access this menu
}

async function migrateAdminMenus() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('🔄 Creating admin_menus table...')
    console.log('')
    
    // Create admin_menus table (without foreign key first to avoid circular dependency)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_menus (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        name_en VARCHAR(200),
        icon VARCHAR(100),
        href VARCHAR(500),
        parent_code VARCHAR(100),
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        roles TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_parent (parent_code),
        INDEX idx_display_order (display_order),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
    
    // Add foreign key constraint after table is created (if not exists)
    try {
      // Check if constraint already exists
      const [constraints] = await connection.execute(
        `SELECT CONSTRAINT_NAME 
         FROM information_schema.TABLE_CONSTRAINTS 
         WHERE TABLE_SCHEMA = ? 
         AND TABLE_NAME = 'admin_menus' 
         AND CONSTRAINT_NAME = 'fk_admin_menus_parent'`,
        [config.database]
      ) as any[]
      
      if (constraints.length === 0) {
        await connection.execute(`
          ALTER TABLE admin_menus
          ADD CONSTRAINT fk_admin_menus_parent
          FOREIGN KEY (parent_code) REFERENCES admin_menus(code) ON DELETE CASCADE
        `)
        console.log('   ✅ Added foreign key constraint')
      } else {
        console.log('   ⚠️  Foreign key constraint already exists')
      }
    } catch (error: any) {
      if (error.code === 'ER_DUP_KEY' || error.code === 'ER_CANT_CREATE_TABLE' || error.code === 'ER_CANNOT_ADD_FOREIGN') {
        console.log('   ⚠️  Foreign key constraint already exists or cannot be added')
      } else {
        throw error
      }
    }
    console.log('   ✅ Created admin_menus table')
    
    // Get role IDs for roles field
    const [roles] = await connection.execute(
      'SELECT id, name FROM roles'
    ) as any[]
    const roleMap = new Map(roles.map((r: any) => [r.name, r.id]))
    
    // Menu items structure (2-level hierarchy)
    const menuItems: MenuItem[] = [
      // Level 1: Dashboard
      {
        code: 'DASHBOARD',
        name: 'Dashboard',
        name_en: 'Dashboard',
        icon: 'HomeIcon',
        href: '/admin',
        display_order: 1,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin', 'tutor']
      },
      
      // Level 1: ผู้เรียน (เปลี่ยนจาก "จัดการผู้ใช้งาน")
      {
        code: 'STUDENTS',
        name: 'ผู้เรียน',
        name_en: 'Students',
        icon: 'UserIcon',
        href: '/admin/students',
        display_order: 2,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      
      
      // Level 1: จัดการคอร์สเรียน
      {
        code: 'COURSES',
        name: 'คอร์สเรียน',
        name_en: 'Courses',
        icon: 'BookOpenIcon',
        href: '/admin/courses',
        display_order: 3,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      
      // Level 1: จัดการการลงทะเบียน
      {
        code: 'ENROLLMENTS',
        name: 'การลงทะเบียน',
        name_en: 'Enrollments',
        icon: 'ClipboardDocumentCheckIcon',
        href: '/admin/enrollments',
        display_order: 4,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      
      // Level 1: จัดการเนื้อหา (Parent)
      {
        code: 'CONTENT',
        name: 'จัดการเนื้อหา',
        name_en: 'Content Management',
        icon: 'DocumentTextIcon',
        display_order: 5,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin']
      },
      // Level 2: Submenus under CONTENT
      {
        code: 'CONTENT_ARTICLES',
        name: 'บทความ',
        name_en: 'Articles',
        icon: 'NewspaperIcon',
        href: '/admin/content/articles',
        parent_code: 'CONTENT',
        display_order: 1,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin']
      },
      {
        code: 'CONTENT_TESTIMONIALS',
        name: 'รีวิว',
        name_en: 'Testimonials',
        icon: 'ChatBubbleLeftRightIcon',
        href: '/admin/content/testimonials',
        parent_code: 'CONTENT',
        display_order: 2,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin']
      },
      
      
      // Level 1: จัดการการชำระเงิน
      {
        code: 'PAYMENTS',
        name: 'การชำระเงิน',
        name_en: 'Payments',
        icon: 'CurrencyDollarIcon',
        href: '/admin/payments',
        display_order: 5,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      
      // Level 1: จัดการโปรโมชั่น
      {
        code: 'PROMOTIONS',
        name: 'โปรโมชั่น',
        name_en: 'Promotions',
        icon: 'TagIcon',
        href: '/admin/promotions',
        display_order: 7,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      
      // Level 1: รายงาน (Parent)
      {
        code: 'REPORTS',
        name: 'รายงาน',
        name_en: 'Reports',
        icon: 'ChartBarIcon',
        display_order: 8,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      // Level 2: Submenus under REPORTS
      {
        code: 'REPORTS_USERS',
        name: 'รายงานผู้ใช้งาน',
        name_en: 'User Reports',
        icon: 'UserGroupIcon',
        href: '/admin/reports/users',
        parent_code: 'REPORTS',
        display_order: 1,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'REPORTS_COURSES',
        name: 'รายงานคอร์สเรียน',
        name_en: 'Course Reports',
        icon: 'BookOpenIcon',
        href: '/admin/reports/courses',
        parent_code: 'REPORTS',
        display_order: 2,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      {
        code: 'REPORTS_ENROLLMENTS',
        name: 'รายงานการลงทะเบียน',
        name_en: 'Enrollment Reports',
        icon: 'ClipboardDocumentCheckIcon',
        href: '/admin/reports/enrollments',
        parent_code: 'REPORTS',
        display_order: 3,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      {
        code: 'REPORTS_PAYMENTS',
        name: 'รายงานการชำระเงิน',
        name_en: 'Payment Reports',
        icon: 'CurrencyDollarIcon',
        href: '/admin/reports/payments',
        parent_code: 'REPORTS',
        display_order: 4,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      {
        code: 'REPORTS_REVENUE',
        name: 'รายงานรายได้',
        name_en: 'Revenue Reports',
        icon: 'ChartBarIcon',
        href: '/admin/reports/revenue',
        parent_code: 'REPORTS',
        display_order: 5,
        is_active: true,
        roles: ['system_admin', 'owner', 'admin', 'branch_admin']
      },
      
      // Level 1: ตั้งค่า (Parent)
      {
        code: 'SETTINGS',
        name: 'ตั้งค่า',
        name_en: 'Settings',
        icon: 'CogIcon',
        display_order: 9,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      // Level 2: Submenus under SETTINGS
      {
        code: 'SETTINGS_EMAIL',
        name: 'ตั้งค่าอีเมล์',
        name_en: 'Email Settings',
        icon: 'EnvelopeIcon',
        href: '/admin/settings/email',
        parent_code: 'SETTINGS',
        display_order: 1,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_SYSTEM',
        name: 'ตั้งค่าระบบ',
        name_en: 'System Settings',
        icon: 'Cog6ToothIcon',
        href: '/admin/settings/system',
        parent_code: 'SETTINGS',
        display_order: 2,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_BRANCHES',
        name: 'สาขา',
        name_en: 'Branches',
        icon: 'BuildingOfficeIcon',
        href: '/admin/settings/branches',
        parent_code: 'SETTINGS',
        display_order: 3,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_GRADE_LEVELS',
        name: 'ระดับชั้น',
        name_en: 'Grade Levels',
        icon: 'AcademicCapIcon',
        href: '/admin/settings/grade-levels',
        parent_code: 'SETTINGS',
        display_order: 4,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_SUBJECTS',
        name: 'วิชา',
        name_en: 'Subjects',
        icon: 'BookOpenIcon',
        href: '/admin/settings/subjects',
        parent_code: 'SETTINGS',
        display_order: 5,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_INCLUSIONS',
        name: 'สิ่งที่ได้รับ',
        name_en: 'Inclusions',
        icon: 'TagIcon',
        href: '/admin/settings/inclusions',
        parent_code: 'SETTINGS',
        display_order: 6,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_ROLES',
        name: 'บทบาทผู้ใช้',
        name_en: 'User Roles',
        icon: 'ShieldCheckIcon',
        href: '/admin/settings/roles',
        parent_code: 'SETTINGS',
        display_order: 7,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_PAYMENT_METHODS',
        name: 'วิธีการชำระเงิน',
        name_en: 'Payment Methods',
        icon: 'CurrencyDollarIcon',
        href: '/admin/settings/payment-methods',
        parent_code: 'SETTINGS',
        display_order: 8,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      {
        code: 'SETTINGS_USERS',
        name: 'จัดการผู้ใช้งาน',
        name_en: 'User Management',
        icon: 'UsersIcon',
        href: '/admin/settings/users',
        parent_code: 'SETTINGS',
        display_order: 9,
        is_active: true,
        roles: ['system_admin', 'owner']
      },
      
      // ============================================
      // TUTOR MENUS
      // ============================================
      
      // Level 1: ตารางสอน
      {
        code: 'TUTOR_SCHEDULE',
        name: 'ตารางสอน',
        name_en: 'Teaching Schedule',
        icon: 'CalendarIcon',
        href: '/admin/tutor/schedule',
        display_order: 10,
        is_active: true,
        roles: ['tutor']
      },
      
      // Level 1: คอร์สของฉัน
      {
        code: 'TUTOR_COURSES',
        name: 'คอร์สของฉัน',
        name_en: 'My Courses',
        icon: 'BookOpenIcon',
        href: '/admin/tutor/courses',
        display_order: 11,
        is_active: true,
        roles: ['tutor']
      },
      
      // Level 1: นักเรียน
      {
        code: 'TUTOR_STUDENTS',
        name: 'นักเรียน',
        name_en: 'Students',
        icon: 'UserGroupIcon',
        href: '/admin/tutor/students',
        display_order: 12,
        is_active: true,
        roles: ['tutor']
      },
      
      // Level 1: การบ้าน
      {
        code: 'TUTOR_ASSIGNMENTS',
        name: 'การบ้าน',
        name_en: 'Assignments',
        icon: 'ClipboardDocumentCheckIcon',
        href: '/admin/tutor/assignments',
        display_order: 13,
        is_active: true,
        roles: ['tutor']
      },
      
      // Level 1: ประกาศ
      {
        code: 'TUTOR_ANNOUNCEMENTS',
        name: 'ประกาศ',
        name_en: 'Announcements',
        icon: 'MegaphoneIcon',
        href: '/admin/tutor/announcements',
        display_order: 14,
        is_active: true,
        roles: ['tutor']
      },
      
      // Level 1: รายงาน (Parent)
      {
        code: 'TUTOR_REPORTS',
        name: 'รายงาน',
        name_en: 'Reports',
        icon: 'ChartBarIcon',
        display_order: 15,
        is_active: true,
        roles: ['tutor']
      },
      // Level 2: Submenus under TUTOR_REPORTS
      {
        code: 'TUTOR_REPORTS_PROGRESS',
        name: 'รายงานความคืบหน้า',
        name_en: 'Progress Reports',
        icon: 'ChartBarIcon',
        href: '/admin/tutor/reports/progress',
        parent_code: 'TUTOR_REPORTS',
        display_order: 1,
        is_active: true,
        roles: ['tutor']
      },
      {
        code: 'TUTOR_REPORTS_GRADES',
        name: 'รายงานคะแนน',
        name_en: 'Grade Reports',
        icon: 'AcademicCapIcon',
        href: '/admin/tutor/reports/grades',
        parent_code: 'TUTOR_REPORTS',
        display_order: 2,
        is_active: true,
        roles: ['tutor']
      },
      {
        code: 'TUTOR_REPORTS_ASSIGNMENTS',
        name: 'รายงานการบ้าน',
        name_en: 'Assignment Reports',
        icon: 'ClipboardDocumentCheckIcon',
        href: '/admin/tutor/reports/assignments',
        parent_code: 'TUTOR_REPORTS',
        display_order: 3,
        is_active: true,
        roles: ['tutor']
      },
      {
        code: 'TUTOR_REPORTS_STATISTICS',
        name: 'สถิติการสอน',
        name_en: 'Teaching Statistics',
        icon: 'ChartBarIcon',
        href: '/admin/tutor/reports/statistics',
        parent_code: 'TUTOR_REPORTS',
        display_order: 4,
        is_active: true,
        roles: ['tutor']
      }
    ]
    
    console.log('📝 Inserting menu items...')
    
    // Insert parent menus first
    const parentMenus = menuItems.filter(m => !m.parent_code)
    for (const menu of parentMenus) {
      try {
        const rolesJson = menu.roles ? JSON.stringify(menu.roles) : null
        await connection.execute(
          `INSERT INTO admin_menus (code, name, name_en, icon, href, display_order, is_active, roles)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           name_en = VALUES(name_en),
           icon = VALUES(icon),
           href = VALUES(href),
           display_order = VALUES(display_order),
           is_active = VALUES(is_active),
           roles = VALUES(roles)`,
          [
            menu.code,
            menu.name,
            menu.name_en,
            menu.icon || null,
            menu.href || null,
            menu.display_order,
            menu.is_active,
            rolesJson
          ]
        )
        console.log(`   ✅ Created/Updated menu: ${menu.name}`)
      } catch (error: any) {
        console.log(`   ⚠️  Error creating menu ${menu.code}: ${error.message}`)
      }
    }
    
    // Insert child menus
    const childMenus = menuItems.filter(m => m.parent_code)
    for (const menu of childMenus) {
      try {
        const rolesJson = menu.roles ? JSON.stringify(menu.roles) : null
        await connection.execute(
          `INSERT INTO admin_menus (code, name, name_en, icon, href, parent_code, display_order, is_active, roles)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           name_en = VALUES(name_en),
           icon = VALUES(icon),
           href = VALUES(href),
           parent_code = VALUES(parent_code),
           display_order = VALUES(display_order),
           is_active = VALUES(is_active),
           roles = VALUES(roles)`,
          [
            menu.code,
            menu.name,
            menu.name_en,
            menu.icon || null,
            menu.href || null,
            menu.parent_code,
            menu.display_order,
            menu.is_active,
            rolesJson
          ]
        )
        console.log(`   ✅ Created/Updated submenu: ${menu.name} (under ${menu.parent_code})`)
      } catch (error: any) {
        console.log(`   ⚠️  Error creating submenu ${menu.code}: ${error.message}`)
      }
    }
    
    console.log('')
    console.log('✅ Admin menus migration completed!')
    console.log('')
    
    // Display summary
    const [menuCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM admin_menus WHERE is_active = TRUE'
    ) as any[]
    
    const [parentCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM admin_menus WHERE parent_code IS NULL AND is_active = TRUE'
    ) as any[]
    
    const [childCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM admin_menus WHERE parent_code IS NOT NULL AND is_active = TRUE'
    ) as any[]
    
    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Total Active Menus: ${menuCount[0].count}`)
    console.log(`   Parent Menus: ${parentCount[0].count}`)
    console.log(`   Submenus: ${childCount[0].count}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error migrating admin menus:', error.message)
    console.error(error)
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

migrateAdminMenus()


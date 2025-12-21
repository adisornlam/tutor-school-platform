import mysql from 'mysql2/promise'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb',
  connectionLimit: 10
}

async function verifyAdminMenus() {
  let connection: mysql.Connection | null = null
  
  try {
    connection = await mysql.createConnection(config)
    console.log('✅ Connected to database\n')

    // 1. Check admincenter user and roles
    console.log('📋 1. Checking admincenter user...')
    const [users] = await connection.execute(
      'SELECT id, username, email, first_name, last_name FROM users WHERE email LIKE ? OR username LIKE ?',
      ['%admincenter%', '%admincenter%']
    ) as any[]

    if (users.length === 0) {
      console.log('   ⚠️  No admincenter user found')
      return
    }

    const user = users[0]
    console.log(`   ✅ Found user: ${user.username} (${user.email})`)
    console.log(`      ID: ${user.id}`)
    console.log(`      Name: ${user.first_name} ${user.last_name}\n`)

    // 2. Check user roles
    console.log('📋 2. Checking user roles...')
    const [userRoles] = await connection.execute(
      `SELECT r.id, r.name, r.description 
       FROM user_roles ur 
       JOIN roles r ON ur.role_id = r.id 
       WHERE ur.user_id = ?`,
      [user.id]
    ) as any[]

    if (userRoles.length === 0) {
      console.log('   ❌ User has no roles assigned!')
      return
    }

    console.log(`   ✅ User has ${userRoles.length} role(s):`)
    userRoles.forEach((role: any) => {
      console.log(`      - ${role.name}: ${role.description || 'No description'}`)
    })
    console.log('')

    // Check if admin role exists
    const hasAdminRole = userRoles.some((r: any) => r.name === 'admin')
    if (!hasAdminRole) {
      console.log('   ❌ User does NOT have "admin" role!')
      console.log('   💡 Run: bun run scripts/create-admin-center.ts\n')
      return
    }

    // 3. Check admin_menus table
    console.log('📋 3. Checking admin_menus table...')
    const [allMenus] = await connection.execute(
      `SELECT id, code, name, is_active, roles 
       FROM admin_menus 
       WHERE is_active = 1 
       ORDER BY display_order 
       LIMIT 20`
    ) as any[]

    if (allMenus.length === 0) {
      console.log('   ❌ No active menus found in admin_menus table!')
      console.log('   💡 Run: bun run db:migrate-menus\n')
      return
    }

    console.log(`   ✅ Found ${allMenus.length} active menus\n`)

    // 4. Check which menus include 'admin' role
    console.log('📋 4. Checking menus that include "admin" role...')
    let menusWithAdmin = 0
    let menusWithoutAdmin = 0

    allMenus.forEach((menu: any) => {
      if (!menu.roles) {
        console.log(`   ⚠️  ${menu.code} (${menu.name}) - No roles restriction (accessible to all)`)
        menusWithAdmin++
        return
      }

      try {
        const roles = JSON.parse(menu.roles) as string[]
        const includesAdmin = roles.includes('admin')
        
        if (includesAdmin) {
          console.log(`   ✅ ${menu.code} (${menu.name}) - Includes "admin" role`)
          menusWithAdmin++
        } else {
          console.log(`   ❌ ${menu.code} (${menu.name}) - Does NOT include "admin" role`)
          console.log(`      Current roles: ${roles.join(', ')}`)
          menusWithoutAdmin++
        }
      } catch (error) {
        console.log(`   ⚠️  ${menu.code} (${menu.name}) - Error parsing roles: ${error}`)
      }
    })

    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   User has "admin" role: ${hasAdminRole ? '✅ YES' : '❌ NO'}`)
    console.log(`   Menus accessible to admin: ${menusWithAdmin}`)
    console.log(`   Menus NOT accessible to admin: ${menusWithoutAdmin}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (!hasAdminRole) {
      console.log('\n💡 Solution: Run "bun run scripts/create-admin-center.ts"')
    } else if (menusWithoutAdmin > 0) {
      console.log('\n💡 Solution: Run "bun run scripts/update-menus-for-admin-role.ts"')
      console.log('   This will add "admin" role to menus that should be visible to admin (กลาง)')
    } else {
      console.log('\n✅ Everything looks good! Admincenter user should see menus.')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.code === 'ECONNREFUSED') {
      console.error('   Database connection failed. Please check:')
      console.error('   - Database is running')
      console.error('   - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in .env')
    }
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

verifyAdminMenus()


import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { join } from 'path'

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tutordb'
}

interface UserData {
  username: string
  email: string | null
  password: string
  first_name: string
  last_name: string
  phone?: string
  role: 'tutor' | 'parent' | 'student'
}

interface TutorData {
  user_id: number
  bio: string
  expertise: string
  branchCode: string
  courseCodes: string[]
}

interface ParentStudentRelation {
  parent_username: string
  student_username: string
  relationship: 'father' | 'mother' | 'guardian'
}

interface EnrollmentData {
  student_username: string
  course_code: string
  branch_code: string
  enrollment_type: 'onsite' | 'online'
  payment_amount: number
}

async function seedTestUsers() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('👥 Seeding test users (tutors, parents, students)...')
    console.log('')
    
    // Get role IDs
    const [roles] = await connection.execute(
      'SELECT id, name FROM roles'
    ) as any[]
    
    const roleMap = new Map(roles.map((r: any) => [r.name, r.id]))
    
    // Get branch IDs
    const [branches] = await connection.execute(
      'SELECT id, code FROM branches'
    ) as any[]
    const branchMap = new Map(branches.map((b: any) => [b.code, b.id]))
    
    // Get course IDs
    const [courses] = await connection.execute(
      'SELECT id, code FROM courses'
    ) as any[]
    const courseMap = new Map(courses.map((c: any) => [c.code, c.id]))
    
    // Users data
    const users: UserData[] = [
      // Tutors
      {
        username: 'tutor1',
        email: 'tutor1@kdcschool.com',
        password: 'password123',
        first_name: 'อาจารย์',
        last_name: 'สมชาย ใจดี',
        phone: '0812345678',
        role: 'tutor'
      },
      {
        username: 'tutor2',
        email: 'tutor2@kdcschool.com',
        password: 'password123',
        first_name: 'อาจารย์',
        last_name: 'สมหญิง รักสอน',
        phone: '0812345679',
        role: 'tutor'
      },
      {
        username: 'tutor3',
        email: 'tutor3@kdcschool.com',
        password: 'password123',
        first_name: 'อาจารย์',
        last_name: 'วิชัย เก่งสอน',
        phone: '0812345680',
        role: 'tutor'
      },
      // Parents
      {
        username: 'parent1',
        email: 'parent1@example.com',
        password: 'password123',
        first_name: 'คุณพ่อ',
        last_name: 'สมชาย ใจดี',
        phone: '0823456789',
        role: 'parent'
      },
      {
        username: 'parent2',
        email: 'parent2@example.com',
        password: 'password123',
        first_name: 'คุณแม่',
        last_name: 'สมหญิง รักเรียน',
        phone: '0823456790',
        role: 'parent'
      },
      {
        username: 'parent3',
        email: 'parent3@example.com',
        password: 'password123',
        first_name: 'คุณพ่อ',
        last_name: 'วิชัย เก่งเรียน',
        phone: '0823456791',
        role: 'parent'
      },
      // Students
      {
        username: 'student1_parent1',
        email: null, // ไม่มี email
        password: 'password123',
        first_name: 'เด็กชาย',
        last_name: 'สมชาย ใจดี',
        phone: null,
        role: 'student'
      },
      {
        username: 'student2_parent2',
        email: null, // ไม่มี email
        password: 'password123',
        first_name: 'เด็กหญิง',
        last_name: 'สมหญิง รักเรียน',
        phone: null,
        role: 'student'
      },
      {
        username: 'student3_parent3',
        email: null, // ไม่มี email
        password: 'password123',
        first_name: 'เด็กชาย',
        last_name: 'วิชัย เก่งเรียน',
        phone: null,
        role: 'student'
      }
    ]
    
    console.log('👤 Creating users...')
    const userIdMap = new Map<string, number>()
    
    for (const userData of users) {
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE username = ?',
        [userData.username]
      ) as any[]
      
      if (existingUsers.length > 0) {
        console.log(`   ⚠️  User "${userData.username}" already exists`)
        userIdMap.set(userData.username, existingUsers[0].id)
        continue
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12)
      
      // Insert user
      const [result] = await connection.execute(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [
          userData.username,
          userData.email,
          passwordHash,
          userData.first_name,
          userData.last_name,
          userData.phone || null
        ]
      ) as any[]
      
      const userId = result.insertId
      userIdMap.set(userData.username, userId)
      
      // Assign role
      const roleId = roleMap.get(userData.role)
      if (roleId) {
        await connection.execute(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [userId, roleId]
        )
      }
      
      console.log(`   ✅ Created user: ${userData.username} (${userData.role}) - ID: ${userId}`)
    }
    
    console.log('')
    console.log('👨‍🏫 Creating tutors...')
    
    // Tutors data
    const tutors: TutorData[] = [
      {
        user_id: userIdMap.get('tutor1')!,
        bio: 'อาจารย์ผู้เชี่ยวชาญด้านคณิตศาสตร์และวิทยาศาสตร์',
        expertise: 'คณิตศาสตร์, วิทยาศาสตร์',
        branchCode: 'FASHION_ISLAND',
        courseCodes: [
          'ENT-P6-M1-REG-2569', // คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องปกติ-ทั่วไป
          'ENT-P6-M1-GIFTED-2569' // คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ GIFTED-IEP-EP
        ]
      },
      {
        user_id: userIdMap.get('tutor2')!,
        bio: 'อาจารย์ผู้เชี่ยวชาญด้านภาษาอังกฤษและภาษาไทย',
        expertise: 'ภาษาอังกฤษ, ภาษาไทย',
        branchCode: 'FASHION_ISLAND',
        courseCodes: [
          'ENT-P6-M1-EP-2569', // คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ EP
          'ENT-HORWANG-SET6-2569' // ข้อสอบจริง รร.หอวัง ชุดที่ 6
        ]
      },
      {
        user_id: userIdMap.get('tutor3')!,
        bio: 'อาจารย์ผู้เชี่ยวชาญด้านคณิตศาสตร์และวิทยาศาสตร์ (สระบุรี)',
        expertise: 'คณิตศาสตร์, วิทยาศาสตร์, ภาษาอังกฤษ',
        branchCode: 'SARABURI',
        courseCodes: [
          'ENT-P6-M1-GIFTED-SARABURI-2569', // คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ GIFTED/SMP EP SMTE
          'ENT-P6-M1-REG-SARABURI-2569' // คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องปกติ/ทั่วไป
        ]
      }
    ]
    
    for (const tutorData of tutors) {
      // Check if tutor already exists
      const [existingTutors] = await connection.execute(
        'SELECT id FROM tutors WHERE user_id = ?',
        [tutorData.user_id]
      ) as any[]
      
      let tutorId: number
      
      if (existingTutors.length > 0) {
        tutorId = existingTutors[0].id
        console.log(`   ⚠️  Tutor already exists for user_id ${tutorData.user_id}`)
      } else {
        // Insert tutor
        const [result] = await connection.execute(
          `INSERT INTO tutors (user_id, bio, expertise, status)
           VALUES (?, ?, ?, 'active')`,
          [tutorData.user_id, tutorData.bio, tutorData.expertise]
        ) as any[]
        
        tutorId = result.insertId
        console.log(`   ✅ Created tutor: ID ${tutorId}`)
      }
      
      // Link tutor to branch
      const branchId = branchMap.get(tutorData.branchCode)
      if (branchId) {
        try {
          await connection.execute(
            'INSERT INTO tutor_branches (tutor_id, branch_id) VALUES (?, ?)',
            [tutorId, branchId]
          )
          console.log(`      → Linked to branch: ${tutorData.branchCode}`)
        } catch (error: any) {
          if (error.code !== 'ER_DUP_ENTRY') {
            throw error
          }
        }
      }
      
      // Link tutor to courses
      for (const courseCode of tutorData.courseCodes) {
        const courseId = courseMap.get(courseCode)
        if (courseId && branchId) {
          try {
            await connection.execute(
              'INSERT INTO tutor_courses (tutor_id, course_id, branch_id) VALUES (?, ?, ?)',
              [tutorId, courseId, branchId]
            )
            console.log(`      → Linked to course: ${courseCode}`)
          } catch (error: any) {
            if (error.code !== 'ER_DUP_ENTRY') {
              throw error
            }
          }
        }
      }
    }
    
    console.log('')
    console.log('👨‍👩‍👧 Creating parent-student relations...')
    
    // Parent-Student relations
    const relations: ParentStudentRelation[] = [
      { parent_username: 'parent1', student_username: 'student1_parent1', relationship: 'father' },
      { parent_username: 'parent2', student_username: 'student2_parent2', relationship: 'mother' },
      { parent_username: 'parent3', student_username: 'student3_parent3', relationship: 'father' }
    ]
    
    for (const relation of relations) {
      const parentId = userIdMap.get(relation.parent_username)
      const studentId = userIdMap.get(relation.student_username)
      
      if (!parentId || !studentId) {
        console.log(`   ⚠️  Missing user IDs for ${relation.parent_username} or ${relation.student_username}`)
        continue
      }
      
      try {
        await connection.execute(
          'INSERT INTO parent_students (parent_id, student_id, relationship) VALUES (?, ?, ?)',
          [parentId, studentId, relation.relationship]
        )
        console.log(`   ✅ Linked: ${relation.parent_username} → ${relation.student_username} (${relation.relationship})`)
      } catch (error: any) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error
        }
        console.log(`   ⚠️  Relation already exists: ${relation.parent_username} → ${relation.student_username}`)
      }
    }
    
    console.log('')
    console.log('📚 Creating enrollments...')
    
    // Enrollments data
    const enrollments: EnrollmentData[] = [
      // Student 1 (Fashion Island)
      {
        student_username: 'student1_parent1',
        course_code: 'ENT-P6-M1-REG-2569',
        branch_code: 'FASHION_ISLAND',
        enrollment_type: 'onsite',
        payment_amount: 5500
      },
      {
        student_username: 'student1_parent1',
        course_code: 'ENT-P6-M1-GIFTED-2569',
        branch_code: 'FASHION_ISLAND',
        enrollment_type: 'online',
        payment_amount: 2200
      },
      // Student 2 (Fashion Island)
      {
        student_username: 'student2_parent2',
        course_code: 'ENT-P6-M1-EP-2569',
        branch_code: 'FASHION_ISLAND',
        enrollment_type: 'onsite',
        payment_amount: 3000
      },
      {
        student_username: 'student2_parent2',
        course_code: 'ENT-HORWANG-SET6-2569',
        branch_code: 'FASHION_ISLAND',
        enrollment_type: 'online',
        payment_amount: 2800
      },
      // Student 3 (Saraburi)
      {
        student_username: 'student3_parent3',
        course_code: 'ENT-P6-M1-GIFTED-SARABURI-2569',
        branch_code: 'SARABURI',
        enrollment_type: 'onsite',
        payment_amount: 2800
      },
      {
        student_username: 'student3_parent3',
        course_code: 'ENT-P6-M1-REG-SARABURI-2569',
        branch_code: 'SARABURI',
        enrollment_type: 'online',
        payment_amount: 4000
      }
    ]
    
    for (const enrollmentData of enrollments) {
      const studentId = userIdMap.get(enrollmentData.student_username)
      const courseId = courseMap.get(enrollmentData.course_code)
      const branchId = branchMap.get(enrollmentData.branch_code)
      
      if (!studentId || !courseId || !branchId) {
        console.log(`   ⚠️  Missing IDs for enrollment: ${enrollmentData.student_username} → ${enrollmentData.course_code}`)
        continue
      }
      
      // Check if enrollment already exists
      const [existingEnrollments] = await connection.execute(
        'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND branch_id = ?',
        [studentId, courseId, branchId]
      ) as any[]
      
      if (existingEnrollments.length > 0) {
        console.log(`   ⚠️  Enrollment already exists: ${enrollmentData.student_username} → ${enrollmentData.course_code}`)
        continue
      }
      
      // Create payment first
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const [paymentResult] = await connection.execute(
        `INSERT INTO payments (
          user_id, amount, discount_amount, final_amount, currency, status,
          payment_method, invoice_number, paid_at
        ) VALUES (?, ?, 0, ?, 'THB', 'paid', 'bank_transfer', ?, NOW())`,
        [
          studentId,
          enrollmentData.payment_amount,
          enrollmentData.payment_amount,
          invoiceNumber
        ]
      ) as any[]
      
      const paymentId = paymentResult.insertId
      
      // Create enrollment
      const [enrollmentResult] = await connection.execute(
        `INSERT INTO enrollments (
          student_id, course_id, branch_id, status, payment_id
        ) VALUES (?, ?, ?, 'active', ?)`,
        [studentId, courseId, branchId, paymentId]
      ) as any[]
      
      const enrollmentId = enrollmentResult.insertId
      
      // Create learning rights
      await connection.execute(
        `INSERT INTO learning_rights (
          enrollment_id, access_type, is_active
        ) VALUES (?, ?, TRUE)`,
        [enrollmentId, enrollmentData.enrollment_type === 'onsite' ? 'live' : 'both']
      )
      
      // Update course_branches current_enrollments
      await connection.execute(
        `UPDATE course_branches 
         SET current_enrollments = current_enrollments + 1
         WHERE course_id = ? AND branch_id = ?`,
        [courseId, branchId]
      )
      
      console.log(`   ✅ Created enrollment: ${enrollmentData.student_username} → ${enrollmentData.course_code} (${enrollmentData.branch_code})`)
    }
    
    console.log('')
    console.log('✅ Test users seeding completed!')
    console.log('')
    
    // Display summary
    const [tutorCount] = await connection.execute('SELECT COUNT(*) as count FROM tutors') as any[]
    const [parentCount] = await connection.execute(
      `SELECT COUNT(*) as count FROM users u
       INNER JOIN user_roles ur ON u.id = ur.user_id
       INNER JOIN roles r ON ur.role_id = r.id
       WHERE r.name = 'parent'`
    ) as any[]
    const [studentCount] = await connection.execute(
      `SELECT COUNT(*) as count FROM users u
       INNER JOIN user_roles ur ON u.id = ur.user_id
       INNER JOIN roles r ON ur.role_id = r.id
       WHERE r.name = 'student'`
    ) as any[]
    const [enrollmentCount] = await connection.execute('SELECT COUNT(*) as count FROM enrollments') as any[]
    
    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Tutors: ${tutorCount[0].count}`)
    console.log(`   Parents: ${parentCount[0].count}`)
    console.log(`   Students: ${studentCount[0].count}`)
    console.log(`   Enrollments: ${enrollmentCount[0].count}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('🔐 Login Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('   Tutors:')
    console.log('     - tutor1 / password123')
    console.log('     - tutor2 / password123')
    console.log('     - tutor3 / password123')
    console.log('   Parents:')
    console.log('     - parent1 / password123')
    console.log('     - parent2 / password123')
    console.log('     - parent3 / password123')
    console.log('   Students:')
    console.log('     - student1_parent1 / password123')
    console.log('     - student2_parent2 / password123')
    console.log('     - student3_parent3 / password123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error seeding test users:', error.message)
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

seedTestUsers()


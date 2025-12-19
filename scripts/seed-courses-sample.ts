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

interface CourseData {
  code: string
  slug: string
  title: string
  short_description: string
  description: string
  type: 'live_online' | 'vod' | 'hybrid'
  onsite_price: number
  online_price: number
  duration_hours: number
  level: 'beginner' | 'intermediate' | 'advanced'
  course_category: 'regular' | 'entrance_exam' | 'special' | 'intensive'
  class_type: 'regular' | 'gifted' | 'iep' | 'ep' | 'special' | 'foundation'
  set_number?: string
  total_sets?: number
  target_school?: string
  academic_year: number
  exam_date?: string // YYYY-MM-DD
  gradeLevelCodes: string[] // เช่น ['P6', 'M1']
  subjectCodes: string[] // เช่น ['MATH', 'SCIENCE', 'ENGLISH']
  branchCode: string
  rounds: Array<{
    round_number: number
    name: string
    schedule_days: string // เช่น "เสาร์", "จันทร์-พุธ-ศุกร์"
    start_date: string // YYYY-MM-DD
    end_date: string // YYYY-MM-DD
    start_time: string // HH:MM:SS
    end_time: string // HH:MM:SS
    onsite_price?: number
    online_price?: number
  }>
  inclusions: {
    onsite: string[] // inclusion codes
    online: string[] // inclusion codes
  }
}

async function seedCoursesSample() {
  const connection = await mysql.createConnection(config)
  
  try {
    console.log('📚 Seeding sample courses from image analysis...')
    console.log('')
    
    // Get admin user ID
    const [adminUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@kdcschool.com']
    ) as any[]
    
    if (adminUsers.length === 0) {
      throw new Error('Admin user not found. Please create admin user first.')
    }
    const adminUserId = adminUsers[0].id
    
    // Get branch
    const [branches] = await connection.execute(
      'SELECT id, code FROM branches WHERE code = ?',
      ['FASHION_ISLAND']
    ) as any[]
    
    if (branches.length === 0) {
      throw new Error('Fashion Island branch not found. Please seed master data first.')
    }
    const branchId = branches[0].id
    
    // Get grade levels map
    const [gradeLevels] = await connection.execute(
      'SELECT id, code FROM grade_levels'
    ) as any[]
    const gradeMap = new Map(gradeLevels.map((g: any) => [g.code, g.id]))
    
    // Get subjects map
    const [subjects] = await connection.execute(
      'SELECT id, code FROM subjects'
    ) as any[]
    const subjectMap = new Map(subjects.map((s: any) => [s.code, s.id]))
    
    // Get inclusions map
    const [inclusions] = await connection.execute(
      'SELECT id, code FROM inclusions'
    ) as any[]
    const inclusionMap = new Map(inclusions.map((i: any) => [i.code, i.id]))
    
    // Course data from image analysis
    const courses: CourseData[] = [
      {
        code: 'ENT-P6-M1-REG-2569',
        slug: 'course-final-curve-p6-m1-regular-2569',
        title: 'คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องปกติ-ทั่วไป ชุด 5/5',
        short_description: 'เตรียมสอบเข้า ม.1 สำหรับนักเรียนชั้น ป.6 ห้องปกติ-ทั่วไป',
        description: `คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องปกติ-ทั่วไป
        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:
        - คณิตศาสตร์
        - วิทยาศาสตร์
        - ภาษาอังกฤษ
        - ภาษาไทย
        - สังคมศึกษา
        
        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง
        เรียนได้ทั้งแบบ Onsite และ Online`,
        type: 'hybrid',
        onsite_price: 5500,
        online_price: 4000,
        duration_hours: 42,
        level: 'intermediate',
        course_category: 'entrance_exam',
        class_type: 'regular',
        set_number: '5/5',
        total_sets: 5,
        academic_year: 2569,
        exam_date: '2026-03-28',
        gradeLevelCodes: ['P6', 'M1'],
        subjectCodes: ['MATH', 'SCIENCE', 'ENGLISH', 'THAI', 'SOCIAL'],
        branchCode: 'FASHION_ISLAND',
        rounds: [
          {
            round_number: 1,
            name: 'รอบ 1',
            schedule_days: 'เสาร์',
            start_date: '2026-02-21',
            end_date: '2026-03-22',
            start_time: '08:30:00',
            end_time: '16:15:00',
            onsite_price: 5500,
            online_price: 4000
          },
          {
            round_number: 2,
            name: 'รอบ 2',
            schedule_days: 'จันทร์-พุธ-ศุกร์',
            start_date: '2026-03-16',
            end_date: '2026-03-27',
            start_time: '08:30:00',
            end_time: '16:15:00',
            onsite_price: 5500,
            online_price: 4000
          }
        ],
        inclusions: {
          onsite: ['TEXTBOOK', 'BAG', 'VIDEO_REPLAY'],
          online: ['TEXTBOOK', 'VIDEO_REPLAY', 'FREE_DELIVERY']
        }
      },
      {
        code: 'ENT-P6-M1-GIFTED-2569',
        slug: 'course-final-curve-p6-m1-gifted-2569',
        title: 'คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ GIFTED-IEP-EP',
        short_description: 'เตรียมสอบเข้า ม.1 ห้องพิเศษ GIFTED-IEP-EP สำหรับนักเรียนชั้น ป.6',
        description: `คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องพิเศษ GIFTED-IEP-EP
        ครอบคลุมเนื้อหาทั้ง 3 วิชาหลัก:
        - คณิตศาสตร์
        - วิทยาศาสตร์
        - ภาษาอังกฤษ
        
        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง
        เรียนได้ทั้งแบบ Onsite และ Online`,
        type: 'hybrid',
        onsite_price: 2800,
        online_price: 2200,
        duration_hours: 16,
        level: 'advanced',
        course_category: 'entrance_exam',
        class_type: 'gifted',
        academic_year: 2569,
        exam_date: '2026-02-21',
        gradeLevelCodes: ['P6', 'M1'],
        subjectCodes: ['MATH', 'SCIENCE', 'ENGLISH'],
        branchCode: 'FASHION_ISLAND',
        rounds: [
          {
            round_number: 1,
            name: 'รอบ 1',
            schedule_days: 'จันทร์-พุธ-ศุกร์',
            start_date: '2026-02-02',
            end_date: '2026-02-13',
            start_time: '17:30:00',
            end_time: '20:30:00',
            onsite_price: 2800,
            online_price: 2200
          },
          {
            round_number: 2,
            name: 'รอบ 2',
            schedule_days: 'เสาร์และอาทิตย์',
            start_date: '2026-02-14',
            end_date: '2026-02-15',
            start_time: '08:30:00',
            end_time: '17:30:00',
            onsite_price: 2800,
            online_price: 2200
          }
        ],
        inclusions: {
          onsite: ['TEXTBOOK', 'BAG', 'VIDEO_REPLAY'],
          online: ['TEXTBOOK', 'VIDEO_REPLAY', 'FREE_DELIVERY']
        }
      },
      {
        code: 'ENT-P6-M1-EP-2569',
        slug: 'course-final-curve-p6-m1-ep-2569',
        title: 'คอร์สโค้งสุดท้าย ป.6 สอบเข้า ม.1 ห้องพิเศษ EP (ภาคอังกฤษ)',
        short_description: 'เตรียมสอบเข้า ม.1 ห้องพิเศษ EP สำหรับนักเรียนชั้น ป.6',
        description: `คอร์สโค้งสุดท้ายสำหรับนักเรียนชั้น ป.6 ที่ต้องการสอบเข้า ม.1 ห้องพิเศษ EP (English Program)
        ครอบคลุมเนื้อหาทั้ง 3 วิชาหลัก:
        - คณิตศาสตร์
        - วิทยาศาสตร์
        - ภาษาอังกฤษ
        
        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง
        เรียนได้ทั้งแบบ Onsite และ Online`,
        type: 'hybrid',
        onsite_price: 3000,
        online_price: 2400,
        duration_hours: 16,
        level: 'advanced',
        course_category: 'entrance_exam',
        class_type: 'ep',
        academic_year: 2569,
        exam_date: '2026-02-21',
        gradeLevelCodes: ['P6', 'M1'],
        subjectCodes: ['MATH', 'SCIENCE', 'ENGLISH'],
        branchCode: 'FASHION_ISLAND',
        rounds: [
          {
            round_number: 2,
            name: 'รอบ 2',
            schedule_days: 'เสาร์และอาทิตย์',
            start_date: '2026-02-14',
            end_date: '2026-02-15',
            start_time: '08:30:00',
            end_time: '17:30:00',
            onsite_price: 3000,
            online_price: 2400
          }
        ],
        inclusions: {
          onsite: ['TEXTBOOK', 'BAG', 'VIDEO_REPLAY'],
          online: ['TEXTBOOK', 'VIDEO_REPLAY', 'FREE_DELIVERY']
        }
      },
      {
        code: 'ENT-HORWANG-SET6-2569',
        slug: 'course-horwang-set6-2569',
        title: 'ข้อสอบจริง รร.หอวัง ชุดที่ 6',
        short_description: 'ตะลุยโจทย์ข้อสอบจริง รร.หอวัง ชุดที่ 6',
        description: `ตะลุยโจทย์ข้อสอบจริง รร.หอวัง ชุดที่ 6
        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:
        - คณิตศาสตร์
        - วิทยาศาสตร์
        - ภาษาอังกฤษ
        - ภาษาไทย
        - สังคมศึกษา
        
        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง
        เรียนได้ทั้งแบบ Onsite และ Online`,
        type: 'hybrid',
        onsite_price: 3300,
        online_price: 2800,
        duration_hours: 24,
        level: 'intermediate',
        course_category: 'entrance_exam',
        class_type: 'special',
        set_number: '6',
        target_school: 'รร.หอวัง',
        academic_year: 2569,
        exam_date: '2026-03-28',
        gradeLevelCodes: ['P6', 'M1'],
        subjectCodes: ['MATH', 'SCIENCE', 'ENGLISH', 'THAI', 'SOCIAL'],
        branchCode: 'FASHION_ISLAND',
        rounds: [
          {
            round_number: 1,
            name: 'รอบ 1',
            schedule_days: 'อังคารและพฤหัสบดี',
            start_date: '2026-03-03',
            end_date: '2026-03-26',
            start_time: '17:30:00',
            end_time: '20:30:00',
            onsite_price: 3300,
            online_price: 2800
          }
        ],
        inclusions: {
          onsite: ['TEXTBOOK', 'BAG', 'VIDEO_REPLAY'],
          online: ['TEXTBOOK', 'VIDEO_REPLAY', 'FREE_DELIVERY']
        }
      },
      {
        code: 'FOUNDATION-P5-P6-2569',
        slug: 'course-foundation-p5-p6-2569',
        title: 'คอร์สปูพื้นฐาน ป.5 ขึ้น ป.6',
        short_description: 'ปูพื้นฐานสำหรับนักเรียนชั้น ป.5 ที่จะขึ้น ป.6',
        description: `คอร์สปูพื้นฐานสำหรับนักเรียนชั้น ป.5 ที่จะขึ้น ป.6
        ครอบคลุมเนื้อหาทั้ง 2 วิชาหลัก:
        - คณิตศาสตร์
        - วิทยาศาสตร์
        
        เพื่อเตรียมความพร้อมก่อนขึ้นชั้น ป.6
        เรียนได้ทั้งแบบ Onsite และ Online`,
        type: 'hybrid',
        onsite_price: 5900,
        online_price: 4500,
        duration_hours: 30,
        level: 'beginner',
        course_category: 'regular',
        class_type: 'foundation',
        academic_year: 2569,
        gradeLevelCodes: ['P5', 'P6'],
        subjectCodes: ['MATH', 'SCIENCE'],
        branchCode: 'FASHION_ISLAND',
        rounds: [
          {
            round_number: 1,
            name: 'รอบ 1',
            schedule_days: 'เสาร์',
            start_date: '2026-03-07',
            end_date: '2026-04-04',
            start_time: '08:30:00',
            end_time: '15:15:00',
            onsite_price: 5900,
            online_price: 4500
          }
        ],
        inclusions: {
          onsite: ['TEXTBOOK', 'BAG'],
          online: ['TEXTBOOK', 'FREE_DELIVERY']
        }
      },
      {
        code: 'ENT-M3-M4-OBEC-2569',
        slug: 'course-m3-m4-obec-2569',
        title: 'ม.3 ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ',
        short_description: 'ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ สำหรับนักเรียนชั้น ม.3',
        description: `ตะลุยโจทย์สอบเข้า ม.4 ห้องปกติ รร.สพฐ สำหรับนักเรียนชั้น ม.3
        ครอบคลุมเนื้อหาทั้ง 5 วิชาหลัก:
        - คณิตศาสตร์
        - วิทยาศาสตร์
        - ภาษาอังกฤษ
        - ภาษาไทย
        - สังคมศึกษา
        
        พร้อมเทคนิคการทำข้อสอบและแนวข้อสอบจริง
        เรียนได้ทั้งแบบ Onsite และ Online`,
        type: 'hybrid',
        onsite_price: 4500,
        online_price: 4000,
        duration_hours: 30,
        level: 'intermediate',
        course_category: 'entrance_exam',
        class_type: 'regular',
        target_school: 'รร.สพฐ',
        academic_year: 2569,
        gradeLevelCodes: ['M3', 'M4'],
        subjectCodes: ['MATH', 'SCIENCE', 'ENGLISH', 'THAI', 'SOCIAL'],
        branchCode: 'FASHION_ISLAND',
        rounds: [
          {
            round_number: 1,
            name: 'รอบ 1',
            schedule_days: 'เสาร์และอาทิตย์',
            start_date: '2026-03-14',
            end_date: '2026-03-28',
            start_time: '08:30:00',
            end_time: '15:15:00',
            onsite_price: 4500,
            online_price: 4000
          }
        ],
        inclusions: {
          onsite: ['TEXTBOOK', 'BAG', 'VIDEO_REPLAY'],
          online: ['TEXTBOOK', 'VIDEO_REPLAY', 'FREE_DELIVERY']
        }
      }
    ]
    
    console.log('📖 Creating courses...')
    console.log('')
    
    for (const course of courses) {
      // Check if course already exists
      const [existingCourses] = await connection.execute(
        'SELECT id FROM courses WHERE code = ?',
        [course.code]
      ) as any[]
      
      if (existingCourses.length > 0) {
        console.log(`   ⚠️  Course "${course.title}" already exists (code: ${course.code})`)
        continue
      }
      
      // Insert course (slug is optional, skip if column doesn't exist)
      const [courseResult] = await connection.execute(
        `INSERT INTO courses (
          code, title, short_description, description, type,
          price, onsite_price, online_price, duration_hours, level,
          course_category, class_type, set_number, total_sets, target_school,
          academic_year, exam_date, status, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
        [
          course.code,
          course.title,
          course.short_description,
          course.description,
          course.type,
          course.onsite_price, // Use onsite_price as default price
          course.onsite_price,
          course.online_price,
          course.duration_hours,
          course.level,
          course.course_category,
          course.class_type,
          course.set_number || null,
          course.total_sets || null,
          course.target_school || null,
          course.academic_year,
          course.exam_date || null,
          adminUserId
        ]
      ) as any[]
      
      const courseId = courseResult.insertId
      console.log(`   ✅ Created course: ${course.title} (ID: ${courseId})`)
      
      // Link course to branch
      await connection.execute(
        `INSERT INTO course_branches (course_id, branch_id, seat_limit, is_available)
         VALUES (?, ?, 50, TRUE)`,
        [courseId, branchId]
      )
      console.log(`      → Linked to branch: ${course.branchCode}`)
      
      // Link grade levels
      for (const gradeCode of course.gradeLevelCodes) {
        const gradeId = gradeMap.get(gradeCode)
        if (gradeId) {
          await connection.execute(
            'INSERT INTO course_grade_levels (course_id, grade_level_id) VALUES (?, ?)',
            [courseId, gradeId]
          )
          console.log(`      → Linked to grade: ${gradeCode}`)
        }
      }
      
      // Link subjects
      for (const subjectCode of course.subjectCodes) {
        const subjectId = subjectMap.get(subjectCode)
        if (subjectId) {
          await connection.execute(
            'INSERT INTO course_subjects (course_id, subject_id) VALUES (?, ?)',
            [courseId, subjectId]
          )
          console.log(`      → Linked to subject: ${subjectCode}`)
        }
      }
      
      // Create course rounds
      for (const round of course.rounds) {
        const [roundResult] = await connection.execute(
          `INSERT INTO course_rounds (
            course_id, round_number, name, start_date, end_date,
            schedule_days, start_time, end_time,
            onsite_price, online_price, seat_limit, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 50, 'upcoming')`,
          [
            courseId,
            round.round_number,
            round.name,
            round.start_date,
            round.end_date,
            round.schedule_days,
            round.start_time,
            round.end_time,
            round.onsite_price || course.onsite_price,
            round.online_price || course.online_price
          ]
        ) as any[]
        
        const roundId = roundResult.insertId
        console.log(`      → Created round: ${round.name} (ID: ${roundId})`)
      }
      
      // Link inclusions
      // Onsite inclusions
      for (const inclusionCode of course.inclusions.onsite) {
        const inclusionId = inclusionMap.get(inclusionCode)
        if (inclusionId) {
          await connection.execute(
            `INSERT INTO course_inclusions (course_id, inclusion_id, enrollment_type, quantity)
             VALUES (?, ?, 'onsite', ?)`,
            [courseId, inclusionId, inclusionCode === 'TEXTBOOK' ? 5 : 1]
          )
        }
      }
      
      // Online inclusions
      for (const inclusionCode of course.inclusions.online) {
        const inclusionId = inclusionMap.get(inclusionCode)
        if (inclusionId) {
          await connection.execute(
            `INSERT INTO course_inclusions (course_id, inclusion_id, enrollment_type, quantity)
             VALUES (?, ?, 'online', ?)`,
            [courseId, inclusionId, inclusionCode === 'TEXTBOOK' ? 5 : 1]
          )
        }
      }
      
      console.log(`      → Linked inclusions`)
      console.log('')
    }
    
    console.log('✅ Sample courses seeding completed!')
    console.log('')
    
    // Display summary
    const [courseCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM courses WHERE status = "published"'
    ) as any[]
    
    const [roundCount] = await connection.execute(
      'SELECT COUNT(*) as count FROM course_rounds'
    ) as any[]
    
    console.log('📊 Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Published Courses: ${courseCount[0].count}`)
    console.log(`   Course Rounds: ${roundCount[0].count}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    
  } catch (error: any) {
    console.error('❌ Error seeding sample courses:', error.message)
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

seedCoursesSample()


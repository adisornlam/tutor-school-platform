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

interface Payment {
  id: number
  user_id: number
  enrollment_id: number | null
  amount: number
  created_at: Date
}

interface Enrollment {
  id: number
  student_id: number
  course_id: number
  branch_id: number
  payment_id: number | null
  created_at: Date
}

async function linkPaymentsToEnrollments() {
  const connection = await mysql.createConnection(config)

  try {
    console.log('🔗 เริ่มวิเคราะห์และผูก Payment กับ Enrollment...')
    console.log('')

    // 1. ดึง payment ที่ยังไม่ผูกกับ enrollment
    const [unlinkedPayments] = await connection.execute<Payment[]>(
      `SELECT id, user_id, enrollment_id, amount, created_at
       FROM payments
       WHERE enrollment_id IS NULL
       ORDER BY created_at ASC`
    )

    console.log(`📊 พบ Payment ที่ยังไม่ผูก: ${unlinkedPayments.length} รายการ`)
    console.log('')

    if (unlinkedPayments.length === 0) {
      console.log('✅ ทุก Payment ผูกกับ Enrollment แล้ว!')
      return
    }

    let linkedCount = 0
    let skippedCount = 0

    // 2. สำหรับแต่ละ payment ที่ยังไม่ผูก
    for (const payment of unlinkedPayments) {
      // หา enrollment ที่:
      // - student_id ตรงกับ payment.user_id
      // - payment_id ยังเป็น NULL หรือตรงกับ payment.id
      // - สร้างก่อนหรือใกล้เคียงกับ payment.created_at
      const [enrollments] = await connection.execute<Enrollment[]>(
        `SELECT id, student_id, course_id, branch_id, payment_id, created_at
         FROM enrollments
         WHERE student_id = ?
           AND (payment_id IS NULL OR payment_id = ?)
         ORDER BY ABS(TIMESTAMPDIFF(SECOND, created_at, ?)) ASC
         LIMIT 1`,
        [payment.user_id, payment.id, payment.created_at]
      )

      if (enrollments.length > 0) {
        const enrollment = enrollments[0]

        // อัปเดต payment.enrollment_id
        await connection.execute(
          'UPDATE payments SET enrollment_id = ? WHERE id = ?',
          [enrollment.id, payment.id]
        )

        // อัปเดต enrollment.payment_id (ถ้ายังไม่มี)
        if (!enrollment.payment_id) {
          await connection.execute(
            'UPDATE enrollments SET payment_id = ? WHERE id = ?',
            [payment.id, enrollment.id]
          )
        }

        linkedCount++
        console.log(`   ✅ Payment #${payment.id} → Enrollment #${enrollment.id} (Student: ${payment.user_id})`)
      } else {
        skippedCount++
        console.log(`   ⚠️  Payment #${payment.id} (Student: ${payment.user_id}) - ไม่พบ Enrollment ที่เหมาะสม`)
      }
    }

    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 สรุปผลการผูก Payment กับ Enrollment:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   ✅ ผูกสำเร็จ: ${linkedCount} รายการ`)
    console.log(`   ⚠️  ข้าม: ${skippedCount} รายการ`)
    console.log(`   📝 รวม: ${unlinkedPayments.length} รายการ`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')

    // 3. ตรวจสอบ payment ที่ยังไม่ผูก (หลังจากการผูก)
    const [remainingUnlinked] = await connection.execute<Payment[]>(
      `SELECT COUNT(*) as count
       FROM payments
       WHERE enrollment_id IS NULL`
    )

    const remainingCount = (remainingUnlinked as any[])[0]?.count || 0

    if (remainingCount > 0) {
      console.log(`⚠️  ยังมี Payment ที่ไม่สามารถผูกได้: ${remainingCount} รายการ`)
      console.log('   (อาจเป็น payment ที่ไม่มี enrollment ที่เกี่ยวข้อง)')
      console.log('')
    } else {
      console.log('✅ ทุก Payment ผูกกับ Enrollment แล้ว!')
      console.log('')
    }

  } catch (error: any) {
    console.error('❌ Error linking payments to enrollments:', error.message)
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

linkPaymentsToEnrollments()


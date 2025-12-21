import { requireAuth } from '../../../../../utils/auth.middleware'
import { getUserRoles } from '../../../../../services/auth.service'
import type { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. System Admin or Owner role required.'
    })
  }

  const templateId = parseInt(getRouterParam(event, 'id') || '0')
  if (!templateId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid template ID'
    })
  }

  try {
    // Mock template - in production, fetch from database
    const templates: Record<number, any> = {
      1: {
        id: 1,
        code: 'welcome',
        name: 'Welcome Email',
        subject: 'ยินดีต้อนรับเข้าสู่ระบบ',
        body: '<p>สวัสดี {{first_name}} {{last_name}},</p><p>ยินดีต้อนรับเข้าสู่ระบบของเรา</p>',
        variables: ['first_name', 'last_name', 'email']
      },
      2: {
        id: 2,
        code: 'password_reset',
        name: 'Password Reset',
        subject: 'รีเซ็ตรหัสผ่าน',
        body: '<p>สวัสดี {{first_name}},</p><p>คลิกที่ลิงก์นี้เพื่อรีเซ็ตรหัสผ่าน: {{reset_link}}</p>',
        variables: ['first_name', 'reset_link']
      },
      3: {
        id: 3,
        code: 'enrollment_confirmation',
        name: 'Enrollment Confirmation',
        subject: 'ยืนยันการลงทะเบียน',
        body: '<p>สวัสดี {{student_name}},</p><p>คุณได้ลงทะเบียนคอร์ส {{course_name}} เรียบร้อยแล้ว</p>',
        variables: ['student_name', 'course_name', 'enrollment_date']
      }
    }

    const template = templates[templateId]
    if (!template) {
      throw createError({
        statusCode: 404,
        message: 'Template not found'
      })
    }

    return {
      success: true,
      data: template
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Error fetching email template:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch email template'
    })
  }
})


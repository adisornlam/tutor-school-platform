import { requireAuth } from '../../../../utils/auth.middleware'
import { query } from '../../../../utils/db'
import { getUserRoles, findUserById } from '../../../../services/auth.service'
import type { UserRole } from '../../../../../shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner, branch_admin only - not tutor)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'branch_admin']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required to view payment history.'
    })
  }

  const studentId = parseInt(getRouterParam(event, 'id') || '0')
  if (!studentId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid student ID'
    })
  }

  // Check access permission based on role
  const isSystemAdmin = roles.includes('system_admin' as UserRole) || roles.includes('owner' as UserRole)
  const isBranchAdmin = roles.includes('branch_admin' as UserRole)

  // For Branch Admin: Check if student has enrollment in their branch
  if (isBranchAdmin && !isSystemAdmin) {
    const branchAdmins = await query<{ branch_id: number }>(
      'SELECT branch_id FROM branch_admins WHERE user_id = ?',
      [auth.userId]
    )
    
    if (branchAdmins.length > 0) {
      const branchIds = branchAdmins.map(ba => ba.branch_id)
      const enrollments = await query<{ id: number }>(
        `SELECT id FROM enrollments 
         WHERE student_id = ? AND branch_id IN (${branchIds.map(() => '?').join(',')})`,
        [studentId, ...branchIds]
      )
      
      if (enrollments.length === 0) {
        throw createError({
          statusCode: 403,
          message: 'Access denied. Student is not enrolled in your branch.'
        })
      }
    }
  }

  // Verify student exists
  const student = await findUserById(studentId)
  if (!student) {
    throw createError({
      statusCode: 404,
      message: 'Student not found'
    })
  }

  // Get payment history for this student (payments table uses user_id)
  const payments = await query<any>(
    `SELECT 
       p.id,
       p.amount,
       p.final_amount,
       p.status,
       p.payment_method,
       p.paid_at,
       p.created_at,
       p.updated_at,
       p.invoice_number,
       p.transaction_id,
       e.id as enrollment_id,
       c.title as course_title,
       c.code as course_code,
       b.name as branch_name
     FROM payments p
     LEFT JOIN enrollments e ON p.enrollment_id = e.id
     LEFT JOIN courses c ON e.course_id = c.id
     LEFT JOIN branches b ON e.branch_id = b.id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`,
    [studentId]
  )

  // Format response
  return {
    success: true,
    data: payments.map((p: any) => ({
      id: p.id,
      amount: parseFloat(p.final_amount || p.amount),
      status: p.status,
      payment_method: p.payment_method,
      payment_method_name: p.payment_method === 'bank_transfer' ? 'โอนเงิน' : p.payment_method === 'online' ? 'ชำระออนไลน์' : p.payment_method || 'ไม่ระบุ',
      payment_date: p.paid_at || p.created_at,
      invoice_number: p.invoice_number,
      transaction_id: p.transaction_id,
      enrollment: p.enrollment_id ? {
        id: p.enrollment_id,
        course: {
          title: p.course_title,
          code: p.course_code
        },
        branch: {
          name: p.branch_name
        }
      } : null,
      created_at: p.created_at,
      updated_at: p.updated_at
    }))
  }
})


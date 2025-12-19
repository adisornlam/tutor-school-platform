import { requireAuth } from '../../../../utils/auth.middleware'
import { query, execute } from '../../../../utils/db'
import { getUserRoles, findUserById } from '../../../../services/auth.service'
import type { UserRole } from '../../../../../shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  // Check if user has admin role (system_admin, owner, branch_admin)
  const roles = await getUserRoles(auth.userId)
  const allowedRoles: UserRole[] = ['system_admin', 'owner', 'branch_admin']
  if (!roles.some(role => allowedRoles.includes(role as UserRole))) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Admin role required.'
    })
  }

  const studentId = parseInt(getRouterParam(event, 'id') || '0')
  if (!studentId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid student ID'
    })
  }

  const body = await readBody<{
    parent_id: number
    relationship: string
  }>(event)

  if (!body.parent_id || !body.relationship) {
    throw createError({
      statusCode: 400,
      message: 'parent_id and relationship are required'
    })
  }

  // Verify student exists and is a student
  const student = await findUserById(studentId)
  if (!student) {
    throw createError({
      statusCode: 404,
      message: 'Student not found'
    })
  }

  const studentRoles = await query<{ name: string }>(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'student'`,
    [studentId]
  )

  if (studentRoles.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'User is not a student'
    })
  }

  // Verify parent exists and is a parent
  const parent = await findUserById(body.parent_id)
  if (!parent) {
    throw createError({
      statusCode: 404,
      message: 'Parent not found'
    })
  }

  const parentRoles = await query<{ name: string }>(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'parent'`,
    [body.parent_id]
  )

  if (parentRoles.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'User is not a parent'
    })
  }

  // Check if relationship already exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM parent_students WHERE parent_id = ? AND student_id = ?',
    [body.parent_id, studentId]
  )

  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      message: 'Parent-student relationship already exists'
    })
  }

  // Validate relationship
  const validRelationships = ['father', 'mother', 'guardian', 'other']
  if (!validRelationships.includes(body.relationship)) {
    throw createError({
      statusCode: 400,
      message: `Invalid relationship. Must be one of: ${validRelationships.join(', ')}`
    })
  }

  // Create relationship
  await execute(
    'INSERT INTO parent_students (parent_id, student_id, relationship) VALUES (?, ?, ?)',
    [body.parent_id, studentId, body.relationship]
  )

  // Get updated parent info
  const newParent = await query<any>(
    `SELECT 
       p.id,
       p.username,
       p.email,
       p.first_name,
       p.last_name,
       p.phone,
       p.status,
       ps.relationship
     FROM parent_students ps
     INNER JOIN users p ON ps.parent_id = p.id
     WHERE ps.parent_id = ? AND ps.student_id = ?`,
    [body.parent_id, studentId]
  )

  if (newParent.length === 0) {
    throw createError({
      statusCode: 500,
      message: 'Failed to retrieve parent information'
    })
  }

  return {
    success: true,
    data: {
      id: newParent[0].id,
      username: newParent[0].username,
      email: newParent[0].email,
      first_name: newParent[0].first_name,
      last_name: newParent[0].last_name,
      phone: newParent[0].phone,
      status: newParent[0].status,
      relationship: newParent[0].relationship
    },
    message: 'Parent added successfully'
  }
})


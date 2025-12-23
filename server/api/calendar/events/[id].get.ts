import { requireAuth } from '../../../utils/auth.middleware'
import { query } from '../../../utils/db'
import { getUserRoles } from '../../../services/auth.service'
import { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const eventId = parseInt(getRouterParam(event, 'id') || '0')

  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid event ID'
    })
  }

  try {
    // Get event
    const events = await query(
      `SELECT 
        ce.id,
        ce.user_id,
        ce.title,
        ce.description,
        ce.start_datetime,
        ce.end_datetime,
        ce.location,
        ce.color,
        ce.is_all_day,
        ce.reminder_minutes,
        ce.is_shared,
        ce.shared_scope,
        ce.shared_branch_id,
        ce.event_type,
        ce.created_at,
        ce.updated_at,
        u.first_name,
        u.last_name
      FROM calendar_events ce
      INNER JOIN users u ON ce.user_id = u.id
      WHERE ce.id = ?`,
      [eventId]
    )

    if (events.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    const eventData = events[0] as any
    const isMine = eventData.user_id === auth.userId

    // Check access permissions
    if (!isMine && !eventData.is_shared) {
      throw createError({
        statusCode: 403,
        message: 'Access denied'
      })
    }

    // If shared, check if user has access based on shared_scope
    if (!isMine && eventData.is_shared) {
      const roles = await getUserRoles(auth.userId)
      const hasAccess = await checkSharedEventAccess(
        eventId,
        eventData.shared_scope,
        eventData.shared_branch_id,
        auth.userId,
        roles
      )

      if (!hasAccess) {
        throw createError({
          statusCode: 403,
          message: 'Access denied'
        })
      }
    }

    // Get individual shares if any
    const individualShares = await query<{ shared_with_user_id: number }>(
      'SELECT shared_with_user_id FROM calendar_event_shared_with WHERE event_id = ?',
      [eventId]
    )

    return {
      success: true,
      data: {
        id: eventData.id,
        user_id: eventData.user_id,
        title: eventData.title,
        description: eventData.description,
        start_datetime: eventData.start_datetime,
        end_datetime: eventData.end_datetime,
        location: eventData.location,
        color: eventData.color,
        is_all_day: eventData.is_all_day,
        reminder_minutes: eventData.reminder_minutes,
        is_shared: eventData.is_shared,
        shared_scope: eventData.shared_scope,
        shared_branch_id: eventData.shared_branch_id,
        event_type: eventData.event_type,
        created_at: eventData.created_at,
        updated_at: eventData.updated_at,
        is_mine: isMine,
        created_by: {
          id: eventData.user_id,
          first_name: eventData.first_name,
          last_name: eventData.last_name
        },
        shared_with_user_ids: individualShares.map(s => s.shared_with_user_id)
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error fetching calendar event:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch calendar event'
    })
  }
})

async function checkSharedEventAccess(
  eventId: number,
  sharedScope: string,
  sharedBranchId: number | null,
  userId: number,
  roles: string[]
): Promise<boolean> {
  const isSystemAdmin = roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.OWNER)
  const isAdmin = roles.includes(UserRole.ADMIN)
  const isBranchAdmin = roles.includes(UserRole.BRANCH_ADMIN)
  const isTutor = roles.includes(UserRole.TUTOR)
  const isStudent = roles.includes(UserRole.STUDENT)
  const isParent = roles.includes(UserRole.PARENT)

  if (sharedScope === 'public') return true

  if (sharedScope === 'admins' && (isSystemAdmin || isAdmin)) return true

  if (sharedScope === 'branch_admins') {
    if (isSystemAdmin || isAdmin) return true
    if (isBranchAdmin) {
      if (sharedBranchId === null) return true
      const branchAdmins = await query<{ branch_id: number }>(
        'SELECT branch_id FROM branch_admins WHERE user_id = ?',
        [userId]
      )
      return branchAdmins.some(ba => ba.branch_id === sharedBranchId)
    }
  }

  if (sharedScope === 'tutors') {
    if (isSystemAdmin || isAdmin) return true
    if (isTutor) {
      if (sharedBranchId === null) return true
      const tutors = await query<{ id: number }>(
        'SELECT id FROM tutors WHERE user_id = ?',
        [userId]
      )
      if (tutors.length > 0 && tutors[0]) {
        const tutorBranches = await query<{ branch_id: number }>(
          'SELECT branch_id FROM tutor_branches WHERE tutor_id = ?',
          [tutors[0].id]
        )
        return tutorBranches.some(tb => tb.branch_id === sharedBranchId)
      }
    }
  }

  if (sharedScope === 'students' || sharedScope === 'branch_students') {
    if (isSystemAdmin || isAdmin) return true
    if (isStudent) {
      if (sharedScope === 'students') return true
      if (sharedBranchId) {
        const enrollments = await query<{ branch_id: number }>(
          'SELECT DISTINCT branch_id FROM enrollments WHERE student_id = ? AND status = "active"',
          [userId]
        )
        return enrollments.some(e => e.branch_id === sharedBranchId)
      }
    }
  }

  if (sharedScope === 'parents' || sharedScope === 'branch_parents') {
    if (isSystemAdmin || isAdmin) return true
    if (isParent) {
      if (sharedScope === 'parents') return true
      if (sharedBranchId) {
        const parentStudents = await query<{ student_id: number }>(
          `SELECT DISTINCT ps.student_id 
           FROM parent_students ps
           INNER JOIN enrollments e ON ps.student_id = e.student_id
           WHERE ps.parent_id = ? AND e.status = "active" AND e.branch_id = ?`,
          [userId, sharedBranchId]
        )
        return parentStudents.length > 0
      }
    }
  }

  // Check individual shares
  const individualShares = await query<{ shared_with_user_id: number }>(
    'SELECT shared_with_user_id FROM calendar_event_shared_with WHERE event_id = ? AND shared_with_user_id = ?',
    [eventId, userId]
  )
  if (individualShares.length > 0) return true

  return false
}


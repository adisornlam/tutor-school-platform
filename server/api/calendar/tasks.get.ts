import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'
import { getUserRoles } from '../../services/auth.service'
import { UserRole } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  
  const queryParams = getQuery(event)
  const startDate = queryParams.start_date as string | undefined
  const endDate = queryParams.end_date as string | undefined
  const status = queryParams.status as string | undefined
  const priority = queryParams.priority as string | undefined
  const includeShared = queryParams.include_shared !== 'false' // default: true

  // Get user roles
  const roles = await getUserRoles(auth.userId)
  const isSystemAdmin = roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.OWNER)
  const isAdmin = roles.includes(UserRole.ADMIN)
  const isBranchAdmin = roles.includes(UserRole.BRANCH_ADMIN)
  const isTutor = roles.includes(UserRole.TUTOR)

  // Get user's branch_ids
  let userBranchIds: number[] = []
  if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    const branchAdmins = await query<{ branch_id: number }>(
      'SELECT branch_id FROM branch_admins WHERE user_id = ?',
      [auth.userId]
    )
    userBranchIds = branchAdmins.map(ba => ba.branch_id)
  }

  // Build conditions for shared tasks access
  const sharedScopeConditions: string[] = []
  const sharedScopeParams: any[] = []

  if (includeShared) {
    sharedScopeConditions.push(`ct.shared_scope = 'public'`)

    if (isSystemAdmin || isAdmin) {
      sharedScopeConditions.push(`ct.shared_scope = 'admins'`)
    }

    if (isBranchAdmin || isSystemAdmin || isAdmin) {
      if (userBranchIds.length > 0) {
        sharedScopeConditions.push(
          `(ct.shared_scope = 'branch_admins' AND (ct.shared_branch_id IS NULL OR ct.shared_branch_id IN (${userBranchIds.map(() => '?').join(',')})))`
        )
        sharedScopeParams.push(...userBranchIds)
      } else {
        sharedScopeConditions.push(`ct.shared_scope = 'branch_admins'`)
      }
    }

    if (isTutor || isSystemAdmin || isAdmin) {
      if (userBranchIds.length > 0) {
        sharedScopeConditions.push(
          `(ct.shared_scope = 'tutors' AND (ct.shared_branch_id IS NULL OR ct.shared_branch_id IN (${userBranchIds.map(() => '?').join(',')})))`
        )
        sharedScopeParams.push(...userBranchIds)
      } else {
        sharedScopeConditions.push(`ct.shared_scope = 'tutors'`)
      }
    }

    sharedScopeConditions.push(
      `EXISTS (
        SELECT 1 FROM calendar_task_shared_with ctsw
        WHERE ctsw.task_id = ct.id AND ctsw.shared_with_user_id = ?
      )`
    )
    sharedScopeParams.push(auth.userId)
  }

  // Build main query
  let sql = `
    SELECT DISTINCT
      ct.id,
      ct.user_id,
      ct.title,
      ct.description,
      ct.due_date,
      ct.start_date,
      ct.priority,
      ct.status,
      ct.color,
      ct.is_shared,
      ct.shared_scope,
      ct.shared_branch_id,
      ct.category,
      ct.completed_at,
      ct.created_at,
      ct.updated_at,
      u.first_name,
      u.last_name,
      CASE WHEN ct.user_id = ? THEN TRUE ELSE FALSE END as is_mine
    FROM calendar_tasks ct
    INNER JOIN users u ON ct.user_id = u.id
    WHERE (
      ct.user_id = ?
      ${includeShared && sharedScopeConditions.length > 0 
        ? `OR (ct.is_shared = TRUE AND (${sharedScopeConditions.join(' OR ')}))` 
        : ''}
    )
  `
  
  const params: any[] = [auth.userId, auth.userId, ...sharedScopeParams]

  // Add filters
  const filterConditions: string[] = []

  if (startDate) {
    filterConditions.push(`(DATE(ct.due_date) >= ? OR DATE(ct.start_date) >= ?)`)
    params.push(startDate, startDate)
  }

  if (endDate) {
    filterConditions.push(`(DATE(ct.due_date) <= ? OR DATE(ct.start_date) <= ? OR ct.due_date IS NULL)`)
    params.push(endDate, endDate)
  }

  if (status) {
    filterConditions.push(`ct.status = ?`)
    params.push(status)
  }

  if (priority) {
    filterConditions.push(`ct.priority = ?`)
    params.push(priority)
  }

  // Apply filters
  if (filterConditions.length > 0) {
    sql += ` AND ${filterConditions.join(' AND ')}`
  }

  sql += ` ORDER BY ct.due_date ASC NULLS LAST, ct.priority DESC, ct.created_at DESC`

  try {
    const tasks = await query(sql, params)
    
    return {
      success: true,
      data: tasks.map((t: any) => ({
        id: t.id,
        user_id: t.user_id,
        title: t.title,
        description: t.description,
        due_date: t.due_date,
        start_date: t.start_date,
        priority: t.priority,
        status: t.status,
        color: t.color,
        is_shared: t.is_shared,
        shared_scope: t.shared_scope,
        shared_branch_id: t.shared_branch_id,
        category: t.category,
        completed_at: t.completed_at,
        created_at: t.created_at,
        updated_at: t.updated_at,
        is_mine: t.is_mine === 1 || t.is_mine === true,
        created_by: {
          id: t.user_id,
          first_name: t.first_name,
          last_name: t.last_name
        }
      }))
    }
  } catch (error: any) {
    console.error('Error fetching calendar tasks:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch calendar tasks'
    })
  }
})


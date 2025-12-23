import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

interface UpdateTaskBody {
  title?: string
  description?: string
  due_date?: string
  start_date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  color?: string
  category?: string
  is_shared?: boolean
  shared_scope?: 'private' | 'tutors' | 'students' | 'parents' | 'admins' | 'branch_admins' | 'public'
  shared_branch_id?: number | null
  shared_with_user_ids?: number[]
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const taskId = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody<UpdateTaskBody>(event)

  if (!taskId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid task ID'
    })
  }

  try {
    // Check if task exists and user owns it
    const tasks = await query(
      'SELECT user_id FROM calendar_tasks WHERE id = ?',
      [taskId]
    )

    if (tasks.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Task not found'
      })
    }

    const taskData = tasks[0] as any
    if (taskData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: 'You can only edit your own tasks'
      })
    }

    // Build update query dynamically
    const updateFields: string[] = []
    const updateValues: any[] = []

    if (body.title !== undefined) {
      updateFields.push('title = ?')
      updateValues.push(body.title)
    }
    if (body.description !== undefined) {
      updateFields.push('description = ?')
      updateValues.push(body.description || null)
    }
    if (body.due_date !== undefined) {
      updateFields.push('due_date = ?')
      updateValues.push(body.due_date || null)
    }
    if (body.start_date !== undefined) {
      updateFields.push('start_date = ?')
      updateValues.push(body.start_date || null)
    }
    if (body.priority !== undefined) {
      updateFields.push('priority = ?')
      updateValues.push(body.priority)
    }
    if (body.status !== undefined) {
      updateFields.push('status = ?')
      updateValues.push(body.status)
      
      // Auto-set completed_at when status is completed
      if (body.status === 'completed') {
        updateFields.push('completed_at = NOW()')
      } else if (body.status !== 'completed') {
        updateFields.push('completed_at = NULL')
      }
    }
    if (body.color !== undefined) {
      updateFields.push('color = ?')
      updateValues.push(body.color)
    }
    if (body.category !== undefined) {
      updateFields.push('category = ?')
      updateValues.push(body.category || null)
    }
    if (body.is_shared !== undefined) {
      updateFields.push('is_shared = ?')
      updateValues.push(body.is_shared)
    }
    if (body.shared_scope !== undefined) {
      updateFields.push('shared_scope = ?')
      updateValues.push(body.is_shared ? body.shared_scope : 'private')
    }
    if (body.shared_branch_id !== undefined) {
      updateFields.push('shared_branch_id = ?')
      updateValues.push(body.shared_branch_id || null)
    }

    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    updateValues.push(taskId)

    await execute(
      `UPDATE calendar_tasks SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    // Update individual shares if provided
    if (body.shared_with_user_ids !== undefined) {
      await execute(
        'DELETE FROM calendar_task_shared_with WHERE task_id = ?',
        [taskId]
      )

      if (body.shared_with_user_ids.length > 0) {
        for (const userId of body.shared_with_user_ids) {
          await execute(
            'INSERT INTO calendar_task_shared_with (task_id, shared_with_user_id) VALUES (?, ?)',
            [taskId, userId]
          )
        }
      }
    }

    // Fetch updated task
    const updatedTasks = await query(
      `SELECT 
        ct.id,
        ct.user_id,
        ct.title,
        ct.description,
        ct.due_date,
        ct.start_date,
        ct.priority,
        ct.status,
        ct.color,
        ct.category,
        ct.is_shared,
        ct.shared_scope,
        ct.shared_branch_id,
        ct.completed_at,
        ct.created_at,
        ct.updated_at,
        u.first_name,
        u.last_name
      FROM calendar_tasks ct
      INNER JOIN users u ON ct.user_id = u.id
      WHERE ct.id = ?`,
      [taskId]
    )

    const updatedTask = updatedTasks[0] as any

    return {
      success: true,
      data: {
        id: updatedTask.id,
        user_id: updatedTask.user_id,
        title: updatedTask.title,
        description: updatedTask.description,
        due_date: updatedTask.due_date,
        start_date: updatedTask.start_date,
        priority: updatedTask.priority,
        status: updatedTask.status,
        color: updatedTask.color,
        category: updatedTask.category,
        is_shared: updatedTask.is_shared,
        shared_scope: updatedTask.shared_scope,
        shared_branch_id: updatedTask.shared_branch_id,
        completed_at: updatedTask.completed_at,
        created_at: updatedTask.created_at,
        updated_at: updatedTask.updated_at,
        created_by: {
          id: updatedTask.user_id,
          first_name: updatedTask.first_name,
          last_name: updatedTask.last_name
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error updating calendar task:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update calendar task'
    })
  }
})


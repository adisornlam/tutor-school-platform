import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const taskId = parseInt(getRouterParam(event, 'id') || '0')

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
        message: 'You can only delete your own tasks'
      })
    }

    // Delete task (cascade will handle calendar_task_shared_with)
    await execute(
      'DELETE FROM calendar_tasks WHERE id = ?',
      [taskId]
    )

    return {
      success: true,
      message: 'Task deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error deleting calendar task:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete calendar task'
    })
  }
})


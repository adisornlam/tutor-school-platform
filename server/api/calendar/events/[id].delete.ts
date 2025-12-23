import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

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
    // Check if event exists and user owns it
    const events = await query(
      'SELECT user_id FROM calendar_events WHERE id = ?',
      [eventId]
    )

    if (events.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    const eventData = events[0] as any
    if (eventData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: 'You can only delete your own events'
      })
    }

    // Delete event (cascade will handle calendar_event_shared_with)
    await execute(
      'DELETE FROM calendar_events WHERE id = ?',
      [eventId]
    )

    return {
      success: true,
      message: 'Event deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error deleting calendar event:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete calendar event'
    })
  }
})


import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

interface UpdateEventBody {
  title?: string
  description?: string
  start_datetime?: string
  end_datetime?: string
  location?: string
  color?: string
  is_all_day?: boolean
  reminder_minutes?: number | null
  is_shared?: boolean
  shared_scope?: 'private' | 'tutors' | 'students' | 'parents' | 'admins' | 'branch_admins' | 'branch_students' | 'branch_parents' | 'public'
  shared_branch_id?: number | null
  event_type?: 'personal' | 'meeting' | 'holiday' | 'announcement' | 'other'
  shared_with_user_ids?: number[]
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const eventId = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody<UpdateEventBody>(event)

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
        message: 'You can only edit your own events'
      })
    }

    // Validate datetime if provided
    if (body.start_datetime || body.end_datetime) {
      const currentEvent = await query(
        'SELECT start_datetime, end_datetime FROM calendar_events WHERE id = ?',
        [eventId]
      ) as any[]
      
      const startDate = body.start_datetime ? new Date(body.start_datetime) : new Date(currentEvent[0].start_datetime)
      const endDate = body.end_datetime ? new Date(body.end_datetime) : new Date(currentEvent[0].end_datetime)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw createError({
          statusCode: 400,
          message: 'Invalid datetime format'
        })
      }

      if (endDate < startDate) {
        throw createError({
          statusCode: 400,
          message: 'end_datetime must be after start_datetime'
        })
      }
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
    if (body.start_datetime !== undefined) {
      updateFields.push('start_datetime = ?')
      updateValues.push(body.start_datetime)
    }
    if (body.end_datetime !== undefined) {
      updateFields.push('end_datetime = ?')
      updateValues.push(body.end_datetime)
    }
    if (body.location !== undefined) {
      updateFields.push('location = ?')
      updateValues.push(body.location || null)
    }
    if (body.color !== undefined) {
      updateFields.push('color = ?')
      updateValues.push(body.color)
    }
    if (body.is_all_day !== undefined) {
      updateFields.push('is_all_day = ?')
      updateValues.push(body.is_all_day)
    }
    if (body.reminder_minutes !== undefined) {
      updateFields.push('reminder_minutes = ?')
      updateValues.push(body.reminder_minutes || null)
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
    if (body.event_type !== undefined) {
      updateFields.push('event_type = ?')
      updateValues.push(body.event_type)
    }

    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    updateValues.push(eventId)

    await execute(
      `UPDATE calendar_events SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    // Update individual shares if provided
    if (body.shared_with_user_ids !== undefined) {
      // Delete existing individual shares
      await execute(
        'DELETE FROM calendar_event_shared_with WHERE event_id = ?',
        [eventId]
      )

      // Add new individual shares
      if (body.shared_with_user_ids.length > 0) {
        for (const userId of body.shared_with_user_ids) {
          await execute(
            'INSERT INTO calendar_event_shared_with (event_id, shared_with_user_id) VALUES (?, ?)',
            [eventId, userId]
          )
        }
      }
    }

    // Fetch updated event
    const updatedEvents = await query(
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

    const updatedEvent = updatedEvents[0] as any

    // Get individual shares
    const individualShares = await query<{ shared_with_user_id: number }>(
      'SELECT shared_with_user_id FROM calendar_event_shared_with WHERE event_id = ?',
      [eventId]
    )

    return {
      success: true,
      data: {
        id: updatedEvent.id,
        user_id: updatedEvent.user_id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        start_datetime: updatedEvent.start_datetime,
        end_datetime: updatedEvent.end_datetime,
        location: updatedEvent.location,
        color: updatedEvent.color,
        is_all_day: updatedEvent.is_all_day,
        reminder_minutes: updatedEvent.reminder_minutes,
        is_shared: updatedEvent.is_shared,
        shared_scope: updatedEvent.shared_scope,
        shared_branch_id: updatedEvent.shared_branch_id,
        event_type: updatedEvent.event_type,
        created_at: updatedEvent.created_at,
        updated_at: updatedEvent.updated_at,
        created_by: {
          id: updatedEvent.user_id,
          first_name: updatedEvent.first_name,
          last_name: updatedEvent.last_name
        },
        shared_with_user_ids: individualShares.map(s => s.shared_with_user_id)
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error updating calendar event:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update calendar event'
    })
  }
})


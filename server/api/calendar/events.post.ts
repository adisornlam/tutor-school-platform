import { requireAuth } from '../../utils/auth.middleware'
import { query, execute } from '../../utils/db'

interface CreateEventBody {
  title: string
  description?: string
  start_datetime: string
  end_datetime: string
  location?: string
  color?: string
  is_all_day?: boolean
  reminder_minutes?: number | null
  is_shared?: boolean
  shared_scope?: 'private' | 'tutors' | 'students' | 'parents' | 'admins' | 'branch_admins' | 'branch_students' | 'branch_parents' | 'public'
  shared_branch_id?: number | null
  event_type?: 'personal' | 'meeting' | 'holiday' | 'announcement' | 'other'
  shared_with_user_ids?: number[] // For individual sharing
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const body = await readBody<CreateEventBody>(event)

  // Validation
  if (!body.title || !body.start_datetime || !body.end_datetime) {
    throw createError({
      statusCode: 400,
      message: 'Title, start_datetime, and end_datetime are required'
    })
  }

  // Validate datetime
  const startDate = new Date(body.start_datetime)
  const endDate = new Date(body.end_datetime)
  
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

  // Set defaults
  const isShared = body.is_shared || false
  const sharedScope = isShared ? (body.shared_scope || 'public') : 'private'
  const eventType = body.event_type || 'personal'
  const color = body.color || '#3B82F6'
  const isAllDay = body.is_all_day || false

  try {
    // Insert event
    const result = await execute(
      `INSERT INTO calendar_events (
        user_id, title, description, start_datetime, end_datetime,
        location, color, is_all_day, reminder_minutes,
        is_shared, shared_scope, shared_branch_id, event_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        auth.userId,
        body.title,
        body.description || null,
        body.start_datetime,
        body.end_datetime,
        body.location || null,
        color,
        isAllDay,
        body.reminder_minutes || null,
        isShared,
        sharedScope,
        body.shared_branch_id || null,
        eventType
      ]
    ) as any

    const eventId = result.insertId

    // Handle individual sharing
    if (isShared && body.shared_with_user_ids && body.shared_with_user_ids.length > 0) {
      for (const userId of body.shared_with_user_ids) {
        await execute(
          'INSERT INTO calendar_event_shared_with (event_id, shared_with_user_id) VALUES (?, ?)',
          [eventId, userId]
        )
      }
    }

    // Fetch created event
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
        message: 'Event not found after creation'
      })
    }

    const createdEvent = events[0] as any

    return {
      success: true,
      data: {
        id: createdEvent.id,
        user_id: createdEvent.user_id,
        title: createdEvent.title,
        description: createdEvent.description,
        start_datetime: createdEvent.start_datetime,
        end_datetime: createdEvent.end_datetime,
        location: createdEvent.location,
        color: createdEvent.color,
        is_all_day: createdEvent.is_all_day,
        reminder_minutes: createdEvent.reminder_minutes,
        is_shared: createdEvent.is_shared,
        shared_scope: createdEvent.shared_scope,
        shared_branch_id: createdEvent.shared_branch_id,
        event_type: createdEvent.event_type,
        created_at: createdEvent.created_at,
        updated_at: createdEvent.updated_at,
        created_by: {
          id: createdEvent.user_id,
          first_name: createdEvent.first_name,
          last_name: createdEvent.last_name
        }
      }
    }
  } catch (error: any) {
    console.error('Error creating calendar event:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to create calendar event'
    })
  }
})


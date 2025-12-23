import { requireAuth } from '../../utils/auth.middleware'
import { query, execute } from '../../utils/db'

interface CreateAppointmentBody {
  title: string
  description?: string
  start_datetime: string
  end_datetime: string
  appointment_type?: 'student' | 'meeting' | 'parent' | 'staff' | 'other'
  location?: string
  meeting_link?: string
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  color?: string
  reminder_minutes?: number | null
  participant_user_ids?: number[] // Users to invite
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const body = await readBody<CreateAppointmentBody>(event)

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
  const appointmentType = body.appointment_type || 'student'
  const status = body.status || 'scheduled'
  const color = body.color || '#3B82F6'

  try {
    // Insert appointment
    const result = await execute(
      `INSERT INTO calendar_appointments (
        user_id, title, description, start_datetime, end_datetime,
        appointment_type, location, meeting_link, status, color, reminder_minutes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        auth.userId,
        body.title,
        body.description || null,
        body.start_datetime,
        body.end_datetime,
        appointmentType,
        body.location || null,
        body.meeting_link || null,
        status,
        color,
        body.reminder_minutes || null
      ]
    ) as any

    const appointmentId = result.insertId

    // Add participants if provided
    if (body.participant_user_ids && body.participant_user_ids.length > 0) {
      // Get user roles to determine participant_type
      for (const userId of body.participant_user_ids) {
        // Skip creator
        if (userId === auth.userId) continue

        const userRoles = await query<{ name: string }>(
          `SELECT r.name 
           FROM user_roles ur
           JOIN roles r ON ur.role_id = r.id
           WHERE ur.user_id = ?`,
          [userId]
        )

        let participantType: 'student' | 'parent' | 'tutor' | 'admin' | 'other' = 'other'
        if (userRoles.length > 0) {
          const roleName = userRoles[0].name
          if (roleName === 'student') participantType = 'student'
          else if (roleName === 'parent') participantType = 'parent'
          else if (roleName === 'tutor') participantType = 'tutor'
          else if (['system_admin', 'owner', 'admin', 'branch_admin'].includes(roleName)) participantType = 'admin'
        }

        await execute(
          'INSERT INTO calendar_appointment_participants (appointment_id, user_id, participant_type) VALUES (?, ?, ?)',
          [appointmentId, userId, participantType]
        )
      }
    }

    // Fetch created appointment with participants
    const appointments = await query(
      `SELECT 
        ca.id,
        ca.user_id,
        ca.title,
        ca.description,
        ca.start_datetime,
        ca.end_datetime,
        ca.appointment_type,
        ca.location,
        ca.meeting_link,
        ca.status,
        ca.color,
        ca.reminder_minutes,
        ca.created_at,
        ca.updated_at,
        u.first_name,
        u.last_name
      FROM calendar_appointments ca
      INNER JOIN users u ON ca.user_id = u.id
      WHERE ca.id = ?`,
      [appointmentId]
    )

    if (appointments.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Appointment not found after creation'
      })
    }

    const createdAppointment = appointments[0] as any

    // Get participants
    const participants = await query(
      `SELECT 
        cap.user_id,
        cap.participant_type,
        cap.status as participant_status,
        u.first_name,
        u.last_name,
        u.email
      FROM calendar_appointment_participants cap
      INNER JOIN users u ON cap.user_id = u.id
      WHERE cap.appointment_id = ?`,
      [appointmentId]
    )

    return {
      success: true,
      data: {
        id: createdAppointment.id,
        user_id: createdAppointment.user_id,
        title: createdAppointment.title,
        description: createdAppointment.description,
        start_datetime: createdAppointment.start_datetime,
        end_datetime: createdAppointment.end_datetime,
        appointment_type: createdAppointment.appointment_type,
        location: createdAppointment.location,
        meeting_link: createdAppointment.meeting_link,
        status: createdAppointment.status,
        color: createdAppointment.color,
        reminder_minutes: createdAppointment.reminder_minutes,
        created_at: createdAppointment.created_at,
        updated_at: createdAppointment.updated_at,
        created_by: {
          id: createdAppointment.user_id,
          first_name: createdAppointment.first_name,
          last_name: createdAppointment.last_name
        },
        participants: participants.map((p: any) => ({
          user_id: p.user_id,
          participant_type: p.participant_type,
          status: p.participant_status,
          user: {
            id: p.user_id,
            first_name: p.first_name,
            last_name: p.last_name,
            email: p.email
          }
        }))
      }
    }
  } catch (error: any) {
    console.error('Error creating calendar appointment:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to create calendar appointment'
    })
  }
})


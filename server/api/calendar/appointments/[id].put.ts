import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

interface UpdateAppointmentBody {
  title?: string
  description?: string
  start_datetime?: string
  end_datetime?: string
  appointment_type?: 'student' | 'meeting' | 'parent' | 'staff' | 'other'
  location?: string
  meeting_link?: string
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  color?: string
  reminder_minutes?: number | null
  participant_user_ids?: number[]
}

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const appointmentId = parseInt(getRouterParam(event, 'id') || '0')
  const body = await readBody<UpdateAppointmentBody>(event)

  if (!appointmentId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid appointment ID'
    })
  }

  try {
    // Check if appointment exists and user owns it or is participant
    const appointments = await query(
      `SELECT user_id FROM calendar_appointments WHERE id = ?`,
      [appointmentId]
    )

    if (appointments.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Appointment not found'
      })
    }

    const appointmentData = appointments[0] as any
    // Only owner can update appointment details
    if (appointmentData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: 'You can only edit appointments you created'
      })
    }

    // Validate datetime if provided
    if (body.start_datetime || body.end_datetime) {
      const currentAppointment = await query(
        'SELECT start_datetime, end_datetime FROM calendar_appointments WHERE id = ?',
        [appointmentId]
      ) as any[]
      
      const startDate = body.start_datetime ? new Date(body.start_datetime) : new Date(currentAppointment[0].start_datetime)
      const endDate = body.end_datetime ? new Date(body.end_datetime) : new Date(currentAppointment[0].end_datetime)

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
    if (body.appointment_type !== undefined) {
      updateFields.push('appointment_type = ?')
      updateValues.push(body.appointment_type)
    }
    if (body.location !== undefined) {
      updateFields.push('location = ?')
      updateValues.push(body.location || null)
    }
    if (body.meeting_link !== undefined) {
      updateFields.push('meeting_link = ?')
      updateValues.push(body.meeting_link || null)
    }
    if (body.status !== undefined) {
      updateFields.push('status = ?')
      updateValues.push(body.status)
    }
    if (body.color !== undefined) {
      updateFields.push('color = ?')
      updateValues.push(body.color)
    }
    if (body.reminder_minutes !== undefined) {
      updateFields.push('reminder_minutes = ?')
      updateValues.push(body.reminder_minutes || null)
    }

    if (updateFields.length === 0 && body.participant_user_ids === undefined) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      })
    }

    if (updateFields.length > 0) {
      updateValues.push(appointmentId)
      await execute(
        `UPDATE calendar_appointments SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      )
    }

    // Update participants if provided
    if (body.participant_user_ids !== undefined) {
      // Delete existing participants
      await execute(
        'DELETE FROM calendar_appointment_participants WHERE appointment_id = ?',
        [appointmentId]
      )

      // Add new participants
      if (body.participant_user_ids.length > 0) {
        for (const userId of body.participant_user_ids) {
          if (userId === auth.userId) continue // Skip creator

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
    }

    // Fetch updated appointment
    const updatedAppointments = await query(
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

    const updatedAppointment = updatedAppointments[0] as any

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
        id: updatedAppointment.id,
        user_id: updatedAppointment.user_id,
        title: updatedAppointment.title,
        description: updatedAppointment.description,
        start_datetime: updatedAppointment.start_datetime,
        end_datetime: updatedAppointment.end_datetime,
        appointment_type: updatedAppointment.appointment_type,
        location: updatedAppointment.location,
        meeting_link: updatedAppointment.meeting_link,
        status: updatedAppointment.status,
        color: updatedAppointment.color,
        reminder_minutes: updatedAppointment.reminder_minutes,
        created_at: updatedAppointment.created_at,
        updated_at: updatedAppointment.updated_at,
        created_by: {
          id: updatedAppointment.user_id,
          first_name: updatedAppointment.first_name,
          last_name: updatedAppointment.last_name
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
    if (error.statusCode) {
      throw error
    }
    console.error('Error updating calendar appointment:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update calendar appointment'
    })
  }
})


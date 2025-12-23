import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const appointmentId = parseInt(getRouterParam(event, 'id') || '0')

  if (!appointmentId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid appointment ID'
    })
  }

  try {
    // Check if appointment exists and user owns it
    const appointments = await query(
      'SELECT user_id FROM calendar_appointments WHERE id = ?',
      [appointmentId]
    )

    if (appointments.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Appointment not found'
      })
    }

    const appointmentData = appointments[0] as any
    if (appointmentData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: 'You can only delete appointments you created'
      })
    }

    // Delete appointment (cascade will handle participants)
    await execute(
      'DELETE FROM calendar_appointments WHERE id = ?',
      [appointmentId]
    )

    return {
      success: true,
      message: 'Appointment deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error deleting calendar appointment:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete calendar appointment'
    })
  }
})


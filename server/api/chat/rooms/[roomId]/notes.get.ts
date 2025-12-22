import { requireAuth } from '#server/utils/auth.middleware'
import { query } from '#server/utils/db'
import { verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid room ID'
    })
  }

  // Verify access
  const hasAccess = await verifyRoomAccess(auth.userId, roomId)
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: 'Access denied to this room'
    })
  }

  try {
    const notes = await query<any>(`
      SELECT 
        crn.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name,
        updater.first_name as updater_first_name,
        updater.last_name as updater_last_name
      FROM chat_room_notes crn
      LEFT JOIN users creator ON crn.created_by = creator.id
      LEFT JOIN users updater ON crn.updated_by = updater.id
      WHERE crn.room_id = ?
      ORDER BY crn.updated_at DESC, crn.created_at DESC
    `, [roomId])

    const formattedNotes = notes.map((note: any) => ({
      id: note.id,
      room_id: note.room_id,
      content: note.content,
      created_by: note.created_by,
      updated_by: note.updated_by,
      created_at: note.created_at,
      updated_at: note.updated_at,
      creator: {
        id: note.created_by,
        first_name: note.creator_first_name,
        last_name: note.creator_last_name
      },
      updater: note.updated_by ? {
        id: note.updated_by,
        first_name: note.updater_first_name,
        last_name: note.updater_last_name
      } : null
    }))

    return {
      success: true,
      data: formattedNotes
    }
  } catch (error: any) {
    console.error('[API] Error fetching notes:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch notes'
    })
  }
})


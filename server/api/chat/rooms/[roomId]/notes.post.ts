import { requireAuth } from '#server/utils/auth.middleware'
import { execute, query } from '#server/utils/db'
import { verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')
  const body = await readBody(event)

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid room ID'
    })
  }

  if (!body.content || !body.content.trim()) {
    throw createError({
      statusCode: 400,
      message: 'Note content is required'
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
    const result = await execute(
      'INSERT INTO chat_room_notes (room_id, content, created_by) VALUES (?, ?, ?)',
      [roomId, body.content.trim(), auth.userId]
    )

    const notes = await query<any>(`
      SELECT 
        crn.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name
      FROM chat_room_notes crn
      LEFT JOIN users creator ON crn.created_by = creator.id
      WHERE crn.id = ?
    `, [result.insertId])

    if (!notes || notes.length === 0) {
      throw createError({
        statusCode: 500,
        message: 'Failed to retrieve created note'
      })
    }

    const note = notes[0]
    const formattedNote = {
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
      updater: null
    }

    return {
      success: true,
      data: formattedNote
    }
  } catch (error: any) {
    console.error('[API] Error creating note:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create note'
    })
  }
})


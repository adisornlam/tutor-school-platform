import { requireAuth } from '#server/utils/auth.middleware'
import { execute, query } from '#server/utils/db'
import { verifyRoomAccess } from '#server/services/chat.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const roomId = parseInt(getRouterParam(event, 'roomId') || '0')
  const noteId = parseInt(getRouterParam(event, 'noteId') || '0')
  const body = await readBody(event)

  if (!roomId || !noteId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid room ID or note ID'
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

  // Verify note belongs to room
  const existingNotes = await query<{ id: number; room_id: number }>(
    'SELECT id, room_id FROM chat_room_notes WHERE id = ?',
    [noteId]
  )

  if (!existingNotes || existingNotes.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Note not found'
    })
  }

  if (existingNotes[0].room_id !== roomId) {
    throw createError({
      statusCode: 403,
      message: 'Note does not belong to this room'
    })
  }

  try {
    await execute(
      'UPDATE chat_room_notes SET content = ?, updated_by = ? WHERE id = ?',
      [body.content.trim(), auth.userId, noteId]
    )

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
      WHERE crn.id = ?
    `, [noteId])

    if (!notes || notes.length === 0) {
      throw createError({
        statusCode: 500,
        message: 'Failed to retrieve updated note'
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
      updater: note.updated_by ? {
        id: note.updated_by,
        first_name: note.updater_first_name,
        last_name: note.updater_last_name
      } : null
    }

    return {
      success: true,
      data: formattedNote
    }
  } catch (error: any) {
    console.error('[API] Error updating note:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update note'
    })
  }
})


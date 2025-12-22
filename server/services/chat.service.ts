import { query, queryOne, execute } from '#server/utils/db'
import type { ChatRoom, ChatMessage, CreateChatRoomData } from '#shared/types/chat.types'

/**
 * Get all chat rooms for a user (as student or tutor)
 */
export async function getUserChatRooms(userId: number): Promise<ChatRoom[]> {
  const rooms = await query<ChatRoom>(`
    SELECT 
      cr.*,
      c.title as course_title,
      c.code as course_code,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.avatar_url as student_avatar_url,
      t.first_name as tutor_first_name,
      t.last_name as tutor_last_name,
      t.avatar_url as tutor_avatar_url,
      (
        SELECT COUNT(*) 
        FROM chat_messages cm 
        WHERE cm.room_id = cr.id 
        AND cm.sender_id != ? 
        AND cm.is_read = FALSE
      ) as unread_count
    FROM chat_rooms cr
    INNER JOIN courses c ON cr.course_id = c.id
    INNER JOIN users s ON cr.student_id = s.id
    INNER JOIN users t ON cr.tutor_id = t.id
    WHERE (cr.student_id = ? OR cr.tutor_id = ?)
    AND cr.status = 'active'
    ORDER BY cr.last_message_at DESC, cr.created_at DESC
  `, [userId, userId, userId])

  return rooms.map((room: any) => ({
    id: room.id,
    course_id: room.course_id,
    student_id: room.student_id,
    tutor_id: room.tutor_id,
    status: room.status,
    last_message_at: room.last_message_at,
    created_at: room.created_at,
    updated_at: room.updated_at,
    course: {
      id: room.course_id,
      title: room.course_title,
      code: room.course_code
    },
    student: {
      id: room.student_id,
      first_name: room.student_first_name,
      last_name: room.student_last_name,
      avatar_url: room.student_avatar_url
    },
    tutor: {
      id: room.tutor_id,
      first_name: room.tutor_first_name,
      last_name: room.tutor_last_name,
      avatar_url: room.tutor_avatar_url
    },
    unread_count: parseInt(room.unread_count) || 0
  }))
}

/**
 * Get a specific chat room by ID
 */
export async function getChatRoom(roomId: number): Promise<ChatRoom | null> {
  const rooms = await query<any>(`
    SELECT 
      cr.*,
      c.title as course_title,
      c.code as course_code,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.avatar_url as student_avatar_url,
      t.first_name as tutor_first_name,
      t.last_name as tutor_last_name,
      t.avatar_url as tutor_avatar_url
    FROM chat_rooms cr
    INNER JOIN courses c ON cr.course_id = c.id
    INNER JOIN users s ON cr.student_id = s.id
    INNER JOIN users t ON cr.tutor_id = t.id
    WHERE cr.id = ?
  `, [roomId])

  if (!rooms || rooms.length === 0) return null

  const room = rooms[0]

  return {
    id: room.id,
    course_id: room.course_id,
    student_id: room.student_id,
    tutor_id: room.tutor_id,
    status: room.status,
    last_message_at: room.last_message_at,
    created_at: room.created_at,
    updated_at: room.updated_at,
    course: {
      id: room.course_id,
      title: room.course_title,
      code: room.course_code
    },
    student: {
      id: room.student_id,
      first_name: room.student_first_name,
      last_name: room.student_last_name,
      avatar_url: room.student_avatar_url
    },
    tutor: {
      id: room.tutor_id,
      first_name: room.tutor_first_name,
      last_name: room.tutor_last_name,
      avatar_url: room.tutor_avatar_url
    }
  }
}

/**
 * Verify if user has access to a chat room
 */
export async function verifyRoomAccess(userId: number, roomId: number): Promise<boolean> {
  const rooms = await query<{ student_id: number; tutor_id: number }>(
    'SELECT student_id, tutor_id FROM chat_rooms WHERE id = ? AND status = "active"',
    [roomId]
  )

  if (!rooms || rooms.length === 0) return false

  const room = rooms[0]
  return room.student_id === userId || room.tutor_id === userId
}

/**
 * Create a new chat room
 */
export async function createChatRoom(
  studentId: number,
  data: CreateChatRoomData
): Promise<ChatRoom> {
  // Check if room already exists
  const existingRooms = await query<{ id: number }>(
    'SELECT id FROM chat_rooms WHERE student_id = ? AND tutor_id = ? AND course_id = ? AND status = "active"',
    [studentId, data.tutor_id, data.course_id]
  )

  if (existingRooms && existingRooms.length > 0) {
    // Return existing room
    const room = await getChatRoom(existingRooms[0].id)
    if (room) return room
    throw new Error('Failed to retrieve existing room')
  }

  // Verify student is enrolled in the course
  const enrollments = await query<{ id: number }>(
    'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND status IN ("active", "completed")',
    [studentId, data.course_id]
  )

  if (!enrollments || enrollments.length === 0) {
    throw new Error('Student is not enrolled in this course')
  }

  // Verify tutor teaches this course
  const tutorCourses = await query<{ id: number }>(`
    SELECT tc.id 
    FROM tutor_courses tc
    INNER JOIN tutors t ON tc.tutor_id = t.id
    WHERE t.user_id = ? AND tc.course_id = ?
  `, [data.tutor_id, data.course_id])

  if (!tutorCourses || tutorCourses.length === 0) {
    throw new Error('Tutor does not teach this course')
  }

  // Create room
  const result = await execute(
    'INSERT INTO chat_rooms (course_id, student_id, tutor_id, status) VALUES (?, ?, ?, "active")',
    [data.course_id, studentId, data.tutor_id]
  )

  const room = await getChatRoom(result.insertId)
  if (!room) throw new Error('Failed to create room')

  // Create participants
  await execute(
    'INSERT INTO chat_room_participants (room_id, user_id, role) VALUES (?, ?, "student"), (?, ?, "tutor")',
    [room.id, studentId, room.id, data.tutor_id]
  )

  // Send initial message if provided
  if (data.initial_message) {
    await saveMessage({
      room_id: room.id,
      sender_id: studentId,
      content: data.initial_message,
      message_type: 'text'
    })
  }

  return room
}

/**
 * Save a chat message
 */
export async function saveMessage(data: {
  room_id: number
  sender_id: number
  content: string | null
  message_type: 'text' | 'image' | 'file' | 'system'
  file_url?: string | null
  file_name?: string | null
  file_size?: number | null
  file_type?: string | null
  reply_to_id?: number | null
}): Promise<ChatMessage> {
  const result = await execute(
    `INSERT INTO chat_messages 
     (room_id, sender_id, message_type, content, file_url, file_name, file_size, file_type, reply_to_id, is_read)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
    [
      data.room_id,
      data.sender_id,
      data.message_type,
      data.content,
      data.file_url || null,
      data.file_name || null,
      data.file_size || null,
      data.file_type || null,
      data.reply_to_id || null
    ]
  )

  // Update room's last_message_at
  await execute(
    'UPDATE chat_rooms SET last_message_at = NOW() WHERE id = ?',
    [data.room_id]
  )

  const messages = await query<any>(`
    SELECT cm.*,
           u.first_name as sender_first_name,
           u.last_name as sender_last_name,
           u.avatar_url as sender_avatar_url,
           reply_to.id as reply_to_id_exists,
           reply_to.content as reply_to_content,
           reply_to.file_name as reply_to_file_name,
           reply_to.message_type as reply_to_message_type,
           reply_user.first_name as reply_to_sender_first_name,
           reply_user.last_name as reply_to_sender_last_name
    FROM chat_messages cm
    INNER JOIN users u ON cm.sender_id = u.id
    LEFT JOIN chat_messages reply_to ON cm.reply_to_id = reply_to.id
    LEFT JOIN users reply_user ON reply_to.sender_id = reply_user.id
    WHERE cm.id = ?
  `, [result.insertId])

  if (!messages || messages.length === 0) throw new Error('Failed to retrieve message')

  const message = messages[0]

  const formattedMessage: ChatMessage = {
    id: message.id,
    room_id: message.room_id,
    sender_id: message.sender_id,
    message_type: message.message_type,
    content: message.content,
    file_name: message.file_name,
    file_size: message.file_size,
    file_type: message.file_type,
    file_url: message.file_url,
    is_read: message.is_read,
    read_at: message.read_at,
    created_at: message.created_at,
    reply_to_id: message.reply_to_id || null,
    is_pinned: message.is_pinned || false,
    sender: {
      id: message.sender_id,
      first_name: message.sender_first_name,
      last_name: message.sender_last_name,
      avatar_url: message.sender_avatar_url
    }
  }

  // Add reply_to if exists
  if (message.reply_to_id_exists) {
    formattedMessage.reply_to = {
      id: message.reply_to_id_exists,
      room_id: message.room_id,
      sender_id: 0, // Will be filled if needed
      message_type: message.reply_to_message_type,
      content: message.reply_to_content,
      file_name: message.reply_to_file_name,
      is_read: false,
      read_at: null,
      created_at: '',
      sender: {
        id: 0,
        first_name: message.reply_to_sender_first_name || '',
        last_name: message.reply_to_sender_last_name || ''
      }
    }
  }

  return formattedMessage
}

/**
 * Get messages for a chat room (with pagination)
 */
export async function getChatMessages(
  roomId: number,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> {
  try {
    // MySQL doesn't support placeholders for LIMIT and OFFSET in prepared statements
    // So we need to use string interpolation for these values (they're already numbers, so safe)
    const limitValue = Math.max(1, Math.min(limit, 100)) // Sanitize: between 1 and 100
    const offsetValue = Math.max(0, offset) // Sanitize: must be >= 0
    
    const messages = await query<any>(`
      SELECT cm.*,
             u.first_name as sender_first_name,
             u.last_name as sender_last_name,
             u.avatar_url as sender_avatar_url,
             reply_to.id as reply_to_id_exists,
             reply_to.content as reply_to_content,
             reply_to.file_name as reply_to_file_name,
             reply_to.message_type as reply_to_message_type,
             reply_user.first_name as reply_to_sender_first_name,
             reply_user.last_name as reply_to_sender_last_name
      FROM chat_messages cm
      INNER JOIN users u ON cm.sender_id = u.id
      LEFT JOIN chat_messages reply_to ON cm.reply_to_id = reply_to.id
      LEFT JOIN users reply_user ON reply_to.sender_id = reply_user.id
      WHERE cm.room_id = ?
      ORDER BY cm.created_at DESC
      LIMIT ${limitValue} OFFSET ${offsetValue}
    `, [roomId])

    if (!messages || messages.length === 0) {
      return []
    }

    return messages.reverse().map((msg: any) => {
      const formatted: ChatMessage = {
        id: msg.id,
        room_id: msg.room_id,
        sender_id: msg.sender_id,
        message_type: msg.message_type,
        content: msg.content,
        file_name: msg.file_name,
        file_size: msg.file_size,
        file_type: msg.file_type,
        file_url: msg.file_url,
        is_read: msg.is_read === 1 || msg.is_read === true,
        read_at: msg.read_at,
        created_at: msg.created_at,
        reply_to_id: msg.reply_to_id || null,
        is_pinned: msg.is_pinned === 1 || msg.is_pinned === true || false,
        sender: {
          id: msg.sender_id,
          first_name: msg.sender_first_name || '',
          last_name: msg.sender_last_name || '',
          avatar_url: msg.sender_avatar_url
        }
      }

      // Add reply_to if exists
      if (msg.reply_to_id_exists) {
        formatted.reply_to = {
          id: msg.reply_to_id_exists,
          room_id: msg.room_id,
          sender_id: 0,
          message_type: msg.reply_to_message_type,
          content: msg.reply_to_content,
          file_name: msg.reply_to_file_name,
          is_read: false,
          read_at: null,
          created_at: '',
          sender: {
            id: 0,
            first_name: msg.reply_to_sender_first_name || '',
            last_name: msg.reply_to_sender_last_name || ''
          }
        }
      }

      return formatted
    })
  } catch (error: any) {
    console.error('[Chat Service] Error in getChatMessages:', error)
    console.error('[Chat Service] Error details:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      roomId,
      limit,
      offset
    })
    throw error
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  roomId: number,
  userId: number,
  messageId?: number
): Promise<void> {
  if (messageId) {
    // Mark specific message as read
    await execute(
      'UPDATE chat_messages SET is_read = TRUE, read_at = NOW() WHERE id = ? AND room_id = ? AND sender_id != ?',
      [messageId, roomId, userId]
    )
  } else {
    // Mark all unread messages in room as read
    await execute(
      'UPDATE chat_messages SET is_read = TRUE, read_at = NOW() WHERE room_id = ? AND sender_id != ? AND is_read = FALSE',
      [roomId, userId]
    )
  }

  // Update participant's last_read_at
  await execute(
    'UPDATE chat_room_participants SET last_read_at = NOW() WHERE room_id = ? AND user_id = ?',
    [roomId, userId]
  )
}

/**
 * Get courses that a tutor teaches
 */
export async function getTutorCourses(userId: number): Promise<number[]> {
  const courses = await query<{ course_id: number }>(`
    SELECT DISTINCT tc.course_id
    FROM tutor_courses tc
    INNER JOIN tutors t ON tc.tutor_id = t.id
    WHERE t.user_id = ?
  `, [userId])
  
  return courses.map(c => c.course_id)
}

/**
 * Get courses that a student is enrolled in
 */
export async function getStudentCourses(userId: number): Promise<number[]> {
  const courses = await query<{ course_id: number }>(`
    SELECT DISTINCT course_id
    FROM enrollments
    WHERE student_id = ? 
    AND status IN ('active', 'completed')
  `, [userId])
  
  return courses.map(c => c.course_id)
}

/**
 * Get all chat rooms (for admin)
 */
export async function getAllChatRooms(
  limit: number = 50,
  offset: number = 0,
  filters?: {
    status?: 'active' | 'archived' | 'closed'
    courseId?: number
    studentId?: number
    tutorId?: number
  }
): Promise<{ rooms: ChatRoom[]; total: number }> {
  let whereConditions: string[] = []
  let params: any[] = []

  if (filters?.status) {
    whereConditions.push('cr.status = ?')
    params.push(filters.status)
  } else {
    whereConditions.push('cr.status = "active"')
  }

  if (filters?.courseId) {
    whereConditions.push('cr.course_id = ?')
    params.push(filters.courseId)
  }

  if (filters?.studentId) {
    whereConditions.push('cr.student_id = ?')
    params.push(filters.studentId)
  }

  if (filters?.tutorId) {
    whereConditions.push('cr.tutor_id = ?')
    params.push(filters.tutorId)
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : 'WHERE cr.status = "active"'

  // Get total count
  const totalResults = await query<{ count: number }>(
    `SELECT COUNT(*) as count FROM chat_rooms cr ${whereClause}`,
    params
  )
  const total = totalResults[0]?.count || 0

  // Get rooms
  // MySQL doesn't support placeholders for LIMIT and OFFSET in prepared statements
  // So we use string interpolation (values are sanitized to prevent SQL injection)
  const limitValue = Math.max(1, Math.min(limit, 100)) // Sanitize: between 1 and 100
  const offsetValue = Math.max(0, offset) // Sanitize: must be >= 0
  const rooms = await query<ChatRoom>(`
    SELECT 
      cr.*,
      c.title as course_title,
      c.code as course_code,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.avatar_url as student_avatar_url,
      t.first_name as tutor_first_name,
      t.last_name as tutor_last_name,
      t.avatar_url as tutor_avatar_url
    FROM chat_rooms cr
    INNER JOIN courses c ON cr.course_id = c.id
    INNER JOIN users s ON cr.student_id = s.id
    INNER JOIN users t ON cr.tutor_id = t.id
    ${whereClause}
    ORDER BY cr.last_message_at DESC, cr.created_at DESC
    LIMIT ${limitValue} OFFSET ${offsetValue}
  `, params)

  return {
    rooms: rooms.map(room => ({
      id: room.id,
      course_id: room.course_id,
      student_id: room.student_id,
      tutor_id: room.tutor_id,
      status: room.status,
      last_message_at: room.last_message_at,
      created_at: room.created_at,
      updated_at: room.updated_at,
      course: {
        id: room.course_id,
        title: room.course_title,
        code: room.course_code
      },
      student: {
        id: room.student_id,
        first_name: room.student_first_name,
        last_name: room.student_last_name,
        avatar_url: room.student_avatar_url
      },
      tutor: {
        id: room.tutor_id,
        first_name: room.tutor_first_name,
        last_name: room.tutor_last_name,
        avatar_url: room.tutor_avatar_url
      }
    })),
    total
  }
}


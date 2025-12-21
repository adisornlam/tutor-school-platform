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
}): Promise<ChatMessage> {
  const result = await execute(
    `INSERT INTO chat_messages 
     (room_id, sender_id, message_type, content, file_url, file_name, file_size, file_type, is_read)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
    [
      data.room_id,
      data.sender_id,
      data.message_type,
      data.content,
      data.file_url || null,
      data.file_name || null,
      data.file_size || null,
      data.file_type || null
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
           u.avatar_url as sender_avatar_url
    FROM chat_messages cm
    INNER JOIN users u ON cm.sender_id = u.id
    WHERE cm.id = ?
  `, [result.insertId])

  if (!messages || messages.length === 0) throw new Error('Failed to retrieve message')

  const message = messages[0]

  return {
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
    sender: {
      id: message.sender_id,
      first_name: message.sender_first_name,
      last_name: message.sender_last_name,
      avatar_url: message.sender_avatar_url
    }
  }
}

/**
 * Get messages for a chat room (with pagination)
 */
export async function getChatMessages(
  roomId: number,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> {
  const messages = await query<ChatMessage>(`
    SELECT cm.*,
           u.first_name as sender_first_name,
           u.last_name as sender_last_name,
           u.avatar_url as sender_avatar_url
    FROM chat_messages cm
    INNER JOIN users u ON cm.sender_id = u.id
    WHERE cm.room_id = ?
    ORDER BY cm.created_at DESC
    LIMIT ? OFFSET ?
  `, [roomId, limit, offset])

  return messages.reverse().map((msg: any) => ({
    id: msg.id,
    room_id: msg.room_id,
    sender_id: msg.sender_id,
    message_type: msg.message_type,
    content: msg.content,
    file_name: msg.file_name,
    file_size: msg.file_size,
    file_type: msg.file_type,
    file_url: msg.file_url,
    is_read: msg.is_read,
    read_at: msg.read_at,
    created_at: msg.created_at,
    sender: {
      id: msg.sender_id,
      first_name: msg.sender_first_name,
      last_name: msg.sender_last_name,
      avatar_url: msg.sender_avatar_url
    }
  }))
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
  params.push(limit, offset)
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
    LIMIT ? OFFSET ?
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


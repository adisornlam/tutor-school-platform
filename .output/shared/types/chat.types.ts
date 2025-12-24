export interface ChatRoom {
  id: number
  course_id: number
  student_id: number
  tutor_id: number
  status: 'active' | 'archived' | 'closed'
  last_message_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  course?: {
    id: number
    title: string
    code?: string | null
  }
  student?: {
    id: number
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
  tutor?: {
    id: number
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
  unread_count?: number
  last_message?: ChatMessage | null
}

export interface ChatMessage {
  id: number
  room_id: number
  sender_id: number
  message_type: 'text' | 'image' | 'file' | 'system'
  content: string | null
  file_name?: string | null
  file_size?: number | null
  file_type?: string | null
  file_url?: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  reply_to_id?: number | null
  reply_to?: ChatMessage | null
  is_pinned?: boolean
  // Joined data
  sender?: {
    id: number
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
}

export interface CreateChatRoomData {
  course_id: number
  tutor_id: number
  initial_message?: string
}

export interface SendMessageData {
  room_id: number
  content: string
  message_type?: 'text' | 'image' | 'file'
  file_url?: string
  file_name?: string
  file_size?: number
  file_type?: string
  reply_to_id?: number | null
}

export interface ChatRoomParticipant {
  id: number
  room_id: number
  user_id: number
  role: 'student' | 'tutor' | 'admin'
  joined_at: string
  last_read_at: string | null
}

export interface ChatRoomTag {
  id: number
  room_id: number
  tag_name: string
  color: string
  created_by: number
  created_at: string
  creator?: {
    id: number
    first_name: string
    last_name: string
  }
}

export interface ChatRoomNote {
  id: number
  room_id: number
  content: string
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
  creator?: {
    id: number
    first_name: string
    last_name: string
  }
  updater?: {
    id: number
    first_name: string
    last_name: string
  } | null
}

export interface CreateChatRoomTagData {
  room_id: number
  tag_name: string
  color?: string
}

export interface CreateChatRoomNoteData {
  room_id: number
  content: string
}


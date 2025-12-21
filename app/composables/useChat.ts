import { io, Socket } from 'socket.io-client'
import type { ChatRoom, ChatMessage, SendMessageData } from '#shared/types/chat.types'

export const useChat = () => {
  const config = useRuntimeConfig()
  const { accessToken, user } = useAuth()
  const socket = ref<Socket | null>(null)
  const connected = ref(false)
  const rooms = ref<ChatRoom[]>([])
  const activeRoom = ref<ChatRoom | null>(null)
  const messages = ref<Map<number, ChatMessage[]>>(new Map())
  const typingUsers = ref<Map<number, Set<number>>>(new Map()) // roomId -> Set of userIds

  const connect = () => {
    if (socket.value?.connected) {
      console.log('[Chat] Already connected')
      return
    }

    if (!accessToken.value) {
      console.warn('[Chat] No access token, cannot connect')
      return
    }

    // Get base URL for Socket.IO
    // Use window.location.origin if available (client-side), otherwise use config
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : (config.public.apiBase?.replace('/api', '') || 'http://localhost:4000')
    
    console.log('[Chat] 🔌 Connecting to:', baseUrl)
    console.log('[Chat] Token exists:', !!accessToken.value)
    console.log('[Chat] Token preview:', accessToken.value ? accessToken.value.substring(0, 20) + '...' : 'none')
    
    socket.value = io(baseUrl, {
      auth: {
        token: accessToken.value
      },
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 45000, // Increase timeout to 45 seconds (default is 20s)
      forceNew: false,
      // Additional options for better connection stability
      upgrade: true,
      rememberUpgrade: false,
      autoConnect: true
    })

    socket.value.on('connect', () => {
      connected.value = true
      console.log('[Chat] ✅ Connected to server')
      console.log('[Chat] Socket ID:', socket.value?.id)
      console.log('[Chat] Socket connected:', socket.value?.connected)
      console.log('[Chat] Transport:', socket.value.io.engine.transport.name)
    })

    socket.value.on('disconnect', (reason) => {
      connected.value = false
      console.warn('[Chat] ⚠️  Disconnected from server:', reason)
    })

    socket.value.on('connect_error', (error) => {
      console.error('[Chat] ❌ Connection error:', error.message || error)
      console.error('[Chat] Error details:', {
        message: error.message,
        description: (error as any).description,
        type: (error as any).type,
        context: (error as any).context,
        data: (error as any).data
      })
      connected.value = false
      
      // Check if it's an authentication error
      if (error.message?.includes('Authentication') || error.message?.includes('token') || error.message?.includes('Unauthorized')) {
        console.error('[Chat] 🔐 Authentication failed - check token')
        console.error('[Chat] Token exists:', !!accessToken.value)
        if (accessToken.value) {
          console.error('[Chat] Token preview:', accessToken.value.substring(0, 20) + '...')
        }
        // Don't retry on auth errors - need to fix token first
        return
      }
      
      // Retry connection after delay if it's a timeout or network error
      if (error.message?.includes('timeout') || error.message?.includes('xhr poll error') || error.message?.includes('Network') || error.message?.includes('ECONNREFUSED')) {
        console.log('[Chat] ⚠️  Network error detected, will retry in 3 seconds...')
        setTimeout(() => {
          if (accessToken.value && !connected.value) {
            console.log('[Chat] 🔄 Retrying connection...')
            if (socket.value && !socket.value.connected) {
              socket.value.connect()
            } else {
              connect()
            }
          }
        }, 3000)
      }
    })

    socket.value.on('room_joined', (data: { roomId: number }) => {
      console.log('[Chat] Joined room:', data.roomId)
    })

    socket.value.on('room_left', (data: { roomId: number }) => {
      console.log('[Chat] Left room:', data.roomId)
    })

    socket.value.on('new_message', (message: ChatMessage) => {
      console.log('[Chat] ✅ New message received:', {
        id: message.id,
        roomId: message.room_id,
        senderId: message.sender_id,
        content: message.content?.substring(0, 50),
        type: message.message_type
      })
      
      const roomMessages = messages.value.get(message.room_id) || []
      
      // Remove optimistic message if exists (replace with real message)
      const tempIndex = roomMessages.findIndex(m => typeof m.id === 'string' && m.id.startsWith('temp-'))
      if (tempIndex !== -1) {
        roomMessages.splice(tempIndex, 1)
      }
      
      // Check if message already exists (prevent duplicates)
      const exists = roomMessages.some(m => m.id === message.id)
      if (!exists) {
        roomMessages.push(message)
        messages.value.set(message.room_id, roomMessages)
        console.log('[Chat] ✅ Message added to local state')
      } else {
        console.log('[Chat] ⚠️  Message already exists, skipping')
      }
    })

    socket.value.on('new_message_notification', (data: { roomId: number; message: ChatMessage }) => {
      console.log('[Chat] New message notification:', data)
      // Update unread count or show notification
      const room = rooms.value.find(r => r.id === data.roomId)
      if (room) {
        room.unread_count = (room.unread_count || 0) + 1
      }
    })

    socket.value.on('user_typing', (data: { userId: number; userName: string }) => {
      if (!activeRoom.value) return
      const roomId = activeRoom.value.id
      if (!typingUsers.value.has(roomId)) {
        typingUsers.value.set(roomId, new Set())
      }
      typingUsers.value.get(roomId)!.add(data.userId)
    })

    socket.value.on('user_stopped_typing', (data: { userId: number }) => {
      if (!activeRoom.value) return
      const roomId = activeRoom.value.id
      typingUsers.value.get(roomId)?.delete(data.userId)
    })

    socket.value.on('messages_read', (data: { roomId: number; userId: number }) => {
      // Update read status for messages in the room
      const roomMessages = messages.value.get(data.roomId) || []
      roomMessages.forEach(msg => {
        if (msg.sender_id !== data.userId && !msg.is_read) {
          msg.is_read = true
        }
      })
    })

    socket.value.on('error', (error: { message: string }) => {
      console.error('[Chat] Error:', error.message)
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  const loadRooms = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: ChatRoom[] }>(
        `${config.public.apiBase}/chat/rooms`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      )

      if (response.success) {
        rooms.value = response.data
        
        // Join all rooms via socket
        if (socket.value && connected.value) {
          response.data.forEach(room => {
            socket.value?.emit('join_room', { roomId: room.id })
          })
        }
      }
    } catch (error: any) {
      console.error('[Chat] Error loading rooms:', error)
    }
  }

  const loadRoom = async (roomId: number) => {
    try {
      const response = await $fetch<{ success: boolean; data: ChatRoom }>(
        `${config.public.apiBase}/chat/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      )

      if (response.success) {
        activeRoom.value = response.data
        
        // Join room via socket
        if (socket.value && connected.value) {
          socket.value.emit('join_room', { roomId })
        }
        
        return response.data
      }
    } catch (error: any) {
      console.error('[Chat] Error loading room:', error)
      throw error
    }
  }

  const loadMessages = async (roomId: number, limit: number = 50, offset: number = 0) => {
    try {
      const response = await $fetch<{ success: boolean; data: ChatMessage[] }>(
        `${config.public.apiBase}/chat/rooms/${roomId}/messages?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        }
      )

      if (response.success) {
        const existingMessages = messages.value.get(roomId) || []
        
        // Merge messages, avoiding duplicates
        const newMessages = response.data.filter(
          newMsg => !existingMessages.some(existing => existing.id === newMsg.id)
        )
        
        if (offset === 0) {
          // Replace messages (first load or refresh)
          messages.value.set(roomId, [...newMessages])
        } else {
          // Prepend older messages
          messages.value.set(roomId, [...newMessages, ...existingMessages])
        }
        
        return response.data
      }
    } catch (error: any) {
      console.error('[Chat] Error loading messages:', error)
      throw error
    }
  }

  const joinRoom = (roomId: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('join_room', { roomId })
    }
  }

  const leaveRoom = (roomId: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('leave_room', { roomId })
    }
  }

  const sendMessage = (data: SendMessageData) => {
    if (!socket.value || !connected.value) {
      console.error('[Chat] ❌ Socket not connected, cannot send message')
      console.error('[Chat] Socket exists:', !!socket.value)
      console.error('[Chat] Connected:', connected.value)
      return
    }

    // Optimistic update - add message to local state immediately
    const tempId = `temp-${Date.now()}-${Math.random()}`
    const optimisticMessage: ChatMessage = {
      id: tempId as any,
      room_id: data.room_id,
      sender_id: user.value?.id || 0,
      message_type: data.message_type || 'text',
      content: data.content,
      file_url: data.file_url || null,
      file_name: data.file_name || null,
      file_size: data.file_size || null,
      file_type: data.file_type || null,
      is_read: false,
      read_at: null,
      created_at: new Date().toISOString(),
      sender: {
        id: user.value?.id || 0,
        first_name: user.value?.first_name || '',
        last_name: user.value?.last_name || '',
        avatar_url: user.value?.avatar_url || null
      }
    }

    // Add to local messages
    const roomMessages = messages.value.get(data.room_id) || []
    roomMessages.push(optimisticMessage)
    messages.value.set(data.room_id, roomMessages)

    console.log('[Chat] 📤 Sending message:', {
      roomId: data.room_id,
      content: data.content?.substring(0, 50),
      messageType: data.message_type
    })

    // Send via socket
    socket.value.emit('send_message', {
      roomId: data.room_id,
      content: data.content,
      messageType: data.message_type || 'text',
      fileUrl: data.file_url,
      fileName: data.file_name,
      fileSize: data.file_size,
      fileType: data.file_type
    })
  }

  const markAsRead = (roomId: number, messageId?: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('mark_read', { roomId, messageId })
    }
  }

  const startTyping = (roomId: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('typing', { roomId })
    }
  }

  const stopTyping = (roomId: number) => {
    if (socket.value && connected.value) {
      socket.value.emit('stop_typing', { roomId })
    }
  }

  const uploadFile = async (
    roomId: number,
    file: File,
    fileType: 'image' | 'file' = 'image'
  ): Promise<{ url: string; filename: string; size: number; type: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<{
      success: boolean
      data: { url: string; filename: string; size: number; type: string }
    }>(`${config.public.apiBase}/chat/upload?roomId=${roomId}&fileType=${fileType}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: formData
    })

    if (response.success) {
      return response.data
    } else {
      throw new Error('Failed to upload file')
    }
  }

  const getRoomMessages = (roomId: number): ChatMessage[] => {
    return messages.value.get(roomId) || []
  }

  const getTypingUsers = (roomId: number): number[] => {
    const users = typingUsers.value.get(roomId)
    return users ? Array.from(users) : []
  }

  const clearMessages = (roomId: number) => {
    messages.value.delete(roomId)
  }

  const setActiveRoom = (room: ChatRoom | null) => {
    activeRoom.value = room
    
    // Leave previous room if exists
    if (activeRoom.value) {
      joinRoom(activeRoom.value.id)
    }
  }

  // Auto-connect when accessToken is available
  watch(accessToken, (newToken, oldToken) => {
    console.log('[Chat] Access token changed:', {
      hasNewToken: !!newToken,
      hadOldToken: !!oldToken,
      connected: connected.value,
      hasSocket: !!socket.value
    })
    
    if (newToken && !connected.value) {
      // If socket exists but not connected, try to reconnect
      if (socket.value && !socket.value.connected) {
        console.log('[Chat] 🔄 Socket exists but not connected, trying to reconnect...')
        socket.value.connect()
        return
      }
      
      // If no socket, create new connection
      if (!socket.value) {
        console.log('[Chat] 🔌 Creating new socket connection...')
        nextTick(() => {
          setTimeout(() => {
            connect()
          }, 500)
        })
      }
    } else if (!newToken && connected.value) {
      disconnect()
    }
  }, { immediate: true })
  
  // Also try to connect on mount if token is available
  if (process.client) {
    onMounted(() => {
      console.log('[Chat] 🚀 useChat mounted, checking connection...', {
        hasToken: !!accessToken.value,
        connected: connected.value,
        hasSocket: !!socket.value
      })
      
      if (accessToken.value && !connected.value) {
        setTimeout(() => {
          if (!socket.value) {
            console.log('[Chat] 🔌 Mounted: Creating connection...')
            connect()
          } else if (!socket.value.connected) {
            console.log('[Chat] 🔄 Mounted: Reconnecting...')
            socket.value.connect()
          }
        }, 1000)
      }
    })
  }

  // Load rooms when connected
  watch(connected, (isConnected) => {
    if (isConnected) {
      // Delay room loading slightly
      setTimeout(() => {
        loadRooms()
      }, 200)
    }
  })

  return {
    socket: readonly(socket),
    connected: readonly(connected),
    rooms: readonly(rooms),
    activeRoom: readonly(activeRoom),
    messages: readonly(messages),
    typingUsers: readonly(typingUsers),
    connect,
    disconnect,
    loadRooms,
    loadRoom,
    loadMessages,
    joinRoom,
    leaveRoom,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    uploadFile,
    getRoomMessages,
    getTypingUsers,
    clearMessages,
    setActiveRoom
  }
}


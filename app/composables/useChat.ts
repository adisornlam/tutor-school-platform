import { useChatSocket } from './useChatSocket'
import type { ChatRoom, ChatMessage, SendMessageData } from '#shared/types/chat.types'

export const useChat = () => {
  const config = useRuntimeConfig()
  const { accessToken, user } = useAuth()
  const rooms = ref<ChatRoom[]>([])
  const activeRoom = ref<ChatRoom | null>(null)
  // ✅ Change: Use Array instead of Map for better Vue reactivity
  const messages = ref<ChatMessage[]>([])
  const typingUsers = ref<Map<number, Set<number>>>(new Map()) // roomId -> Set of userIds

  // Use Socket.IO for real-time updates
  const { 
    socket,
    connected, 
    connect: connectSocket, 
    disconnect: disconnectSocket,
    joinRoom: joinRoomSocket,
    leaveRoom: leaveRoomSocket,
    on: socketOn,
    off: socketOff,
    emit: socketEmit
  } = useChatSocket()

  // ✅ Change: Add targetRoomId for watch-based room joining
  const targetRoomId = ref<number | null>(null)

  // ✅ Change: Watch for connection and room join coordination
  watch([connected, targetRoomId], ([isConnected, roomId]) => {
    if (isConnected && roomId) {
      console.log(`[Chat] ✅ Both connected and roomId ready, joining room ${roomId}`)
      joinRoomSocket(roomId)
    }
  }, { immediate: true })


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
        
        // ✅ Change: Join all rooms via Socket.IO (will be handled by watch)
        // Note: Only join when connected, watch will handle individual joins
        if (connected.value) {
          // Join each room one by one (watch will trigger for each)
          response.data.forEach(room => {
            joinRoomSocket(room.id) // Direct join since connected
          })
        } else {
          // If not connected, set targetRoomId for the first room
          // Watch will join when connection is ready
          if (response.data.length > 0) {
            targetRoomId.value = response.data[0].id
          }
        }
        
        // Update unread count
        if (typeof window !== 'undefined') {
          const { updateUnreadCount } = useUnreadMessages()
          updateUnreadCount(response.data)
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
        
        console.log('[Chat] 📋 Loaded room:', {
          roomId: response.data.id,
          studentId: response.data.student_id,
          tutorId: response.data.tutor_id
        })
        
        // Join room via Socket.IO
        if (connected.value) {
          console.log(`[Chat] 📥 Joining room ${roomId} via Socket.IO`)
          joinRoomSocket(roomId)
        } else {
          console.warn(`[Chat] ⚠️  Socket.IO not connected, cannot join room ${roomId}`)
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
        if (offset === 0) {
          // First load: Replace all messages for this room
          // Keep messages from other rooms, remove old messages from this room
          const otherRoomMessages = messages.value.filter(m => m.room_id !== roomId)
          // Use all API messages (no deduplication needed on first load)
          messages.value = [...otherRoomMessages, ...response.data]
          
          console.log('[Chat] 📋 First load messages for room:', {
            roomId,
            apiCount: response.data.length,
            otherRoomsCount: otherRoomMessages.length,
            totalCount: messages.value.length
          })
        } else {
          // Load more: Prepend older messages with deduplication
          const existingIds = new Set(messages.value.map(m => m.id))
          const newMessages = response.data.filter(msg => !existingIds.has(msg.id as number))
          messages.value = [...newMessages, ...messages.value]
          
          console.log('[Chat] 📋 Loaded more messages for room:', {
            roomId,
            apiCount: response.data.length,
            newCount: newMessages.length,
            totalCount: messages.value.length
          })
        }
        
        return response.data
      }
    } catch (error: any) {
      console.error('[Chat] Error loading messages:', error)
      throw error
    }
  }

  const joinRoom = (roomId: number) => {
    // ✅ Change: Set targetRoomId, watch will handle the join
    targetRoomId.value = roomId
  }

  const leaveRoom = (roomId: number) => {
    // ✅ Change: Leave room and clear targetRoomId
    if (connected.value) {
      leaveRoomSocket(roomId)
    }
    if (targetRoomId.value === roomId) {
      targetRoomId.value = null
    }
  }

  // Track sending state to prevent duplicate sends
  const sendingMessages = ref<Set<string>>(new Set())
  
  const sendMessage = async (data: SendMessageData) => {
    // Always use REST API for sending messages (SSE is one-way)
    const messageContent = data.content || ''
    const messageKey = `${data.room_id}-${messageContent}-${Date.now()}`
    
    console.log('[Chat] 🚀 sendMessage called:', {
      roomId: data.room_id,
      content: messageContent,
      messageType: data.message_type,
      userId: user.value?.id,
      timestamp: new Date().toISOString()
    })
    
    // Prevent duplicate sends of the same message within 2 seconds
    const duplicateKey = `${data.room_id}-${messageContent}`
    if (sendingMessages.value.has(duplicateKey)) {
      console.log('[Chat] ⚠️ Message already being sent, skipping duplicate:', messageContent.substring(0, 50))
      return
    }
    
    // Mark as sending
    sendingMessages.value.add(duplicateKey)
    console.log('[Chat] ✅ Message marked as sending, duplicateKey:', duplicateKey)
    
    try {
      // Optimistic update - add message to local state immediately
      const tempId = `temp-${Date.now()}-${Math.random()}`
      
      const optimisticMessage: ChatMessage = {
        id: tempId as any,
        room_id: data.room_id,
        sender_id: user.value?.id || 0,
        message_type: data.message_type || 'text',
        content: messageContent,
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

      // ✅ Change: Add optimistic message to Array
      // Check if optimistic message with same content already exists
      const hasOptimistic = messages.value.some(m => {
        const id = m.id as any
        return typeof id === 'string' && id.startsWith('temp-') && 
               m.content === messageContent && 
               m.room_id === data.room_id
      })
      if (!hasOptimistic) {
        // Re-assignment to trigger reactivity
        messages.value = [...messages.value, optimisticMessage]
      }

      console.log('[Chat] 📤 Sending message via REST API:', {
        roomId: data.room_id,
        content: data.content?.substring(0, 50),
        messageType: data.message_type,
        apiUrl: `${config.public.apiBase}/chat/rooms/${data.room_id}/messages`,
        hasToken: !!accessToken.value
      })

      // Send message via REST API
      const response = await $fetch<{ success: boolean; data: ChatMessage }>(
        `${config.public.apiBase}/chat/rooms/${data.room_id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: {
            content: data.content,
            message_type: data.message_type || 'text',
            file_url: data.file_url,
            file_name: data.file_name,
            file_size: data.file_size,
            file_type: data.file_type,
            reply_to_id: data.reply_to_id || null
          }
        }
      )
      
      console.log('[Chat] 📥 REST API response received:', {
        success: response.success,
        messageId: response.data?.id,
        content: response.data?.content?.substring(0, 50),
        roomId: response.data?.room_id
      })

      if (response.success) {
        console.log('[Chat] 📥 REST API response received:', {
          messageId: response.data.id,
          content: response.data.content?.substring(0, 50)
        })
        
        // ✅ Change: Replace optimistic message or add real message (using Array)
        // Find optimistic message to replace
        const tempIndex = messages.value.findIndex(m => {
          const id = m.id as any
          return typeof id === 'string' && id.startsWith('temp-') && 
                 m.content === messageContent && 
                 m.sender_id === user.value?.id &&
                 m.room_id === data.room_id
        })
        
        if (tempIndex !== -1) {
          // Replace optimistic with real message
          const newMessages = [...messages.value]
          newMessages[tempIndex] = response.data
          messages.value = newMessages
          console.log('[Chat] ✅ Replaced optimistic message with real message')
        } else {
          // Check if already exists (shouldn't happen, but safety check)
          const exists = messages.value.some(m => m.id === response.data.id)
          if (!exists) {
            messages.value = [...messages.value, response.data]
            console.log('[Chat] ✅ Added real message from REST API')
          }
        }
      }
    } catch (error: any) {
      console.error('[Chat] ❌ Error sending message via REST API:', error)
      // ✅ Change: Remove optimistic message on error (using Array)
      const tempIndex = messages.value.findIndex(m => {
        const id = m.id as any
        return typeof id === 'string' && id.startsWith('temp-') && 
               m.content === messageContent &&
               m.sender_id === user.value?.id &&
               m.room_id === data.room_id
      })
      if (tempIndex !== -1) {
        const newMessages = [...messages.value]
        newMessages.splice(tempIndex, 1)
        messages.value = newMessages
      }
      throw error
    } finally {
      // Remove from sending set after 2 seconds (allow retry after that)
      setTimeout(() => {
        sendingMessages.value.delete(duplicateKey)
      }, 2000)
    }
  }

  const markAsRead = async (roomId: number, messageId?: number) => {
    // Use Socket.IO to mark messages as read
    if (connected.value) {
      socketEmit('mark_read', { roomId, messageId })
    } else {
      // Fallback to REST API if Socket.IO not connected
      try {
        await $fetch(`${config.public.apiBase}/chat/rooms/${roomId}/messages/read`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          body: {
            messageId
          }
        })
      } catch (error) {
        console.error('[Chat] Error marking messages as read:', error)
      }
    }
    
    // Update room's unread_count in local state
    const room = rooms.value.find(r => r.id === roomId)
    if (room) {
      room.unread_count = 0
      if (typeof window !== 'undefined') {
        const { updateUnreadCount } = useUnreadMessages()
        updateUnreadCount(rooms.value)
      }
    }
  }

  const startTyping = async (roomId: number) => {
    // Use Socket.IO to indicate typing
    if (connected.value) {
      socketEmit('typing', { roomId })
    } else {
      // Fallback to REST API if Socket.IO not connected
      try {
        await $fetch(`${config.public.apiBase}/chat/rooms/${roomId}/typing`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        })
      } catch (error) {
        console.error('[Chat] Error starting typing:', error)
      }
    }
  }

  const stopTyping = async (roomId: number) => {
    // Use Socket.IO to stop typing
    if (connected.value) {
      socketEmit('stop_typing', { roomId })
    } else {
      // Fallback to REST API if Socket.IO not connected
      try {
        await $fetch(`${config.public.apiBase}/chat/rooms/${roomId}/typing/stop`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        })
      } catch (error) {
        console.error('[Chat] Error stopping typing:', error)
      }
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

  // ✅ Change: Get messages by room ID (using Array filter)
  const getRoomMessages = (roomId: number): ChatMessage[] => {
    return messages.value.filter(m => m.room_id === roomId)
  }

  // ✅ Change: Computed property for sorted messages by room
  const sortedMessages = computed(() => {
    if (!activeRoom.value?.id) {
      return []
    }
    
    const roomMessages = messages.value.filter(m => m.room_id === activeRoom.value!.id)
    
    // Sort by created_at to ensure correct order
    const sorted = [...roomMessages].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return timeA - timeB
    })
    
    console.log('[Chat] 🔄 sortedMessages computed:', {
      roomId: activeRoom.value.id,
      count: sorted.length,
      messageIds: sorted.map(m => m.id).slice(-5)
    })
    
    return sorted
  })

  const getTypingUsers = (roomId: number): number[] => {
    const users = typingUsers.value.get(roomId)
    return users ? Array.from(users) : []
  }

  const clearMessages = (roomId: number) => {
    // ✅ Change: Filter out messages for this room
    messages.value = messages.value.filter(m => m.room_id !== roomId)
  }

  const setActiveRoom = (room: ChatRoom | null) => {
    console.log('[Chat] 🎯 setActiveRoom called:', {
      roomId: room?.id || 'null',
      previousRoomId: activeRoom.value?.id,
      connected: connected.value
    })
    
    // Leave previous room
    if (activeRoom.value && connected.value) {
      console.log(`[Chat] 📤 Leaving previous room ${activeRoom.value.id}`)
      leaveRoomSocket(activeRoom.value.id)
    }
    
    activeRoom.value = room
    
    // ✅ Change: Set targetRoomId, watch will handle the join
    if (activeRoom.value) {
      targetRoomId.value = activeRoom.value.id
    } else {
      targetRoomId.value = null
    }
  }

  // Setup Socket.IO event listeners
  const setupChatEventListeners = () => {
    if (typeof window === 'undefined') {
      console.warn('[Chat] Cannot setup event listeners in server-side')
      return
    }
    
    if (!socket.value) {
      console.warn('[Chat] ⚠️ Socket not available, cannot setup event listeners')
      console.warn('[Chat] ⚠️ Will retry when socket is available...')
      // Retry when socket is available
      const checkSocket = setInterval(() => {
        if (socket.value) {
          console.log('[Chat] ✅ Socket available now, setting up event listeners...')
          clearInterval(checkSocket)
          setupChatEventListeners()
        }
      }, 500)
      setTimeout(() => clearInterval(checkSocket), 10000)
      return
    }
    
    console.log('[Chat] ✅ Setting up Socket.IO event listeners, socket ID:', socket.value.id)

    // ✅ Change: New message event - Socket as Single Source of Truth
    socketOn('new_message', (message: ChatMessage) => {
      console.log('[Chat] 📨 Socket.IO event: new_message received:', {
        id: message.id,
        roomId: message.room_id,
        senderId: message.sender_id,
        currentUserId: user.value?.id,
        content: message.content?.substring(0, 50)
      })
      
      // Skip if message is from current user (they already have it from REST API)
      if (message.sender_id === user.value?.id) {
        console.log('[Chat] ⏭️  Skipping own message from Socket.IO')
        return
      }
      
      // ✅ Change: Handle incoming message (Socket as Single Source of Truth)
      // Prevent duplicates
      const exists = messages.value.some(m => m.id === message.id)
      if (!exists) {
        // Re-assignment to trigger reactivity
        messages.value = [...messages.value, message]
        console.log('[Chat] ✅ Message added from Socket.IO:', {
          messageId: message.id,
          roomId: message.room_id,
          totalCount: messages.value.length
        })
      } else {
        console.log('[Chat] ⚠️ Message ID', message.id, 'already exists - skipping')
      }
      
      // Update unread count
      const room = rooms.value.find(r => r.id === message.room_id)
      if (room) {
        room.unread_count = (room.unread_count || 0) + 1
        if (typeof window !== 'undefined') {
          const { updateUnreadCount } = useUnreadMessages()
          updateUnreadCount(rooms.value)
        }
      }
    })

    // Typing event
    socketOn('user_typing', (data: { userId: number; userName: string; roomId: number }) => {
      if (!typingUsers.value.has(data.roomId)) {
        typingUsers.value.set(data.roomId, new Set())
      }
      typingUsers.value.get(data.roomId)!.add(data.userId)
    })

    // Stop typing event
    socketOn('stop_typing', (data: { userId: number; roomId: number }) => {
      typingUsers.value.get(data.roomId)?.delete(data.userId)
    })

    // ✅ Change: Messages read event (using Array)
    socketOn('messages_read', (data: { roomId: number; userId: number }) => {
      const roomMessages = messages.value.filter(m => m.room_id === data.roomId)
      const updatedMessages = messages.value.map(msg => {
        if (msg.room_id === data.roomId && msg.sender_id !== data.userId && !msg.is_read) {
          return { ...msg, is_read: true }
        }
        return msg
      })
      messages.value = updatedMessages
      
      // Update room's unread_count if current user read messages
      if (data.userId === user.value?.id) {
        const room = rooms.value.find(r => r.id === data.roomId)
        if (room) {
          room.unread_count = 0
          if (typeof window !== 'undefined') {
            const { updateUnreadCount } = useUnreadMessages()
            updateUnreadCount(rooms.value)
          }
        }
      }
    })

    // Room joined event - Server confirms room join success
    // This is sent by the server when join_room succeeds
    socketOn('room_joined', (data: { roomId: number }) => {
      console.log(`[Chat] ✅ Room ${data.roomId} joined successfully - ready to receive messages`)
      
      // Optionally: Load messages when room is joined
      // This ensures we have messages ready when user opens the room
      if (activeRoom.value?.id === data.roomId) {
        console.log(`[Chat] 📋 Active room matches joined room, loading messages...`)
        loadMessages(data.roomId, 50, 0).catch(error => {
          console.error(`[Chat] ❌ Error loading messages after joining room:`, error)
        })
      }
    })

    // Room left event - Server confirms room leave success
    // This is sent by the server when leave_room succeeds
    socketOn('room_left', (data: { roomId: number }) => {
      console.log(`[Chat] 📤 Left room ${data.roomId} - will no longer receive messages from this room`)
    })

    // Error event
    socketOn('error', (error: { message: string }) => {
      console.error('[Chat] ❌ Socket.IO error:', error.message)
    })
  }

  return {
    connected: readonly(connected),
    socket, // ✅ Return socket for checking availability
    rooms: readonly(rooms),
    activeRoom: readonly(activeRoom),
    messages: readonly(messages), // ✅ UI reads only
    sortedMessages, // ✅ Computed property for UI
    typingUsers: readonly(typingUsers),
    connect: connectSocket,
    disconnect: disconnectSocket,
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
    setActiveRoom,
    setupChatEventListeners
  }
}

import { useChatSSE } from './useChatSSE'
import type { ChatRoom, ChatMessage, SendMessageData } from '#shared/types/chat.types'

export const useChat = () => {
  const config = useRuntimeConfig()
  const { accessToken, user } = useAuth()
  const rooms = ref<ChatRoom[]>([])
  const activeRoom = ref<ChatRoom | null>(null)
  const messages = ref<Map<number, ChatMessage[]>>(new Map())
  const typingUsers = ref<Map<number, Set<number>>>(new Map()) // roomId -> Set of userIds

  // Use SSE for real-time updates
  const { 
    connected, 
    connect: connectSSE, 
    disconnect: disconnectSSE,
    subscribeToRoom: subscribeToRoomSSE,
    setupEventListeners
  } = useChatSSE()


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
        
        // Subscribe to all rooms via SSE
        response.data.forEach(room => {
          subscribeToRoomSSE(room.id)
        })
        
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
        
        // Subscribe to room via SSE
        subscribeToRoomSSE(roomId)
        
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
    // Subscribe to room via SSE
    subscribeToRoomSSE(roomId)
  }

  const leaveRoom = (roomId: number) => {
    // SSE doesn't need explicit leave, but we can unsubscribe if needed
    // For now, we'll keep subscription active
  }

  // Track sending state to prevent duplicate sends
  const sendingMessages = ref<Set<string>>(new Set())
  
  const sendMessage = async (data: SendMessageData) => {
    // Always use REST API for sending messages (SSE is one-way)
    const messageContent = data.content || ''
    const messageKey = `${data.room_id}-${messageContent}-${Date.now()}`
    
    // Prevent duplicate sends of the same message within 2 seconds
    const duplicateKey = `${data.room_id}-${messageContent}`
    if (sendingMessages.value.has(duplicateKey)) {
      console.log('[Chat] ⚠️ Message already being sent, skipping duplicate:', messageContent.substring(0, 50))
      return
    }
    
    // Mark as sending
    sendingMessages.value.add(duplicateKey)
    
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

      // Add to local messages (only if not already added)
      const roomMessages = messages.value.get(data.room_id) || []
      // Check if optimistic message with same content already exists
      const hasOptimistic = roomMessages.some(m => {
        const id = m.id as any
        return typeof id === 'string' && id.startsWith('temp-') && m.content === messageContent
      })
      if (!hasOptimistic) {
        roomMessages.push(optimisticMessage)
        messages.value.set(data.room_id, roomMessages)
      }

      console.log('[Chat] 📤 Sending message via REST API:', {
        roomId: data.room_id,
        content: data.content?.substring(0, 50),
        messageType: data.message_type
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
            file_type: data.file_type
          }
        }
      )

      if (response.success) {
        console.log('[Chat] 📥 REST API response received:', {
          messageId: response.data.id,
          content: response.data.content?.substring(0, 50)
        })
        
        // Replace optimistic message with real message from REST API response
        const roomMessages = messages.value.get(data.room_id) || []
        
        // Find and replace optimistic message
        const tempIndex = roomMessages.findIndex(m => {
          const id = m.id as any
          return typeof id === 'string' && id.startsWith('temp-') && 
                 m.content === messageContent && 
                 m.sender_id === user.value?.id
        })
        
        if (tempIndex !== -1) {
          // Replace optimistic with real message
          roomMessages[tempIndex] = response.data
          // Update the Map to trigger reactivity
          messages.value.set(data.room_id, [...roomMessages])
          console.log('[Chat] ✅ Replaced optimistic message with real message from REST API')
        } else {
          // No optimistic found, check if real message already exists
          const exists = roomMessages.some(m => {
            const mId = m.id as any
            return typeof mId === 'number' && mId === response.data.id
          })
          if (!exists) {
            roomMessages.push(response.data)
            messages.value.set(data.room_id, [...roomMessages])
            console.log('[Chat] ✅ Added real message from REST API')
          } else {
            console.log('[Chat] ⚠️ Real message already exists, skipping')
          }
        }
      }
    } catch (error: any) {
      console.error('[Chat] ❌ Error sending message via REST API:', error)
      // Remove optimistic message on error
      const roomMessages = messages.value.get(data.room_id) || []
      const tempIndex = roomMessages.findIndex(m => {
        const id = m.id as any
        return typeof id === 'string' && id.startsWith('temp-') && 
               m.content === messageContent &&
               m.sender_id === user.value?.id
      })
      if (tempIndex !== -1) {
        roomMessages.splice(tempIndex, 1)
        messages.value.set(data.room_id, roomMessages)
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
    // Use REST API to mark messages as read
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
      
      // Update room's unread_count in local state
      const room = rooms.value.find(r => r.id === roomId)
      if (room) {
        room.unread_count = 0
        // Update unread count
        if (typeof window !== 'undefined') {
          const { updateUnreadCount } = useUnreadMessages()
          updateUnreadCount(rooms.value)
        }
      }
    } catch (error) {
      console.error('[Chat] Error marking messages as read:', error)
    }
  }

  const startTyping = async (roomId: number) => {
    // Use REST API to indicate typing
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

  const stopTyping = async (roomId: number) => {
    // Use REST API to stop typing
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
    console.log('[Chat] 🎯 setActiveRoom called:', room?.id || 'null')
    activeRoom.value = room
    
    // Subscribe to room via SSE
    if (activeRoom.value) {
      subscribeToRoomSSE(activeRoom.value.id)
    }
  }

  // Setup SSE event listeners
  const setupChatEventListeners = () => {
    if (typeof window === 'undefined') {
      console.warn('[Chat] Cannot setup event listeners in server-side')
      return
    }
    
    setupEventListeners(
      // onNewMessage
      // Note: SSE events should NOT be received by the sender (server excludes them)
      // This handler only processes messages from other users
      (message: ChatMessage) => {
        console.log('[Chat] 📨 SSE event: new_message received:', {
          id: message.id,
          roomId: message.room_id,
          senderId: message.sender_id,
          content: message.content?.substring(0, 50)
        })
        
        const roomMessages = messages.value.get(message.room_id) || []
        
        // Simple check: if message already exists by ID, skip
        const exists = roomMessages.some(m => {
          const mId = m.id as any
          return typeof mId === 'number' && mId === message.id
        })
        
        if (exists) {
          console.log('[Chat] ⚠️ Message ID', message.id, 'already exists - skipping')
          return
        }
        
        // Add the message (this should only be for messages from other users)
        roomMessages.push(message)
        messages.value.set(message.room_id, roomMessages)
        console.log('[Chat] ✅ Message ID', message.id, 'added from SSE')
        
        // Update unread count immediately in local state (for instant badge update)
        const room = rooms.value.find(r => r.id === message.room_id)
        if (room) {
          room.unread_count = (room.unread_count || 0) + 1
          // Update unread count badge immediately
          if (typeof window !== 'undefined') {
            const { updateUnreadCount } = useUnreadMessages()
            updateUnreadCount(rooms.value)
            console.log('[Chat] ✅ Updated unread count immediately:', room.unread_count)
          }
        } else {
          // Room not found in local state, reload rooms immediately to get it
          console.log('[Chat] ⚠️ Room not found in local state, reloading rooms immediately...', {
            roomId: message.room_id,
            availableRooms: rooms.value.map(r => r.id)
          })
          // Reload rooms immediately (don't wait) so the room is available
          // After rooms are loaded, if activeRoom matches this room, the watch will trigger
          loadRooms().then(() => {
            console.log('[Chat] ✅ Rooms reloaded after new message, checking if activeRoom needs update...')
            // Check if we need to set activeRoom or trigger watch
            const room = rooms.value.find(r => r.id === message.room_id)
            if (room && !activeRoom.value) {
              // If no activeRoom is set, we could auto-select this room
              // But for now, just log - the user should select the room manually
              console.log('[Chat] 💡 Room found after reload, but activeRoom is not set. User should select the room to see messages.')
            } else if (room && activeRoom.value?.id === message.room_id) {
              console.log('[Chat] ✅ ActiveRoom matches message room, watch should trigger UI update')
            }
          }).catch(error => {
            console.error('[Chat] Error reloading rooms after new message:', error)
          })
        }
        
        // Reload rooms in background to sync with server (non-blocking, for accuracy)
        setTimeout(async () => {
          try {
            await loadRooms()
          } catch (error) {
            console.error('[Chat] Error reloading rooms after new message:', error)
          }
        }, 2000)
      },
      // onTyping
      (data: { userId: number; userName: string; roomId: number }) => {
        if (!typingUsers.value.has(data.roomId)) {
          typingUsers.value.set(data.roomId, new Set())
        }
        typingUsers.value.get(data.roomId)!.add(data.userId)
      },
      // onStopTyping
      (data: { userId: number; roomId: number }) => {
        typingUsers.value.get(data.roomId)?.delete(data.userId)
      },
      // onMessagesRead
      (data: { roomId: number; userId: number }) => {
        const roomMessages = messages.value.get(data.roomId) || []
        roomMessages.forEach(msg => {
          if (msg.sender_id !== data.userId && !msg.is_read) {
            msg.is_read = true
          }
        })
        
        // Update room's unread_count if current user read messages
        if (data.userId === user.value?.id) {
          const room = rooms.value.find(r => r.id === data.roomId)
          if (room) {
            room.unread_count = 0
            // Update unread count
            if (typeof window !== 'undefined') {
              const { updateUnreadCount } = useUnreadMessages()
              updateUnreadCount(rooms.value)
            }
          }
        }
      },
      // onRoomSubscribed
      (data: { roomId: number }) => {
        console.log(`[Chat] ✅ Subscribed to room ${data.roomId}`)
      }
    )
  }

  // Note: Connection should be managed by the component that uses this composable
  // Don't auto-connect here to avoid multiple connections

  return {
    connected: readonly(connected),
    rooms: readonly(rooms),
    activeRoom: readonly(activeRoom),
    messages: readonly(messages),
    typingUsers: readonly(typingUsers),
    connect: connectSSE,
    disconnect: disconnectSSE,
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

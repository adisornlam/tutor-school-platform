<template>
  <div class="h-screen flex">
    <!-- Sidebar: Room List -->
    <div class="w-80 border-r bg-white">
      <ChatRoomList
        :rooms="chatRooms"
        :active-room="activeRoom"
        :loading="loadingRooms"
        @select-room="handleSelectRoom"
        @create-room="showCreateModal = true"
      />
    </div>

    <!-- Main: Chat Window -->
    <div class="flex-1">
      <div v-if="!activeRoom" class="h-full flex items-center justify-center bg-gray-50">
        <div class="text-center text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-lg">เลือกห้องแชทเพื่อเริ่มการสนทนา</p>
        </div>
      </div>

      <ChatWindow
        v-else
        :room="activeRoom"
        :messages="currentMessages"
        :loading="loadingMessages"
        @send-message="handleSendMessage"
        @load-more="handleLoadMore"
      />
    </div>

    <!-- Create Chat Room Modal -->
    <CreateChatRoomModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @room-created="handleRoomCreated"
    />
  </div>
</template>

<script setup lang="ts">
import ChatRoomList from '~/components/chat/ChatRoomList.vue'
import ChatWindow from '~/components/chat/ChatWindow.vue'
import CreateChatRoomModal from '~/components/chat/CreateChatRoomModal.vue'
import type { ChatRoom, ChatMessage, SendMessageData } from '#shared/types/chat.types'

definePageMeta({
  middleware: 'auth',
  layout: 'chat'
})

const { user } = useAuth()
const { 
  rooms, 
  activeRoom, 
  setActiveRoom, 
  getRoomMessages, 
  loadRooms, 
  loadRoom, 
  loadMessages, 
  sendMessage,
  markAsRead,
  messages: chatMessages
} = useChat()

const loadingRooms = ref(false)
const loadingMessages = ref(false)
const currentMessages = ref<ChatMessage[]>([])
const messageOffset = ref(0)
const hasMoreMessages = ref(true)
const showCreateModal = ref(false)
const uploading = ref(false)

const chatRooms = computed(() => [...rooms.value])

// Load rooms on mount and setup SSE
onMounted(async () => {
  loadingRooms.value = true
  try {
    // Setup SSE connection first
    const { setupChatEventListeners, connect, connected } = useChat()
    
    // Only connect if not already connected
    if (!connected.value) {
      connect() // Connect SSE
    }
    
    // Setup event listeners immediately (they will attach when connection is ready)
    setupChatEventListeners()
    
    // Load rooms after connection is established
    await loadRooms()
  } catch (error) {
    console.error('[Chat] Error loading rooms:', error)
  } finally {
    loadingRooms.value = false
  }
})

// Cleanup on unmount
onUnmounted(() => {
  const { disconnect } = useChat()
  disconnect()
})

// Load messages when room changes
watch(() => activeRoom.value?.id, async (roomId) => {
  if (roomId) {
    await loadRoomMessages(roomId)
    // Mark messages as read
    markAsRead(roomId)
  } else {
    currentMessages.value = []
    messageOffset.value = 0
    hasMoreMessages.value = true
  }
}, { immediate: true })

// Watch messages.value directly to catch new messages even when activeRoom is not set
// This ensures messages appear immediately when they arrive via SSE
watch(() => {
  if (!activeRoom.value) return null
  const roomMessages = chatMessages.value.get(activeRoom.value.id)
  return roomMessages ? roomMessages.length : 0
}, (newCount, oldCount) => {
  if (!activeRoom.value) return
  
  // If count increased, trigger the main watch to update UI
  if (newCount && newCount > (oldCount || 0)) {
    console.log('[Chat] 🔔 Message count changed for active room:', {
      roomId: activeRoom.value.id,
      oldCount,
      newCount
    })
    // The main watch below will handle the actual update
  }
})

// Watch for new messages from composable (via SSE) and update currentMessages
// Note: SSE events should only contain messages from other users (server excludes sender)
// This watch also handles when REST API replaces optimistic messages with real messages
watch(() => {
  if (!activeRoom.value) return []
  return chatMessages.value.get(activeRoom.value.id) || []
}, (newMessages, oldMessages) => {
  if (!activeRoom.value) {
    console.log('[Chat] ⚠️ No active room, skipping message update')
    return
  }
  
  if (!newMessages || newMessages.length === 0) {
    console.log('[Chat] ⚠️ No new messages in watch, skipping')
    return
  }
  
  // Get existing real message IDs
  const existingIds = new Set<number>()
  currentMessages.value.forEach(m => {
    const id = m.id as any
    if (typeof id === 'number') {
      existingIds.add(id)
    }
  })
  
  // Find messages to add (real messages that don't exist yet)
  const messagesToAdd = newMessages.filter(m => {
    const id = m.id as any
    return typeof id === 'number' && !existingIds.has(id)
  })
  
  console.log('[Chat] 🔍 Messages analysis:', {
    totalNew: newMessages.length,
    existingIds: existingIds.size,
    messagesToAdd: messagesToAdd.length,
    messagesToAddIds: messagesToAdd.map(m => m.id)
  })
  
  // Find temp messages in currentMessages that should be replaced
  // (when a real message with same content from same sender exists in newMessages)
  const tempMessagesToRemove: number[] = []
  currentMessages.value.forEach((currentMsg, index) => {
    const currentId = currentMsg.id as any
    if (typeof currentId === 'string' && currentId.startsWith('temp-')) {
      // Check if newMessages has a real message with same content from same sender
      const hasRealReplacement = newMessages.some(newMsg => {
        const newId = newMsg.id as any
        return typeof newId === 'number' &&
               newMsg.content === currentMsg.content &&
               newMsg.sender_id === currentMsg.sender_id
      })
      if (hasRealReplacement) {
        tempMessagesToRemove.push(index)
      }
    }
  })
  
  if (messagesToAdd.length > 0 || tempMessagesToRemove.length > 0) {
    // Remove temp messages that have been replaced
    const filteredMessages = currentMessages.value.filter((_, index) => 
      !tempMessagesToRemove.includes(index)
    )
    
    // Merge new messages
    const allMessages = [...filteredMessages, ...messagesToAdd]
    
    // Sort by created_at
    allMessages.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return timeA - timeB
    })
    
    // Final deduplication by ID (only for real messages)
    const seen = new Set<number>()
    const uniqueMessages = allMessages.filter(m => {
      const id = m.id as any
      if (typeof id === 'number') {
        if (seen.has(id)) return false
        seen.add(id)
        return true
      }
      // Keep temp messages (optimistic updates that haven't been replaced yet)
      return true
    })
    
    console.log('[Chat] ✅ Updating currentMessages:', {
      before: currentMessages.value.length,
      after: uniqueMessages.length,
      added: messagesToAdd.length,
      removed: tempMessagesToRemove.length,
      isFirstLoad
    })
    
    currentMessages.value = uniqueMessages
    
    if (isFirstLoad || messagesToAdd.length > 0 || tempMessagesToRemove.length > 0) {
      console.log('[Chat] 📨 New messages detected, updating UI:', {
        added: messagesToAdd.length,
        removed: tempMessagesToRemove.length,
        isFirstLoad
      })
      
      // Auto mark as read
      markAsRead(activeRoom.value.id)
    }
  } else {
    console.log('[Chat] ⚠️ No messages to add or remove, skipping update')
  }
}, { deep: true })

const loadRoomMessages = async (roomId: number, append: boolean = false) => {
  loadingMessages.value = true
  try {
    const offset = append ? messageOffset.value : 0
    const apiMessages = await loadMessages(roomId, 50, offset)
    
    if (!apiMessages) {
      console.error('[Chat] loadMessages returned undefined')
      return
    }
    
    // Get cached messages from composable (may include optimistic updates)
    const cachedMessages = getRoomMessages(roomId) || []
    
    // Merge: prioritize cached messages (they may have optimistic updates)
    const allMessages = [...apiMessages, ...cachedMessages]
    
    // Simple deduplication: use message ID as unique key
    const seen = new Set<number>()
    const uniqueMessages = allMessages.filter(m => {
      const id = m.id as any
      
      // For real messages (number ID), deduplicate by ID
      if (typeof id === 'number') {
        if (seen.has(id)) return false
        seen.add(id)
        return true
      }
      
      // Keep temp messages (optimistic updates)
      return typeof id === 'string' && id.startsWith('temp-')
    })
    
    // Sort by created_at
    uniqueMessages.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime()
      const timeB = new Date(b.created_at).getTime()
      return timeA - timeB
    })
    
    if (append) {
      // Prepend older messages, remove duplicates from currentMessages
      const currentIds = new Set(
        currentMessages.value
          .map(m => {
            const id = m.id as any
            return typeof id === 'number' ? id : null
          })
          .filter(id => id !== null) as number[]
      )
      const newMessages = uniqueMessages.filter(m => {
        const id = m.id as any
        return typeof id === 'number' ? !currentIds.has(id) : true
      })
      currentMessages.value = [...newMessages, ...currentMessages.value]
    } else {
      // Replace messages
      currentMessages.value = uniqueMessages
      messageOffset.value = 0
    }
    
    // Update offset for next load
    if (apiMessages.length < 50) {
      hasMoreMessages.value = false
    } else {
      messageOffset.value += apiMessages.length
      hasMoreMessages.value = true
    }
  } catch (error) {
    console.error('[Chat] Error loading messages:', error)
  } finally {
    loadingMessages.value = false
  }
}

const handleSelectRoom = async (room: ChatRoom) => {
  console.log('[Chat] 🎯 Selecting room:', room.id)
  setActiveRoom(room)
  messageOffset.value = 0
  hasMoreMessages.value = true
}

const sending = ref(false)

const handleSendMessage = async (data: any) => {
  if (!activeRoom.value) return
  
  // Prevent duplicate sends
  if (sending.value) {
    console.log('[Chat] ⚠️ Already sending a message, skipping duplicate')
    return
  }
  
  sending.value = true
  
  try {
    await sendMessage({
      room_id: activeRoom.value.id,
      content: data.content,
      message_type: data.messageType,
      file_url: data.fileUrl,
      file_name: data.fileName,
      file_size: data.fileSize,
      file_type: data.fileType
    })
    
    // Mark as read after sending
    markAsRead(activeRoom.value.id)
  } catch (error) {
    console.error('[Chat] Error in handleSendMessage:', error)
  } finally {
    // Reset sending state after a short delay
    setTimeout(() => {
      sending.value = false
    }, 500)
  }
}

const handleLoadMore = async () => {
  if (!activeRoom.value || !hasMoreMessages.value || loadingMessages.value) return
  await loadRoomMessages(activeRoom.value.id, true)
}

const handleRoomCreated = async (roomId: number) => {
  // Reload rooms to get the new room
  await loadRooms()
  
  // Find and select the new room
  const newRoom = rooms.value.find(r => r.id === roomId)
  if (newRoom) {
    await handleSelectRoom(newRoom)
  }
}

// Note: We removed the duplicate watch that was watching chatMessages.value
// The watch above (line 122) already handles updates from chatMessages
</script>


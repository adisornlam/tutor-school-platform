<template>
  <div class="h-full flex overflow-hidden">
    <!-- Sidebar: Room List -->
    <div class="w-80 border-r bg-white flex-shrink-0 overflow-y-auto">
      <ChatRoomList
        :rooms="chatRooms"
        :active-room="activeRoom"
        :loading="loadingRooms"
        @select-room="handleSelectRoom"
        @create-room="showCreateModal = true"
      />
    </div>

    <!-- Main: Chat Window -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div v-if="!activeRoom" class="flex-1 flex items-center justify-center bg-gray-50">
        <div class="text-center text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-lg">เลือกห้องแชทเพื่อเริ่มการสนทนา</p>
        </div>
      </div>

      <div v-else class="flex-1 flex min-w-0 overflow-hidden">
        <ChatWindow
          class="flex-1 min-w-0"
          :room="activeRoom"
          :messages="currentMessages"
          :loading="loadingMessages"
          @send-message="handleSendMessage"
          @load-more="handleLoadMore"
        />
        
        <!-- Right Sidebar: Tags and Notes -->
        <ChatRoomSidebar class="flex-shrink-0" :room="activeRoom" />
      </div>
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
import ChatRoomSidebar from '~/components/chat/ChatRoomSidebar.vue'
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
  sortedMessages, // ✅ Change: Use sortedMessages computed property
  setupChatEventListeners,
  connect,
  connected,
  socket
} = useChat()

const loadingRooms = ref(false)
const loadingMessages = ref(false)
const messageOffset = ref(0)
const hasMoreMessages = ref(true)
const showCreateModal = ref(false)
const uploading = ref(false)

const chatRooms = computed(() => [...rooms.value])

// Load rooms on mount and setup Socket.IO
onMounted(async () => {
  loadingRooms.value = true
  try {
    console.log('[Chat Page] 🚀 Mounting chat page, setting up Socket.IO...')
    
    // Only connect if not already connected
    if (!connected.value) {
      console.log('[Chat Page] 🔌 Connecting Socket.IO...')
      connect() // Connect Socket.IO
      
      // Wait for connection to establish
      let attempts = 0
      while (!connected.value && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      if (!connected.value) {
        console.warn('[Chat Page] ⚠️ Socket.IO connection timeout')
      }
    } else {
      console.log('[Chat Page] ✅ Socket.IO already connected')
    }
    
    // Setup event listeners - wait for socket to be available
    console.log('[Chat Page] 👂 Setting up event listeners...')
    
    // Wait for socket to be available
    let socketAttempts = 0
    while (!socket.value && socketAttempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100))
      socketAttempts++
    }
    
    if (socket.value) {
      console.log('[Chat Page] ✅ Socket available, setting up event listeners, socket ID:', socket.value.id)
      setupChatEventListeners()
    } else {
      console.warn('[Chat Page] ⚠️ Socket not available after waiting, will retry in setupChatEventListeners')
      setupChatEventListeners() // Will retry internally
    }
    
    // Load rooms after connection is established
    console.log('[Chat Page] 📋 Loading rooms...')
    await loadRooms()
    
    // Restore active room from URL query parameter
    const route = useRoute()
    const roomIdFromUrl = route.query.roomId ? parseInt(route.query.roomId as string) : null
    if (roomIdFromUrl) {
      const roomToRestore = rooms.value.find(r => r.id === roomIdFromUrl)
      if (roomToRestore) {
        console.log('[Chat Page] 🔄 Restoring active room from URL:', roomIdFromUrl)
        await handleSelectRoom(roomToRestore)
        // Mark as read immediately when restoring room
        markAsRead(roomIdFromUrl)
      }
    } else if (rooms.value.length > 0 && activeRoom.value) {
      // If there's an active room (from previous session or default), mark as read
      console.log('[Chat Page] 📋 Marking active room as read on page entry:', activeRoom.value.id)
      markAsRead(activeRoom.value.id)
    }
    
    console.log('[Chat Page] ✅ Chat page setup complete')
  } catch (error) {
    console.error('[Chat Page] ❌ Error loading rooms:', error)
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
    messageOffset.value = 0
    hasMoreMessages.value = true
  }
}, { immediate: true })

// ✅ Change: Use sortedMessages from composable (already computed and sorted)
const currentMessages = sortedMessages

// Auto-scroll when messages change (following article approach)
watch(() => currentMessages.value.length, (newLength, oldLength) => {
  console.log('[Chat] 📏 Message count changed:', {
    oldLength,
    newLength,
    willScroll: newLength > (oldLength || 0)
  })
  // ChatWindow component has its own scroll handler
  // Vue reactivity will automatically update the UI
})

const loadRoomMessages = async (roomId: number, append: boolean = false) => {
  loadingMessages.value = true
  try {
    const offset = append ? messageOffset.value : 0
    
    // Use loadMessages from composable - it handles Map updates internally
    // Don't try to update chatMessages.value directly (it's readonly)
    const apiMessages = await loadMessages(roomId, 50, offset)
    
    if (!apiMessages) {
      console.error('[Chat] loadMessages returned undefined')
      return
    }
    
    // The loadMessages function already updates the messages Map in the composable
    // The computed property (currentMessages) will automatically update when messages.value changes
    // No need to manually update chatMessages.value here
    
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
  
  // Update URL query parameter to persist active room
  const route = useRoute()
  const router = useRouter()
  if (route.query.roomId !== room.id.toString()) {
    await router.replace({
      query: { ...route.query, roomId: room.id.toString() }
    })
  }
}

const sending = ref(false)

const handleSendMessage = async (data: any) => {
  console.log('[Chat Page] 🎯 handleSendMessage called:', {
    hasActiveRoom: !!activeRoom.value,
    roomId: activeRoom.value?.id,
    content: data.content?.substring(0, 50),
    messageType: data.messageType,
    isSending: sending.value
  })
  
  if (!activeRoom.value) {
    console.error('[Chat Page] ❌ No active room')
    return
  }
  
  // Prevent duplicate sends
  if (sending.value) {
    console.log('[Chat Page] ⚠️ Already sending a message, skipping duplicate')
    return
  }
  
  sending.value = true
  console.log('[Chat Page] ✅ Sending state set to true')
  
  try {
    console.log('[Chat Page] 📤 Calling sendMessage composable...')
    await sendMessage({
      room_id: activeRoom.value.id,
      content: data.content,
      message_type: data.messageType,
      file_url: data.fileUrl,
      file_name: data.fileName,
      file_size: data.fileSize,
      file_type: data.fileType,
      reply_to_id: data.replyToId || null
    })
    
    console.log('[Chat Page] ✅ sendMessage completed successfully')
    
    // Mark as read after sending
    markAsRead(activeRoom.value.id)
  } catch (error: any) {
    console.error('[Chat Page] ❌ Error in handleSendMessage:', {
      error: error.message,
      stack: error.stack,
      response: error.response
    })
  } finally {
    // Reset sending state after a short delay
    setTimeout(() => {
      sending.value = false
      console.log('[Chat Page] 🔄 Sending state reset to false')
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


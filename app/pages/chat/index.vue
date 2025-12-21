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
  markAsRead 
} = useChat()

const loadingRooms = ref(false)
const loadingMessages = ref(false)
const currentMessages = ref<ChatMessage[]>([])
const messageOffset = ref(0)
const hasMoreMessages = ref(true)
const showCreateModal = ref(false)

const chatRooms = computed(() => rooms.value)

// Load rooms on mount
onMounted(async () => {
  loadingRooms.value = true
  try {
    await loadRooms()
  } catch (error) {
    console.error('[Chat] Error loading rooms:', error)
  } finally {
    loadingRooms.value = false
  }
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

const loadRoomMessages = async (roomId: number, append: boolean = false) => {
  loadingMessages.value = true
  try {
    const offset = append ? messageOffset.value : 0
    const messages = await loadMessages(roomId, 50, offset)
    
    if (append) {
      // Prepend older messages
      currentMessages.value = [...messages, ...currentMessages.value]
    } else {
      // Replace messages
      currentMessages.value = messages
      messageOffset.value = 0
    }
    
    // Update offset for next load
    if (messages.length < 50) {
      hasMoreMessages.value = false
    } else {
      messageOffset.value += messages.length
      hasMoreMessages.value = true
    }
    
    // Also get messages from composable's cache
    const cachedMessages = getRoomMessages(roomId)
    if (cachedMessages.length > currentMessages.value.length) {
      currentMessages.value = cachedMessages
    }
  } catch (error) {
    console.error('[Chat] Error loading messages:', error)
  } finally {
    loadingMessages.value = false
  }
}

const handleSelectRoom = async (room: ChatRoom) => {
  setActiveRoom(room)
  messageOffset.value = 0
  hasMoreMessages.value = true
}

const handleSendMessage = (data: any) => {
  if (!activeRoom.value) return
  
  sendMessage({
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

// Watch for new messages from socket
watch(() => activeRoom.value?.id, (roomId) => {
  if (roomId) {
    const socketMessages = getRoomMessages(roomId)
    if (socketMessages.length > 0) {
      // Merge socket messages with API messages
      const existingIds = new Set(currentMessages.value.map(m => m.id))
      const newMessages = socketMessages.filter(m => !existingIds.has(m.id))
      if (newMessages.length > 0) {
        currentMessages.value = [...currentMessages.value, ...newMessages]
        // Auto mark as read
        markAsRead(roomId)
      }
    }
  }
})
</script>


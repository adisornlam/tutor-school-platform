<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Header -->
    <div v-if="room" class="border-b p-4 bg-gray-50">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            v-if="otherUser?.avatar_url"
            :src="otherUser.avatar_url"
            :alt="otherUser.first_name"
            class="w-full h-full object-cover"
          >
          <span v-else class="text-gray-500 font-semibold">
            {{ otherUser?.first_name?.charAt(0) }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900">
            {{ otherUser?.first_name }} {{ otherUser?.last_name }}
          </h3>
          <p class="text-sm text-gray-500 truncate">
            {{ room.course?.title }}
          </p>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-1"
      @scroll="handleScroll"
    >
      <!-- Loading More -->
      <div v-if="loadingMore" class="text-center py-2 text-sm text-gray-500">
        กำลังโหลด...
      </div>

      <!-- Load More Button -->
      <div v-if="hasMoreMessages && !loadingMore" class="text-center py-2">
        <button
          @click="loadMoreMessages"
          class="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          โหลดข้อความเก่า
        </button>
      </div>

      <!-- Messages -->
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :current-user-id="currentUserId"
        @image-click="handleImageClick"
      />

      <!-- Typing Indicator -->
      <div v-if="typingUsers.length > 0" class="flex items-center space-x-2 text-gray-500 text-sm italic py-2">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
        </div>
        <span>กำลังพิมพ์...</span>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && messages.length === 0" class="text-center py-8 text-gray-500">
        ยังไม่มีข้อความ
      </div>
    </div>

    <!-- Chat Input -->
    <ChatInput
      v-if="room"
      :room-id="room.id"
      placeholder="พิมพ์ข้อความ..."
      :uploading="uploading"
      :sending="sending"
      @send-message="handleSendMessage"
      @typing="handleTyping"
    />

    <!-- Image Preview Modal -->
    <div
      v-if="previewImage"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="previewImage = null"
    >
      <img
        :src="previewImage"
        alt="Preview"
        class="max-w-full max-h-full object-contain"
        @click.stop
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import type { ChatRoom, ChatMessage as ChatMessageType } from '#shared/types/chat.types'

interface Props {
  room: ChatRoom | null
  messages: ChatMessageType[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'send-message': [data: any]
  'load-more': []
}>()

const { user } = useAuth()
const { getTypingUsers, startTyping, stopTyping, uploadFile } = useChat()
const messagesContainer = ref<HTMLDivElement | null>(null)
const previewImage = ref<string | null>(null)
const uploading = ref(false)
const sending = ref(false)
const loadingMore = ref(false)
const hasMoreMessages = ref(true)
const typingTimer = ref<NodeJS.Timeout | null>(null)

const currentUserId = computed(() => user.value?.id || 0)

const otherUser = computed(() => {
  if (!props.room || !user.value) return null
  return props.room.student_id === user.value.id ? props.room.tutor : props.room.student
})

const typingUsers = computed(() => {
  if (!props.room) return []
  return getTypingUsers(props.room.id)
})

const handleSendMessage = async (data: any) => {
  sending.value = true
  try {
    emit('send-message', data)
    
    // Scroll to bottom after sending
    await nextTick()
    scrollToBottom()
  } finally {
    sending.value = false
  }
}

const handleTyping = () => {
  if (!props.room) return
  
  startTyping(props.room.id)
  
  // Clear existing timer
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }
  
  // Stop typing after 3 seconds
  typingTimer.value = setTimeout(() => {
    if (props.room) {
      stopTyping(props.room.id)
    }
  }, 3000)
}

const handleImageClick = (url: string) => {
  previewImage.value = url
}

const handleScroll = () => {
  if (!messagesContainer.value) return
  
  const { scrollTop } = messagesContainer.value
  
  // Load more when scrolled to top
  if (scrollTop < 100 && hasMoreMessages.value && !loadingMore.value) {
    loadMoreMessages()
  }
}

const loadMoreMessages = () => {
  emit('load-more')
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Scroll to bottom when room changes
watch(() => props.room?.id, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Cleanup
onUnmounted(() => {
  if (typingTimer.value) {
    clearTimeout(typingTimer.value)
  }
})
</script>


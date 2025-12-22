<template>
  <div class="h-full flex flex-col bg-white overflow-hidden">
    <!-- Header -->
    <div v-if="room" class="border-b p-4 bg-gray-50 flex-shrink-0">
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

      <!-- Messages with Date Separators -->
      <template v-for="(item, index) in messagesWithDates" :key="item.key">
        <!-- Date Separator -->
        <div
          v-if="item.type === 'date'"
          class="flex items-center justify-center my-4"
        >
          <div class="bg-gray-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-1">
            <span>{{ item.dateLabel }}</span>
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <!-- Message -->
        <div
          v-else
          :id="`message-${item.message.id}`"
          :ref="el => { if (el && item.message) messageRefs[item.message.id] = el as HTMLElement }"
        >
          <ChatMessage
            :message="item.message"
            :current-user-id="currentUserId"
            @image-click="handleImageClick"
            @reply="handleReply"
            @pin="handlePin"
            @scroll-to-message="handleScrollToMessage"
          />
        </div>
      </template>

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
    <div class="flex-shrink-0">
      <ChatInput
        v-if="room"
        :room-id="room.id"
        placeholder="พิมพ์ข้อความ..."
        :uploading="uploading"
        :sending="sending"
        :replying-to="replyingToMessage"
        @send-message="handleSendMessage"
        @typing="handleTyping"
        @cancel-reply="replyingToMessage = null"
      />
    </div>

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
import { format, isSameDay, parseISO } from 'date-fns'
import { th } from 'date-fns/locale'

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
  'reply': [message: ChatMessageType]
  'pin': [messageId: number, pin: boolean]
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
const replyingToMessage = ref<ChatMessageType | null>(null)
const messageRefs = ref<Record<number, HTMLElement>>({})

const currentUserId = computed(() => user.value?.id || 0)

const otherUser = computed(() => {
  if (!props.room || !user.value) return null
  return props.room.student_id === user.value.id ? props.room.tutor : props.room.student
})

const typingUsers = computed(() => {
  if (!props.room) return []
  return getTypingUsers(props.room.id)
})

// Format date for display (e.g., "3 ส.ค. (อา.)")
const formatDateLabel = (date: Date) => {
  const day = format(date, 'd', { locale: th })
  const month = format(date, 'MMM', { locale: th })
  const dayOfWeek = format(date, 'EEE', { locale: th })
  return `${day} ${month} (${dayOfWeek}.)`
}

// Check if two dates are on the same day
const isSameDate = (date1: string | Date, date2: string | Date) => {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
    return isSameDay(d1, d2)
  } catch {
    return false
  }
}

// Messages with date separators
const messagesWithDates = computed(() => {
  const result: Array<{ type: 'message' | 'date'; message?: ChatMessageType; dateLabel?: string; key: string }> = []
  
  for (let i = 0; i < props.messages.length; i++) {
    const message = props.messages[i]
    const messageDate = parseISO(message.created_at)
    
    // Check if this is the first message or if the date changed from previous message
    const prevMessage = i > 0 ? props.messages[i - 1] : null
    const shouldShowDate = !prevMessage || !isSameDate(message.created_at, prevMessage.created_at)
    
    if (shouldShowDate) {
      result.push({
        type: 'date',
        dateLabel: formatDateLabel(messageDate),
        key: `date-${message.id}`
      })
    }
    
    result.push({
      type: 'message',
      message: message,
      key: `message-${message.id}-${message.created_at}`
    })
  }
  
  return result
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

const handleReply = (message: ChatMessageType) => {
  replyingToMessage.value = message
  // Focus on input
  nextTick(() => {
    const input = document.querySelector('textarea[placeholder="พิมพ์ข้อความ..."]') as HTMLTextAreaElement
    if (input) {
      input.focus()
    }
  })
}

const handlePin = async (messageId: number, pin: boolean) => {
  // TODO: Implement pin functionality via API
  console.log('[ChatWindow] Pin message:', messageId, pin)
  emit('pin', messageId, pin)
}

const handleScrollToMessage = (messageId: number) => {
  const messageElement = messageRefs.value[messageId] || document.getElementById(`message-${messageId}`)
  if (messageElement && messagesContainer.value) {
    // Scroll to message with smooth behavior
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    // Highlight the message briefly
    messageElement.classList.add('bg-yellow-100', 'transition-colors', 'duration-300')
    setTimeout(() => {
      messageElement.classList.remove('bg-yellow-100')
    }, 2000)
  }
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


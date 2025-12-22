<template>
  <div
    :class="[
      'flex mb-4',
      isOwnMessage ? 'justify-end' : 'justify-start'
    ]"
  >
    <div :class="['flex space-x-2 max-w-[70%]', isOwnMessage ? 'flex-row-reverse space-x-reverse' : '']" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
      <!-- Avatar -->
      <div v-if="!isOwnMessage" class="flex-shrink-0">
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            v-if="message.sender?.avatar_url"
            :src="message.sender.avatar_url"
            :alt="message.sender.first_name"
            class="w-full h-full object-cover"
          >
          <span v-else class="text-gray-500 text-sm font-semibold">
            {{ message.sender?.first_name?.charAt(0) }}
          </span>
        </div>
      </div>

      <!-- Message Content -->
      <div 
        :class="['flex flex-col group relative', isOwnMessage ? 'items-end' : 'items-start']"
      >
        <!-- Sender Name (for received messages) -->
        <span v-if="!isOwnMessage" class="text-xs text-gray-500 mb-1 px-1">
          {{ message.sender?.first_name }} {{ message.sender?.last_name }}
        </span>

        <!-- Message Bubble Container -->
        <div class="flex items-center space-x-2">
          <!-- Message Bubble -->
          <div
            :class="[
              'rounded-lg px-4 py-2 relative',
              isOwnMessage
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-900'
            ]"
          >

          <!-- Reply Preview (if this message is a reply) -->
          <div
            v-if="message.reply_to"
            @click="$emit('scroll-to-message', message.reply_to_id)"
            :class="[
              'mb-2 pb-2 border-l-4 pl-2 cursor-pointer hover:opacity-90 transition-opacity',
              isOwnMessage
                ? 'border-white text-white bg-white bg-opacity-20 rounded'
                : 'border-gray-500 text-gray-700 bg-gray-50 rounded'
            ]"
          >
            <div :class="['font-semibold mb-0.5', isOwnMessage ? 'text-white' : 'text-gray-800']">
              {{ message.reply_to.sender?.first_name }} {{ message.reply_to.sender?.last_name }}
            </div>
            <div :class="['truncate', isOwnMessage ? 'text-white' : 'text-gray-700']">
              {{ message.reply_to.content || (message.reply_to.file_name || 'ไฟล์') }}
            </div>
          </div>
          <!-- Text Message -->
          <p v-if="message.message_type === 'text'" class="whitespace-pre-wrap break-words">
            {{ message.content }}
          </p>

          <!-- Image Message -->
          <div v-else-if="message.message_type === 'image'" class="max-w-sm">
            <img
              v-if="message.file_url"
              :src="message.file_url"
              :alt="message.content || 'Image'"
              class="rounded-lg max-w-full h-auto cursor-pointer"
              @click="$emit('image-click', message.file_url)"
            >
            <p v-if="message.content" class="mt-2 text-sm opacity-90">
              {{ message.content }}
            </p>
          </div>

          <!-- File Message -->
          <div v-else-if="message.message_type === 'file'" class="flex items-center space-x-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="flex-1 min-w-0">
              <a
                :href="message.file_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium hover:underline truncate block"
              >
                {{ message.file_name || 'ไฟล์' }}
              </a>
              <p v-if="message.file_size" class="text-xs opacity-75">
                {{ formatFileSize(message.file_size) }}
              </p>
            </div>
          </div>
        </div>
          
          <!-- Three Dots Menu Button (shown on hover) -->
          <button
            v-if="showMenu"
            @click.stop="showContextMenu = !showContextMenu"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            type="button"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>

        <!-- Context Menu -->
        <div
          v-if="showContextMenu"
          :class="[
            'absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px]',
            isOwnMessage ? 'right-0' : 'left-0'
          ]"
          style="top: 100%; margin-top: 4px;"
          @click.stop
        >
          <button
            @click="handleReply"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ตอบกลับ
          </button>
          <button
            @click="handleCopyLink"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            คัดลอกลิงก์
          </button>
          <button
            @click="handlePin"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {{ message.is_pinned ? 'ยกเลิกปักหมุด' : 'ปักหมุด' }}
          </button>
        </div>

        <!-- Timestamp -->
        <span class="text-xs text-gray-400 mt-1 px-1">
          {{ formatTime(message.created_at) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '#shared/types/chat.types'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

interface Props {
  message: ChatMessage
  currentUserId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'image-click': [url: string]
  'reply': [message: ChatMessage]
  'pin': [messageId: number, pin: boolean]
  'scroll-to-message': [messageId: number]
}>()

const isOwnMessage = computed(() => props.message.sender_id === props.currentUserId)
const showMenu = ref(false)
const showContextMenu = ref(false)

const handleReply = () => {
  emit('reply', props.message)
  showContextMenu.value = false
}

const handleCopyLink = async () => {
  const messageLink = `${window.location.origin}/chat?roomId=${props.message.room_id}&messageId=${props.message.id}`
  try {
    await navigator.clipboard.writeText(messageLink)
    // Show toast or notification
    console.log('Copied link:', messageLink)
    showContextMenu.value = false
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const handlePin = () => {
  emit('pin', props.message.id, !props.message.is_pinned)
  showContextMenu.value = false
}

// Close context menu when clicking outside
onMounted(() => {
  const handleClickOutside = () => {
    if (showContextMenu.value) {
      showContextMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

const formatTime = (dateString: string) => {
  try {
    return format(new Date(dateString), 'HH:mm', { locale: th })
  } catch {
    return dateString
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>


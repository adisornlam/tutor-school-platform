<template>
  <div
    :class="[
      'flex mb-4',
      isOwnMessage ? 'justify-end' : 'justify-start'
    ]"
  >
    <div :class="['flex space-x-2 max-w-[70%]', isOwnMessage ? 'flex-row-reverse space-x-reverse' : '']">
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
      <div :class="['flex flex-col', isOwnMessage ? 'items-end' : 'items-start']">
        <!-- Sender Name (for received messages) -->
        <span v-if="!isOwnMessage" class="text-xs text-gray-500 mb-1 px-1">
          {{ message.sender?.first_name }} {{ message.sender?.last_name }}
        </span>

        <!-- Message Bubble -->
        <div
          :class="[
            'rounded-lg px-4 py-2',
            isOwnMessage
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-900'
          ]"
        >
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
}>()

const isOwnMessage = computed(() => props.message.sender_id === props.currentUserId)

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


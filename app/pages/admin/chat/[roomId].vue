<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <NuxtLink
          to="/admin/chat"
          class="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-3xl font-bold">ดูแชท #{{ roomId }}</h1>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <div v-else-if="room" class="h-[calc(100vh-200px)] flex flex-col bg-white rounded-lg shadow">
      <!-- Room Info -->
      <div class="border-b p-4 bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">ผู้เรียน</p>
            <p class="font-semibold">{{ room.student?.first_name }} {{ room.student?.last_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">อาจารย์</p>
            <p class="font-semibold">{{ room.tutor?.first_name }} {{ room.tutor?.last_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">คอร์ส</p>
            <p class="font-semibold">{{ room.course?.title }}</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-1">
        <div v-if="loadingMessages" class="text-center py-2 text-sm text-gray-500">
          กำลังโหลด...
        </div>

        <div v-if="hasMoreMessages && !loadingMessages" class="text-center py-2">
          <button
            @click="loadMoreMessages"
            class="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            โหลดข้อความเก่า
          </button>
        </div>

        <div
          v-for="message in messages"
          :key="message.id"
          class="flex mb-4"
          :class="message.sender_id === room.student_id ? 'justify-end' : 'justify-start'"
        >
          <div class="flex space-x-2 max-w-[70%]">
            <div
              :class="[
                'rounded-lg px-4 py-2',
                message.sender_id === room.student_id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              ]"
            >
              <p v-if="message.message_type === 'text'" class="whitespace-pre-wrap">
                {{ message.content }}
              </p>
              <img
                v-else-if="message.message_type === 'image' && message.file_url"
                :src="message.file_url"
                alt="Image"
                class="rounded-lg max-w-sm cursor-pointer"
                @click="previewImage = message.file_url"
              >
              <a
                v-else-if="message.message_type === 'file' && message.file_url"
                :href="message.file_url"
                target="_blank"
                class="flex items-center space-x-2 text-sm hover:underline"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ message.file_name || 'ไฟล์' }}</span>
              </a>
              <p class="text-xs opacity-75 mt-1">
                {{ formatTime(message.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
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
import type { ChatRoom, ChatMessage } from '#shared/types/chat.types'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const route = useRoute()
const config = useRuntimeConfig()
const { accessToken } = useAuth()

const roomId = computed(() => parseInt(route.params.roomId as string))
const room = ref<ChatRoom | null>(null)
const messages = ref<ChatMessage[]>([])
const loading = ref(true)
const loadingMessages = ref(false)
const error = ref('')
const previewImage = ref<string | null>(null)
const messageOffset = ref(0)
const hasMoreMessages = ref(true)

const loadRoom = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch<{ success: boolean; data: ChatRoom }>(
      `${config.public.apiBase}/admin/chat/rooms/${roomId.value}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    
    if (response.success) {
      room.value = response.data
      await loadMessages()
    }
  } catch (err: any) {
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
    console.error('[Admin Chat] Error loading room:', err)
  } finally {
    loading.value = false
  }
}

const loadMessages = async (append: boolean = false) => {
  loadingMessages.value = true
  
  try {
    const offset = append ? messageOffset.value : 0
    const response = await $fetch<{ success: boolean; data: ChatMessage[] }>(
      `${config.public.apiBase}/chat/rooms/${roomId.value}/messages?limit=50&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    
    if (response.success) {
      if (append) {
        messages.value = [...response.data.reverse(), ...messages.value]
      } else {
        messages.value = response.data.reverse()
        messageOffset.value = 0
      }
      
      if (response.data.length < 50) {
        hasMoreMessages.value = false
      } else {
        messageOffset.value += response.data.length
        hasMoreMessages.value = true
      }
    }
  } catch (err: any) {
    console.error('[Admin Chat] Error loading messages:', err)
  } finally {
    loadingMessages.value = false
  }
}

const loadMoreMessages = () => {
  if (!hasMoreMessages.value || loadingMessages.value) return
  loadMessages(true)
}

const formatTime = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: th })
  } catch {
    return dateString
  }
}

onMounted(() => {
  loadRoom()
})
</script>


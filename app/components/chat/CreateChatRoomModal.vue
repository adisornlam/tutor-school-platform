<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between">
        <h2 class="text-xl font-semibold">เริ่มแชทกับอาจารย์</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p class="mt-2 text-gray-600">กำลังโหลด...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {{ error }}
        </div>

        <div v-else-if="chatOptions.length === 0" class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>คุณยังไม่มีคอร์สที่สามารถแชทได้</p>
          <p class="text-sm mt-2">กรุณาลงทะเบียนเรียนคอร์สก่อน</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="option in chatOptions"
            :key="`${option.course.id}-${option.tutor.id}-${option.studentId}`"
            class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            :class="option.chatRoomId ? 'border-green-200 bg-green-50' : 'border-gray-200'"
          >
            <div class="flex items-start space-x-4">
              <!-- Course Thumbnail -->
              <div class="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  v-if="option.course.thumbnail"
                  :src="option.course.thumbnail"
                  :alt="option.course.title"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 mb-1">{{ option.course.title }}</h3>
                <p class="text-sm text-gray-600 mb-2">
                  อาจารย์: {{ option.tutor.firstName }} {{ option.tutor.lastName }}
                </p>
                <div class="flex items-center justify-between">
                  <span
                    v-if="option.chatRoomId"
                    class="text-xs text-green-600 font-medium"
                  >
                    ✓ มีห้องแชทอยู่แล้ว
                  </span>
                  <span v-else class="text-xs text-gray-500">
                    ยังไม่มีห้องแชท
                  </span>
                  <button
                    @click="handleStartChat(option)"
                    :disabled="creating"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {{ option.chatRoomId ? 'เปิดแชท' : 'เริ่มแชท' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChatOption {
  course: {
    id: number
    title: string
    code: string | null
    thumbnail: string | null
  }
  tutor: {
    id: number
    firstName: string
    lastName: string
    username: string
    email: string
    avatar: string | null
  }
  enrollmentId: number
  studentId: number
  chatRoomId: number | null
}

interface Props {
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'room-created': [roomId: number]
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()
const chatOptions = ref<ChatOption[]>([])
const loading = ref(false)
const error = ref('')
const creating = ref(false)

const loadChatOptions = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch<{ success: boolean; data: ChatOption[] }>(
      `${config.public.apiBase}/learning/available-chats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )

    if (response.success) {
      chatOptions.value = response.data
    }
  } catch (err: any) {
    console.error('[CreateChatRoomModal] Error loading options:', err)
    error.value = err.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
  } finally {
    loading.value = false
  }
}

const handleStartChat = async (option: ChatOption) => {
  if (option.chatRoomId) {
    // Room already exists, just emit the room ID
    emit('room-created', option.chatRoomId)
    emit('close')
    return
  }

  creating.value = true
  
  try {
    const response = await $fetch<{ success: boolean; data: { id: number } }>(
      `${config.public.apiBase}/chat/rooms`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: {
          course_id: option.course.id,
          tutor_id: option.tutor.id
        }
      }
    )

    if (response.success) {
      emit('room-created', response.data.id)
      emit('close')
    }
  } catch (err: any) {
    console.error('[CreateChatRoomModal] Error creating room:', err)
    error.value = err.data?.message || 'ไม่สามารถสร้างห้องแชทได้'
  } finally {
    creating.value = false
  }
}

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    loadChatOptions()
  }
})
</script>


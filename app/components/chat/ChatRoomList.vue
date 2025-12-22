<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold">แชท</h2>
      </div>
      <button
        v-if="canCreateRoom"
        @click="$emit('create-room')"
        class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เริ่มแชทใหม่</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="p-4 text-center text-gray-500">
        กำลังโหลด...
      </div>

      <div v-else-if="rooms.length === 0" class="p-4 text-center text-gray-500">
        ไม่มีห้องแชท
      </div>

      <div v-else class="divide-y">
        <button
          v-for="room in rooms"
          :key="room.id"
          @click="$emit('select-room', room)"
          :class="[
            'w-full p-4 text-left hover:bg-gray-50 transition-colors',
            activeRoom?.id === room.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
          ]"
        >
          <div class="flex items-start space-x-3">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  v-if="getOtherUser(room)?.avatar_url"
                  :src="getOtherUser(room)?.avatar_url"
                  :alt="getOtherUser(room)?.first_name"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-gray-500 text-lg font-semibold">
                  {{ getOtherUser(room)?.first_name?.charAt(0) }}
                </span>
              </div>
            </div>

            <!-- Room Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-900 truncate">
                  {{ getOtherUser(room)?.first_name }} {{ getOtherUser(room)?.last_name }}
                </h3>
                <span
                  v-if="room.unread_count && room.unread_count > 0"
                  class="ml-2 flex-shrink-0 bg-green-600 text-white text-xs font-semibold rounded-full px-2 py-1 min-w-[20px] text-center"
                >
                  {{ room.unread_count > 99 ? '99+' : room.unread_count }}
                </span>
              </div>
              <p class="text-sm text-gray-600 truncate">
                {{ room.course?.title }}
              </p>
              <p
                v-if="room.last_message_at"
                class="text-xs text-gray-400 mt-1"
              >
                {{ formatDate(room.last_message_at) }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatRoom } from '#shared/types/chat.types'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

interface Props {
  rooms: ChatRoom[]
  activeRoom?: ChatRoom | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'select-room': [room: ChatRoom]
  'create-room': []
}>()

const { user, hasAnyRole } = useAuth()

// Check if user can create chat rooms (only students and parents)
const canCreateRoom = computed(() => {
  return hasAnyRole(['student', 'parent'])
})

const getOtherUser = (room: ChatRoom) => {
  if (!user.value) return null
  // If current user is student, return tutor; otherwise return student
  return room.student_id === user.value.id ? room.tutor : room.student
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: th
    })
  } catch {
    return dateString
  }
}
</script>


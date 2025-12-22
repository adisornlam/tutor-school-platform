<template>
  <div class="w-80 border-l bg-white flex-shrink-0 overflow-y-auto flex flex-col h-full">
    <div v-if="!room" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-sm">เลือกห้องแชทเพื่อดูข้อมูล</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <!-- User Info Section -->
      <div class="p-4 border-b">
        <div class="flex flex-col items-center mb-4">
          <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
            <img
              v-if="otherUser?.avatar_url"
              :src="otherUser.avatar_url"
              :alt="otherUser.first_name"
              class="w-full h-full object-cover"
            >
            <span v-else class="text-gray-500 text-2xl font-semibold">
              {{ otherUser?.first_name?.charAt(0) }}
            </span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            {{ otherUser?.first_name }} {{ otherUser?.last_name }}
          </h3>
          <button
            @click="showEditNameModal = true"
            class="text-gray-500 hover:text-gray-700"
            title="แก้ไขชื่อ"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-semibold text-gray-700">แท็ก</h4>
          <button
            @click="showAddTagModal = true"
            class="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>ใส่แท็ก</span>
          </button>
        </div>
        <div v-if="tags.length === 0" class="text-sm text-gray-500 text-center py-4">
          ยังไม่มีแท็ก
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags"
            :key="tag.id"
            :style="{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }"
            class="px-3 py-1 rounded-full text-sm font-medium border"
          >
            {{ tag.tag_name }}
          </span>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-semibold text-gray-700">
            โน้ต <span class="text-gray-500 font-normal">({{ notes.length }})</span>
          </h4>
          <button
            @click="showAddNoteModal = true"
            class="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>เพิ่มโน้ต</span>
          </button>
        </div>
        <div v-if="notes.length === 0" class="text-sm text-gray-500 text-center py-4">
          ยังไม่มีโน้ต
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="note in notes"
            :key="note.id"
            class="bg-gray-50 rounded-lg p-3"
          >
            <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ note.content }}</p>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>
                สร้างโดย {{ note.creator?.first_name }} {{ note.creator?.last_name }}
                <span v-if="note.updated_by && note.updated_by !== note.created_by">
                  (แก้ไขล่าสุดโดย {{ note.updater?.first_name }} {{ note.updater?.last_name }})
                </span>
              </span>
              <button
                @click="editNote(note)"
                class="text-green-600 hover:text-green-700"
              >
                แก้ไข
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Tag Modal -->
    <AddTagModal
      v-if="room"
      :show="showAddTagModal"
      :room-id="room.id"
      @close="showAddTagModal = false"
      @tag-added="handleTagAdded"
    />

    <!-- Add Note Modal -->
    <AddNoteModal
      v-if="room"
      :show="showAddNoteModal"
      :room-id="room.id"
      @close="showAddNoteModal = false"
      @note-added="handleNoteAdded"
    />

    <!-- Edit Note Modal -->
    <EditNoteModal
      v-if="editingNote"
      :note="editingNote"
      @close="editingNote = null"
      @note-updated="handleNoteUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import type { ChatRoom, ChatRoomTag, ChatRoomNote } from '#shared/types/chat.types'
import AddTagModal from './AddTagModal.vue'
import AddNoteModal from './AddNoteModal.vue'
import EditNoteModal from './EditNoteModal.vue'

interface Props {
  room: ChatRoom | null
}

const props = defineProps<Props>()

const { user } = useAuth()
const config = useRuntimeConfig()
const { accessToken } = useAuth()

const tags = ref<ChatRoomTag[]>([])
const notes = ref<ChatRoomNote[]>([])
const showAddTagModal = ref(false)
const showAddNoteModal = ref(false)
const showEditNameModal = ref(false)
const editingNote = ref<ChatRoomNote | null>(null)

const otherUser = computed(() => {
  if (!props.room || !user.value) return null
  return props.room.student_id === user.value.id ? props.room.tutor : props.room.student
})

// Load tags and notes when room changes
watch(() => props.room?.id, async (roomId) => {
  if (roomId) {
    await loadTags()
    await loadNotes()
  } else {
    tags.value = []
    notes.value = []
  }
}, { immediate: true })

const loadTags = async () => {
  if (!props.room?.id) return
  
  try {
    const response = await $fetch<{ success: boolean; data: ChatRoomTag[] }>(
      `${config.public.apiBase}/chat/rooms/${props.room.id}/tags`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    
    if (response.success) {
      tags.value = response.data
    }
  } catch (error) {
    console.error('[ChatRoomSidebar] Error loading tags:', error)
  }
}

const loadNotes = async () => {
  if (!props.room?.id) return
  
  try {
    const response = await $fetch<{ success: boolean; data: ChatRoomNote[] }>(
      `${config.public.apiBase}/chat/rooms/${props.room.id}/notes`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    
    if (response.success) {
      notes.value = response.data
    }
  } catch (error) {
    console.error('[ChatRoomSidebar] Error loading notes:', error)
  }
}

const handleTagAdded = () => {
  loadTags()
}

const handleNoteAdded = () => {
  loadNotes()
}

const handleNoteUpdated = () => {
  editingNote.value = null
  loadNotes()
}

const editNote = (note: ChatRoomNote) => {
  editingNote.value = note
}
</script>


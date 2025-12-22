<template>
  <div
    v-if="note"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">แก้ไขโน้ต</h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหาโน้ต</label>
          <textarea
            v-model="content"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            @click="handleUpdate"
            :disabled="!content.trim() || loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatRoomNote } from '#shared/types/chat.types'

const props = defineProps<{
  note: ChatRoomNote | null
}>()

const emit = defineEmits<{
  close: []
  'note-updated': []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const content = ref('')
const loading = ref(false)

watch(() => props.note, (newNote) => {
  if (newNote) {
    content.value = newNote.content
  }
}, { immediate: true })

const handleUpdate = async () => {
  if (!props.note || !content.value.trim() || loading.value) return

  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `${config.public.apiBase}/chat/rooms/${props.note.room_id}/notes/${props.note.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: {
          content: content.value.trim()
        }
      }
    )

    if (response.success) {
      emit('note-updated')
      emit('close')
    }
  } catch (error: any) {
    console.error('[EditNoteModal] Error updating note:', error)
    alert(error.data?.message || 'ไม่สามารถแก้ไขโน้ตได้')
  } finally {
    loading.value = false
  }
}
</script>


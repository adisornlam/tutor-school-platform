<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">เพิ่มโน้ต</h3>
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
            placeholder="บันทึกข้อมูลผู้ใช้ บันทึกบทสนทนา หรือเพิ่มข้อความสำหรับส่งต่องาน..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">ผู้ใช้จะไม่เห็นเนื้อหาในโน้ตนี้</p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            @click="handleAdd"
            :disabled="!content.trim() || loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'กำลังเพิ่ม...' : 'เพิ่ม' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  roomId: number
}>()

const emit = defineEmits<{
  close: []
  'note-added': []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const content = ref('')
const loading = ref(false)

const handleAdd = async () => {
  if (!content.value.trim() || loading.value) return

  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `${config.public.apiBase}/chat/rooms/${props.roomId}/notes`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: {
          content: content.value.trim()
        }
      }
    )

    if (response.success) {
      content.value = ''
      emit('note-added')
      emit('close')
    }
  } catch (error: any) {
    console.error('[AddNoteModal] Error adding note:', error)
    alert(error.data?.message || 'ไม่สามารถเพิ่มโน้ตได้')
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    content.value = ''
  }
})
</script>


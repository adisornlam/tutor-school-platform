<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">เพิ่มแท็ก</h3>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อแท็ก</label>
          <input
            v-model="tagName"
            type="text"
            placeholder="เช่น VIP, สำคัญ, ติดตาม"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @keydown.enter.prevent="handleAdd"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สี</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in colors"
              :key="color.value"
              @click="selectedColor = color.value"
              :class="[
                'w-10 h-10 rounded-full border-2 transition-all',
                selectedColor === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
              ]"
              :style="{ backgroundColor: color.value }"
            >
            </button>
          </div>
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
            :disabled="!tagName.trim() || loading"
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
  'tag-added': []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const tagName = ref('')
const selectedColor = ref('#3B82F6')
const loading = ref(false)

const colors = [
  { value: '#3B82F6', name: 'Blue' },
  { value: '#10B981', name: 'Green' },
  { value: '#F59E0B', name: 'Orange' },
  { value: '#EF4444', name: 'Red' },
  { value: '#8B5CF6', name: 'Purple' },
  { value: '#EC4899', name: 'Pink' },
  { value: '#06B6D4', name: 'Cyan' },
  { value: '#84CC16', name: 'Lime' }
]

const handleAdd = async () => {
  if (!tagName.value.trim() || loading.value) return

  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `${config.public.apiBase}/chat/rooms/${props.roomId}/tags`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: {
          tag_name: tagName.value.trim(),
          color: selectedColor.value
        }
      }
    )

    if (response.success) {
      tagName.value = ''
      selectedColor.value = '#3B82F6'
      emit('tag-added')
      emit('close')
    }
  } catch (error: any) {
    console.error('[AddTagModal] Error adding tag:', error)
    alert(error.data?.message || 'ไม่สามารถเพิ่มแท็กได้')
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    tagName.value = ''
    selectedColor.value = '#3B82F6'
  }
})
</script>


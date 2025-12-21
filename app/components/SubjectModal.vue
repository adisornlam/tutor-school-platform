<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ subject ? 'แก้ไขวิชา' : 'เพิ่มวิชา' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รหัส <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.code"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อวิชา <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อย่อ
            </label>
            <input
              v-model="form.short_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ไอคอน (Icon)
            </label>
            <input
              v-model="form.icon"
              type="text"
              placeholder="เช่น: book, calculator"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">กำลังบันทึก...</span>
            <span v-else>บันทึก</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Subject {
  id: number
  code: string
  name: string
  short_name?: string | null
  description?: string | null
  icon?: string | null
}

interface Props {
  show: boolean
  subject?: Subject | null
}

const props = withDefaults(defineProps<Props>(), {
  subject: null
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const form = reactive({
  code: '',
  name: '',
  short_name: '',
  description: '',
  icon: ''
})

const loading = ref(false)
const error = ref('')

watch(() => props.subject, (subject) => {
  if (subject) {
    form.code = subject.code
    form.name = subject.name
    form.short_name = subject.short_name || ''
    form.description = subject.description || ''
    form.icon = subject.icon || ''
  } else {
    form.code = ''
    form.name = ''
    form.short_name = ''
    form.description = ''
    form.icon = ''
  }
  error.value = ''
}, { immediate: true })

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const body: any = {
      code: form.code,
      name: form.name,
      short_name: form.short_name || null,
      description: form.description || null,
      icon: form.icon || null
    }

    if (props.subject) {
      await $fetch(`${config.public.apiBase}/admin/settings/subjects/${props.subject.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/settings/subjects`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving subject:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ mode === 'view' ? 'ดูเทมเพลต' : 'แก้ไขเทมเพลต' }}
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

      <div v-if="mode === 'view'">
        <!-- View Mode -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อเทมเพลต</label>
            <div class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">{{ template.name }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">รหัส</label>
            <div class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">{{ template.code }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">หัวเรื่อง</label>
            <div class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">{{ template.subject }}</div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตัวแปรที่ใช้ได้</label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="variable in template.variables"
                :key="variable"
                class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded"
              >
                {{ formatVariable(variable) }}
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เนื้อหา (HTML)</label>
            <div class="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[200px] overflow-auto">
              <div v-html="template.body"></div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตัวอย่างการแสดงผล</label>
            <div class="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg min-h-[200px]">
              <div v-html="previewBody"></div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-6 mt-6 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ปิด
          </button>
          <button
            type="button"
            @click="switchToEdit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            แก้ไข
          </button>
        </div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Edit Mode -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ชื่อเทมเพลต <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">รหัส</label>
          <input
            :value="template.code"
            type="text"
            disabled
            class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            หัวเรื่อง <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.subject"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            เนื้อหา (HTML) <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.body"
            rows="10"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
            :placeholder="placeholderExample"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">ใช้ตัวแปรในรูปแบบ &#123;&#123;variable_name&#125;&#125;</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ตัวอย่างการแสดงผล</label>
          <div class="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg min-h-[200px]">
            <div v-html="previewBody"></div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="switchToView"
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
interface EmailTemplate {
  id: number
  code: string
  name: string
  subject: string
  body: string
  variables: string[]
}

interface Props {
  show: boolean
  template: EmailTemplate
  mode?: 'view' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view'
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const mode = ref<'view' | 'edit'>(props.mode)

const switchToEdit = () => {
  mode.value = 'edit'
}

const switchToView = () => {
  mode.value = 'view'
}

const form = reactive({
  name: '',
  subject: '',
  body: ''
})

const loading = ref(false)
const error = ref('')

const placeholderExample = '<p>สวัสดี {{first_name}},</p>'

const formatVariable = (variable: string) => {
  return `{{${variable}}}`
}

// Initialize form when template prop changes
watch(() => props.template, (template) => {
  if (template) {
    form.name = template.name
    form.subject = template.subject
    form.body = template.body
  }
  error.value = ''
  mode.value = props.mode
}, { immediate: true })

// Watch mode prop changes
watch(() => props.mode, (newMode) => {
  mode.value = newMode
})

// Preview body with sample data
const previewBody = computed(() => {
  let preview = form.body || props.template.body
  
  // Replace variables with sample data
  props.template.variables.forEach(variable => {
    const sampleData: Record<string, string> = {
      first_name: 'สมชาย',
      last_name: 'ใจดี',
      email: 'example@email.com',
      student_name: 'สมชาย ใจดี',
      course_name: 'คณิตศาสตร์ ม.3',
      enrollment_date: '1 มกราคม 2567',
      reset_link: 'https://example.com/reset-password'
    }
    
    const regex = new RegExp(`{{\\s*${variable}\\s*}}`, 'g')
    preview = preview.replace(regex, sampleData[variable] || `[${variable}]`)
  })
  
  return preview
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await $fetch(`${config.public.apiBase}/admin/settings/email/templates/${props.template.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        name: form.name,
        subject: form.subject,
        body: form.body
      }
    })

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('Error saving template:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>


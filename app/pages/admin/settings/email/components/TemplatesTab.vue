<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-2xl font-bold mb-2">เทมเพลตอีเมล</h2>
      <p class="text-gray-600">จัดการเทมเพลตอีเมลสำหรับการส่งอีเมลต่างๆ</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p class="mt-2 text-gray-600">กำลังโหลด...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded m-6">
      {{ error }}
    </div>

    <!-- Templates Table -->
    <div v-else>
      <div v-if="templates.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบเทมเพลต
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หัวเรื่อง</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตัวแปร</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="template in templates" :key="template.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ template.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ template.code }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 max-w-xs truncate">{{ template.subject }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="variable in template.variables"
                  :key="variable"
                  class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                >
                  {{ variable }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="viewTemplate(template)"
                  class="text-blue-600 hover:text-blue-900"
                  title="ดู"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click.stop="editTemplate(template)"
                  class="text-green-600 hover:text-green-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Template Modal -->
    <TemplateModal
      v-if="showModal && selectedTemplate"
      :show="showModal"
      :template="selectedTemplate"
      :mode="modalMode"
      @close="closeModal"
      @saved="handleTemplateSaved"
    />
  </div>
</template>

<script setup lang="ts">
import TemplateModal from './TemplateModal.vue'

const config = useRuntimeConfig()
const { accessToken } = useAuth()

interface EmailTemplate {
  id: number
  code: string
  name: string
  subject: string
  body: string
  variables: string[]
  created_at?: string
  updated_at?: string
}

const templates = ref<EmailTemplate[]>([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const selectedTemplate = ref<EmailTemplate | null>(null)
const modalMode = ref<'view' | 'edit'>('view')

const loadTemplates = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: EmailTemplate[]
    }>(`${config.public.apiBase}/admin/settings/email/templates`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      templates.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading templates:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const viewTemplate = (template: EmailTemplate) => {
  selectedTemplate.value = { ...template }
  modalMode.value = 'view'
  showModal.value = true
}

const editTemplate = (template: EmailTemplate) => {
  selectedTemplate.value = { ...template }
  modalMode.value = 'edit'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTemplate.value = null
}

const handleTemplateSaved = () => {
  closeModal()
  loadTemplates()
}

onMounted(() => {
  loadTemplates()
})
</script>


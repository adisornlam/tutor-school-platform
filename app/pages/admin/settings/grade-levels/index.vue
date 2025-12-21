<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการระดับชั้น</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มระดับชั้น</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาด้วยชื่อ, รหัส"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
          <select
            v-model="filters.level_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadGradeLevels"
          >
            <option value="">ทั้งหมด</option>
            <option value="elementary">ประถมศึกษา</option>
            <option value="secondary">มัธยมศึกษา</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Grade Levels Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="gradeLevels.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบระดับชั้น
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="gradeLevel in gradeLevels" :key="gradeLevel.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ gradeLevel.code }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ gradeLevel.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded" :class="gradeLevel.level_type === 'elementary' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                {{ gradeLevel.level_type === 'elementary' ? 'ประถมศึกษา' : 'มัธยมศึกษา' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ gradeLevel.display_order || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="editGradeLevel(gradeLevel)"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click.stop="confirmDelete(gradeLevel)"
                  class="text-red-600 hover:text-red-900"
                  title="ลบ"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <GradeLevelModal
      v-if="showCreateModal || editingGradeLevel"
      :show="showCreateModal || !!editingGradeLevel"
      :grade-level="editingGradeLevel"
      @close="closeModal"
      @saved="handleGradeLevelSaved"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

interface GradeLevel {
  id: number
  code: string
  name: string
  level_type: 'elementary' | 'secondary'
  grade_number: number
  display_order: number
  created_at: string
}

const gradeLevels = ref<GradeLevel[]>([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const editingGradeLevel = ref<GradeLevel | null>(null)

const filters = reactive({
  search: '',
  level_type: ''
})

let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadGradeLevels()
  }, 500)
}

const loadGradeLevels = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.level_type) params.append('level_type', filters.level_type)

    const response = await $fetch<{
      success: boolean
      data: GradeLevel[]
    }>(`${config.public.apiBase}/admin/settings/grade-levels?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      gradeLevels.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading grade levels:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const editGradeLevel = (gradeLevel: GradeLevel) => {
  editingGradeLevel.value = { ...gradeLevel }
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingGradeLevel.value = null
}

const handleGradeLevelSaved = () => {
  closeModal()
  loadGradeLevels()
}

const confirmDelete = async (gradeLevel: GradeLevel) => {
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: 'ยืนยันการลบ',
    message: `คุณแน่ใจหรือไม่ว่าต้องการลบระดับชั้น ${gradeLevel.name}?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await $fetch(`${config.public.apiBase}/admin/settings/grade-levels/${gradeLevel.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    await loadGradeLevels()
  } catch (err: any) {
    console.error('Error deleting grade level:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบระดับชั้น')
  }
}

onMounted(() => {
  loadGradeLevels()
})
</script>


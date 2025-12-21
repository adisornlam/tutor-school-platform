<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการบทบาทผู้ใช้</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มบทบาท</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
        <input
          v-model="filters.search"
          type="text"
          placeholder="ค้นหาด้วยชื่อบทบาท, คำอธิบาย"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          @input="debouncedSearch"
        >
      </div>
    </div>

    <!-- Roles Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="roles.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบบทบาท
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อบทบาท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คำอธิบาย</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ role.name }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-500 max-w-xs truncate">{{ role.description || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(role.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="editRole(role)"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                  :disabled="isSystemRole(role.name)"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="{ 'opacity-50 cursor-not-allowed': isSystemRole(role.name) }">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="!isSystemRole(role.name)"
                  @click.stop="confirmDelete(role)"
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
    <RoleModal
      v-if="showCreateModal || editingRole"
      :show="showCreateModal || !!editingRole"
      :role="editingRole"
      @close="closeModal"
      @saved="handleRoleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

interface Role {
  id: number
  name: string
  description?: string | null
  created_at: string
}

const roles = ref<Role[]>([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const editingRole = ref<Role | null>(null)

const filters = reactive({
  search: ''
})

const systemRoles = ['system_admin', 'owner', 'admin', 'branch_admin', 'tutor', 'parent', 'student']

const isSystemRole = (roleName: string) => {
  return systemRoles.includes(roleName)
}

let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadRoles()
  }, 500)
}

const loadRoles = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)

    const response = await $fetch<{
      success: boolean
      data: Role[]
    }>(`${config.public.apiBase}/admin/settings/roles?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      roles.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading roles:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const editRole = (role: Role) => {
  if (isSystemRole(role.name)) return
  editingRole.value = { ...role }
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingRole.value = null
}

const handleRoleSaved = () => {
  closeModal()
  loadRoles()
}

const confirmDelete = async (role: Role) => {
  if (isSystemRole(role.name)) return
  
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: 'ยืนยันการลบ',
    message: `คุณแน่ใจหรือไม่ว่าต้องการลบบทบาท ${role.name}?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await $fetch(`${config.public.apiBase}/admin/settings/roles/${role.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    await loadRoles()
  } catch (err: any) {
    console.error('Error deleting role:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบบทบาท')
  }
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

onMounted(() => {
  loadRoles()
})
</script>


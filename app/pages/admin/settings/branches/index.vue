<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการสาขา</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มสาขา</span>
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
            placeholder="ค้นหาด้วยชื่อสาขา, รหัสสาขา, ที่อยู่"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadBranches"
          >
            <option value="">ทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ปิดใช้งาน</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Branches Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="branches.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบสาขา
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สาขา</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ที่อยู่</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ติดต่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="branch in branches" :key="branch.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ branch.name }}</div>
                <div class="text-sm text-gray-500">รหัส: {{ branch.code }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ branch.address || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                <div v-if="branch.phone">{{ branch.phone }}</div>
                <div v-if="branch.email" class="text-gray-500">{{ branch.email }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="getStatusBadgeClass(branch.status)"
              >
                {{ getStatusName(branch.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(branch.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="editBranch(branch)"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="branch.status === 'active'"
                  @click.stop="confirmUpdateStatus(branch.id, 'inactive', 'ปิดใช้งาน')"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="ปิดใช้งาน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </button>
                <button
                  v-else
                  @click.stop="confirmUpdateStatus(branch.id, 'active', 'เปิดใช้งาน')"
                  class="text-green-600 hover:text-green-900"
                  title="เปิดใช้งาน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click.stop="confirmDelete(branch)"
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
    <BranchModal
      v-if="showCreateModal || editingBranch"
      :show="showCreateModal || !!editingBranch"
      :branch="editingBranch"
      @close="closeModal"
      @saved="handleBranchSaved"
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

interface Branch {
  id: number
  name: string
  code: string
  address?: string | null
  phone?: string | null
  email?: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

const branches = ref<Branch[]>([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const editingBranch = ref<Branch | null>(null)

const filters = reactive({
  search: '',
  status: ''
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadBranches()
  }, 500)
}

const loadBranches = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)

    const response = await $fetch<{
      success: boolean
      data: Branch[]
    }>(`${config.public.apiBase}/admin/settings/branches?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      branches.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading branches:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const editBranch = (branch: Branch) => {
  editingBranch.value = { ...branch }
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingBranch.value = null
}

const handleBranchSaved = () => {
  closeModal()
  loadBranches()
}

const confirmUpdateStatus = async (branchId: number, newStatus: string, actionName: string) => {
  const branch = branches.value.find(b => b.id === branchId)
  if (!branch) return
  
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: `ยืนยัน${actionName}`,
    message: `คุณแน่ใจหรือไม่ว่าต้องการ${actionName}สาขา ${branch.name}?`,
    confirmText: actionName,
    cancelText: 'ยกเลิก',
    type: newStatus === 'active' ? 'info' : 'warning'
  })
  
  if (!confirmed) return
  
  try {
    await $fetch(`${config.public.apiBase}/admin/settings/branches/${branchId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: { status: newStatus }
    })
    await loadBranches()
  } catch (err: any) {
    console.error('Error updating status:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  }
}

const confirmDelete = async (branch: Branch) => {
  const { confirm } = useConfirm()
  const confirmed = await confirm({
    title: 'ยืนยันการลบ',
    message: `คุณแน่ใจหรือไม่ว่าต้องการลบสาขา ${branch.name}?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await $fetch(`${config.public.apiBase}/admin/settings/branches/${branch.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    await loadBranches()
  } catch (err: any) {
    console.error('Error deleting branch:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบสาขา')
  }
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    active: 'ใช้งาน',
    inactive: 'ปิดใช้งาน'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

onMounted(() => {
  loadBranches()
})
</script>


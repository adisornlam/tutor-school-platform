<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการผู้ใช้งาน</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มผู้ใช้งาน</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ค้นหาด้วย username, email, ชื่อ"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">บทบาท</label>
          <select
            v-model="filters.role"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadUsers"
          >
            <option value="">ทั้งหมด</option>
            <option value="system_admin">System Admin</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin กลาง</option>
            <option value="branch_admin">Branch Admin</option>
            <option value="tutor">Tutor</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadUsers"
          >
            <option value="">ทั้งหมด</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="users.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบผู้ใช้งาน
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ใช้งาน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่สร้าง</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ user.first_name }} {{ user.last_name }}
                </div>
                <div class="text-sm text-gray-500">{{ user.username }}</div>
                <div v-if="user.email" class="text-xs text-gray-400">{{ user.email }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="role in user.roles"
                  :key="role"
                  class="px-2 py-1 text-xs font-medium rounded"
                  :class="getRoleBadgeClass(role)"
                >
                  {{ getRoleDisplayName(role) }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="getStatusBadgeClass(user.status)"
              >
                {{ getStatusDisplayName(user.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="user.status === 'active'"
                  @click="updateStatus(user.id, 'inactive')"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="ปิดใช้งาน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </button>
                <button
                  v-else
                  @click="updateStatus(user.id, 'active')"
                  class="text-green-600 hover:text-green-900"
                  title="เปิดใช้งาน"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(user)"
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

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          แสดง {{ (pagination.page - 1) * pagination.limit + 1 }} ถึง 
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
          จาก {{ pagination.total }} รายการ
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            ก่อนหน้า
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <UserModal
      v-if="showCreateModal || editingUser"
      :show="showCreateModal || !!editingUser"
      :user="editingUser"
      @close="closeModal"
      @saved="handleUserSaved"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="userToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="userToDelete = null"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-600 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน 
          <strong>{{ userToDelete.first_name }} {{ userToDelete.last_name }}</strong>?
          <br>
          <span class="text-sm text-red-600">การกระทำนี้ไม่สามารถยกเลิกได้</span>
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="userToDelete = null"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            @click="deleteUser"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
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

interface User {
  id: number
  username: string
  email: string | null
  first_name: string
  last_name: string
  phone?: string | null
  status: string
  roles: string[]
  created_at: string
  updated_at: string
}

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const editingUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)

const filters = reactive({
  search: '',
  role: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.page = 1
    loadUsers()
  }, 500)
}

const loadUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString()
    })

    if (filters.search) params.append('search', filters.search)
    if (filters.role) params.append('role', filters.role)
    if (filters.status) params.append('status', filters.status)

    const response = await $fetch<{
      success: boolean
      data: User[]
      pagination: typeof pagination
    }>(`${config.public.apiBase}/admin/users?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      users.value = response.data
      Object.assign(pagination, response.pagination)
    }
  } catch (err: any) {
    console.error('Error loading users:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const changePage = (page: number) => {
  pagination.page = page
  loadUsers()
}

const editUser = (user: User) => {
  editingUser.value = { ...user }
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
}

const handleUserSaved = () => {
  closeModal()
  loadUsers()
}

const updateStatus = async (userId: number, status: string) => {
  try {
    await $fetch(`${config.public.apiBase}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: { status }
    })
    await loadUsers()
  } catch (err: any) {
    console.error('Error updating status:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')
  }
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  try {
    await $fetch(`${config.public.apiBase}/admin/users/${userToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    userToDelete.value = null
    await loadUsers()
  } catch (err: any) {
    console.error('Error deleting user:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน')
  }
}

const getRoleDisplayName = (role: string) => {
  const roleNames: Record<string, string> = {
    system_admin: 'System Admin',
    owner: 'Owner',
    admin: 'Admin กลาง',
    branch_admin: 'Branch Admin',
    tutor: 'อาจารย์',
    parent: 'ผู้ปกครอง',
    student: 'นักเรียน'
  }
  return roleNames[role] || role
}

const getRoleBadgeClass = (role: string) => {
  const classes: Record<string, string> = {
    system_admin: 'bg-purple-100 text-purple-800',
    owner: 'bg-indigo-100 text-indigo-800',
    admin: 'bg-teal-100 text-teal-800',
    branch_admin: 'bg-blue-100 text-blue-800',
    tutor: 'bg-green-100 text-green-800',
    parent: 'bg-yellow-100 text-yellow-800',
    student: 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getStatusDisplayName = (status: string) => {
  const statusNames: Record<string, string> = {
    active: 'ใช้งาน',
    inactive: 'ปิดใช้งาน',
    suspended: 'ระงับ'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

onMounted(() => {
  loadUsers()
})
</script>


<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold">แก้ไขผู้เรียน</h1>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <div v-else-if="student" class="space-y-6">
      <!-- Student Basic Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-6">ข้อมูลผู้เรียน</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Username <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.username"
                type="text"
                required
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 cursor-not-allowed"
              >
              <p class="mt-1 text-xs text-gray-500">ไม่สามารถแก้ไข Username ได้</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.first_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                นามสกุล <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.last_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                สถานะ <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.status"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="active">ใช้งาน</option>
                <option value="inactive">ปิดใช้งาน</option>
                <option value="suspended">ระงับ</option>
              </select>
            </div>
          </div>

          <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ submitError }}
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$router.back()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">กำลังบันทึก...</span>
              <span v-else>บันทึก</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Parents Management -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">ผู้ปกครอง</h2>
          <button
            @click="showAddParentModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>เพิ่มผู้ปกครอง</span>
          </button>
        </div>

        <div v-if="parents && parents.length > 0" class="space-y-4">
          <div
            v-for="parent in parents"
            :key="parent.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ parent.first_name }} {{ parent.last_name }}
                  </h3>
                  <span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    {{ getRelationshipName(parent.relationship) }}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">Email:</span>
                    <span class="ml-2 text-gray-900">{{ parent.email || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">เบอร์โทรศัพท์:</span>
                    <span class="ml-2 text-gray-900">{{ parent.phone || '-' }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editParent(parent)"
                  class="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="แก้ไขผู้ปกครอง"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="mt-2">ไม่มีข้อมูลผู้ปกครอง</p>
        </div>
      </div>
    </div>

    <!-- Add Parent Modal -->
    <div
      v-if="showAddParentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddParentModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">เพิ่มผู้ปกครอง</h3>
        <form @submit.prevent="handleAddParent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ค้นหาผู้ปกครอง (Username หรือ Email)
            </label>
            <input
              v-model="parentSearch"
              type="text"
              placeholder="กรอก username หรือ email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              @input="searchParent"
            >
            <div v-if="parentSearchResults.length > 0" class="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              <button
                v-for="user in parentSearchResults"
                :key="user.id"
                type="button"
                @click="selectParent(user)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              >
                <div class="font-medium">{{ user.first_name }} {{ user.last_name }}</div>
                <div class="text-sm text-gray-500">{{ user.username }} - {{ user.email || '-' }}</div>
              </button>
            </div>
          </div>
          <div v-if="selectedParentToAdd">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ความสัมพันธ์ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="parentRelationship"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="father">บิดา</option>
              <option value="mother">มารดา</option>
              <option value="guardian">ผู้ปกครอง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
          <div v-if="addParentError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ addParentError }}
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeAddParentModal"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="!selectedParentToAdd || addingParent"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="addingParent">กำลังเพิ่ม...</span>
              <span v-else>เพิ่ม</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Parent Modal -->
    <div
      v-if="parentToEdit"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="parentToEdit = null"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">แก้ไขผู้ปกครอง</h3>
        <form @submit.prevent="handleEditParent" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ <span class="text-red-500">*</span>
            </label>
            <input
              v-model="editParentForm.first_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              นามสกุล <span class="text-red-500">*</span>
            </label>
            <input
              v-model="editParentForm.last_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="editParentForm.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              v-model="editParentForm.phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ความสัมพันธ์ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="editParentForm.relationship"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="father">บิดา</option>
              <option value="mother">มารดา</option>
              <option value="guardian">ผู้ปกครอง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
          <div v-if="editParentError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ editParentError }}
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="parentToEdit = null"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="editingParent"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="editingParent">กำลังบันทึก...</span>
              <span v-else>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { accessToken } = useAuth()

const studentId = parseInt(route.params.id as string)
const loading = ref(true)
const error = ref('')
const student = ref<any>(null)
const parents = ref<any[]>([])
const submitting = ref(false)
const submitError = ref('')

// Parent management
const showAddParentModal = ref(false)
const parentSearch = ref('')
const parentSearchResults = ref<any[]>([])
const selectedParentToAdd = ref<any>(null)
const parentRelationship = ref('guardian')
const addingParent = ref(false)
const addParentError = ref('')
const parentToEdit = ref<any>(null)
const editingParent = ref(false)
const editParentError = ref('')
const editParentForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  relationship: 'guardian'
})

const form = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  status: 'active'
})

const loadStudent = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: any
    }>(`${config.public.apiBase}/admin/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      student.value = response.data.student
      parents.value = response.data.parents || []
      
      // Populate form
      form.username = student.value.username
      form.email = student.value.email || ''
      form.first_name = student.value.first_name
      form.last_name = student.value.last_name
      form.phone = student.value.phone || ''
      form.status = student.value.status
    }
  } catch (err: any) {
    console.error('Error loading student:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  submitError.value = ''

  try {
    await $fetch(`${config.public.apiBase}/admin/users/${studentId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        email: form.email || null,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || null
      }
    })

    // Update status separately
    await $fetch(`${config.public.apiBase}/admin/users/${studentId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        status: form.status
      }
    })

    // Redirect back to detail page
    router.push(`/admin/students/${studentId}`)
  } catch (err: any) {
    console.error('Error updating student:', err)
    submitError.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    submitting.value = false
  }
}

const searchParent = async () => {
  if (!parentSearch.value || parentSearch.value.length < 2) {
    parentSearchResults.value = []
    return
  }

  try {
    // TODO: Create API endpoint for searching users by username/email
    // For now, we'll use the existing users API
    const response = await $fetch<{
      success: boolean
      data: any[]
    }>(`${config.public.apiBase}/admin/users?search=${encodeURIComponent(parentSearch.value)}&role=parent&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      // Filter out parents that are already linked
      const existingParentIds = parents.value.map(p => p.id)
      parentSearchResults.value = response.data.filter(user => 
        !existingParentIds.includes(user.id)
      )
    }
  } catch (err) {
    console.error('Error searching parent:', err)
    parentSearchResults.value = []
  }
}

const selectParent = (user: any) => {
  selectedParentToAdd.value = user
  parentSearch.value = `${user.first_name} ${user.last_name} (${user.username})`
  parentSearchResults.value = []
  addParentError.value = ''
}

const closeAddParentModal = () => {
  showAddParentModal.value = false
  selectedParentToAdd.value = null
  parentSearch.value = ''
  parentRelationship.value = 'guardian'
  addParentError.value = ''
  parentSearchResults.value = []
}

const handleAddParent = async () => {
  if (!selectedParentToAdd.value) return

  addingParent.value = true
  addParentError.value = ''
  try {
    // TODO: Create API endpoint for adding parent-student relationship
    // For now, we'll need to create this endpoint
    await $fetch(`${config.public.apiBase}/admin/students/${studentId}/parents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        parent_id: selectedParentToAdd.value.id,
        relationship: parentRelationship.value
      }
    })

    // Reload student data
    await loadStudent()
    closeAddParentModal()
  } catch (err: any) {
    console.error('Error adding parent:', err)
    addParentError.value = err.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ปกครอง'
  } finally {
    addingParent.value = false
  }
}


const editParent = (parent: any) => {
  parentToEdit.value = parent
  editParentForm.first_name = parent.first_name
  editParentForm.last_name = parent.last_name
  editParentForm.email = parent.email || ''
  editParentForm.phone = parent.phone || ''
  editParentForm.relationship = parent.relationship || 'guardian'
  editParentError.value = ''
}

const handleEditParent = async () => {
  if (!parentToEdit.value) return

  editingParent.value = true
  editParentError.value = ''

  try {
    // Update parent user info
    await $fetch(`${config.public.apiBase}/admin/users/${parentToEdit.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        email: editParentForm.email || null,
        first_name: editParentForm.first_name,
        last_name: editParentForm.last_name,
        phone: editParentForm.phone || null
      }
    })

    // Update relationship if changed
    if (editParentForm.relationship !== parentToEdit.value.relationship) {
      await $fetch(`${config.public.apiBase}/admin/students/${studentId}/parents/${parentToEdit.value.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body: {
          relationship: editParentForm.relationship
        }
      })
    }

    // Reload student data
    await loadStudent()
    parentToEdit.value = null
  } catch (err: any) {
    console.error('Error editing parent:', err)
    editParentError.value = err.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ปกครอง'
  } finally {
    editingParent.value = false
  }
}

const getRelationshipName = (relationship: string) => {
  const relationshipNames: Record<string, string> = {
    father: 'บิดา',
    mother: 'มารดา',
    guardian: 'ผู้ปกครอง',
    other: 'อื่นๆ'
  }
  return relationshipNames[relationship] || relationship
}

onMounted(() => {
  loadStudent()
})
</script>


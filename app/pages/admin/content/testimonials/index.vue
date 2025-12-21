<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการรีวิว</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>เพิ่มรีวิว</span>
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
            placeholder="ค้นหาด้วยชื่อ, บทบาท, รีวิว"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @input="debouncedSearch"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @change="loadTestimonials"
          >
            <option value="">ทั้งหมด</option>
            <option value="pending">รออนุมัติ</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Testimonials Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else-if="testimonials.length === 0" class="p-8 text-center text-gray-500">
        ไม่พบรีวิว
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คะแนน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รีวิว</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="testimonial in testimonials" :key="testimonial.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div v-if="testimonial.avatar_url" class="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                  <img :src="testimonial.avatar_url" :alt="testimonial.name" class="h-full w-full object-cover">
                </div>
                <div v-else class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">
                  {{ testimonial.name[0] }}
                </div>
                <div class="text-sm font-medium text-gray-900">{{ testimonial.name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ testimonial.role }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-1">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 line-clamp-2">{{ testimonial.comment }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="{
                  'bg-yellow-100 text-yellow-800': testimonial.status === 'pending',
                  'bg-green-100 text-green-800': testimonial.status === 'approved',
                  'bg-red-100 text-red-800': testimonial.status === 'rejected'
                }"
              >
                {{ getStatusName(testimonial.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click.stop="editTestimonial(testimonial)"
                  class="text-blue-600 hover:text-blue-900"
                  title="แก้ไข"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click.stop="confirmDelete(testimonial)"
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
    <TestimonialModal
      :show="showCreateModal || editingTestimonial !== null"
      :testimonial="editingTestimonial"
      @close="closeModal"
      @saved="handleTestimonialSaved"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

interface Testimonial {
  id: number
  name: string
  role: string
  comment: string
  rating: number
  avatar_url?: string | null
  status: string
  display_order: number
  created_at: string
  updated_at: string
}

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const testimonials = ref<Testimonial[]>([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const editingTestimonial = ref<Testimonial | null>(null)

const filters = reactive({
  search: '',
  status: ''
})

// Debounce search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadTestimonials()
  }, 500)
}

const loadTestimonials = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)

    const response = await $fetch<{
      success: boolean
      data: Testimonial[]
    }>(`${config.public.apiBase}/admin/testimonials?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      testimonials.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading testimonials:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    pending: 'รออนุมัติ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ปฏิเสธ'
  }
  return statusNames[status] || status
}

const editTestimonial = (testimonial: Testimonial) => {
  editingTestimonial.value = { ...testimonial }
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingTestimonial.value = null
}

const handleTestimonialSaved = () => {
  closeModal()
  loadTestimonials()
}

const { confirm } = useConfirm()
const confirmDelete = async (testimonial: Testimonial) => {
  const confirmed = await confirm({
    title: 'ยืนยันการลบ',
    message: `คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวจาก ${testimonial.name}?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
    confirmText: 'ลบ',
    cancelText: 'ยกเลิก',
    type: 'danger'
  })
  
  if (!confirmed) return

  try {
    await $fetch(`${config.public.apiBase}/admin/testimonials/${testimonial.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    await loadTestimonials()
  } catch (err: any) {
    console.error('Error deleting testimonial:', err)
    alert(err.data?.message || 'เกิดข้อผิดพลาดในการลบรีวิว')
  }
}

onMounted(() => {
  loadTestimonials()
})
</script>


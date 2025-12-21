<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold">จัดการแชท</h1>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">ทั้งหมด</option>
            <option value="active">เปิดใช้งาน</option>
            <option value="archived">เก็บถาวร</option>
            <option value="closed">ปิด</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา (ชื่อผู้เรียน/อาจารย์)</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหา..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">คอร์ส</label>
          <select
            v-model.number="filters.courseId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option :value="null">ทั้งหมด</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ค้นหา
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Rooms Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2">กำลังโหลด...</p>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ห้องแชท
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ผู้เรียน
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                อาจารย์
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                คอร์ส
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                อัพเดตล่าสุด
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="room in rooms" :key="room.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  #{{ room.id }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ room.student?.first_name }} {{ room.student?.last_name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ room.tutor?.first_name }} {{ room.tutor?.last_name }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ room.course?.title }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ room.course?.code }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    room.status === 'active' ? 'bg-green-100 text-green-800' :
                    room.status === 'archived' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ getStatusText(room.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(room.last_message_at || room.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink
                  :to="`/admin/chat/${room.id}`"
                  class="text-green-600 hover:text-green-900"
                >
                  ดูแชท
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t flex items-center justify-between">
          <div class="text-sm text-gray-700">
            แสดง {{ (pagination.offset || 0) + 1 }} - {{ Math.min((pagination.offset || 0) + (pagination.limit || 50), pagination.total) }} จาก {{ pagination.total }}
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ก่อนหน้า
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatRoom } from '#shared/types/chat.types'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const config = useRuntimeConfig()
const { accessToken } = useAuth()

const rooms = ref<ChatRoom[]>([])
const courses = ref<Array<{ id: number; title: string }>>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const filters = reactive({
  status: '',
  courseId: null as number | null
})
const pagination = reactive({
  page: 1,
  limit: 50,
  total: 0,
  totalPages: 0,
  offset: 0
})

const loadRooms = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const params: any = {
      limit: pagination.limit,
      offset: pagination.offset
    }
    
    if (filters.status) {
      params.status = filters.status
    }
    if (filters.courseId) {
      params.courseId = filters.courseId
    }
    
    const queryString = new URLSearchParams(params).toString()
    const response = await $fetch<{
      success: boolean
      data: ChatRoom[]
      pagination: typeof pagination
    }>(`${config.public.apiBase}/admin/chat/rooms?${queryString}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    
    if (response.success) {
      // Filter by search query if provided
      let filteredRooms = response.data
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filteredRooms = response.data.filter(room => {
          const studentName = `${room.student?.first_name} ${room.student?.last_name}`.toLowerCase()
          const tutorName = `${room.tutor?.first_name} ${room.tutor?.last_name}`.toLowerCase()
          return studentName.includes(query) || tutorName.includes(query)
        })
      }
      
      rooms.value = filteredRooms
      Object.assign(pagination, response.pagination)
    }
  } catch (err: any) {
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
    console.error('[Admin Chat] Error loading rooms:', err)
  } finally {
    loading.value = false
  }
}

const loadCourses = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: Array<{ id: number; title: string }> }>(
      `${config.public.apiBase}/admin/courses`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
    )
    
    if (response.success) {
      courses.value = response.data
    }
  } catch (err) {
    console.error('[Admin Chat] Error loading courses:', err)
  }
}

const applyFilters = () => {
  pagination.page = 1
  pagination.offset = 0
  loadRooms()
}

const changePage = (page: number) => {
  pagination.page = page
  pagination.offset = (page - 1) * pagination.limit
  loadRooms()
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'เปิดใช้งาน',
    archived: 'เก็บถาวร',
    closed: 'ปิด'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: th
    })
  } catch {
    return dateString
  }
}

onMounted(async () => {
  await loadCourses()
  await loadRooms()
})
</script>


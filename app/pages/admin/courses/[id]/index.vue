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
        <h1 class="text-3xl font-bold">รายละเอียดคอร์ส</h1>
      </div>
      <div class="flex items-center space-x-3">
        <button
          v-if="canEdit"
          @click="router.push(`/admin/courses/${courseId}/edit`)"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>แก้ไข</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="courseDetail" class="space-y-6">
      <!-- Course Thumbnail -->
      <div v-if="courseDetail.course.thumbnail_url" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">รูปภาพปก</h2>
        <div class="flex justify-center">
          <img
            :src="courseDetail.course.thumbnail_url"
            :alt="courseDetail.course.title"
            class="max-w-full h-auto rounded-lg shadow-md"
            style="max-height: 400px;"
            @error="handleImageError"
          >
        </div>
      </div>

      <!-- Course Basic Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">ข้อมูลคอร์ส</h2>
          <span
            class="px-3 py-1 text-sm font-medium rounded"
            :class="getStatusBadgeClass(courseDetail.course.status)"
          >
            {{ getStatusName(courseDetail.course.status) }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 mb-1">ชื่อคอร์ส</label>
            <p class="text-lg font-medium text-gray-900">
              {{ courseDetail.course.title }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">รหัสคอร์ส</label>
            <p class="text-gray-900">{{ courseDetail.course.code || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ประเภท</label>
            <span class="px-2 py-1 text-xs font-medium rounded" :class="getTypeBadgeClass(courseDetail.course.type)">
              {{ getTypeName(courseDetail.course.type) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ราคา</label>
            <p class="text-lg font-medium text-gray-900">
              {{ formatCurrency(courseDetail.course.price) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ระยะเวลา</label>
            <p class="text-gray-900">
              {{ courseDetail.course.duration_hours ? `${courseDetail.course.duration_hours} ชั่วโมง` : '-' }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ระดับ</label>
            <p class="text-gray-900">
              {{ courseDetail.course.level ? getLevelName(courseDetail.course.level) : '-' }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">วันที่สร้าง</label>
            <p class="text-gray-900">{{ formatDate(courseDetail.course.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">อัปเดตล่าสุด</label>
            <p class="text-gray-900">{{ formatDate(courseDetail.course.updated_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">สร้างโดย</label>
            <p class="text-gray-900">
              {{ courseDetail.course.created_by_name ? `${courseDetail.course.created_by_name} ${courseDetail.course.created_by_last_name || ''}` : '-' }}
            </p>
          </div>
          <div v-if="courseDetail.course.description" class="md:col-span-2 lg:col-span-3">
            <label class="block text-sm font-medium text-gray-500 mb-1">คำอธิบาย</label>
            <div class="text-gray-900 prose max-w-none" v-html="courseDetail.course.description"></div>
          </div>
        </div>
      </div>

      <!-- Branches -->
      <div v-if="courseDetail.branches && courseDetail.branches.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">สาขาที่เปิดสอน ({{ courseDetail.branches.length }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="branch in courseDetail.branches"
            :key="branch.branch_id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ branch.branch_name }}</h3>
                <p v-if="branch.branch_code" class="text-sm text-gray-500 mt-1">รหัส: {{ branch.branch_code }}</p>
                <div class="mt-3 space-y-1">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">จำนวนที่นั่ง:</span>
                    <span class="font-medium text-gray-900">
                      {{ branch.seat_limit ? branch.seat_limit.toLocaleString() : 'ไม่จำกัด' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">ผู้ลงทะเบียนแล้ว:</span>
                    <span class="font-medium text-gray-900">{{ branch.current_enrollments || 0 }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">สถานะ:</span>
                    <span
                      class="px-2 py-1 text-xs font-medium rounded"
                      :class="branch.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ branch.is_available ? 'พร้อมใช้งาน' : 'ปิดใช้งาน' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-lg shadow p-6">
        <div class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p>ยังไม่มีสาขาที่เปิดสอน</p>
        </div>
      </div>

      <!-- Enrollments -->
      <div v-if="courseDetail.enrollments && courseDetail.enrollments.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ผู้เรียนที่ลงทะเบียน ({{ courseDetail.enrollments.length }})</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้เรียน</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สาขา</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ลงทะเบียน</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="enrollment in courseDetail.enrollments" :key="enrollment.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <div>
                    <div class="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer"
                      @click="router.push(`/admin/students/${enrollment.student.id}`)">
                      {{ enrollment.student.first_name }} {{ enrollment.student.last_name }}
                    </div>
                    <div class="text-xs text-gray-500">{{ enrollment.student.username }}</div>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ enrollment.branch.name }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded"
                    :class="getEnrollmentStatusBadgeClass(enrollment.status)"
                  >
                    {{ getEnrollmentStatusName(enrollment.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500">
                  {{ formatDate(enrollment.enrolled_at) }}
                </td>
                <td class="px-4 py-3 text-right">
                  <NuxtLink
                    :to="`/admin/enrollments/${enrollment.id}`"
                    class="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    ดูรายละเอียด
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="bg-white rounded-lg shadow p-6">
        <div class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>ยังไม่มีผู้เรียนลงทะเบียนในคอร์สนี้</p>
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

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { accessToken, user } = useAuth()

const courseId = parseInt(route.params.id as string)
const loading = ref(true)
const error = ref('')
const courseDetail = ref<any>(null)

// Check if user can edit (System Admin, Owner, Admin กลาง, Branch Admin only)
const canEdit = computed(() => {
  if (!user.value || !user.value.roles) return false
  const allowedRoles = ['system_admin', 'owner', 'admin', 'branch_admin']
  return user.value.roles.some((role: string) => allowedRoles.includes(role))
})

const loadCourseDetail = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: any
    }>(`${config.public.apiBase}/admin/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      courseDetail.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading course detail:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}


const getTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    live_online: 'Live Online',
    vod: 'VOD',
    hybrid: 'Hybrid'
  }
  return typeNames[type] || type
}

const getTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    live_online: 'bg-blue-100 text-blue-800',
    vod: 'bg-purple-100 text-purple-800',
    hybrid: 'bg-indigo-100 text-indigo-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    draft: 'ร่าง',
    published: 'เผยแพร่',
    archived: 'เก็บถาวร'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getLevelName = (level: string) => {
  const levelNames: Record<string, string> = {
    beginner: 'เริ่มต้น',
    intermediate: 'กลาง',
    advanced: 'สูง'
  }
  return levelNames[level] || level
}

const getEnrollmentStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    active: 'ใช้งาน',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  }
  return statusNames[status] || status
}

const getEnrollmentStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy', { locale: th })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

onMounted(() => {
  loadCourseDetail()
})
</script>


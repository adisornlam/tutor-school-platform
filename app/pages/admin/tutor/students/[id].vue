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
        <h1 class="text-3xl font-bold">รายละเอียดนักเรียน</h1>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="studentDetail" class="space-y-6">
      <!-- Student Basic Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">ข้อมูลนักเรียน</h2>
          <span
            class="px-3 py-1 text-sm font-medium rounded"
            :class="getStatusBadgeClass(studentDetail.student.status)"
          >
            {{ getStatusDisplayName(studentDetail.student.status) }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ชื่อ-นามสกุล</label>
            <p class="text-lg font-medium text-gray-900">
              {{ studentDetail.student.first_name }} {{ studentDetail.student.last_name }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p class="text-gray-900">{{ studentDetail.student.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p class="text-gray-900">{{ studentDetail.student.email || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label>
            <p class="text-gray-900">{{ studentDetail.student.phone || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">วันที่สร้าง</label>
            <p class="text-gray-900">{{ formatDate(studentDetail.student.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Parents Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ผู้ปกครอง</h2>
        <div v-if="studentDetail.parents && studentDetail.parents.length > 0" class="space-y-4">
          <div
            v-for="parent in studentDetail.parents"
            :key="parent.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-gray-900">
                {{ parent.first_name }} {{ parent.last_name }}
              </h3>
              <span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {{ getRelationshipName(parent.relationship) }}
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p class="text-gray-900">{{ parent.email || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label>
                <p class="text-gray-900">{{ parent.phone || '-' }}</p>
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

      <!-- Enrollments -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">คอร์สที่ลงทะเบียน</h2>
        <div v-if="studentDetail.enrollments && studentDetail.enrollments.length > 0" class="space-y-4">
          <div
            v-for="enrollment in studentDetail.enrollments"
            :key="enrollment.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-medium text-gray-900">{{ enrollment.course.title }}</h3>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded"
                    :class="enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ getEnrollmentStatusName(enrollment.status) }}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">รหัสคอร์ส:</span>
                    <span class="ml-2 text-gray-900">{{ enrollment.course.code }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">สาขา:</span>
                    <span class="ml-2 text-gray-900">{{ enrollment.branch.name }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">วันที่ลงทะเบียน:</span>
                    <span class="ml-2 text-gray-900">{{ formatDate(enrollment.enrolled_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p class="mt-2">ยังไม่ได้ลงทะเบียนคอร์สใดๆ</p>
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
const config = useRuntimeConfig()
const { accessToken } = useAuth()

const studentId = parseInt(route.params.id as string)
const loading = ref(true)
const error = ref('')
const studentDetail = ref<any>(null)

const loadStudentDetail = async () => {
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
      studentDetail.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading student detail:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
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

const getRelationshipName = (relationship: string) => {
  const relationshipNames: Record<string, string> = {
    father: 'บิดา',
    mother: 'มารดา',
    guardian: 'ผู้ปกครอง',
    other: 'อื่นๆ'
  }
  return relationshipNames[relationship] || relationship
}

const getEnrollmentStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    pending: 'รอดำเนินการ',
    active: 'กำลังเรียน',
    completed: 'เรียนจบ',
    cancelled: 'ยกเลิก'
  }
  return statusNames[status] || status
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: th })
}

onMounted(() => {
  loadStudentDetail()
})
</script>


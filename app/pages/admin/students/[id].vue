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
        <h1 class="text-3xl font-bold">รายละเอียดผู้เรียน</h1>
      </div>
      <div class="flex items-center space-x-3">
        <button
          v-if="canEdit"
          @click="editStudent"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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

    <div v-else-if="studentDetail" class="space-y-6">
      <!-- Student Basic Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">ข้อมูลผู้เรียน</h2>
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
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">อัปเดตล่าสุด</label>
            <p class="text-gray-900">{{ formatDate(studentDetail.student.updated_at) }}</p>
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
                <label class="block text-sm font-medium text-gray-500 mb-1">Username</label>
                <p class="text-gray-900">{{ parent.username }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p class="text-gray-900">{{ parent.email || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label>
                <p class="text-gray-900">{{ parent.phone || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">สถานะ</label>
                <span
                  class="px-2 py-1 text-xs font-medium rounded"
                  :class="getStatusBadgeClass(parent.status)"
                >
                  {{ getStatusDisplayName(parent.status) }}
                </span>
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
              <NuxtLink
                :to="`/admin/enrollments/${enrollment.id}`"
                class="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ดูรายละเอียด
              </NuxtLink>
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

      <!-- Learning Progress (if available) -->
      <div v-if="learningProgress && learningProgress.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ความคืบหน้าการเรียน</h2>
        <div class="space-y-4">
          <div
            v-for="progress in learningProgress"
            :key="progress.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">{{ progress.course_title }}</h3>
              <span class="text-sm text-gray-500">{{ progress.completion_percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-600 h-2 rounded-full transition-all"
                :style="{ width: `${progress.completion_percentage}%` }"
              ></div>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              เรียนแล้ว {{ progress.completed_sessions }} / {{ progress.total_sessions }} บทเรียน
            </div>
          </div>
        </div>
      </div>

      <!-- Payment History (only for admin roles) -->
      <div v-if="canViewPayments" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ประวัติการชำระเงิน</h2>
        <div v-if="loadingPayments" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
        <div v-else-if="payments && payments.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่ชำระ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวนเงิน</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วิธีการชำระ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">รหัสคอร์ส</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สาขา</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ payment.payment_date ? formatDate(payment.payment_date) : formatDate(payment.created_at) }}
                </td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  {{ formatCurrency(payment.amount) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  {{ payment.payment_method_name }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <span v-if="payment.enrollment" class="font-medium text-blue-600">
                    {{ payment.enrollment.course.code }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">
                  <span v-if="payment.enrollment" class="font-medium">
                    {{ payment.enrollment.branch.name }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-sm">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded"
                    :class="getPaymentStatusBadgeClass(payment.status)"
                  >
                    {{ getPaymentStatusName(payment.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="mt-2">ไม่มีประวัติการชำระเงิน</p>
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

const studentId = parseInt(route.params.id as string)
const loading = ref(true)
const error = ref('')
const studentDetail = ref<any>(null)
const learningProgress = ref<any[]>([])
const payments = ref<any[]>([])
const loadingPayments = ref(false)

// Check if user can edit (System Admin, Owner, Branch Admin only)
const canEdit = computed(() => {
  if (!user.value || !user.value.roles) return false
  const allowedRoles = ['system_admin', 'owner', 'branch_admin']
  return user.value.roles.some((role: string) => allowedRoles.includes(role))
})

// Check if user can view payments (System Admin, Owner, Branch Admin only)
const canViewPayments = computed(() => {
  if (!user.value || !user.value.roles) return false
  const allowedRoles = ['system_admin', 'owner', 'branch_admin']
  return user.value.roles.some((role: string) => allowedRoles.includes(role))
})

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
      
      // Load additional data if available
      await Promise.all([
        loadLearningProgress(),
        ...(canViewPayments.value ? [loadPayments()] : [])
      ])
    }
  } catch (err: any) {
    console.error('Error loading student detail:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const loadLearningProgress = async () => {
  try {
    // TODO: Implement learning progress API
    // const response = await $fetch(`${config.public.apiBase}/admin/students/${studentId}/progress`, {
    //   headers: { Authorization: `Bearer ${accessToken.value}` }
    // })
    // learningProgress.value = response.data
  } catch (err) {
    // Silently fail - progress data is optional
  }
}

const loadPayments = async () => {
  if (!canViewPayments.value) return
  
  loadingPayments.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data: any[]
    }>(`${config.public.apiBase}/admin/students/${studentId}/payments`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    
    if (response.success) {
      payments.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading payments:', err)
    // Silently fail - payment data is optional
    payments.value = []
  } finally {
    loadingPayments.value = false
  }
}

const editStudent = () => {
  router.push(`/admin/students/${studentId}/edit`)
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

const getPaymentStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    pending: 'รอชำระ',
    paid: 'ชำระแล้ว',
    failed: 'ชำระไม่สำเร็จ',
    refunded: 'คืนเงิน'
  }
  return statusNames[status] || status
}

const getPaymentStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: th })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

onMounted(() => {
  loadStudentDetail()
})
</script>


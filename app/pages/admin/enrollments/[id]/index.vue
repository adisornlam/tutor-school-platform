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
        <h1 class="text-3xl font-bold">รายละเอียดการลงทะเบียน</h1>
      </div>
      <div class="flex items-center space-x-3">
        <button
          v-if="canEdit"
          @click="router.push(`/admin/enrollments/${enrollmentId}/edit`)"
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

    <div v-else-if="enrollmentDetail" class="space-y-6">
      <!-- Enrollment Status -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">สถานะการลงทะเบียน</h2>
          <span
            class="px-3 py-1 text-sm font-medium rounded"
            :class="getStatusBadgeClass(enrollmentDetail.enrollment.status)"
          >
            {{ getStatusName(enrollmentDetail.enrollment.status) }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ประเภทการเรียน</label>
            <span class="px-2 py-1 text-xs font-medium rounded" :class="enrollmentDetail.enrollment.enrollment_type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
              {{ enrollmentDetail.enrollment.enrollment_type === 'online' ? 'เรียนออนไลน์' : 'เรียนสด' }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">วันที่ลงทะเบียน</label>
            <p class="text-gray-900">{{ formatDate(enrollmentDetail.enrollment.enrollment_date || enrollmentDetail.enrollment.created_at) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">อัปเดตล่าสุด</label>
            <p class="text-gray-900">{{ formatDate(enrollmentDetail.enrollment.updated_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Student Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ข้อมูลนักเรียน</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ชื่อ-นามสกุล</label>
            <p class="text-gray-900">{{ enrollmentDetail.student.first_name }} {{ enrollmentDetail.student.last_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <p class="text-gray-900">@{{ enrollmentDetail.student.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">อีเมล</label>
            <p class="text-gray-900">{{ enrollmentDetail.student.email || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label>
            <p class="text-gray-900">{{ enrollmentDetail.student.phone || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Course Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ข้อมูลคอร์ส</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 mb-1">ชื่อคอร์ส</label>
            <NuxtLink :to="`/admin/courses/${enrollmentDetail.course.id}`" class="text-green-600 hover:text-green-700">
              <p class="text-lg font-medium">{{ enrollmentDetail.course.title }}</p>
            </NuxtLink>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">รหัสคอร์ส</label>
            <p class="text-gray-900">{{ enrollmentDetail.course.code || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ประเภท</label>
            <span class="px-2 py-1 text-xs font-medium rounded" :class="getTypeBadgeClass(enrollmentDetail.course.type)">
              {{ getTypeName(enrollmentDetail.course.type) }}
            </span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ราคา</label>
            <p class="text-lg font-medium text-gray-900">{{ formatCurrency(enrollmentDetail.course.price) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ระยะเวลา</label>
            <p class="text-gray-900">
              {{ enrollmentDetail.course.duration_hours ? `${enrollmentDetail.course.duration_hours} ชั่วโมง` : '-' }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ระดับ</label>
            <p class="text-gray-900">
              {{ enrollmentDetail.course.level ? getLevelName(enrollmentDetail.course.level) : '-' }}
            </p>
          </div>
          <div v-if="enrollmentDetail.course.description" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 mb-1">คำอธิบาย</label>
            <div class="text-gray-900 prose max-w-none" v-html="enrollmentDetail.course.description"></div>
          </div>
        </div>
      </div>

      <!-- Branch Info (for onsite) -->
      <div v-if="enrollmentDetail.enrollment.enrollment_type === 'onsite' && enrollmentDetail.branch" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ข้อมูลสาขา</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ชื่อสาขา</label>
            <p class="text-gray-900">{{ enrollmentDetail.branch.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">รหัสสาขา</label>
            <p class="text-gray-900">{{ enrollmentDetail.branch.code || '-' }}</p>
          </div>
          <div v-if="enrollmentDetail.branch.address" class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 mb-1">ที่อยู่</label>
            <p class="text-gray-900">{{ enrollmentDetail.branch.address }}</p>
          </div>
          <div v-if="enrollmentDetail.branch.phone">
            <label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label>
            <p class="text-gray-900">{{ enrollmentDetail.branch.phone }}</p>
          </div>
          <div v-if="enrollmentDetail.branch.email">
            <label class="block text-sm font-medium text-gray-500 mb-1">อีเมล</label>
            <p class="text-gray-900">{{ enrollmentDetail.branch.email }}</p>
          </div>
        </div>
      </div>

      <!-- Shipping Address Info (for online) -->
      <div v-if="enrollmentDetail.enrollment.enrollment_type === 'online' && enrollmentDetail.shipping_address" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ที่อยู่จัดส่ง</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ผู้รับ</label>
            <p class="text-gray-900">{{ enrollmentDetail.shipping_address.recipient_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">เบอร์โทรศัพท์</label>
            <p class="text-gray-900">{{ enrollmentDetail.shipping_address.phone }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-500 mb-1">ที่อยู่</label>
            <p class="text-gray-900">
              {{ enrollmentDetail.shipping_address.address_line1 }}
              <span v-if="enrollmentDetail.shipping_address.address_line2">, {{ enrollmentDetail.shipping_address.address_line2 }}</span>
            </p>
            <p class="text-gray-900">
              <span v-if="enrollmentDetail.shipping_address.subdistrict">{{ enrollmentDetail.shipping_address.subdistrict }} </span>
              <span v-if="enrollmentDetail.shipping_address.district">อ.{{ enrollmentDetail.shipping_address.district }} </span>
              <span v-if="enrollmentDetail.shipping_address.province">จ.{{ enrollmentDetail.shipping_address.province }} </span>
              <span v-if="enrollmentDetail.shipping_address.postal_code">{{ enrollmentDetail.shipping_address.postal_code }}</span>
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">ประเภทที่อยู่</label>
            <p class="text-gray-900">
              {{ enrollmentDetail.shipping_address.address_type === 'home' ? 'บ้าน' : enrollmentDetail.shipping_address.address_type === 'work' ? 'ที่ทำงาน' : 'อื่นๆ' }}
              <span v-if="enrollmentDetail.shipping_address.is_default" class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">หลัก</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Payment Info -->
      <div v-if="enrollmentDetail.payment" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">ข้อมูลการชำระเงิน</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">จำนวนเงิน</label>
            <p class="text-lg font-medium text-gray-900">{{ formatCurrency(enrollmentDetail.payment.amount) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">สถานะ</label>
            <span class="px-2 py-1 text-xs font-medium rounded" :class="getPaymentStatusBadgeClass(enrollmentDetail.payment.status)">
              {{ getPaymentStatusName(enrollmentDetail.payment.status) }}
            </span>
          </div>
          <div v-if="enrollmentDetail.payment.payment_method">
            <label class="block text-sm font-medium text-gray-500 mb-1">วิธีการชำระ</label>
            <p class="text-gray-900">{{ enrollmentDetail.payment.payment_method }}</p>
          </div>
          <div v-if="enrollmentDetail.payment.transaction_id">
            <label class="block text-sm font-medium text-gray-500 mb-1">Transaction ID</label>
            <p class="text-gray-900">{{ enrollmentDetail.payment.transaction_id }}</p>
          </div>
          <div v-if="enrollmentDetail.payment.invoice_number">
            <label class="block text-sm font-medium text-gray-500 mb-1">เลขที่ใบแจ้งหนี้</label>
            <p class="text-gray-900">{{ enrollmentDetail.payment.invoice_number }}</p>
          </div>
          <div v-if="enrollmentDetail.payment.paid_at">
            <label class="block text-sm font-medium text-gray-500 mb-1">วันที่ชำระ</label>
            <p class="text-gray-900">{{ formatDate(enrollmentDetail.payment.paid_at) }}</p>
          </div>
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

const enrollmentId = computed(() => parseInt(route.params.id as string))
const loading = ref(true)
const error = ref('')
const enrollmentDetail = ref<any>(null)

// Check if user can edit (System Admin, Owner, Admin กลาง, Branch Admin only)
const canEdit = computed(() => {
  if (!user.value || !user.value.roles) return false
  const allowedRoles = ['system_admin', 'owner', 'admin', 'branch_admin']
  return user.value.roles.some((role: string) => allowedRoles.includes(role))
})

const loadEnrollmentDetail = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: any
    }>(`${config.public.apiBase}/admin/enrollments/${enrollmentId.value}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success) {
      enrollmentDetail.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading enrollment detail:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const getStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    pending: 'รอการยืนยัน',
    active: 'กำลังเรียน',
    completed: 'เรียนจบ',
    cancelled: 'ยกเลิก'
  }
  return statusNames[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
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

const getLevelName = (level: string) => {
  const levelNames: Record<string, string> = {
    beginner: 'เริ่มต้น',
    intermediate: 'กลาง',
    advanced: 'สูง'
  }
  return levelNames[level] || level
}

const getPaymentStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    pending: 'รอการชำระ',
    paid: 'ชำระแล้ว',
    failed: 'ชำระไม่สำเร็จ',
    refunded: 'คืนเงินแล้ว'
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: th })
}

onMounted(() => {
  loadEnrollmentDetail()
})
</script>


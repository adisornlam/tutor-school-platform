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
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">ผู้ปกครอง</h2>
          <button
            v-if="canEdit"
            @click="showAddParentModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>เพิ่มผู้ปกครอง</span>
          </button>
        </div>
        <div v-if="studentDetail.parents && studentDetail.parents.length > 0" class="space-y-4">
          <div
            v-for="parent in studentDetail.parents"
            :key="parent.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ parent.first_name }} {{ parent.last_name }}
                </h3>
                <span class="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                  {{ getRelationshipName(parent.relationship) }}
                </span>
              </div>
              <div v-if="canEdit" class="flex items-center space-x-2">
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
                class="ml-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                  <span v-if="payment.enrollment" class="font-medium text-green-600">
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

    <!-- Add Parent Modal -->
    <div
      v-if="showAddParentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddParentModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
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
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
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

    <!-- Edit Student Modal -->
    <StudentModal
      v-if="showEditStudentModal"
      :show="showEditStudentModal"
      :student="editingStudent"
      @close="closeEditStudentModal"
      @saved="handleStudentSaved"
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

// Edit student modal
const showEditStudentModal = ref(false)
const editingStudent = ref<any>(null)

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

// Check if user can edit (System Admin, Owner, Admin กลาง, Branch Admin only)
const canEdit = computed(() => {
  if (!user.value || !user.value.roles) return false
  const allowedRoles = ['system_admin', 'owner', 'admin', 'branch_admin']
  return user.value.roles.some((role: string) => allowedRoles.includes(role))
})

// Check if user can view payments (System Admin, Owner, Admin กลาง, Branch Admin only)
const canViewPayments = computed(() => {
  if (!user.value || !user.value.roles) return false
  const allowedRoles = ['system_admin', 'owner', 'admin', 'branch_admin']
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
  if (studentDetail.value && studentDetail.value.student) {
    editingStudent.value = {
      id: studentDetail.value.student.id,
      username: studentDetail.value.student.username,
      email: studentDetail.value.student.email,
      first_name: studentDetail.value.student.first_name,
      last_name: studentDetail.value.student.last_name,
      phone: studentDetail.value.student.phone,
      status: studentDetail.value.student.status,
      parents: []
    }
    showEditStudentModal.value = true
  }
}

const closeEditStudentModal = () => {
  showEditStudentModal.value = false
  editingStudent.value = null
}

const handleStudentSaved = async () => {
  closeEditStudentModal()
  await loadStudentDetail()
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

// Parent management functions
const searchParent = async () => {
  if (!parentSearch.value || parentSearch.value.length < 2) {
    parentSearchResults.value = []
    return
  }

  try {
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
      const existingParentIds = (studentDetail.value?.parents || []).map((p: any) => p.id)
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
    const response = await $fetch<{
      success: boolean
      data?: any
      message?: string
    }>(`${config.public.apiBase}/admin/students/${studentId}/parents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        parent_id: selectedParentToAdd.value.id,
        relationship: parentRelationship.value
      }
    })

    if (response.success) {
      // Reload student data
      await loadStudentDetail()
      closeAddParentModal()
    }
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
    await loadStudentDetail()
    parentToEdit.value = null
  } catch (err: any) {
    console.error('Error editing parent:', err)
    editParentError.value = err.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ปกครอง'
  } finally {
    editingParent.value = false
  }
}

onMounted(() => {
  loadStudentDetail()
})
</script>


<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ enrollment ? 'แก้ไขการลงทะเบียน' : 'ลงทะเบียนใหม่' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="!autoSelectStudent">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              นักเรียน <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="studentSearchQuery"
                type="text"
                placeholder="ค้นหานักเรียน (ชื่อ, username, อีเมล)..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                @input="handleStudentSearch"
                @focus="showStudentDropdown = true"
                @blur="handleStudentBlur"
              />
              <div
                v-if="selectedStudent"
                class="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <!-- Dropdown -->
              <div
                v-if="showStudentDropdown && (filteredStudents.length > 0 || studentSearchQuery)"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                <div
                  v-if="loadingStudents"
                  class="px-4 py-2 text-sm text-gray-500"
                >
                  กำลังค้นหา...
                </div>
                <div
                  v-else-if="filteredStudents.length === 0 && studentSearchQuery"
                  class="px-4 py-2 text-sm text-gray-500"
                >
                  ไม่พบนักเรียน
                </div>
                <div
                  v-else
                  class="divide-y divide-gray-200"
                >
                  <button
                    v-for="student in filteredStudents"
                    :key="student.id"
                    type="button"
                    @click="selectStudent(student)"
                    class="w-full text-left px-4 py-2 hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                    :class="{ 'bg-green-100': form.student_id === student.id }"
                  >
                    <div class="font-medium text-gray-900">
                      {{ student.first_name }} {{ student.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">@{{ student.username }}</div>
                    <div v-if="student.email" class="text-xs text-gray-400">{{ student.email }}</div>
                  </button>
                </div>
              </div>
            </div>
            <input
              v-model.number="form.student_id"
              type="hidden"
              required
            />
          </div>
          <div v-else class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              นักเรียน
            </label>
            <div class="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              <p class="font-medium text-gray-900">{{ selectedStudent?.first_name }} {{ selectedStudent?.last_name }}</p>
              <p class="text-sm text-gray-500">@{{ selectedStudent?.username }}</p>
            </div>
            <input
              v-model.number="form.student_id"
              type="hidden"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              คอร์ส <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.course_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              @change="loadBranchesForCourse"
            >
              <option value="">เลือกคอร์ส</option>
              <option v-for="course in availableCourses" :key="course.id" :value="course.id">
                {{ course.title }}
              </option>
            </select>
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ประเภทการเรียน <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-6">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.enrollment_type"
                  type="radio"
                  value="onsite"
                  class="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span class="text-gray-700">เรียนสด (Onsite)</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.enrollment_type"
                  type="radio"
                  value="online"
                  class="mr-2 w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <span class="text-gray-700">เรียนออนไลน์ (Online)</span>
              </label>
            </div>
          </div>

          <div v-if="form.enrollment_type === 'onsite'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สาขา <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.branch_id"
              :required="form.enrollment_type === 'onsite'"
              :disabled="!form.course_id || loadingBranches"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-900"
            >
              <option value="">{{ loadingBranches ? 'กำลังโหลด...' : 'เลือกสาขา' }}</option>
              <option v-for="branch in availableBranches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </div>

          <div v-if="form.enrollment_type === 'online' && form.student_id">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ที่อยู่จัดส่ง <span class="text-red-500">*</span>
            </label>
            <AddressSelect
              ref="addressSelectRef"
              v-model="form.shipping_address_id"
              :user-id="form.student_id"
              :required="form.enrollment_type === 'online'"
              placeholder="เลือกที่อยู่จัดส่ง"
              hint="สำหรับส่งเอกสารประกอบการเรียน"
              @add-new="showAddressForm = true"
            />
          </div>
          <div v-else-if="form.enrollment_type === 'online' && !form.student_id" class="text-sm text-gray-500">
            กรุณาเลือกนักเรียนก่อนเพื่อเลือกที่อยู่จัดส่ง
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              สถานะ <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
            >
              <option value="pending">รอการยืนยัน</option>
              <option value="active">กำลังเรียน</option>
              <option value="completed">เรียนจบ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              วันที่ลงทะเบียน
            </label>
            <input
              v-model="form.enrollment_date"
              type="datetime-local"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              style="color-scheme: light;"
            >
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Address Form Modal -->
        <div
          v-if="showAddressForm"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="showAddressForm = false"
        >
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold">เพิ่มที่อยู่ใหม่</h3>
              <button
                @click="showAddressForm = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AddressForm
              ref="addressFormRef"
              :address="null"
              @update="newAddress = $event"
            />
            <div class="flex justify-end space-x-3 mt-4 pt-4 border-t">
              <button
                type="button"
                @click="showAddressForm = false"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                @click="saveNewAddress"
                :disabled="loading"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">กำลังบันทึก...</span>
            <span v-else>บันทึก</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddressSelect from './AddressSelect.vue'
import AddressForm from './AddressForm.vue'
interface Enrollment {
  id: number
  student_id: number
  course_id: number
  branch_id: number
  enrollment_type?: 'onsite' | 'online'
  shipping_address_id?: number | null
  enrollment_date?: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  payment_id?: number | null
}

interface Student {
  id: number
  username: string
  first_name: string
  last_name: string
  email?: string
}

interface Course {
  id: number
  title: string
  code?: string
}

interface Branch {
  id: number
  name: string
  code?: string
}

interface Props {
  show: boolean
  enrollment?: Enrollment | null
  prefillCourseId?: number
  prefillEnrollmentType?: 'onsite' | 'online'
}

const props = withDefaults(defineProps<Props>(), {
  enrollment: null,
  prefillCourseId: undefined,
  prefillEnrollmentType: undefined
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const config = useRuntimeConfig()
const { accessToken, user } = useAuth()

const form = reactive({
  student_id: 0,
  course_id: 0,
  branch_id: 0,
  enrollment_type: 'onsite' as 'onsite' | 'online',
  shipping_address_id: null as number | null,
  enrollment_date: '',
  status: 'pending' as 'pending' | 'active' | 'completed' | 'cancelled'
})

const loading = ref(false)
const loadingBranches = ref(false)
const loadingStudents = ref(false)
const error = ref('')
const availableStudents = ref<Student[]>([])
const filteredStudents = ref<Student[]>([])
const availableCourses = ref<Course[]>([])
const availableBranches = ref<Branch[]>([])
const studentSearchQuery = ref('')
const showStudentDropdown = ref(false)
const selectedStudent = ref<Student | null>(null)
const showAddressForm = ref(false)
const newAddress = ref<any>(null)
const addressSelectRef = ref<any>(null)
const autoSelectStudent = ref(false)

let searchTimeout: NodeJS.Timeout | null = null

const handleStudentSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchStudents()
  }, 300)
}

const searchStudents = async () => {
  if (!studentSearchQuery.value.trim()) {
    filteredStudents.value = []
    return
  }

  loadingStudents.value = true
  try {
    const response = await $fetch<{ success: boolean; data: Student[] }>(
      `${config.public.apiBase}/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        params: {
          role: 'student',
          search: studentSearchQuery.value,
          limit: 20
        }
      }
    )
    if (response.success) {
      filteredStudents.value = response.data
    }
  } catch (err: any) {
    console.error('Error searching students:', err)
    filteredStudents.value = []
  } finally {
    loadingStudents.value = false
  }
}

const selectStudent = (student: Student) => {
  form.student_id = student.id
  selectedStudent.value = student
  studentSearchQuery.value = `${student.first_name} ${student.last_name} (@${student.username})`
  showStudentDropdown.value = false
}

const handleStudentBlur = () => {
  // Delay to allow click on dropdown items
  setTimeout(() => {
    showStudentDropdown.value = false
  }, 200)
}

const loadCourses = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: Course[] }>(
      `${config.public.apiBase}/admin/courses`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        params: { status: 'published' }
      }
    )
    if (response.success) {
      availableCourses.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading courses:', err)
  }
}

const loadBranchesForCourse = async () => {
  if (!form.course_id) {
    availableBranches.value = []
    form.branch_id = 0
    return
  }

  loadingBranches.value = true
  try {
    const response = await $fetch<{
      success: boolean
      data: {
        branches: Array<{
          branch_id: number
          branch_name: string
          branch_code?: string
        }>
      }
    }>(`${config.public.apiBase}/admin/courses/${form.course_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })
    if (response.success && response.data.branches) {
      availableBranches.value = response.data.branches.map(b => ({
        id: b.branch_id,
        name: b.branch_name,
        code: b.branch_code
      }))
    }
  } catch (err: any) {
    console.error('Error loading branches:', err)
    error.value = 'ไม่สามารถโหลดข้อมูลสาขาได้'
  } finally {
    loadingBranches.value = false
  }
}

// Initialize form when enrollment prop changes
watch(() => props.enrollment, (enrollment) => {
  if (enrollment) {
    form.student_id = enrollment.student_id
    form.course_id = enrollment.course_id
    form.branch_id = enrollment.branch_id || 0
    form.enrollment_type = enrollment.enrollment_type || 'onsite'
    form.shipping_address_id = enrollment.shipping_address_id || null
    form.status = enrollment.status
    form.enrollment_date = enrollment.enrollment_date 
      ? new Date(enrollment.enrollment_date).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
    
    // If we have student_id, we need to fetch student info to display
    if (enrollment.student_id) {
      fetchStudentInfo(enrollment.student_id)
    }
    
    loadBranchesForCourse()
  } else {
    form.student_id = 0
    form.course_id = props.prefillCourseId || 0
    form.branch_id = 0
    form.enrollment_type = props.prefillEnrollmentType || 'onsite'
    form.shipping_address_id = null
    form.status = 'pending'
    form.enrollment_date = new Date().toISOString().slice(0, 16)
    availableBranches.value = []
    selectedStudent.value = null
    studentSearchQuery.value = ''
    
    // If prefill course, load branches
    if (props.prefillCourseId) {
      loadBranchesForCourse()
    }
  }
}, { immediate: true })

const fetchStudentInfo = async (studentId: number) => {
  try {
    const response = await $fetch<{ success: boolean; data: Student[] }>(
      `${config.public.apiBase}/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        params: { role: 'student' }
      }
    )
    if (response.success) {
      const student = response.data.find(s => s.id === studentId)
      if (student) {
        selectedStudent.value = student
        studentSearchQuery.value = `${student.first_name} ${student.last_name} (@${student.username})`
      }
    }
  } catch (err: any) {
    console.error('Error fetching student info:', err)
  }
}

// Check if user is a student and auto-select
const checkAutoSelectStudent = async () => {
  if (!user.value || !user.value.roles) {
    autoSelectStudent.value = false
    return
  }

  // If user is a student, auto-select themselves
  if (user.value.roles.includes('student')) {
    autoSelectStudent.value = true
    form.student_id = user.value.id
    
    // Fetch student info to display
    try {
      const response = await $fetch<{ success: boolean; data: Student[] }>(
        `${config.public.apiBase}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          },
          params: { role: 'student', search: user.value.username || user.value.email }
        }
      )
      if (response.success && response.data.length > 0) {
        const student = response.data.find(s => s.id === user.value.id) || response.data[0]
        selectedStudent.value = student
        studentSearchQuery.value = `${student.first_name} ${student.last_name} (@${student.username})`
      }
    } catch (err: any) {
      console.error('Error fetching student info:', err)
    }
  } else {
    autoSelectStudent.value = false
  }
}

// Load data when modal opens
watch(() => props.show, async (show) => {
  if (show) {
    await checkAutoSelectStudent()
    loadCourses()
    if (props.enrollment) {
      loadBranchesForCourse()
      if (props.enrollment.student_id) {
        fetchStudentInfo(props.enrollment.student_id)
      }
    } else {
      // Reset search when opening new enrollment
      if (!autoSelectStudent.value) {
        studentSearchQuery.value = ''
        selectedStudent.value = null
        filteredStudents.value = []
      }
      
      // Prefill course if provided
      if (props.prefillCourseId) {
        form.course_id = props.prefillCourseId
        loadBranchesForCourse()
      }
      
      // Prefill enrollment type if provided
      if (props.prefillEnrollmentType) {
        form.enrollment_type = props.prefillEnrollmentType
      }
    }
  }
}, { immediate: true })

const addressFormRef = ref<any>(null)

const saveNewAddress = async () => {
  if (!form.student_id || !newAddress.value) {
    error.value = 'กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน'
    return
  }

  // Validate address form
  if (addressFormRef.value && addressFormRef.value.validate && !addressFormRef.value.validate()) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch(`${config.public.apiBase}/admin/users/${form.student_id}/addresses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: newAddress.value
    })

    if (response.success) {
      form.shipping_address_id = response.data.id
      showAddressForm.value = false
      newAddress.value = null
      
      // Reload addresses in AddressSelect
      if (addressSelectRef.value && addressSelectRef.value.reloadAddresses) {
        await addressSelectRef.value.reloadAddresses()
      }
    }
  } catch (err: any) {
    console.error('Error saving address:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกที่อยู่'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  // Validation
  if (form.enrollment_type === 'onsite' && !form.branch_id) {
    error.value = 'กรุณาเลือกสาขาสำหรับเรียนสด'
    return
  }

  if (form.enrollment_type === 'online' && !form.shipping_address_id) {
    error.value = 'กรุณาเลือกที่อยู่จัดส่งสำหรับเรียนออนไลน์'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const body: any = {
      student_id: form.student_id,
      course_id: form.course_id,
      enrollment_type: form.enrollment_type,
      status: form.status,
      enrollment_date: form.enrollment_date || new Date().toISOString()
    }

    if (form.enrollment_type === 'onsite') {
      body.branch_id = form.branch_id
    } else {
      body.shipping_address_id = form.shipping_address_id
    }

    if (props.enrollment) {
      // Update
      await $fetch(`${config.public.apiBase}/admin/enrollments/${props.enrollment.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    } else {
      // Create
      await $fetch(`${config.public.apiBase}/admin/enrollments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        },
        body
      })
    }

    emit('saved')
  } catch (err: any) {
    console.error('Error saving enrollment:', err)
    error.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    loading.value = false
  }
}
</script>


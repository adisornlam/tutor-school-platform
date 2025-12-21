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
        <h1 class="text-3xl font-bold">แก้ไขการลงทะเบียน</h1>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <template v-else>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              นักเรียน <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.student_id"
              required
              :disabled="loadingStudents"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{{ loadingStudents ? 'กำลังโหลด...' : 'เลือกนักเรียน' }}</option>
              <option v-for="student in availableStudents" :key="student.id" :value="student.id">
                {{ student.first_name }} {{ student.last_name }} (@{{ student.username }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              คอร์ส <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.course_id"
              required
              :disabled="loadingCourses"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              @change="loadBranchesForCourse"
            >
              <option value="">{{ loadingCourses ? 'กำลังโหลด...' : 'เลือกคอร์ส' }}</option>
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
            <AddressSelect
              v-model="form.shipping_address_id"
              :user-id="form.student_id"
              :required="form.enrollment_type === 'online'"
              placeholder="เลือกที่อยู่จัดส่ง"
              hint="สำหรับส่งเอกสารประกอบการเรียน"
            />
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

        <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ submitError }}
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t">
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
    </template>
  </div>
</template>

<script setup lang="ts">
import AddressSelect from '~/components/AddressSelect.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { accessToken } = useAuth()

const enrollmentId = computed(() => parseInt(route.params.id as string))
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const submitError = ref('')

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
}

interface Branch {
  id: number
  name: string
  code?: string
}

const form = reactive({
  student_id: 0,
  course_id: 0,
  branch_id: 0,
  enrollment_type: 'onsite' as 'onsite' | 'online',
  shipping_address_id: null as number | null,
  enrollment_date: '',
  status: 'pending' as 'pending' | 'active' | 'completed' | 'cancelled'
})

const availableStudents = ref<Student[]>([])
const availableCourses = ref<Course[]>([])
const availableBranches = ref<Branch[]>([])
const loadingStudents = ref(false)
const loadingCourses = ref(false)
const loadingBranches = ref(false)

const loadStudents = async () => {
  loadingStudents.value = true
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
      availableStudents.value = response.data
    }
  } catch (err: any) {
    console.error('Error loading students:', err)
  } finally {
    loadingStudents.value = false
  }
}

const loadCourses = async () => {
  loadingCourses.value = true
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
  } finally {
    loadingCourses.value = false
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

const loadEnrollment = async () => {
  if (!enrollmentId.value || isNaN(enrollmentId.value)) {
    error.value = 'รหัสการลงทะเบียนไม่ถูกต้อง'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<{
      success: boolean
      data: {
        enrollment: any
        student: any
        course: any
        branch: any
      }
    }>(`${config.public.apiBase}/admin/enrollments/${enrollmentId.value}`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    })

    if (response.success && response.data.enrollment) {
      const enrollment = response.data.enrollment
      form.student_id = enrollment.student_id
      form.course_id = enrollment.course_id
      form.branch_id = enrollment.branch_id || 0
      form.enrollment_type = enrollment.enrollment_type || 'onsite'
      form.shipping_address_id = enrollment.shipping_address_id || null
      form.status = enrollment.status
      form.enrollment_date = enrollment.enrollment_date
        ? new Date(enrollment.enrollment_date).toISOString().slice(0, 16)
        : new Date(enrollment.created_at).toISOString().slice(0, 16)
      
      // Load branches for selected course
      await loadBranchesForCourse()
    } else {
      error.value = 'ไม่พบข้อมูลการลงทะเบียน'
    }
  } catch (err: any) {
    console.error('Error loading enrollment:', err)
    error.value = err.data?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  submitError.value = ''

  try {
    // Validation
    if (form.enrollment_type === 'onsite' && !form.branch_id) {
      submitError.value = 'กรุณาเลือกสาขาสำหรับเรียนสด'
      submitting.value = false
      return
    }

    if (form.enrollment_type === 'online' && !form.shipping_address_id) {
      submitError.value = 'กรุณาเลือกที่อยู่จัดส่งสำหรับเรียนออนไลน์'
      submitting.value = false
      return
    }

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

    await $fetch(`${config.public.apiBase}/admin/enrollments/${enrollmentId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body
    })

    // Redirect to enrollment detail page
    await router.push(`/admin/enrollments/${enrollmentId.value}`)
  } catch (err: any) {
    console.error('Error updating enrollment:', err)
    submitError.value = err.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadStudents()
  loadCourses()
  loadEnrollment()
})
</script>


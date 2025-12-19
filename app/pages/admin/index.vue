<template>
  <div>
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

      <!-- Welcome Message -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-2">
          ยินดีต้อนรับ, {{ user?.first_name }} {{ user?.last_name }}!
        </h2>
        <p class="text-gray-600">
          คุณเข้าสู่ระบบในฐานะ: 
          <span class="font-semibold text-green-600">
            {{ getRoleDisplayName(user?.roles?.[0]) }}
          </span>
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">นักเรียนทั้งหมด</p>
              <p class="text-2xl font-bold mt-2">1,234</p>
              <p class="text-sm text-green-600 mt-1">+12% จากเดือนที่แล้ว</p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">คอร์สเรียน</p>
              <p class="text-2xl font-bold mt-2">89</p>
              <p class="text-sm text-green-600 mt-1">+5 คอร์สใหม่</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">รายได้เดือนนี้</p>
              <p class="text-2xl font-bold mt-2">฿2,450,000</p>
              <p class="text-sm text-green-600 mt-1">+30% จากเดือนที่แล้ว</p>
            </div>
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">การลงทะเบียน</p>
              <p class="text-2xl font-bold mt-2">156</p>
              <p class="text-sm text-green-600 mt-1">+9% จากเดือนที่แล้ว</p>
            </div>
            <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">รายได้</h2>
          <div class="h-64 flex items-center justify-center text-gray-400">
            <p>กราฟรายได้ (จะเพิ่มในภายหลัง)</p>
          </div>
        </div>

        <!-- Recent Enrollments -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">การลงทะเบียนล่าสุด</h2>
          <div class="space-y-4">
            <div
              v-for="enrollment in recentEnrollments"
              :key="enrollment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium">{{ enrollment.studentName }}</p>
                <p class="text-sm text-gray-600">{{ enrollment.courseName }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">฿{{ enrollment.amount.toLocaleString() }}</p>
                <p class="text-xs text-gray-500">{{ enrollment.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const { user } = useAuth()

const getRoleDisplayName = (role?: string) => {
  const roleNames: Record<string, string> = {
    system_admin: 'ผู้ดูแลระบบ',
    owner: 'เจ้าของ',
    branch_admin: 'ผู้ดูแลสาขา',
    tutor: 'อาจารย์',
    student: 'นักเรียน',
    parent: 'ผู้ปกครอง'
  }
  return roleNames[role || ''] || role || 'ผู้ใช้'
}

const recentEnrollments = [
  {
    id: 1,
    studentName: 'สมชาย ใจดี',
    courseName: 'คณิตศาสตร์ ม.1',
    amount: 5000,
    date: '19 ธ.ค. 2024'
  },
  {
    id: 2,
    studentName: 'สมหญิง รักเรียน',
    courseName: 'ภาษาอังกฤษ TOEIC',
    amount: 4500,
    date: '18 ธ.ค. 2024'
  },
  {
    id: 3,
    studentName: 'วิชัย เก่งมาก',
    courseName: 'ฟิสิกส์ ม.4',
    amount: 5500,
    date: '17 ธ.ค. 2024'
  }
]
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">ประวัติการชำระเงิน</h1>
    
    <div class="bg-white rounded-lg shadow p-8 text-center">
      <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีข้อมูลการชำระเงิน</h3>
      <p class="text-gray-600">ระบบการชำระเงินกำลังพัฒนา</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'student'
})
</script>


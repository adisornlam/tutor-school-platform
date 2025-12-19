<template>
  <div>
    <!-- Redirect to main login page -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <p class="text-gray-600 mb-4">กำลังเปลี่ยนเส้นทาง...</p>
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Redirect admin login to main login page
// All users (admin, owner, student, parent) use the same login page
// After login, they will be redirected based on their role

definePageMeta({
  middleware: 'guest'
})

onMounted(() => {
  // Redirect to main login with admin redirect
  const redirect = useRoute().query.redirect as string || '/admin'
  navigateTo(`/auth/login?redirect=${encodeURIComponent(redirect)}`)
})
</script>


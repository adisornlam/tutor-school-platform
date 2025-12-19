<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Set timezone and locale (client-side only)
if (process.client) {
  onMounted(() => {
    const { locale } = useI18n()
    
    // Client-side timezone handling
    useHead({
      htmlAttrs: {
        lang: locale.value
      }
    })
  })
}
</script>


<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">{{ error.statusCode }}</h1>
      <p class="text-gray-600 mb-8">{{ error.statusMessage }}</p>
      <button 
        @click="handleError"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {{ t('error.goHome') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
  }
}>()

const { t } = useI18n()

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>


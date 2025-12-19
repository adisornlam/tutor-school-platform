<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="text-2xl font-bold text-primary-blue">
            {{ t('app.name') }}
          </NuxtLink>
          <div class="flex items-center gap-4">
            <NuxtLink to="/courses" class="text-gray-700 hover:text-primary-blue">
              {{ t('nav.courses') }}
            </NuxtLink>
            <NuxtLink to="/auth/login" class="text-gray-700 hover:text-primary-blue">
              {{ t('nav.login') }}
            </NuxtLink>
            <button 
              @click="toggleLocale"
              class="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
            >
              {{ currentLocale === 'th' ? 'EN' : 'TH' }}
            </button>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="bg-gray-800 text-white mt-auto py-8">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2024 KDC Tutor School. {{ t('footer.allRightsReserved') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale, t } = useI18n()
const currentLocale = computed(() => locale.value)

const toggleLocale = () => {
  setLocale(currentLocale.value === 'th' ? 'en' : 'th')
}

// Provide $t for template
const $t = t
</script>


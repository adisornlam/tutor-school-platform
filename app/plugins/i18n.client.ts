// Client-side i18n plugin
export default defineNuxtPlugin(() => {
  const { locale, t } = useI18n()
  
  // Set initial HTML lang attribute
  if (process.client) {
    document.documentElement.lang = locale.value
  }
  
  // Provide global $t helper
  return {
    provide: {
      t
    }
  }
})


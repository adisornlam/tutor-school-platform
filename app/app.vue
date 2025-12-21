<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  
  <!-- Confirmation Modal - Global for all pages -->
  <ConfirmModal
    v-if="confirmIsOpen || confirmOptions"
    :is-open="confirmIsOpen"
    :title="confirmOptions?.title"
    :message="confirmOptions?.message || ''"
    :confirm-text="confirmOptions?.confirmText"
    :cancel-text="confirmOptions?.cancelText"
    :type="confirmOptions?.type"
    :show-input="confirmOptions?.showInput"
    :input-label="confirmOptions?.inputLabel"
    :input-placeholder="confirmOptions?.inputPlaceholder"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <!-- Token Expiration Dialog - Global for all pages -->
  <TokenExpirationDialog
    v-if="tokenExpirationDialogOpen || tokenExpirationMessage"
    :is-open="tokenExpirationDialogOpen"
    :message="tokenExpirationMessage"
    @close="closeTokenExpirationDialog"
    @login="handleTokenExpirationLogin"
  />
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

// Global confirmation modal
const { isOpen: confirmIsOpen, options: confirmOptions, handleConfirm, handleCancel } = useConfirm()

// Global token expiration dialog
const { 
  showExpirationDialog: tokenExpirationDialogOpen, 
  expirationMessage: tokenExpirationMessage,
  closeExpirationDialog: closeTokenExpirationDialog,
  redirectToLogin: handleTokenExpirationLogin
} = useTokenExpiration()
</script>


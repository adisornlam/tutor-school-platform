export const useTokenExpiration = () => {
  const showExpirationDialog = useState<boolean>('tokenExpiration:showDialog', () => false)
  const expirationMessage = useState<string>('tokenExpiration:message', () => '')

  const handleTokenExpiration = (message?: string) => {
    // Default message for session timeout (not login failure)
    expirationMessage.value = message || 'เซสชันของคุณหมดอายุแล้ว เนื่องจากไม่ได้ใช้งานตามเวลาที่กำหนด\nกรุณาเข้าสู่ระบบอีกครั้ง'
    showExpirationDialog.value = true
  }

  const closeExpirationDialog = () => {
    showExpirationDialog.value = false
    expirationMessage.value = ''
  }

  const redirectToLogin = async () => {
    const { logout } = useAuth()
    closeExpirationDialog()
    await logout()
    await navigateTo('/auth/login')
  }

  return {
    showExpirationDialog: readonly(showExpirationDialog),
    expirationMessage: readonly(expirationMessage),
    handleTokenExpiration,
    closeExpirationDialog,
    redirectToLogin
  }
}


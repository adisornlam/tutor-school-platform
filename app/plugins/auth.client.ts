export default defineNuxtPlugin((nuxtApp) => {
  const { handleTokenExpiration, redirectToLogin } = useTokenExpiration()
  let isHandlingExpiration = false

  // Intercept $fetch errors globally
  if (process.client) {
    // Store original $fetch
    const originalFetch = $fetch
    
    // Create a wrapper function
    const fetchWithAuth = async (...args: any[]) => {
      try {
        return await originalFetch(...args)
      } catch (error: any) {
        // Check if it's a 401 error (token expired or invalid)
        if (error?.statusCode === 401 || error?.status === 401) {
          const message = (error?.data?.message || error?.message || '').toLowerCase()
          
          // Check if it's a login failure (should NOT show session expiration dialog)
          // Check both English and Thai error messages
          const isLoginFailure = message.includes('username or password') || 
                                 message.includes('invalid username') ||
                                 message.includes('invalid password') ||
                                 message.includes('authentication failed') ||
                                 message.includes('อีเมล์หรือรหัสผ่านไม่ถูกต้อง') ||
                                 message.includes('รหัสผ่านไม่ถูกต้อง') ||
                                 // Check if the request is to login endpoint
                                 (args[0] && typeof args[0] === 'string' && args[0].includes('/auth/login'))
          
          // Only show session expiration dialog if:
          // 1. It's NOT a login failure
          // 2. It's a token/session related error (expired or invalid token)
          // 3. Not already handling expiration
          const isTokenError = message.includes('expired') || 
                               message.includes('invalid or expired token') ||
                               message.includes('invalid or expired refresh token') ||
                               message.includes('session expired') ||
                               message.includes('เซสชัน') ||
                               (message.includes('invalid') && message.includes('token') && !message.includes('username'))
          
          if (!isLoginFailure && isTokenError && !isHandlingExpiration) {
            isHandlingExpiration = true
            handleTokenExpiration('เซสชันของคุณหมดอายุแล้ว เนื่องจากไม่ได้ใช้งานตามเวลาที่กำหนด\nกรุณาเข้าสู่ระบบอีกครั้ง')
            
            // Redirect to login after showing dialog
            setTimeout(async () => {
              await redirectToLogin()
              isHandlingExpiration = false
            }, 2000)
          }
        }
        
        // Re-throw the error so it can be handled by the calling code
        throw error
      }
    }
    
    // Replace $fetch globally
    ;(globalThis as any).$fetch = fetchWithAuth
    nuxtApp.$fetch = fetchWithAuth
  }
})


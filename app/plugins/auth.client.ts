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
          const message = error?.data?.message || error?.message || ''
          
          // Only show dialog if it's a token expiration error and not already handling
          if ((message.includes('expired') || message.includes('Invalid') || message.includes('token') || message.includes('Authentication')) && !isHandlingExpiration) {
            isHandlingExpiration = true
            handleTokenExpiration(message)
            
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


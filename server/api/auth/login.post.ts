import { login } from '../../services/auth.service'
import type { LoginCredentials } from '../../../shared/types/user.types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LoginCredentials>(event)
    console.log('[Login API] Received login request for username:', body.username)
    
    // Validation
    if (!body.username || !body.password) {
      console.log('[Login API] Validation failed: missing username or password')
      throw createError({
        statusCode: 400,
        message: 'Username and password are required'
      })
    }
    
    console.log('[Login API] Calling login service...')
    const result = await login(body)
    console.log('[Login API] Login successful for user ID:', result.user.id)
  
  // Set cookies
  setCookie(event, 'access_token', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 // 15 minutes
  })
  
  setCookie(event, 'refresh_token', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
  
    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    }
  } catch (error: any) {
    console.error('[Login API] Error:', error)
    console.error('[Login API] Error message:', error.message)
    console.error('[Login API] Error statusCode:', error.statusCode)
    
    // Re-throw the error so it can be handled by Nuxt error handling
    throw error
  }
})


import type { UserWithRoles } from '#shared/types/user.types'
import { UserRole } from '#shared/types/user.types'

export const useAuth = () => {
  const user = useState<UserWithRoles | null>('auth.user', () => null)
  const accessToken = useState<string | null>('auth.token', () => null)
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)

  const login = async (username: string, password: string) => {
    const config = useRuntimeConfig()
    const response = await $fetch<{
      success: boolean
      data: {
        user: UserWithRoles
        accessToken: string
      }
    }>(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: { username, password }
    })

    if (response.success) {
      user.value = response.data.user
      accessToken.value = response.data.accessToken
      
      // Store token in cookie
      const tokenCookie = useCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 // 2 hours
      })
      tokenCookie.value = response.data.accessToken
      
      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    return response
  }

  const logout = async () => {
    const config = useRuntimeConfig()
    try {
      await $fetch(`${config.public.apiBase}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      })
    } catch (error) {
      // Ignore errors on logout
    }

    user.value = null
    accessToken.value = null
    const tokenCookie = useCookie('access_token')
    tokenCookie.value = null

    await navigateTo('/')
  }

  const fetchUser = async () => {
    const config = useRuntimeConfig()
    const tokenCookie = useCookie('access_token')
    
    if (!tokenCookie.value) {
      return null
    }

    try {
      const response = await $fetch<{
        success: boolean
        data: UserWithRoles
      }>(`${config.public.apiBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenCookie.value}`
        }
      })

      if (response.success) {
        user.value = response.data
        accessToken.value = tokenCookie.value
        return response.data
      }
    } catch (error) {
      // Token invalid or expired
      user.value = null
      accessToken.value = null
      tokenCookie.value = null
    }

    return null
  }

  const hasRole = (role: UserRole | string) => {
    return user.value?.roles.includes(role as UserRole) ?? false
  }

  const hasAnyRole = (roles: (UserRole | string)[]) => {
    return roles.some(role => hasRole(role))
  }

  return {
    user: readonly(user),
    accessToken: readonly(accessToken),
    isAuthenticated,
    login,
    logout,
    fetchUser,
    hasRole,
    hasAnyRole
  }
}


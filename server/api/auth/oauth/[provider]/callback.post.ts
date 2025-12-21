import { createUser, findUserByEmail, getUserWithRoles } from '#server/services/auth.service'
import { generateAccessToken, generateRefreshToken } from '#server/utils/jwt'
import { queryOne, execute } from '#server/utils/db'
import { UserRole, UserStatus } from '#shared/types/user.types'

export default defineEventHandler(async (event) => {
  const provider = getRouterParam(event, 'provider')
  const body = await readBody(event)
  const { code, redirect_uri } = body

  if (!['google', 'facebook', 'line'].includes(provider || '')) {
    throw createError({
      statusCode: 400,
      message: 'Invalid OAuth provider'
    })
  }

  const config = useRuntimeConfig()
  const clientId = process.env[`OAUTH_${provider!.toUpperCase()}_CLIENT_ID`]
  const clientSecret = process.env[`OAUTH_${provider!.toUpperCase()}_CLIENT_SECRET`]

  if (!clientId || !clientSecret) {
    throw createError({
      statusCode: 500,
      message: `${provider} OAuth is not configured`
    })
  }

  try {
    let userInfo: any = {}

    // Exchange code for access token and get user info
    if (provider === 'google') {
      // Exchange code for token
      const tokenResponse = await $fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect_uri || `${config.public.apiBase}/auth/callback/google`,
          grant_type: 'authorization_code'
        }).toString()
      }) as any

      // Get user info
      const userResponse = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      }) as any

      userInfo = {
        email: userResponse.email,
        firstName: userResponse.given_name,
        lastName: userResponse.family_name,
        picture: userResponse.picture
      }
    } else if (provider === 'facebook') {
      // Exchange code for token
      const tokenResponse = await $fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'GET',
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect_uri || `${config.public.apiBase}/auth/callback/facebook`,
          code
        }
      }) as any

      // Get user info
      const userResponse = await $fetch('https://graph.facebook.com/v18.0/me', {
        params: {
          fields: 'id,name,email,first_name,last_name,picture',
          access_token: tokenResponse.access_token
        }
      }) as any

      userInfo = {
        email: userResponse.email,
        firstName: userResponse.first_name,
        lastName: userResponse.last_name,
        picture: userResponse.picture?.data?.url
      }
    } else if (provider === 'line') {
      // Exchange code for token
      const tokenResponse = await $fetch('https://api.line.me/oauth2/v2.1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirect_uri || `${config.public.apiBase}/auth/callback/line`,
          client_id: clientId,
          client_secret: clientSecret
        }).toString()
      }) as any

      // Get user info
      const userResponse = await $fetch('https://api.line.me/v2/profile', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      }) as any

      // Get email (requires ID token)
      let email = ''
      if (tokenResponse.id_token) {
        // Decode JWT id_token to get email
        const payload = JSON.parse(Buffer.from(tokenResponse.id_token.split('.')[1], 'base64').toString())
        email = payload.email
      }

      userInfo = {
        email: email || `${userResponse.userId}@line.me`,
        firstName: userResponse.displayName?.split(' ')[0] || '',
        lastName: userResponse.displayName?.split(' ').slice(1).join(' ') || '',
        picture: userResponse.pictureUrl
      }
    }

    if (!userInfo.email) {
      throw createError({
        statusCode: 400,
        message: 'Unable to get email from OAuth provider'
      })
    }

    // Check if user exists
    let user = await findUserByEmail(userInfo.email)

    if (!user) {
      // Create new user
      const username = userInfo.email.split('@')[0] + '_' + provider
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
      
      const createdUser = await createUser({
        username,
        email: userInfo.email,
        password: randomPassword, // Will be hashed, user can't login with password
        first_name: userInfo.firstName || '',
        last_name: userInfo.lastName || '',
        phone: undefined
      }, UserRole.PARENT) // Default to parent role for OAuth registrations

      user = createdUser

      // Update avatar if available
      if (userInfo.picture) {
        await execute(
          'UPDATE users SET avatar_url = ? WHERE id = ?',
          [userInfo.picture, user.id]
        )
      }
    } else {
      // Update avatar if available
      if (userInfo.picture && !user.avatar_url) {
        await execute(
          'UPDATE users SET avatar_url = ? WHERE id = ?',
          [userInfo.picture, user.id]
        )
      }
    }

    const userWithRoles = await getUserWithRoles(user.id)
    if (!userWithRoles) {
      throw createError({
        statusCode: 500,
        message: 'Failed to get user roles'
      })
    }

    const accessToken = generateAccessToken(userWithRoles)
    const refreshToken = generateRefreshToken(user.id)

    // Store refresh token
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await execute(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
      [user.id, refreshToken, expiresAt, refreshToken, expiresAt]
    )

    // Set cookies
    setCookie(event, 'access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 // 2 hours
    })

    setCookie(event, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return {
      success: true,
      data: {
        user: userWithRoles,
        accessToken
      }
    }
  } catch (err: any) {
    console.error(`OAuth ${provider} callback error:`, err)
    throw createError({
      statusCode: 500,
      message: err.message || `Failed to authenticate with ${provider}`
    })
  }
})


import jwt from 'jsonwebtoken'
import type { UserWithRoles } from '#shared/types/user.types'

const config = useRuntimeConfig()

export interface JWTPayload {
  userId: number
  email: string
  roles: string[]
}

export function generateAccessToken(user: UserWithRoles): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    roles: user.roles
  }
  
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  })
}

export function generateRefreshToken(userId: number): string {
  return jwt.sign({ userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn
  })
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token'
    })
  }
}

export function verifyRefreshToken(token: string): { userId: number } {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as { userId: number }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired refresh token'
    })
  }
}


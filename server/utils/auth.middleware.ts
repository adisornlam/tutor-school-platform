import type { H3Event } from 'h3'
import { verifyAccessToken } from './jwt'

export async function requireAuth(event: H3Event) {
  const token = getCookie(event, 'access_token') || 
                getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }
  
  try {
    const payload = verifyAccessToken(token)
    event.context.user = payload
    return payload
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Session expired due to inactivity'
    })
  }
}

export async function optionalAuth(event: H3Event) {
  const token = getCookie(event, 'access_token') || 
                getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  try {
    const payload = verifyAccessToken(token)
    event.context.user = payload
    return payload
  } catch (error) {
    return null
  }
}


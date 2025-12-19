import { requireAuth } from '../../utils/auth.middleware'
import { getUserWithRoles } from '../../services/auth.service'

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event)
  const user = await getUserWithRoles(auth.userId)
  
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }
  
  return {
    success: true,
    data: user
  }
})


import { requireAuth } from '../../utils/auth.middleware'
import { query } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  try {
    // Get all active branches
    const branches = await query(
      `SELECT 
        id,
        name,
        code,
        address,
        phone,
        email,
        status,
        created_at,
        updated_at
      FROM branches
      WHERE status = 'active'
      ORDER BY name ASC`
    )

    return {
      success: true,
      data: branches
    }
  } catch (error: any) {
    console.error('Error fetching branches:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch branches'
    })
  }
})


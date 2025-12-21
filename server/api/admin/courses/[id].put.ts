import { requireAuth } from '../../../utils/auth.middleware'
import { query, execute } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const courseId = parseInt(getRouterParam(event, 'id') || '0')
  
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course ID'
    })
  }

  const body = await readBody(event)
  
  // Validation
  if (!body.title || !body.type || body.price === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Title, type, and price are required'
    })
  }

  // Validate type
  const validTypes = ['live_online', 'vod', 'hybrid']
  if (!validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course type'
    })
  }

  // Validate status
  const validStatuses = ['draft', 'published', 'archived']
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid course status'
    })
  }

  // Check if course exists
  const existing = await query(
    'SELECT id FROM courses WHERE id = ?',
    [courseId]
  )
  
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Course not found'
    })
  }

  // Check if code already exists (if provided and different from current)
  if (body.code) {
    const codeCheck = await query(
      'SELECT id FROM courses WHERE code = ? AND id != ?',
      [body.code, courseId]
    )
    
    if (codeCheck.length > 0) {
      throw createError({
        statusCode: 409,
        message: 'Course code already exists'
      })
    }
  }

  // Validate branches array (if provided)
  if (body.branches !== undefined) {
    if (!Array.isArray(body.branches)) {
      throw createError({
        statusCode: 400,
        message: 'Branches must be an array'
      })
    }

    // Validate branch_ids if provided
    if (body.branches.length > 0) {
      const branchIds = body.branches.map((b: any) => 
        typeof b === 'object' ? b.branch_id : b
      ).filter(Boolean)
      
      if (branchIds.length > 0) {
        const existingBranches = await query(
          'SELECT id FROM branches WHERE id IN (?) AND status = "active"',
          [branchIds]
        )
        
        if (existingBranches.length !== branchIds.length) {
          throw createError({
            statusCode: 400,
            message: 'One or more branch IDs are invalid or inactive'
          })
        }
      }
    }
  }

  try {
    // Update course
    await execute(
      `UPDATE courses SET
        title = ?,
        description = ?,
        thumbnail_url = ?,
        type = ?,
        price = ?,
        duration_hours = ?,
        level = ?,
        status = ?,
        code = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        body.title,
        body.description || null,
        body.thumbnail_url || null,
        body.type,
        body.price,
        body.duration_hours || null,
        body.level || null,
        body.status,
        body.code || null,
        courseId
      ]
    )

    // Update course_branches if branches are provided
    if (body.branches !== undefined) {
      // Get current branches
      const currentBranches = await query(
        'SELECT branch_id FROM course_branches WHERE course_id = ?',
        [courseId]
      )
      const currentBranchIds = currentBranches.map((b: any) => b.branch_id)

      // Extract branch IDs from request
      const requestedBranchIds = body.branches.map((b: any) => 
        typeof b === 'object' ? b.branch_id : b
      ).filter(Boolean)

      // Find branches to delete (in current but not in requested)
      const branchesToDelete = currentBranchIds.filter(
        (id: number) => !requestedBranchIds.includes(id)
      )

      // Find branches to add (in requested but not in current)
      const branchesToAdd = body.branches.filter((b: any) => {
        const branchId = typeof b === 'object' ? b.branch_id : b
        return !currentBranchIds.includes(branchId)
      })

      // Find branches to update (in both)
      const branchesToUpdate = body.branches.filter((b: any) => {
        const branchId = typeof b === 'object' ? b.branch_id : b
        return currentBranchIds.includes(branchId)
      })

      // Delete removed branches
      if (branchesToDelete.length > 0) {
        await execute(
          'DELETE FROM course_branches WHERE course_id = ? AND branch_id IN (?)',
          [courseId, branchesToDelete]
        )
      }

      // Add new branches
      for (const branch of branchesToAdd) {
        const branchId = typeof branch === 'object' ? branch.branch_id : branch
        const seatLimit = typeof branch === 'object' ? (branch.seat_limit || null) : null
        const isAvailable = typeof branch === 'object' ? (branch.is_available !== undefined ? branch.is_available : true) : true

        await execute(
          `INSERT INTO course_branches (course_id, branch_id, seat_limit, is_available)
           VALUES (?, ?, ?, ?)`,
          [courseId, branchId, seatLimit, isAvailable]
        )
      }

      // Update existing branches (seat_limit, is_available)
      for (const branch of branchesToUpdate) {
        const branchId = typeof branch === 'object' ? branch.branch_id : branch
        const seatLimit = typeof branch === 'object' ? branch.seat_limit : null
        const isAvailable = typeof branch === 'object' ? (branch.is_available !== undefined ? branch.is_available : true) : true

        await execute(
          `UPDATE course_branches 
           SET seat_limit = ?, is_available = ?
           WHERE course_id = ? AND branch_id = ?`,
          [seatLimit, isAvailable, courseId, branchId]
        )
      }
    }

    // Update course_images if images are provided
    if (body.images !== undefined) {
      // Delete all existing images
      await execute(
        'DELETE FROM course_images WHERE course_id = ?',
        [courseId]
      )

      // Insert new images
      if (Array.isArray(body.images) && body.images.length > 0) {
        for (const image of body.images) {
          await execute(
            `INSERT INTO course_images (course_id, image_url, image_type, display_order, alt_text)
             VALUES (?, ?, ?, ?, ?)`,
            [
              courseId,
              image.image_url,
              image.image_type || 'gallery',
              image.display_order || 0,
              image.alt_text || null
            ]
          )
        }
      }
    }

    // Get course with branches
    const course = await query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    )

    // Get branches for this course
    const courseBranches = await query(
      `SELECT 
        cb.id,
        cb.course_id,
        cb.branch_id,
        cb.seat_limit,
        cb.current_enrollments,
        cb.is_available,
        b.name as branch_name,
        b.code as branch_code
      FROM course_branches cb
      INNER JOIN branches b ON cb.branch_id = b.id
      WHERE cb.course_id = ?`,
      [courseId]
    )

    // Get images for this course
    const courseImages = await query(
      `SELECT 
        id,
        course_id,
        image_url,
        image_type,
        display_order,
        alt_text,
        created_at
      FROM course_images
      WHERE course_id = ?
      ORDER BY display_order ASC, created_at ASC`,
      [courseId]
    )

    return {
      success: true,
      data: {
        ...course[0],
        branches: courseBranches.map((cb: any) => ({
          id: cb.id,
          branch_id: cb.branch_id,
          branch_name: cb.branch_name,
          branch_code: cb.branch_code,
          seat_limit: cb.seat_limit,
          current_enrollments: cb.current_enrollments,
          is_available: cb.is_available
        })),
        images: courseImages
      }
    }
  } catch (error: any) {
    console.error('Error updating course:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update course'
    })
  }
})


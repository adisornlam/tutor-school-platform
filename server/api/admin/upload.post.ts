import { requireAuth } from '../../utils/auth.middleware'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  try {
    // Get query parameters
    const query = getQuery(event)
    const entityType = query.entityType as string // 'courses', 'articles', 'testimonials', 'users'
    const entityId = query.entityId ? parseInt(query.entityId as string) : null
    const fileType = query.fileType as string || 'content' // 'thumbnail', 'content', 'avatar', 'featured'

    // Validate entityType
    const allowedEntityTypes = ['courses', 'articles', 'testimonials', 'users']
    if (!entityType || !allowedEntityTypes.includes(entityType)) {
      throw createError({
        statusCode: 400,
        message: `entityType is required and must be one of: ${allowedEntityTypes.join(', ')}`
      })
    }

    // entityId is required for thumbnail, featured, and avatar
    // For content images, entityId can be null if creating new entity
    if (!entityId && ['thumbnail', 'featured', 'avatar'].includes(fileType)) {
      throw createError({
        statusCode: 400,
        message: 'entityId is required for thumbnail, featured, and avatar file types'
      })
    }

    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }

    const file = formData[0]
    
    if (!file.filename || !file.data) {
      throw createError({
        statusCode: 400,
        message: 'Invalid file'
      })
    }

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!file.type || !allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        message: 'Only image files are allowed (JPEG, PNG, GIF, WebP)'
      })
    }

    // Validate file size based on fileType
    let maxSize = 2 * 1024 * 1024 // Default 2MB
    if (fileType === 'avatar') {
      maxSize = 1 * 1024 * 1024 // 1MB for avatars
    } else if (fileType === 'thumbnail' || fileType === 'featured') {
      maxSize = 2 * 1024 * 1024 // 2MB for thumbnails/featured
    } else if (fileType === 'content') {
      maxSize = 2 * 1024 * 1024 // 2MB for content images
    }

    if (file.data.length > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
      throw createError({
        statusCode: 400,
        message: `File size exceeds ${maxSizeMB}MB limit`
      })
    }

    // Determine directory structure
    let uploadsDir: string
    let publicUrl: string
    let filename: string

    if (entityId) {
      // New structure: uploads/{entityType}/{entityId}/
      const entityDir = join(process.cwd(), 'public', 'uploads', entityType, entityId.toString())
      if (!existsSync(entityDir)) {
        await mkdir(entityDir, { recursive: true })
      }

      // Generate filename based on fileType
      const extension = file.filename.split('.').pop()
      if (fileType === 'thumbnail' || fileType === 'featured' || fileType === 'avatar') {
        // Use fixed name for these types (will overwrite if exists)
        filename = `${fileType}.${extension}`
      } else {
        // For content images, use timestamp
        const timestamp = Date.now()
        filename = `content-${timestamp}.${extension}`
      }

      uploadsDir = entityDir
      publicUrl = `/uploads/${entityType}/${entityId}/${filename}`
    } else {
      // Fallback: uploads/{entityType}/ (for content images when entityId is not available yet)
      uploadsDir = join(process.cwd(), 'public', 'uploads', entityType)
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.filename.split('.').pop()
      filename = `${timestamp}-${randomString}.${extension}`
      publicUrl = `/uploads/${entityType}/${filename}`
    }

    // Save file
    const filePath = join(uploadsDir, filename)
    await writeFile(filePath, file.data)

    return {
      success: true,
      data: {
        url: publicUrl,
        filename: filename,
        originalName: file.filename,
        size: file.data.length,
        type: file.type,
        entityType,
        entityId,
        fileType
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error uploading file:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to upload file'
    })
  }
})


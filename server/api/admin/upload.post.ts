import { requireAuth } from '../../utils/auth.middleware'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  try {
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

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        message: 'File size exceeds 5MB limit'
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.filename.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'courses')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadsDir, filename)
    await writeFile(filePath, file.data)

    // Return public URL
    const publicUrl = `/uploads/courses/${filename}`

    return {
      success: true,
      data: {
        url: publicUrl,
        filename: filename,
        originalName: file.filename,
        size: file.data.length,
        type: file.type
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


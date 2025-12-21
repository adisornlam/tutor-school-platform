import { requireAuth } from '#server/utils/auth.middleware'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  // Get query parameters
  const query = getQuery(event)
  const roomId = query.roomId ? parseInt(query.roomId as string) : null
  const fileType = (query.fileType as string) || 'image' // 'image' or 'file'

  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: 'roomId is required'
    })
  }

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

    // Validate file type
    const isImage = fileType === 'image'
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const allowedFileTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ]

    if (isImage) {
      if (!file.type || !allowedImageTypes.includes(file.type)) {
        throw createError({
          statusCode: 400,
          message: 'Only image files are allowed (JPEG, PNG, GIF, WebP)'
        })
      }
    } else {
      if (!file.type || (!allowedImageTypes.includes(file.type) && !allowedFileTypes.includes(file.type))) {
        throw createError({
          statusCode: 400,
          message: 'File type not allowed'
        })
      }
    }

    // Validate file size
    const maxImageSize = 5 * 1024 * 1024 // 5MB for images
    const maxFileSize = 10 * 1024 * 1024 // 10MB for files
    const maxSize = isImage ? maxImageSize : maxFileSize

    if (file.data.length > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
      throw createError({
        statusCode: 400,
        message: `File size exceeds ${maxSizeMB}MB limit`
      })
    }

    // Generate filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.filename.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Create directory structure: uploads/chat/{roomId}/images or files
    const subdir = isImage ? 'images' : 'files'
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'chat', roomId.toString(), subdir)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadsDir, filename)
    await writeFile(filePath, file.data)

    // Return public URL
    const publicUrl = `/uploads/chat/${roomId}/${subdir}/${filename}`

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


import { d as defineEventHandler, a as getQuery, c as createError, n as readMultipartFormData } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import 'node:http';
import 'node:https';
import 'node:crypto';
import 'stream';
import 'events';
import 'http';
import 'crypto';
import 'buffer';
import 'zlib';
import 'https';
import 'net';
import 'tls';
import 'url';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'querystring';
import 'timers';
import 'object-assign';
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const upload_post = defineEventHandler(async (event) => {
  await requireAuth(event);
  try {
    const query = getQuery(event);
    const entityType = query.entityType;
    const entityId = query.entityId ? parseInt(query.entityId) : null;
    const fileType = query.fileType || "content";
    const allowedEntityTypes = ["courses", "articles", "testimonials", "users"];
    if (!entityType || !allowedEntityTypes.includes(entityType)) {
      throw createError({
        statusCode: 400,
        message: `entityType is required and must be one of: ${allowedEntityTypes.join(", ")}`
      });
    }
    if (!entityId && ["thumbnail", "featured", "avatar"].includes(fileType)) {
      throw createError({
        statusCode: 400,
        message: "entityId is required for thumbnail, featured, and avatar file types"
      });
    }
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No file uploaded"
      });
    }
    const file = formData[0];
    if (!file.filename || !file.data) {
      throw createError({
        statusCode: 400,
        message: "Invalid file"
      });
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!file.type || !allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        message: "Only image files are allowed (JPEG, PNG, GIF, WebP)"
      });
    }
    let maxSize = 2 * 1024 * 1024;
    if (fileType === "avatar") {
      maxSize = 1 * 1024 * 1024;
    } else if (fileType === "thumbnail" || fileType === "featured") {
      maxSize = 2 * 1024 * 1024;
    } else if (fileType === "content") {
      maxSize = 2 * 1024 * 1024;
    }
    if (file.data.length > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      throw createError({
        statusCode: 400,
        message: `File size exceeds ${maxSizeMB}MB limit`
      });
    }
    let uploadsDir;
    let publicUrl;
    let filename;
    if (entityId) {
      const entityDir = join(process.cwd(), "public", "uploads", entityType, entityId.toString());
      if (!existsSync(entityDir)) {
        await mkdir(entityDir, { recursive: true });
      }
      const extension = file.filename.split(".").pop();
      if (fileType === "thumbnail" || fileType === "featured" || fileType === "avatar") {
        filename = `${fileType}.${extension}`;
      } else {
        const timestamp = Date.now();
        filename = `content-${timestamp}.${extension}`;
      }
      uploadsDir = entityDir;
      publicUrl = `/uploads/${entityType}/${entityId}/${filename}`;
    } else {
      uploadsDir = join(process.cwd(), "public", "uploads", entityType);
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.filename.split(".").pop();
      filename = `${timestamp}-${randomString}.${extension}`;
      publicUrl = `/uploads/${entityType}/${filename}`;
    }
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, file.data);
    return {
      success: true,
      data: {
        url: publicUrl,
        filename,
        originalName: file.filename,
        size: file.data.length,
        type: file.type,
        entityType,
        entityId,
        fileType
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error uploading file:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to upload file"
    });
  }
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map

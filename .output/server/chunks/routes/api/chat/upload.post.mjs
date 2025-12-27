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
import 'jws';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const upload_post = defineEventHandler(async (event) => {
  await requireAuth(event);
  const query = getQuery(event);
  const roomId = query.roomId ? parseInt(query.roomId) : null;
  const fileType = query.fileType || "image";
  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: "roomId is required"
    });
  }
  try {
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
    const isImage = fileType === "image";
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const allowedFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain"
    ];
    if (isImage) {
      if (!file.type || !allowedImageTypes.includes(file.type)) {
        throw createError({
          statusCode: 400,
          message: "Only image files are allowed (JPEG, PNG, GIF, WebP)"
        });
      }
    } else {
      if (!file.type || !allowedImageTypes.includes(file.type) && !allowedFileTypes.includes(file.type)) {
        throw createError({
          statusCode: 400,
          message: "File type not allowed"
        });
      }
    }
    const maxImageSize = 5 * 1024 * 1024;
    const maxFileSize = 10 * 1024 * 1024;
    const maxSize = isImage ? maxImageSize : maxFileSize;
    if (file.data.length > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      throw createError({
        statusCode: 400,
        message: `File size exceeds ${maxSizeMB}MB limit`
      });
    }
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.filename.split(".").pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    const subdir = isImage ? "images" : "files";
    const uploadsDir = join(process.cwd(), "public", "uploads", "chat", roomId.toString(), subdir);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, file.data);
    const publicUrl = `/uploads/chat/${roomId}/${subdir}/${filename}`;
    return {
      success: true,
      data: {
        url: publicUrl,
        filename,
        originalName: file.filename,
        size: file.data.length,
        type: file.type
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

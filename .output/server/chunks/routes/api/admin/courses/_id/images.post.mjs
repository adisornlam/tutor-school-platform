import { d as defineEventHandler, b as getRouterParam, c as createError, r as readBody, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../_/auth.middleware.mjs';
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
import 'fs';
import 'path';
import 'querystring';
import 'timers';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const images_post = defineEventHandler(async (event) => {
  await requireAuth(event);
  const courseId = parseInt(getRouterParam(event, "id") || "0");
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: "Invalid course ID"
    });
  }
  const body = await readBody(event);
  if (!body.image_url) {
    throw createError({
      statusCode: 400,
      message: "image_url is required"
    });
  }
  const existing = await query(
    "SELECT id FROM courses WHERE id = ?",
    [courseId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Course not found"
    });
  }
  try {
    const result = await execute(
      `INSERT INTO course_images (course_id, image_url, image_type, display_order, alt_text)
       VALUES (?, ?, ?, ?, ?)`,
      [
        courseId,
        body.image_url,
        body.image_type || "gallery",
        body.display_order || 0,
        body.alt_text || null
      ]
    );
    const image = await query(
      "SELECT * FROM course_images WHERE id = ?",
      [result.insertId]
    );
    return {
      success: true,
      data: image[0]
    };
  } catch (error) {
    console.error("Error adding course image:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to add course image"
    });
  }
});

export { images_post as default };
//# sourceMappingURL=images.post.mjs.map

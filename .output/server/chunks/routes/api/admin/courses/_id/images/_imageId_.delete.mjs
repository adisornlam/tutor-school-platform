import { d as defineEventHandler, b as getRouterParam, c as createError, q as query, e as execute } from '../../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../../_/auth.middleware.mjs';
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
import 'negotiator';
import 'mime-types';
import 'path';
import 'querystring';
import 'base64id';
import 'timers';
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _imageId__delete = defineEventHandler(async (event) => {
  await requireAuth(event);
  const courseId = parseInt(getRouterParam(event, "id") || "0");
  const imageId = parseInt(getRouterParam(event, "imageId") || "0");
  if (!courseId || !imageId) {
    throw createError({
      statusCode: 400,
      message: "Invalid course ID or image ID"
    });
  }
  const existing = await query(
    "SELECT id FROM course_images WHERE id = ? AND course_id = ?",
    [imageId, courseId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Course image not found"
    });
  }
  try {
    await execute(
      "DELETE FROM course_images WHERE id = ? AND course_id = ?",
      [imageId, courseId]
    );
    return {
      success: true,
      message: "Course image deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting course image:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete course image"
    });
  }
});

export { _imageId__delete as default };
//# sourceMappingURL=_imageId_.delete.mjs.map

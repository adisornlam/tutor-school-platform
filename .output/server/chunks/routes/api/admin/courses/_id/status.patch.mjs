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
import 'accepts';
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

const status_patch = defineEventHandler(async (event) => {
  await requireAuth(event);
  const courseId = parseInt(getRouterParam(event, "id") || "0");
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: "Invalid course ID"
    });
  }
  const body = await readBody(event);
  if (!body.status) {
    throw createError({
      statusCode: 400,
      message: "Status is required"
    });
  }
  const validStatuses = ["draft", "published", "archived"];
  if (!validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid course status"
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
    await execute(
      "UPDATE courses SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [body.status, courseId]
    );
    const course = await query(
      "SELECT * FROM courses WHERE id = ?",
      [courseId]
    );
    return {
      success: true,
      data: course[0]
    };
  } catch (error) {
    console.error("Error updating course status:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update course status"
    });
  }
});

export { status_patch as default };
//# sourceMappingURL=status.patch.mjs.map

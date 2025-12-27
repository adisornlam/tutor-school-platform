import { d as defineEventHandler, b as getRouterParam, c as createError, q as query, e as execute } from '../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../_/auth.middleware.mjs';
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
import 'util';
import 'mysql2/promise';
import 'node:url';

const _id__delete = defineEventHandler(async (event) => {
  await requireAuth(event);
  const courseId = parseInt(getRouterParam(event, "id") || "0");
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: "Invalid course ID"
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
  const enrollments = await query(
    "SELECT id FROM enrollments WHERE course_id = ? LIMIT 1",
    [courseId]
  );
  if (enrollments.length > 0) {
    throw createError({
      statusCode: 409,
      message: "Cannot delete course with existing enrollments"
    });
  }
  try {
    await execute(
      "DELETE FROM courses WHERE id = ?",
      [courseId]
    );
    return {
      success: true,
      message: "Course deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete course"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, r as readBody, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const gradeLevels_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const body = await readBody();
  if (!body.code || !body.name || !body.level_type || !body.grade_number) {
    throw createError({
      statusCode: 400,
      message: "Code, name, level_type, and grade_number are required"
    });
  }
  const existing = await query(
    "SELECT id FROM grade_levels WHERE code = ?",
    [body.code]
  );
  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      message: "Grade level code already exists"
    });
  }
  try {
    const result = await execute(
      `INSERT INTO grade_levels (code, name, level_type, grade_number, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        body.code,
        body.name,
        body.level_type,
        body.grade_number,
        body.display_order || 0
      ]
    );
    const gradeLevels = await query(
      "SELECT * FROM grade_levels WHERE id = ?",
      [result.insertId]
    );
    return {
      success: true,
      data: gradeLevels[0],
      message: "Grade level created successfully"
    };
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "Grade levels table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to create grade level"
    });
  }
});

export { gradeLevels_post as default };
//# sourceMappingURL=grade-levels.post.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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
import 'object-assign';
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const subjectId = parseInt(getRouterParam(event, "id") || "0");
  if (!subjectId) {
    throw createError({
      statusCode: 400,
      message: "Invalid subject ID"
    });
  }
  try {
    const existing = await query("SELECT id FROM subjects WHERE id = ?", [subjectId]);
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Subject not found"
      });
    }
    const usage = await query(
      "SELECT COUNT(*) as count FROM course_subjects WHERE subject_id = ?",
      [subjectId]
    );
    if (((_a = usage[0]) == null ? void 0 : _a.count) > 0) {
      throw createError({
        statusCode: 400,
        message: "Cannot delete subject. It is being used in courses."
      });
    }
    await execute("DELETE FROM subjects WHERE id = ?", [subjectId]);
    return {
      success: true,
      message: "Subject deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "Subjects table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to delete subject"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

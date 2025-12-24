globalThis.__timing__.logStart('Load chunks/routes/api/admin/settings/inclusions/_id_.delete');import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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
import 'engine.io';
import 'socket.io';
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
  const inclusionId = parseInt(getRouterParam(event, "id") || "0");
  if (!inclusionId) {
    throw createError({
      statusCode: 400,
      message: "Invalid inclusion ID"
    });
  }
  try {
    const existing = await query("SELECT id FROM inclusions WHERE id = ?", [inclusionId]);
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Inclusion not found"
      });
    }
    const usage = await query(
      "SELECT COUNT(*) as count FROM course_inclusions WHERE inclusion_id = ?",
      [inclusionId]
    );
    if (((_a = usage[0]) == null ? void 0 : _a.count) > 0) {
      throw createError({
        statusCode: 400,
        message: "Cannot delete inclusion. It is being used in courses."
      });
    }
    await execute("DELETE FROM inclusions WHERE id = ?", [inclusionId]);
    return {
      success: true,
      message: "Inclusion deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "Inclusions table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to delete inclusion"
    });
  }
});

export { _id__delete as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/admin/settings/inclusions/_id_.delete');
//# sourceMappingURL=_id_.delete.mjs.map

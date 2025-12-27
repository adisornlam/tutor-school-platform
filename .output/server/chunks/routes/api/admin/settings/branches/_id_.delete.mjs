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
import 'cookie';
import 'ws';
import 'cors';
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
  const branchId = parseInt(getRouterParam(event, "id") || "0");
  if (!branchId) {
    throw createError({
      statusCode: 400,
      message: "Invalid branch ID"
    });
  }
  const existing = await query("SELECT id FROM branches WHERE id = ?", [branchId]);
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Branch not found"
    });
  }
  const enrollments = await query(
    "SELECT COUNT(*) as count FROM enrollments WHERE branch_id = ?",
    [branchId]
  );
  if (((_a = enrollments[0]) == null ? void 0 : _a.count) > 0) {
    throw createError({
      statusCode: 400,
      message: "Cannot delete branch. It is being used in enrollments."
    });
  }
  await execute("DELETE FROM branches WHERE id = ?", [branchId]);
  return {
    success: true,
    message: "Branch deleted successfully"
  };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

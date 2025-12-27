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
import 'mime-db';
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
  const roleId = parseInt(getRouterParam(event, "id") || "0");
  if (!roleId) {
    throw createError({
      statusCode: 400,
      message: "Invalid role ID"
    });
  }
  try {
    const existing = await query("SELECT id, name FROM roles WHERE id = ?", [roleId]);
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Role not found"
      });
    }
    const roleName = existing[0].name;
    const systemRoles = ["system_admin", "owner", "admin", "branch_admin", "tutor", "parent", "student"];
    if (systemRoles.includes(roleName)) {
      throw createError({
        statusCode: 400,
        message: "Cannot delete system role"
      });
    }
    const usage = await query(
      "SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?",
      [roleId]
    );
    if (((_a = usage[0]) == null ? void 0 : _a.count) > 0) {
      throw createError({
        statusCode: 400,
        message: "Cannot delete role. It is being used by users."
      });
    }
    await execute("DELETE FROM roles WHERE id = ?", [roleId]);
    return {
      success: true,
      message: "Role deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: "Failed to delete role"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

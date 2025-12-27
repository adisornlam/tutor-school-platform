import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, m as findUserById, e as execute } from '../../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const adminRoles = ["system_admin", "owner"];
  if (!roles.some((role) => adminRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const userId = parseInt(getRouterParam(event, "id") || "0");
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "Invalid user ID"
    });
  }
  if (userId === auth.userId) {
    throw createError({
      statusCode: 400,
      message: "Cannot delete your own account"
    });
  }
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: "User not found"
    });
  }
  await execute(
    "UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?",
    ["inactive", userId]
  );
  return {
    success: true,
    message: "User deleted successfully"
  };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

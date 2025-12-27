import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, s as UserStatus, m as findUserById, e as execute, f as getUserWithRoles } from '../../../../../nitro/nitro.mjs';
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
import 'util';
import 'ecdsa-sig-formatter';
import 'buffer-equal-constant-time';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const status_patch = defineEventHandler(async (event) => {
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
      message: "Cannot change your own account status"
    });
  }
  const body = await readBody(event);
  if (!body.status || !Object.values(UserStatus).includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid status. Must be one of: active, inactive, suspended"
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
    [body.status, userId]
  );
  const user = await getUserWithRoles(userId);
  if (!user) {
    throw createError({
      statusCode: 500,
      message: "Failed to get updated user"
    });
  }
  return {
    success: true,
    data: user,
    message: `User status updated to ${body.status}`
  };
});

export { status_patch as default };
//# sourceMappingURL=status.patch.mjs.map

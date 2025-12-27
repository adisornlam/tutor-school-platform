import { d as defineEventHandler, g as getUserRoles, U as UserRole, c as createError, b as getRouterParam, q as query } from '../../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const id = parseInt(getRouterParam(event, "id") || "0");
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: "Valid ID is required"
    });
  }
  const existing = await query(
    "SELECT id FROM content_pages WHERE id = ? LIMIT 1",
    [id]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Page not found"
    });
  }
  try {
    await query("DELETE FROM content_pages WHERE id = ?", [id]);
    return {
      success: true,
      message: "Page deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting content page:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete content page"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, q as query, e as execute } from '../../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../../_/auth.middleware.mjs';
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
import 'negotiator';
import 'mime-types';
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
  const body = await readBody();
  if (!body.status || !["active", "inactive"].includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid status. Must be active or inactive"
    });
  }
  const existing = await query("SELECT id FROM branches WHERE id = ?", [branchId]);
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Branch not found"
    });
  }
  await execute(
    "UPDATE branches SET status = ?, updated_at = NOW() WHERE id = ?",
    [body.status, branchId]
  );
  const branches = await query("SELECT * FROM branches WHERE id = ?", [branchId]);
  return {
    success: true,
    data: branches[0],
    message: `Branch status updated to ${body.status}`
  };
});

export { status_patch as default };
//# sourceMappingURL=status.patch.mjs.map

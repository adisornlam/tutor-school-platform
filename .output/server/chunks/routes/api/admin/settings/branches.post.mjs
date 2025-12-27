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
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const branches_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const body = await readBody(event);
  if (!body.name || !body.code) {
    throw createError({
      statusCode: 400,
      message: "Name and code are required"
    });
  }
  const existing = await query(
    "SELECT id FROM branches WHERE code = ?",
    [body.code]
  );
  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      message: "Branch code already exists"
    });
  }
  const result = await execute(
    `INSERT INTO branches (name, code, address, phone, email, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      body.name,
      body.code,
      body.address || null,
      body.phone || null,
      body.email || null,
      body.status || "active"
    ]
  );
  const branches = await query(
    "SELECT * FROM branches WHERE id = ?",
    [result.insertId]
  );
  return {
    success: true,
    data: branches[0],
    message: "Branch created successfully"
  };
});

export { branches_post as default };
//# sourceMappingURL=branches.post.mjs.map

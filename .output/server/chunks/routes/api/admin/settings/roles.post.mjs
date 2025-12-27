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
import 'util';
import 'mysql2/promise';
import 'node:url';

const roles_post = defineEventHandler(async (event) => {
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
  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: "Name is required"
    });
  }
  try {
    const existing = await query(
      "SELECT id FROM roles WHERE name = ?",
      [body.name]
    );
    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: "Role name already exists"
      });
    }
    const result = await execute(
      `INSERT INTO roles (name, description)
       VALUES (?, ?)`,
      [
        body.name,
        body.description || null
      ]
    );
    const roles2 = await query(
      "SELECT * FROM roles WHERE id = ?",
      [result.insertId]
    );
    return {
      success: true,
      data: roles2[0],
      message: "Role created successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: "Failed to create role"
    });
  }
});

export { roles_post as default };
//# sourceMappingURL=roles.post.mjs.map

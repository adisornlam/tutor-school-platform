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

const inclusions_post = defineEventHandler(async (event) => {
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
  if (!body.code || !body.name) {
    throw createError({
      statusCode: 400,
      message: "Code and name are required"
    });
  }
  try {
    const existing = await query(
      "SELECT id FROM inclusions WHERE code = ?",
      [body.code]
    );
    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: "Inclusion code already exists"
      });
    }
    const result = await execute(
      `INSERT INTO inclusions (code, name, description, icon)
       VALUES (?, ?, ?, ?)`,
      [
        body.code,
        body.name,
        body.description || null,
        body.icon || null
      ]
    );
    const inclusions = await query(
      "SELECT * FROM inclusions WHERE id = ?",
      [result.insertId]
    );
    return {
      success: true,
      data: inclusions[0],
      message: "Inclusion created successfully"
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
      message: "Failed to create inclusion"
    });
  }
});

export { inclusions_post as default };
//# sourceMappingURL=inclusions.post.mjs.map

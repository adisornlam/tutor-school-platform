import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
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
  const body = await readBody();
  try {
    const existing = await query("SELECT id FROM roles WHERE id = ?", [roleId]);
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Role not found"
      });
    }
    if (body.name) {
      const nameCheck = await query(
        "SELECT id FROM roles WHERE name = ? AND id != ?",
        [body.name, roleId]
      );
      if (nameCheck.length > 0) {
        throw createError({
          statusCode: 409,
          message: "Role name already exists"
        });
      }
    }
    const updateFields = [];
    const updateValues = [];
    if (body.name !== void 0) {
      updateFields.push("name = ?");
      updateValues.push(body.name);
    }
    if (body.description !== void 0) {
      updateFields.push("description = ?");
      updateValues.push(body.description);
    }
    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updateValues.push(roleId);
    await execute(
      `UPDATE roles SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );
    const roles2 = await query("SELECT * FROM roles WHERE id = ?", [roleId]);
    return {
      success: true,
      data: roles2[0],
      message: "Role updated successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: "Failed to update role"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

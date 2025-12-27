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
import 'path';
import 'querystring';
import 'timers';
import 'safe-buffer';
import 'util';
import 'jwa';
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
  const branchId = parseInt(getRouterParam(event, "id") || "0");
  if (!branchId) {
    throw createError({
      statusCode: 400,
      message: "Invalid branch ID"
    });
  }
  const body = await readBody(event);
  const existing = await query("SELECT id FROM branches WHERE id = ?", [branchId]);
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Branch not found"
    });
  }
  if (body.code) {
    const codeCheck = await query(
      "SELECT id FROM branches WHERE code = ? AND id != ?",
      [body.code, branchId]
    );
    if (codeCheck.length > 0) {
      throw createError({
        statusCode: 409,
        message: "Branch code already exists"
      });
    }
  }
  const updateFields = [];
  const updateValues = [];
  if (body.name !== void 0) {
    updateFields.push("name = ?");
    updateValues.push(body.name);
  }
  if (body.code !== void 0) {
    updateFields.push("code = ?");
    updateValues.push(body.code);
  }
  if (body.address !== void 0) {
    updateFields.push("address = ?");
    updateValues.push(body.address);
  }
  if (body.phone !== void 0) {
    updateFields.push("phone = ?");
    updateValues.push(body.phone);
  }
  if (body.email !== void 0) {
    updateFields.push("email = ?");
    updateValues.push(body.email);
  }
  if (body.status !== void 0) {
    updateFields.push("status = ?");
    updateValues.push(body.status);
  }
  if (updateFields.length === 0) {
    throw createError({
      statusCode: 400,
      message: "No fields to update"
    });
  }
  updateValues.push(branchId);
  await execute(
    `UPDATE branches SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = ?`,
    updateValues
  );
  const branches = await query("SELECT * FROM branches WHERE id = ?", [branchId]);
  return {
    success: true,
    data: branches[0],
    message: "Branch updated successfully"
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

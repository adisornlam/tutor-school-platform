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
  const subjectId = parseInt(getRouterParam(event, "id") || "0");
  if (!subjectId) {
    throw createError({
      statusCode: 400,
      message: "Invalid subject ID"
    });
  }
  const body = await readBody();
  try {
    const existing = await query("SELECT id FROM subjects WHERE id = ?", [subjectId]);
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Subject not found"
      });
    }
    if (body.code) {
      const codeCheck = await query(
        "SELECT id FROM subjects WHERE code = ? AND id != ?",
        [body.code, subjectId]
      );
      if (codeCheck.length > 0) {
        throw createError({
          statusCode: 409,
          message: "Subject code already exists"
        });
      }
    }
    const updateFields = [];
    const updateValues = [];
    if (body.code !== void 0) {
      updateFields.push("code = ?");
      updateValues.push(body.code);
    }
    if (body.name !== void 0) {
      updateFields.push("name = ?");
      updateValues.push(body.name);
    }
    if (body.short_name !== void 0) {
      updateFields.push("short_name = ?");
      updateValues.push(body.short_name);
    }
    if (body.description !== void 0) {
      updateFields.push("description = ?");
      updateValues.push(body.description);
    }
    if (body.icon !== void 0) {
      updateFields.push("icon = ?");
      updateValues.push(body.icon);
    }
    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updateValues.push(subjectId);
    await execute(
      `UPDATE subjects SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );
    const subjects = await query("SELECT * FROM subjects WHERE id = ?", [subjectId]);
    return {
      success: true,
      data: subjects[0],
      message: "Subject updated successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "Subjects table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to update subject"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

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
import 'object-assign';
import 'vary';
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
  const gradeLevelId = parseInt(getRouterParam(event, "id") || "0");
  if (!gradeLevelId) {
    throw createError({
      statusCode: 400,
      message: "Invalid grade level ID"
    });
  }
  const body = await readBody();
  try {
    const existing = await query("SELECT id FROM grade_levels WHERE id = ?", [gradeLevelId]);
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Grade level not found"
      });
    }
    if (body.code) {
      const codeCheck = await query(
        "SELECT id FROM grade_levels WHERE code = ? AND id != ?",
        [body.code, gradeLevelId]
      );
      if (codeCheck.length > 0) {
        throw createError({
          statusCode: 409,
          message: "Grade level code already exists"
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
    if (body.level_type !== void 0) {
      updateFields.push("level_type = ?");
      updateValues.push(body.level_type);
    }
    if (body.grade_number !== void 0) {
      updateFields.push("grade_number = ?");
      updateValues.push(body.grade_number);
    }
    if (body.display_order !== void 0) {
      updateFields.push("display_order = ?");
      updateValues.push(body.display_order);
    }
    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updateValues.push(gradeLevelId);
    await execute(
      `UPDATE grade_levels SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );
    const gradeLevels = await query("SELECT * FROM grade_levels WHERE id = ?", [gradeLevelId]);
    return {
      success: true,
      data: gradeLevels[0],
      message: "Grade level updated successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "Grade levels table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to update grade level"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

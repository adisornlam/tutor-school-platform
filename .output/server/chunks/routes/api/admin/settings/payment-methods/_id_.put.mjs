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
  const id = parseInt(getRouterParam(event, "id") || "0");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Payment method ID is required"
    });
  }
  const body = await readBody();
  try {
    const existing = await query(
      "SELECT id, code FROM payment_methods WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Payment method not found"
      });
    }
    if (body.is_default) {
      await execute(
        "UPDATE payment_methods SET is_default = FALSE WHERE is_default = TRUE AND id != ?",
        [id]
      );
    }
    const updates = [];
    const values = [];
    if (body.name !== void 0) {
      updates.push("name = ?");
      values.push(body.name);
    }
    if (body.name_en !== void 0) {
      updates.push("name_en = ?");
      values.push(body.name_en || null);
    }
    if (body.description !== void 0) {
      updates.push("description = ?");
      values.push(body.description || null);
    }
    if (body.icon !== void 0) {
      updates.push("icon = ?");
      values.push(body.icon || null);
    }
    if (body.is_active !== void 0) {
      updates.push("is_active = ?");
      values.push(body.is_active);
    }
    if (body.is_default !== void 0) {
      updates.push("is_default = ?");
      values.push(body.is_default);
    }
    if (body.display_order !== void 0) {
      updates.push("display_order = ?");
      values.push(body.display_order);
    }
    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updates.push("updated_at = NOW()");
    values.push(id);
    await execute(
      `UPDATE payment_methods SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    const updated = await query(
      "SELECT * FROM payment_methods WHERE id = ?",
      [id]
    );
    return {
      success: true,
      data: updated[0],
      message: "Payment method updated successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error updating payment method:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to update payment method"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

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
import 'path';
import 'querystring';
import 'timers';
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
  const id = parseInt(getRouterParam(event, "id") || "0");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Payment method ID is required"
    });
  }
  const body = await readBody();
  if (body.is_active === void 0) {
    throw createError({
      statusCode: 400,
      message: "is_active is required"
    });
  }
  try {
    const existing = await query(
      "SELECT id, is_default FROM payment_methods WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Payment method not found"
      });
    }
    if (existing[0].is_default && !body.is_active) {
      throw createError({
        statusCode: 400,
        message: "Cannot deactivate default payment method"
      });
    }
    await execute(
      "UPDATE payment_methods SET is_active = ?, updated_at = NOW() WHERE id = ?",
      [body.is_active, id]
    );
    const updated = await query(
      "SELECT * FROM payment_methods WHERE id = ?",
      [id]
    );
    return {
      success: true,
      data: updated[0],
      message: `Payment method ${body.is_active ? "activated" : "deactivated"} successfully`
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error updating payment method status:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to update payment method status"
    });
  }
});

export { status_patch as default };
//# sourceMappingURL=status.patch.mjs.map

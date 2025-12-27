import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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
import 'util';
import 'ecdsa-sig-formatter';
import 'buffer-equal-constant-time';
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

const _id__delete = defineEventHandler(async (event) => {
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
  try {
    const existing = await query(
      "SELECT id, code, is_default FROM payment_methods WHERE id = ?",
      [id]
    );
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Payment method not found"
      });
    }
    const method = existing[0];
    if (method.is_default) {
      throw createError({
        statusCode: 400,
        message: "Cannot delete default payment method"
      });
    }
    const payments = await query(
      "SELECT COUNT(*) as count FROM payments WHERE payment_method = ?",
      [method.code]
    );
    if (payments[0].count > 0) {
      throw createError({
        statusCode: 400,
        message: `Cannot delete payment method. There are ${payments[0].count} payments using this method.`
      });
    }
    await execute(
      "DELETE FROM payment_methods WHERE id = ?",
      [id]
    );
    return {
      success: true,
      message: "Payment method deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error deleting payment method:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to delete payment method"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

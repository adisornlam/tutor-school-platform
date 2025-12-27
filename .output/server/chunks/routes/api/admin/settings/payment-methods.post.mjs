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

const paymentMethods_post = defineEventHandler(async (event) => {
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
  if (!body.code || !body.name || !body.type) {
    throw createError({
      statusCode: 400,
      message: "Code, name, and type are required"
    });
  }
  if (!/^[a-z0-9_]+$/.test(body.code)) {
    throw createError({
      statusCode: 400,
      message: "Code must contain only lowercase letters, numbers, and underscores"
    });
  }
  try {
    const existing = await query(
      "SELECT id FROM payment_methods WHERE code = ?",
      [body.code]
    );
    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: "Payment method with this code already exists"
      });
    }
    if (body.is_default) {
      await execute(
        "UPDATE payment_methods SET is_default = FALSE WHERE is_default = TRUE"
      );
    }
    await execute(
      `INSERT INTO payment_methods (
        code, name, name_en, type, description, icon,
        is_active, is_default, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.code,
        body.name,
        body.name_en || null,
        body.type,
        body.description || null,
        body.icon || null,
        body.is_active !== void 0 ? body.is_active : true,
        body.is_default !== void 0 ? body.is_default : false,
        body.display_order || 0
      ]
    );
    const [created] = await query(
      "SELECT * FROM payment_methods WHERE code = ?",
      [body.code]
    );
    return {
      success: true,
      data: created[0],
      message: "Payment method created successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error creating payment method:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to create payment method"
    });
  }
});

export { paymentMethods_post as default };
//# sourceMappingURL=payment-methods.post.mjs.map

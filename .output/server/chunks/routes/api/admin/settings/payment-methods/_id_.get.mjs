import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query } from '../../../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
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
    const methods = await query(
      "SELECT * FROM payment_methods WHERE id = ?",
      [id]
    );
    if (methods.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Payment method not found"
      });
    }
    return {
      success: true,
      data: methods[0]
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error fetching payment method:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch payment method"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map

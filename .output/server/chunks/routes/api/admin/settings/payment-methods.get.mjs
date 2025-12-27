import { d as defineEventHandler, g as getUserRoles, c as createError, q as query } from '../../../../nitro/nitro.mjs';
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
import 'jws';
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

const paymentMethods_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  try {
    const paymentMethods = await query(
      `SELECT 
        id,
        code,
        name,
        name_en,
        type,
        description,
        icon,
        is_active,
        is_default,
        display_order,
        created_at,
        updated_at
      FROM payment_methods
      ORDER BY display_order, name`
    );
    return {
      success: true,
      data: paymentMethods
    };
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "Payment methods table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to fetch payment methods"
    });
  }
});

export { paymentMethods_get as default };
//# sourceMappingURL=payment-methods.get.mjs.map

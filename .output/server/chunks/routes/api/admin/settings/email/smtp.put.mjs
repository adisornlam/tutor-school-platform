import { d as defineEventHandler, g as getUserRoles, c as createError, r as readBody } from '../../../../../nitro/nitro.mjs';
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

const smtp_put = defineEventHandler(async (event) => {
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
  if (!body.host || !body.port || !body.from_email || !body.from_name) {
    throw createError({
      statusCode: 400,
      message: "Host, port, from email, and from name are required"
    });
  }
  if (body.port < 1 || body.port > 65535) {
    throw createError({
      statusCode: 400,
      message: "Port must be between 1 and 65535"
    });
  }
  try {
    const smtpSettings = {
      host: body.host,
      port: body.port,
      secure: body.secure || false,
      username: body.username,
      from_email: body.from_email,
      from_name: body.from_name,
      enabled: body.enabled || false
      // Don't store password here, handle separately in secure storage
    };
    return {
      success: true,
      data: smtpSettings,
      message: "SMTP settings updated successfully"
    };
  } catch (error) {
    console.error("Error updating SMTP settings:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update SMTP settings"
    });
  }
});

export { smtp_put as default };
//# sourceMappingURL=smtp.put.mjs.map

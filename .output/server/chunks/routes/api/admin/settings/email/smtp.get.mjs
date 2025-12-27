import { d as defineEventHandler, g as getUserRoles, c as createError } from '../../../../../nitro/nitro.mjs';
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
import 'mime-db';
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

const smtp_get = defineEventHandler(async (event) => {
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
    const smtpSettings = {
      host: process.env.SMTP_HOST || "",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      username: process.env.SMTP_USERNAME || "",
      password: "",
      // Never return password
      from_email: process.env.SMTP_FROM_EMAIL || "",
      from_name: process.env.SMTP_FROM_NAME || "",
      enabled: process.env.SMTP_ENABLED === "true"
    };
    return {
      success: true,
      data: smtpSettings
    };
  } catch (error) {
    console.error("Error fetching SMTP settings:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch SMTP settings"
    });
  }
});

export { smtp_get as default };
//# sourceMappingURL=smtp.get.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody } from '../../../../../../nitro/nitro.mjs';
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
import 'accepts';
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
  const templateId = parseInt(getRouterParam(event, "id") || "0");
  if (!templateId) {
    throw createError({
      statusCode: 400,
      message: "Invalid template ID"
    });
  }
  const body = await readBody();
  if (!body.name && !body.subject && !body.body) {
    throw createError({
      statusCode: 400,
      message: "At least one field (name, subject, body) is required"
    });
  }
  try {
    const updatedTemplate = {
      id: templateId,
      ...body,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    return {
      success: true,
      data: updatedTemplate,
      message: "Email template updated successfully"
    };
  } catch (error) {
    console.error("Error updating email template:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update email template"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__delete = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const testimonialId = parseInt(getRouterParam(event, "id") || "0");
  if (!testimonialId) {
    throw createError({
      statusCode: 400,
      message: "Invalid testimonial ID"
    });
  }
  const existing = await query(
    "SELECT id FROM testimonials WHERE id = ?",
    [testimonialId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Testimonial not found"
    });
  }
  try {
    await execute("DELETE FROM testimonials WHERE id = ?", [testimonialId]);
    return {
      success: true,
      message: "Testimonial deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete testimonial"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

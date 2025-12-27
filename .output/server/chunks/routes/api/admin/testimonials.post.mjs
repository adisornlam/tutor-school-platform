import { d as defineEventHandler, g as getUserRoles, c as createError, r as readBody, e as execute } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
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

const testimonials_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const body = await readBody();
  if (!body.name || !body.role || !body.comment || !body.rating) {
    throw createError({
      statusCode: 400,
      message: "Name, role, comment, and rating are required"
    });
  }
  if (body.rating < 1 || body.rating > 5) {
    throw createError({
      statusCode: 400,
      message: "Rating must be between 1 and 5"
    });
  }
  const validStatuses = ["pending", "approved", "rejected"];
  const status = body.status && validStatuses.includes(body.status) ? body.status : "pending";
  try {
    const result = await execute(
      `INSERT INTO testimonials (name, role, comment, rating, avatar_url, status, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.role,
        body.comment,
        body.rating,
        body.avatar_url || null,
        status,
        body.display_order || 0
      ]
    );
    return {
      success: true,
      data: {
        id: result.insertId
      }
    };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create testimonial"
    });
  }
});

export { testimonials_post as default };
//# sourceMappingURL=testimonials.post.mjs.map

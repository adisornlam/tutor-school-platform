import { d as defineEventHandler, g as getUserRoles, c as createError, a as getQuery, q as query } from '../../../nitro/nitro.mjs';
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

const testimonials_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const queryParams = getQuery(event);
  const search = queryParams.search;
  const status = queryParams.status;
  let sql = `
    SELECT 
      id,
      name,
      role,
      comment,
      rating,
      avatar_url,
      status,
      display_order,
      created_at,
      updated_at
    FROM testimonials
    WHERE 1=1
  `;
  const params = [];
  if (search) {
    sql += ` AND (name LIKE ? OR role LIKE ? OR comment LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }
  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY display_order ASC, created_at DESC`;
  try {
    const testimonials = await query(sql, params);
    return {
      success: true,
      data: testimonials
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch testimonials"
    });
  }
});

export { testimonials_get as default };
//# sourceMappingURL=testimonials.get.mjs.map

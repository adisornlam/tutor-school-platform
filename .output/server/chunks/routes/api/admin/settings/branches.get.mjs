import { d as defineEventHandler, g as getUserRoles, c as createError, a as getQuery, q as query } from '../../../../nitro/nitro.mjs';
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
import 'object-assign';
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const branches_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const queryParams = getQuery(event);
  const search = queryParams.search;
  const status = queryParams.status;
  let whereConditions = [];
  const queryValues = [];
  if (search) {
    whereConditions.push(`(name LIKE ? OR code LIKE ? OR address LIKE ?)`);
    const searchPattern = `%${search}%`;
    queryValues.push(searchPattern, searchPattern, searchPattern);
  }
  if (status) {
    whereConditions.push(`status = ?`);
    queryValues.push(status);
  }
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  try {
    const branches = await query(
      `SELECT 
        id,
        name,
        code,
        address,
        phone,
        email,
        status,
        created_at,
        updated_at
      FROM branches
      ${whereClause}
      ORDER BY name ASC`,
      queryValues
    );
    return {
      success: true,
      data: branches
    };
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch branches"
    });
  }
});

export { branches_get as default };
//# sourceMappingURL=branches.get.mjs.map

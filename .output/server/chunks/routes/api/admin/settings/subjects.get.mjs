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

const subjects_get = defineEventHandler(async (event) => {
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
  let whereConditions = [];
  const queryValues = [];
  if (search) {
    whereConditions.push(`(name LIKE ? OR code LIKE ? OR short_name LIKE ?)`);
    const searchPattern = `%${search}%`;
    queryValues.push(searchPattern, searchPattern, searchPattern);
  }
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  try {
    const subjects = await query(
      `SELECT 
        id,
        code,
        name,
        short_name,
        description,
        icon,
        created_at
      FROM subjects
      ${whereClause}
      ORDER BY name ASC`,
      queryValues
    );
    return {
      success: true,
      data: subjects
    };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    if (error.code === "ER_NO_SUCH_TABLE") {
      return {
        success: true,
        data: []
      };
    }
    throw createError({
      statusCode: 500,
      message: "Failed to fetch subjects"
    });
  }
});

export { subjects_get as default };
//# sourceMappingURL=subjects.get.mjs.map

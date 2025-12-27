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
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const users_get = defineEventHandler(async (event) => {
  var _a;
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const adminRoles = ["system_admin", "owner", "admin", "branch_admin"];
  if (!roles.some((role2) => adminRoles.includes(role2))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const queryParams = getQuery(event);
  const role = queryParams.role;
  const search = queryParams.search;
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 20;
  const offset = (page - 1) * limit;
  let whereConditions = [];
  const queryValues = [];
  if (role) {
    whereConditions.push(`r.name = ?`);
    queryValues.push(role);
  }
  const status = queryParams.status;
  if (status) {
    whereConditions.push(`u.status = ?`);
    queryValues.push(status);
  }
  if (search) {
    whereConditions.push(`(
      u.username LIKE ? OR 
      u.email LIKE ? OR 
      u.first_name LIKE ? OR 
      u.last_name LIKE ?
    )`);
    const searchPattern = `%${search}%`;
    queryValues.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }
  whereConditions.push(`u.id IN (
    SELECT DISTINCT ur_inner.user_id
    FROM user_roles ur_inner
    JOIN roles r_inner ON ur_inner.role_id = r_inner.id
    WHERE r_inner.name IN ('system_admin', 'owner', 'admin', 'branch_admin', 'tutor')
  )`);
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const countResult = await query(
    `SELECT COUNT(DISTINCT u.id) as count
     FROM users u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
     ${whereClause}`,
    queryValues
  );
  const total = ((_a = countResult[0]) == null ? void 0 : _a.count) || 0;
  const users = await query(
    `SELECT 
       u.id,
       u.username,
       u.email,
       u.first_name,
       u.last_name,
       u.phone,
       u.status,
       u.created_at,
       u.updated_at,
       GROUP_CONCAT(DISTINCT r.name) as roles
     FROM users u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
     ${whereClause}
     GROUP BY u.id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryValues, limit, offset]
  );
  const formattedUsers = users.map((user) => {
    const allRoles = user.roles ? user.roles.split(",").filter((r) => r && r.trim()) : [];
    const validRoles = ["system_admin", "owner", "admin", "branch_admin", "tutor"];
    const displayRoles = allRoles.filter((role2) => validRoles.includes(role2));
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      status: user.status,
      roles: displayRoles,
      // Only show valid roles
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  });
  return {
    success: true,
    data: formattedUsers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map

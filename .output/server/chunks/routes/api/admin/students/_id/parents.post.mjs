import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, m as findUserById, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const parents_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin", "branch_admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const studentId = parseInt(getRouterParam(event, "id") || "0");
  if (!studentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid student ID"
    });
  }
  const body = await readBody(event);
  if (!body.parent_id || !body.relationship) {
    throw createError({
      statusCode: 400,
      message: "parent_id and relationship are required"
    });
  }
  const student = await findUserById(studentId);
  if (!student) {
    throw createError({
      statusCode: 404,
      message: "Student not found"
    });
  }
  const studentRoles = await query(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'student'`,
    [studentId]
  );
  if (studentRoles.length === 0) {
    throw createError({
      statusCode: 400,
      message: "User is not a student"
    });
  }
  const parent = await findUserById(body.parent_id);
  if (!parent) {
    throw createError({
      statusCode: 404,
      message: "Parent not found"
    });
  }
  const parentRoles = await query(
    `SELECT r.name 
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ? AND r.name = 'parent'`,
    [body.parent_id]
  );
  if (parentRoles.length === 0) {
    throw createError({
      statusCode: 400,
      message: "User is not a parent"
    });
  }
  const existing = await query(
    "SELECT id FROM parent_students WHERE parent_id = ? AND student_id = ?",
    [body.parent_id, studentId]
  );
  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      message: "Parent-student relationship already exists"
    });
  }
  const validRelationships = ["father", "mother", "guardian", "other"];
  if (!validRelationships.includes(body.relationship)) {
    throw createError({
      statusCode: 400,
      message: `Invalid relationship. Must be one of: ${validRelationships.join(", ")}`
    });
  }
  await execute(
    "INSERT INTO parent_students (parent_id, student_id, relationship) VALUES (?, ?, ?)",
    [body.parent_id, studentId, body.relationship]
  );
  const newParent = await query(
    `SELECT 
       p.id,
       p.username,
       p.email,
       p.first_name,
       p.last_name,
       p.phone,
       p.status,
       ps.relationship
     FROM parent_students ps
     INNER JOIN users p ON ps.parent_id = p.id
     WHERE ps.parent_id = ? AND ps.student_id = ?`,
    [body.parent_id, studentId]
  );
  if (newParent.length === 0) {
    throw createError({
      statusCode: 500,
      message: "Failed to retrieve parent information"
    });
  }
  return {
    success: true,
    data: {
      id: newParent[0].id,
      username: newParent[0].username,
      email: newParent[0].email,
      first_name: newParent[0].first_name,
      last_name: newParent[0].last_name,
      phone: newParent[0].phone,
      status: newParent[0].status,
      relationship: newParent[0].relationship
    },
    message: "Parent added successfully"
  };
});

export { parents_post as default };
//# sourceMappingURL=parents.post.mjs.map

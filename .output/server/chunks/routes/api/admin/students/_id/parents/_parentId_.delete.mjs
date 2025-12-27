import { d as defineEventHandler, g as getUserRoles, c as createError, m as findUserById, q as query, e as execute } from '../../../../../../nitro/nitro.mjs';
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
import 'negotiator';
import 'mime-types';
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

const _parentId__delete = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin", "branch_admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const routeParams = event.context.params;
  const studentId = parseInt((routeParams == null ? void 0 : routeParams.id) || "0");
  const parentId = parseInt((routeParams == null ? void 0 : routeParams.parentId) || "0");
  if (!studentId || !parentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid student ID or parent ID"
    });
  }
  const student = await findUserById(studentId);
  if (!student) {
    throw createError({
      statusCode: 404,
      message: "Student not found"
    });
  }
  const relationship = await query(
    "SELECT id FROM parent_students WHERE parent_id = ? AND student_id = ?",
    [parentId, studentId]
  );
  if (relationship.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Parent-student relationship not found"
    });
  }
  await execute(
    "DELETE FROM parent_students WHERE parent_id = ? AND student_id = ?",
    [parentId, studentId]
  );
  return {
    success: true,
    message: "Parent removed successfully"
  };
});

export { _parentId__delete as default };
//# sourceMappingURL=_parentId_.delete.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, r as readBody, m as findUserById, q as query, e as execute } from '../../../../../../nitro/nitro.mjs';
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

const _parentId__patch = defineEventHandler(async (event) => {
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
  const body = await readBody(event);
  const { relationship } = body;
  if (!relationship || !["father", "mother", "guardian", "other"].includes(relationship)) {
    throw createError({
      statusCode: 400,
      message: "Invalid relationship. Must be one of: father, mother, guardian, other"
    });
  }
  const student = await findUserById(studentId);
  if (!student) {
    throw createError({
      statusCode: 404,
      message: "Student not found"
    });
  }
  const existingRelationship = await query(
    "SELECT id, relationship FROM parent_students WHERE parent_id = ? AND student_id = ?",
    [parentId, studentId]
  );
  if (existingRelationship.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Parent-student relationship not found"
    });
  }
  await execute(
    "UPDATE parent_students SET relationship = ? WHERE parent_id = ? AND student_id = ?",
    [relationship, parentId, studentId]
  );
  return {
    success: true,
    message: "Parent relationship updated successfully",
    data: {
      parent_id: parentId,
      student_id: studentId,
      relationship
    }
  };
});

export { _parentId__patch as default };
//# sourceMappingURL=_parentId_.patch.mjs.map

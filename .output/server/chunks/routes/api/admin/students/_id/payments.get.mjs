import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query, m as findUserById } from '../../../../../nitro/nitro.mjs';
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

const payments_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin", "branch_admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required to view payment history."
    });
  }
  const studentId = parseInt(getRouterParam(event, "id") || "0");
  if (!studentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid student ID"
    });
  }
  const isSystemAdmin = roles.includes("system_admin") || roles.includes("owner");
  const isAdmin = roles.includes("admin");
  const isBranchAdmin = roles.includes("branch_admin");
  if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    const branchAdmins = await query(
      "SELECT branch_id FROM branch_admins WHERE user_id = ?",
      [auth.userId]
    );
    if (branchAdmins.length > 0) {
      const branchIds = branchAdmins.map((ba) => ba.branch_id);
      const enrollments = await query(
        `SELECT id FROM enrollments 
         WHERE student_id = ? AND branch_id IN (${branchIds.map(() => "?").join(",")})`,
        [studentId, ...branchIds]
      );
      if (enrollments.length === 0) {
        throw createError({
          statusCode: 403,
          message: "Access denied. Student is not enrolled in your branch."
        });
      }
    }
  }
  const student = await findUserById(studentId);
  if (!student) {
    throw createError({
      statusCode: 404,
      message: "Student not found"
    });
  }
  const payments = await query(
    `SELECT 
       p.id,
       p.amount,
       p.final_amount,
       p.status,
       p.payment_method,
       p.paid_at,
       p.created_at,
       p.updated_at,
       p.invoice_number,
       p.transaction_id,
       e.id as enrollment_id,
       c.title as course_title,
       c.code as course_code,
       b.name as branch_name
     FROM payments p
     LEFT JOIN enrollments e ON p.enrollment_id = e.id
     LEFT JOIN courses c ON e.course_id = c.id
     LEFT JOIN branches b ON e.branch_id = b.id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`,
    [studentId]
  );
  return {
    success: true,
    data: payments.map((p) => ({
      id: p.id,
      amount: parseFloat(p.final_amount || p.amount),
      status: p.status,
      payment_method: p.payment_method,
      payment_method_name: p.payment_method === "bank_transfer" ? "\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19" : p.payment_method === "online" ? "\u0E0A\u0E33\u0E23\u0E30\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C" : p.payment_method || "\u0E44\u0E21\u0E48\u0E23\u0E30\u0E1A\u0E38",
      payment_date: p.paid_at || p.created_at,
      invoice_number: p.invoice_number,
      transaction_id: p.transaction_id,
      enrollment: p.enrollment_id ? {
        id: p.enrollment_id,
        course: {
          title: p.course_title,
          code: p.course_code
        },
        branch: {
          name: p.branch_name
        }
      } : null,
      created_at: p.created_at,
      updated_at: p.updated_at
    }))
  };
});

export { payments_get as default };
//# sourceMappingURL=payments.get.mjs.map

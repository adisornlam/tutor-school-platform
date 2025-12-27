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
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const enrollments_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin", "branch_admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const queryParams = getQuery(event);
  const search = queryParams.search;
  const status = queryParams.status;
  const courseId = queryParams.course_id;
  const studentId = queryParams.student_id;
  const branchId = queryParams.branch_id;
  const params = [];
  let hasEnrollmentType = false;
  let hasShippingAddress = false;
  try {
    const columnCheck = await query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'enrollments' 
       AND COLUMN_NAME IN ('enrollment_type', 'shipping_address_id')`
    );
    hasEnrollmentType = columnCheck.some((col) => col.COLUMN_NAME === "enrollment_type");
    hasShippingAddress = columnCheck.some((col) => col.COLUMN_NAME === "shipping_address_id");
  } catch (error) {
    console.log("[Enrollments API] Could not check column existence, assuming columns don't exist");
  }
  const enrollmentTypeSelect = hasEnrollmentType ? `COALESCE(e.enrollment_type, 'onsite') as enrollment_type` : `'onsite' as enrollment_type`;
  const shippingAddressSelect = hasShippingAddress ? `e.shipping_address_id` : `NULL as shipping_address_id`;
  let sql = `
    SELECT 
      e.id,
      e.student_id,
      e.course_id,
      e.branch_id,
      ${enrollmentTypeSelect},
      ${shippingAddressSelect},
      e.enrollment_date,
      e.status,
      e.payment_id,
      e.created_at,
      e.updated_at,
      s.username as student_username,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.email as student_email,
      c.title as course_title,
      c.code as course_code,
      c.price as course_price,
      b.name as branch_name,
      b.code as branch_code
    FROM enrollments e
    INNER JOIN users s ON e.student_id = s.id
    INNER JOIN courses c ON e.course_id = c.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE 1=1
  `;
  if (search) {
    sql += ` AND (
      s.username LIKE ? OR 
      s.first_name LIKE ? OR 
      s.last_name LIKE ? OR 
      s.email LIKE ? OR
      c.title LIKE ? OR 
      c.code LIKE ?
    )`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }
  if (status) {
    sql += ` AND e.status = ?`;
    params.push(status);
  }
  if (courseId) {
    sql += ` AND e.course_id = ?`;
    params.push(parseInt(courseId));
  }
  if (studentId) {
    sql += ` AND e.student_id = ?`;
    params.push(parseInt(studentId));
  }
  if (branchId) {
    sql += ` AND e.branch_id = ?`;
    params.push(parseInt(branchId));
  }
  sql += ` ORDER BY e.created_at DESC`;
  try {
    const enrollments = await query(sql, params);
    return {
      success: true,
      data: enrollments
    };
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    console.error("SQL:", sql);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to fetch enrollments"
    });
  }
});

export { enrollments_get as default };
//# sourceMappingURL=enrollments.get.mjs.map

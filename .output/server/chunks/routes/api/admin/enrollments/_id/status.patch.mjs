import { d as defineEventHandler, b as getRouterParam, c as createError, r as readBody, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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
import 'mime-db';
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

const status_patch = defineEventHandler(async (event) => {
  await requireAuth(event);
  const enrollmentId = parseInt(getRouterParam(event, "id") || "0");
  if (!enrollmentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid enrollment ID"
    });
  }
  const body = await readBody(event);
  if (!body.status) {
    throw createError({
      statusCode: 400,
      message: "Status is required"
    });
  }
  const validStatuses = ["pending", "active", "completed", "cancelled"];
  if (!validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid enrollment status"
    });
  }
  try {
    const enrollment = await query(
      "SELECT id, course_id, branch_id, status FROM enrollments WHERE id = ?",
      [enrollmentId]
    );
    if (enrollment.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Enrollment not found"
      });
    }
    const oldStatus = enrollment[0].status;
    const courseId = enrollment[0].course_id;
    const branchId = enrollment[0].branch_id;
    await execute(
      "UPDATE enrollments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [body.status, enrollmentId]
    );
    if (oldStatus === "active" && body.status !== "active") {
      await execute(
        `UPDATE course_branches 
         SET current_enrollments = GREATEST(0, current_enrollments - 1) 
         WHERE course_id = ? AND branch_id = ?`,
        [courseId, branchId]
      );
    } else if (oldStatus !== "active" && body.status === "active") {
      await execute(
        `UPDATE course_branches 
         SET current_enrollments = current_enrollments + 1 
         WHERE course_id = ? AND branch_id = ?`,
        [courseId, branchId]
      );
    }
    const updated = await query(
      `SELECT 
        e.id,
        e.student_id,
        e.course_id,
        e.branch_id,
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
        b.name as branch_name,
        b.code as branch_code
      FROM enrollments e
      INNER JOIN users s ON e.student_id = s.id
      INNER JOIN courses c ON e.course_id = c.id
      INNER JOIN branches b ON e.branch_id = b.id
      WHERE e.id = ?`,
      [enrollmentId]
    );
    return {
      success: true,
      data: updated[0]
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error updating enrollment status:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update enrollment status"
    });
  }
});

export { status_patch as default };
//# sourceMappingURL=status.patch.mjs.map

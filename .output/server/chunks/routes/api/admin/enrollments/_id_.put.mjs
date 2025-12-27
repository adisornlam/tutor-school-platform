import { d as defineEventHandler, b as getRouterParam, c as createError, r as readBody, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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
import 'accepts';
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

const _id__put = defineEventHandler(async (event) => {
  await requireAuth(event);
  const enrollmentId = parseInt(getRouterParam(event, "id") || "0");
  if (!enrollmentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid enrollment ID"
    });
  }
  const body = await readBody(event);
  const existing = await query(
    "SELECT id, course_id, branch_id, status, enrollment_type, shipping_address_id FROM enrollments WHERE id = ?",
    [enrollmentId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Enrollment not found"
    });
  }
  const oldEnrollment = existing[0];
  const validStatuses = ["pending", "active", "completed", "cancelled"];
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid enrollment status"
    });
  }
  if (body.enrollment_type && !["onsite", "online"].includes(body.enrollment_type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid enrollment type. Must be "onsite" or "online"'
    });
  }
  const enrollmentType = body.enrollment_type !== void 0 ? body.enrollment_type : oldEnrollment.enrollment_type || "onsite";
  try {
    if (body.student_id) {
      const students = await query(
        "SELECT id FROM users WHERE id = ?",
        [body.student_id]
      );
      if (students.length === 0) {
        throw createError({
          statusCode: 404,
          message: "Student not found"
        });
      }
    }
    if (body.course_id) {
      const courses = await query(
        "SELECT id FROM courses WHERE id = ?",
        [body.course_id]
      );
      if (courses.length === 0) {
        throw createError({
          statusCode: 404,
          message: "Course not found"
        });
      }
    }
    if (body.branch_id && enrollmentType === "onsite") {
      const branches = await query(
        'SELECT id FROM branches WHERE id = ? AND status = "active"',
        [body.branch_id]
      );
      if (branches.length === 0) {
        throw createError({
          statusCode: 404,
          message: "Branch not found or inactive"
        });
      }
    }
    if (body.shipping_address_id && enrollmentType === "online") {
      const studentId = body.student_id || oldEnrollment.student_id;
      const addresses = await query(
        "SELECT id FROM user_addresses WHERE id = ? AND user_id = ?",
        [body.shipping_address_id, studentId]
      );
      if (addresses.length === 0) {
        throw createError({
          statusCode: 404,
          message: "Shipping address not found or does not belong to student"
        });
      }
    }
    const updates = [];
    const params = [];
    if (body.student_id !== void 0) {
      updates.push("student_id = ?");
      params.push(body.student_id);
    }
    if (body.course_id !== void 0) {
      updates.push("course_id = ?");
      params.push(body.course_id);
    }
    if (body.enrollment_type !== void 0) {
      updates.push("enrollment_type = ?");
      params.push(body.enrollment_type);
    }
    if (body.branch_id !== void 0) {
      if (enrollmentType === "online") {
        updates.push("branch_id = NULL");
      } else {
        updates.push("branch_id = ?");
        params.push(body.branch_id);
      }
    }
    if (body.shipping_address_id !== void 0) {
      if (enrollmentType === "onsite") {
        updates.push("shipping_address_id = NULL");
      } else {
        updates.push("shipping_address_id = ?");
        params.push(body.shipping_address_id);
      }
    }
    if (body.enrollment_date !== void 0) {
      updates.push("enrollment_date = ?");
      params.push(body.enrollment_date);
    }
    if (body.status !== void 0) {
      updates.push("status = ?");
      params.push(body.status);
    }
    if (body.payment_id !== void 0) {
      updates.push("payment_id = ?");
      params.push(body.payment_id);
    }
    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(enrollmentId);
    await execute(
      `UPDATE enrollments SET ${updates.join(", ")} WHERE id = ?`,
      params
    );
    if (body.status && body.status !== oldEnrollment.status) {
      const finalEnrollmentType = body.enrollment_type !== void 0 ? body.enrollment_type : oldEnrollment.enrollment_type || "onsite";
      if (finalEnrollmentType === "onsite") {
        const courseId = body.course_id || oldEnrollment.course_id;
        const branchId = body.branch_id || oldEnrollment.branch_id;
        if (oldEnrollment.status === "active" && body.status !== "active") {
          await execute(
            `UPDATE course_branches 
             SET current_enrollments = GREATEST(0, current_enrollments - 1) 
             WHERE course_id = ? AND branch_id = ?`,
            [courseId, branchId]
          );
        } else if (oldEnrollment.status !== "active" && body.status === "active") {
          await execute(
            `UPDATE course_branches 
             SET current_enrollments = current_enrollments + 1 
             WHERE course_id = ? AND branch_id = ?`,
            [courseId, branchId]
          );
        }
      }
    }
    const enrollment = await query(
      `SELECT 
        e.id,
        e.student_id,
        e.course_id,
        e.branch_id,
        e.enrollment_type,
        e.shipping_address_id,
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
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE e.id = ?`,
      [enrollmentId]
    );
    return {
      success: true,
      data: enrollment[0]
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error updating enrollment:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update enrollment"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

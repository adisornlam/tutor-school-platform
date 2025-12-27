import { d as defineEventHandler, g as getUserRoles, c as createError, q as query } from '../../../nitro/nitro.mjs';
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

const myCourses_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["student", "parent"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Student or Parent role required."
    });
  }
  let studentIds = [auth.userId];
  if (roles.includes("parent")) {
    const linkedStudents = await query(
      `SELECT DISTINCT student_id 
       FROM parent_students 
       WHERE parent_id = ? AND is_active = 1`,
      [auth.userId]
    );
    studentIds = [auth.userId, ...linkedStudents.map((s) => s.student_id)];
  }
  let hasEnrollmentType = false;
  try {
    const columnCheck = await query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'enrollments' 
       AND COLUMN_NAME = 'enrollment_type'`
    );
    hasEnrollmentType = columnCheck.length > 0;
  } catch (error) {
    console.log("[My Courses API] Could not check column existence, assuming column doesn't exist");
  }
  const enrollmentTypeSelect = hasEnrollmentType ? `COALESCE(e.enrollment_type, 'onsite') as enrollment_type` : `'onsite' as enrollment_type`;
  const placeholders = studentIds.map(() => "?").join(",");
  let sql = `
    SELECT 
      e.id,
      e.student_id,
      e.course_id,
      e.branch_id,
      ${enrollmentTypeSelect},
      e.enrollment_date,
      e.status,
      e.created_at,
      e.updated_at,
      c.id as course_id,
      c.title as course_title,
      c.code as course_code,
      c.description as course_description,
      c.thumbnail_url as course_thumbnail_url,
      c.type as course_type,
      c.level as course_level,
      c.price as course_price,
      c.onsite_price,
      c.online_price,
      b.name as branch_name,
      b.code as branch_code,
      s.first_name as student_first_name,
      s.last_name as student_last_name,
      s.username as student_username
    FROM enrollments e
    INNER JOIN courses c ON e.course_id = c.id
    LEFT JOIN branches b ON e.branch_id = b.id
    INNER JOIN users s ON e.student_id = s.id
    WHERE e.student_id IN (${placeholders})
      AND e.status IN ('active', 'completed')
    ORDER BY e.enrollment_date DESC
  `;
  try {
    const enrollments = await query(sql, studentIds);
    const formattedEnrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrollmentDate: enrollment.enrollment_date,
      status: enrollment.status,
      enrollmentType: enrollment.enrollment_type || "onsite",
      course: {
        id: enrollment.course_id,
        title: enrollment.course_title,
        code: enrollment.course_code,
        description: enrollment.course_description,
        thumbnail: enrollment.course_thumbnail_url,
        thumbnail_url: enrollment.course_thumbnail_url,
        type: enrollment.course_type,
        level: enrollment.course_level,
        price: enrollment.course_price,
        onsite_price: enrollment.onsite_price,
        online_price: enrollment.online_price
      },
      branch: enrollment.branch_id ? {
        id: enrollment.branch_id,
        name: enrollment.branch_name,
        code: enrollment.branch_code
      } : null,
      student: {
        id: enrollment.student_id,
        firstName: enrollment.student_first_name,
        lastName: enrollment.student_last_name,
        username: enrollment.student_username
      },
      // TODO: Calculate progress from learning progress table if exists
      progress: 0,
      createdAt: enrollment.created_at,
      updatedAt: enrollment.updated_at
    }));
    return {
      success: true,
      data: formattedEnrollments
    };
  } catch (error) {
    console.error("[My Courses API] Error fetching enrollments:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to fetch enrollments"
    });
  }
});

export { myCourses_get as default };
//# sourceMappingURL=my-courses.get.mjs.map

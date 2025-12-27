import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, m as findUserById, q as query } from '../../../../nitro/nitro.mjs';
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
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin", "branch_admin", "tutor"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin or Tutor role required."
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
  const isTutor = roles.includes("tutor");
  if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    const { query: query2 } = await import('../../../../nitro/nitro.mjs').then(function (n) { return n.a9; });
    const branchAdmins = await query2(
      "SELECT branch_id FROM branch_admins WHERE user_id = ?",
      [auth.userId]
    );
    if (branchAdmins.length > 0) {
      const branchIds = branchAdmins.map((ba) => ba.branch_id);
      const enrollments2 = await query2(
        `SELECT id FROM enrollments 
           WHERE student_id = ? AND branch_id IN (${branchIds.map(() => "?").join(",")})`,
        [studentId, ...branchIds]
      );
      if (enrollments2.length === 0) {
        throw createError({
          statusCode: 403,
          message: "Access denied. Student is not enrolled in your branch."
        });
      }
    }
  }
  if (isTutor && !isSystemAdmin && !isBranchAdmin) {
    const { query: query2 } = await import('../../../../nitro/nitro.mjs').then(function (n) { return n.a9; });
    const tutors = await query2(
      "SELECT id FROM tutors WHERE user_id = ?",
      [auth.userId]
    );
    if (tutors.length > 0) {
      const tutorId = tutors[0].id;
      const tutorCourses = await query2(
        "SELECT DISTINCT course_id FROM tutor_courses WHERE tutor_id = ?",
        [tutorId]
      );
      if (tutorCourses.length > 0) {
        const courseIds = tutorCourses.map((tc) => tc.course_id);
        const enrollments2 = await query2(
          `SELECT id FROM enrollments 
           WHERE student_id = ? AND course_id IN (${courseIds.map(() => "?").join(",")})`,
          [studentId, ...courseIds]
        );
        if (enrollments2.length === 0) {
          throw createError({
            statusCode: 403,
            message: "Access denied. Student is not enrolled in your courses."
          });
        }
      } else {
        throw createError({
          statusCode: 403,
          message: "Access denied. You have no assigned courses."
        });
      }
    } else {
      throw createError({
        statusCode: 403,
        message: "Access denied. Tutor profile not found."
      });
    }
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
      statusCode: 404,
      message: "User is not a student"
    });
  }
  const parents = await query(
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
     WHERE ps.student_id = ?`,
    [studentId]
  );
  const enrollments = await query(
    `SELECT 
       e.id,
       e.status as enrollment_status,
       e.created_at as enrolled_at,
       c.id as course_id,
       c.title as course_title,
       c.code as course_code,
       b.id as branch_id,
       b.name as branch_name,
       b.code as branch_code
     FROM enrollments e
     INNER JOIN courses c ON e.course_id = c.id
     INNER JOIN branches b ON e.branch_id = b.id
     WHERE e.student_id = ?
     ORDER BY e.created_at DESC`,
    [studentId]
  );
  const { password_hash, ...publicStudent } = student;
  return {
    success: true,
    data: {
      student: publicStudent,
      parents: parents.map((p) => ({
        id: p.id,
        username: p.username,
        email: p.email,
        first_name: p.first_name,
        last_name: p.last_name,
        phone: p.phone,
        status: p.status,
        relationship: p.relationship
      })),
      enrollments: enrollments.map((e) => ({
        id: e.id,
        course: {
          id: e.course_id,
          title: e.course_title,
          code: e.course_code
        },
        branch: {
          id: e.branch_id,
          name: e.branch_name,
          code: e.branch_code
        },
        status: e.enrollment_status,
        enrolled_at: e.enrolled_at
      }))
    }
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map

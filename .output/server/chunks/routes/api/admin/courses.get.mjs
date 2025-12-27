import { d as defineEventHandler, g as getUserRoles, U as UserRole, c as createError, a as getQuery, q as query } from '../../../nitro/nitro.mjs';
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
import 'util';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const courses_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN, UserRole.BRANCH_ADMIN, UserRole.TUTOR];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin or Tutor role required."
    });
  }
  const queryParams = getQuery(event);
  const search = queryParams.search;
  const type = queryParams.type;
  const status = queryParams.status;
  const isSystemAdmin = roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.OWNER);
  const isAdmin = roles.includes(UserRole.ADMIN);
  const isBranchAdmin = roles.includes(UserRole.BRANCH_ADMIN);
  const isTutor = roles.includes(UserRole.TUTOR);
  let courseIds = [];
  if (isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    const tutors = await query(
      "SELECT id FROM tutors WHERE user_id = ?",
      [auth.userId]
    );
    if (tutors.length === 0 || !tutors[0]) {
      return {
        success: true,
        data: []
      };
    }
    const tutorId = tutors[0].id;
    const tutorCourses = await query(
      "SELECT DISTINCT course_id FROM tutor_courses WHERE tutor_id = ?",
      [tutorId]
    );
    courseIds = tutorCourses.map((tc) => tc.course_id);
    if (courseIds.length === 0) {
      return {
        success: true,
        data: []
      };
    }
  }
  let sql = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.type,
      c.price,
      c.duration_hours,
      c.level,
      c.status,
      c.code,
      c.created_at,
      c.updated_at,
      u.first_name as created_by_name,
      u.last_name as created_by_last_name
    FROM courses c
    LEFT JOIN users u ON c.created_by = u.id
    WHERE 1=1
  `;
  const params = [];
  if (isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin && courseIds.length > 0) {
    sql += ` AND c.id IN (${courseIds.map(() => "?").join(",")})`;
    params.push(...courseIds);
  }
  if (search) {
    sql += ` AND (c.title LIKE ? OR c.code LIKE ? OR c.description LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }
  if (type) {
    sql += ` AND c.type = ?`;
    params.push(type);
  }
  if (status) {
    sql += ` AND c.status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY c.created_at DESC`;
  try {
    const courses = await query(sql, params);
    return {
      success: true,
      data: courses
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch courses"
    });
  }
});

export { courses_get as default };
//# sourceMappingURL=courses.get.mjs.map

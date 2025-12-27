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
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const students_get = defineEventHandler(async (event) => {
  var _a;
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin", "branch_admin", "tutor"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin or Tutor role required."
    });
  }
  const queryParams = getQuery(event);
  const search = queryParams.search;
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 20;
  const offset = (page - 1) * limit;
  const isSystemAdmin = roles.includes("system_admin") || roles.includes("owner");
  const isAdmin = roles.includes("admin");
  const isBranchAdmin = roles.includes("branch_admin");
  const isTutor = roles.includes("tutor");
  let branchIds = [];
  if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    const branchAdmins = await query(
      "SELECT branch_id FROM branch_admins WHERE user_id = ?",
      [auth.userId]
    );
    branchIds = branchAdmins.map((ba) => ba.branch_id);
    if (branchIds.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  }
  let tutorId = null;
  let courseIds = [];
  if (isTutor && !isSystemAdmin && !isBranchAdmin) {
    const tutors = await query(
      "SELECT id FROM tutors WHERE user_id = ?",
      [auth.userId]
    );
    if (tutors.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
    tutorId = tutors[0].id;
    const tutorCourses = await query(
      "SELECT DISTINCT course_id FROM tutor_courses WHERE tutor_id = ?",
      [tutorId]
    );
    courseIds = tutorCourses.map((tc) => tc.course_id);
    if (courseIds.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  }
  let whereConditions = [];
  const queryValues = [];
  const status = queryParams.status;
  if (status) {
    whereConditions.push(`u.status = ?`);
    queryValues.push(status);
  }
  if (search) {
    whereConditions.push(`(
      u.username LIKE ? OR 
      u.email LIKE ? OR 
      u.first_name LIKE ? OR 
      u.last_name LIKE ?
    )`);
    const searchPattern = `%${search}%`;
    queryValues.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }
  whereConditions.push(`r.name = 'student'`);
  if (isBranchAdmin && !isSystemAdmin && branchIds.length > 0) {
    whereConditions.push(`e.branch_id IN (${branchIds.map(() => "?").join(",")})`);
    queryValues.push(...branchIds);
  }
  if (isTutor && !isSystemAdmin && !isBranchAdmin && courseIds.length > 0) {
    whereConditions.push(`e.course_id IN (${courseIds.map(() => "?").join(",")})`);
    queryValues.push(...courseIds);
  }
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  let fromClause = `FROM users u
     INNER JOIN user_roles ur ON u.id = ur.user_id
     INNER JOIN roles r ON ur.role_id = r.id`;
  if (isBranchAdmin && !isSystemAdmin && branchIds.length > 0) {
    fromClause += ` INNER JOIN enrollments e ON u.id = e.student_id`;
  } else if (isTutor && !isSystemAdmin && !isBranchAdmin && courseIds.length > 0) {
    fromClause += ` INNER JOIN enrollments e ON u.id = e.student_id`;
  }
  const countResult = await query(
    `SELECT COUNT(DISTINCT u.id) as count
     ${fromClause}
     ${whereClause}`,
    queryValues
  );
  const total = ((_a = countResult[0]) == null ? void 0 : _a.count) || 0;
  const students = await query(
    `SELECT 
       u.id,
       u.username,
       u.email,
       u.first_name,
       u.last_name,
       u.phone,
       u.status,
       u.created_at,
       u.updated_at,
       GROUP_CONCAT(DISTINCT CONCAT(
         IFNULL(p.id, ''), ':', 
         IFNULL(CONCAT(p.first_name, ' ', p.last_name), ''), ':', 
         IFNULL(ps.relationship, '')
       ) SEPARATOR '||') as parent_info
     ${fromClause}
     LEFT JOIN parent_students ps ON u.id = ps.student_id
     LEFT JOIN users p ON ps.parent_id = p.id
     ${whereClause}
     GROUP BY u.id
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryValues, limit, offset]
  );
  const formattedStudents = students.map((student) => {
    const parents = [];
    if (student.parent_info) {
      const parentInfos = student.parent_info.split("||").filter((info) => info.trim() !== "");
      for (const info of parentInfos) {
        const [parentId, parentName, relationship] = info.split(":");
        if (parentId && parentName && parentId !== "" && parentName !== "") {
          parents.push({
            id: parseInt(parentId),
            name: parentName,
            relationship: relationship || "guardian"
          });
        }
      }
    }
    return {
      id: student.id,
      username: student.username,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      phone: student.phone,
      status: student.status,
      parents,
      created_at: student.created_at,
      updated_at: student.updated_at
    };
  });
  return {
    success: true,
    data: formattedStudents,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
});

export { students_get as default };
//# sourceMappingURL=students.get.mjs.map

import { d as defineEventHandler, g as getUserRoles, U as UserRole, c as createError, a as getQuery, q as query } from '../../../../nitro/nitro.mjs';
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
import 'jws';
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

const schedules_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const isTutor = roles.includes(UserRole.TUTOR);
  const isSystemAdmin = roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.OWNER);
  const isAdmin = roles.includes(UserRole.ADMIN);
  const isBranchAdmin = roles.includes(UserRole.BRANCH_ADMIN);
  if (!isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Tutor or Admin role required."
    });
  }
  const queryParams = getQuery(event);
  const startDate = queryParams.start_date;
  const endDate = queryParams.end_date;
  const status = queryParams.status;
  const courseId = queryParams.course_id;
  const tutorId = queryParams.tutor_id;
  let filterTutorId = null;
  let branchIds = [];
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
    filterTutorId = tutors[0].id;
  } else if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    const branchAdmins = await query(
      "SELECT branch_id FROM branch_admins WHERE user_id = ?",
      [auth.userId]
    );
    branchIds = branchAdmins.map((ba) => ba.branch_id);
    if (branchIds.length === 0) {
      return {
        success: true,
        data: []
      };
    }
  } else if (tutorId) {
    filterTutorId = parseInt(tutorId);
  }
  let sql = `
    SELECT 
      cs.id,
      cs.course_id,
      cs.branch_id,
      cs.tutor_id,
      cs.start_datetime,
      cs.end_datetime,
      cs.session_type,
      cs.meeting_link,
      cs.video_url,
      cs.status,
      c.title as course_title,
      c.code as course_code,
      c.type as course_type,
      b.name as branch_name,
      b.code as branch_code,
      t.id as tutor_profile_id
    FROM course_schedules cs
    INNER JOIN courses c ON cs.course_id = c.id
    INNER JOIN branches b ON cs.branch_id = b.id
    INNER JOIN tutors t ON cs.tutor_id = t.id
    WHERE 1=1
  `;
  const params = [];
  if (filterTutorId) {
    sql += ` AND cs.tutor_id = ?`;
    params.push(filterTutorId);
  }
  if (branchIds.length > 0) {
    sql += ` AND cs.branch_id IN (${branchIds.map(() => "?").join(",")})`;
    params.push(...branchIds);
  }
  if (startDate) {
    sql += ` AND DATE(cs.start_datetime) >= ?`;
    params.push(startDate);
  }
  if (endDate) {
    sql += ` AND DATE(cs.start_datetime) <= ?`;
    params.push(endDate);
  }
  if (status) {
    sql += ` AND cs.status = ?`;
    params.push(status);
  }
  if (courseId) {
    sql += ` AND cs.course_id = ?`;
    params.push(parseInt(courseId));
  }
  sql += ` ORDER BY cs.start_datetime ASC`;
  try {
    const schedules = await query(sql, params);
    return {
      success: true,
      data: schedules.map((s) => ({
        id: s.id,
        course_id: s.course_id,
        branch_id: s.branch_id,
        tutor_id: s.tutor_id,
        start_datetime: s.start_datetime,
        end_datetime: s.end_datetime,
        session_type: s.session_type,
        meeting_link: s.meeting_link,
        video_url: s.video_url,
        status: s.status,
        course: {
          id: s.course_id,
          title: s.course_title,
          code: s.course_code,
          type: s.course_type
        },
        branch: {
          id: s.branch_id,
          name: s.branch_name,
          code: s.branch_code
        }
      }))
    };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch schedules"
    });
  }
});

export { schedules_get as default };
//# sourceMappingURL=schedules.get.mjs.map

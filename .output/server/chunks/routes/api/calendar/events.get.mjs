import { d as defineEventHandler, a as getQuery, g as getUserRoles, U as UserRole, q as query, c as createError } from '../../../nitro/nitro.mjs';
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

const events_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const queryParams = getQuery(event);
  const startDate = queryParams.start_date;
  const endDate = queryParams.end_date;
  const eventType = queryParams.event_type;
  const includeShared = queryParams.include_shared !== "false";
  const branchId = queryParams.branch_id;
  const roles = await getUserRoles(auth.userId);
  const isSystemAdmin = roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.OWNER);
  const isAdmin = roles.includes(UserRole.ADMIN);
  const isBranchAdmin = roles.includes(UserRole.BRANCH_ADMIN);
  const isTutor = roles.includes(UserRole.TUTOR);
  const isStudent = roles.includes(UserRole.STUDENT);
  const isParent = roles.includes(UserRole.PARENT);
  let userBranchIds = [];
  if (isBranchAdmin && !isSystemAdmin && !isAdmin) {
    const branchAdmins = await query(
      "SELECT branch_id FROM branch_admins WHERE user_id = ?",
      [auth.userId]
    );
    userBranchIds = branchAdmins.map((ba) => ba.branch_id);
  } else if (isTutor && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    const tutors = await query(
      "SELECT id FROM tutors WHERE user_id = ?",
      [auth.userId]
    );
    if (tutors.length > 0 && tutors[0]) {
      const tutorBranches = await query(
        "SELECT branch_id FROM tutor_branches WHERE tutor_id = ?",
        [tutors[0].id]
      );
      userBranchIds = tutorBranches.map((tb) => tb.branch_id);
    }
  } else if (isStudent && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    const enrollments = await query(
      'SELECT DISTINCT branch_id FROM enrollments WHERE student_id = ? AND status = "active"',
      [auth.userId]
    );
    userBranchIds = enrollments.map((e) => e.branch_id);
  } else if (isParent && !isSystemAdmin && !isAdmin && !isBranchAdmin) {
    const parentStudents = await query(
      `SELECT DISTINCT ps.student_id 
       FROM parent_students ps
       INNER JOIN enrollments e ON ps.student_id = e.student_id
       WHERE ps.parent_id = ? AND e.status = "active"`,
      [auth.userId]
    );
    if (parentStudents.length > 0) {
      const studentIds = parentStudents.map((ps) => ps.student_id);
      const enrollments = await query(
        `SELECT DISTINCT branch_id FROM enrollments 
         WHERE student_id IN (${studentIds.map(() => "?").join(",")}) AND status = "active"`,
        studentIds
      );
      userBranchIds = enrollments.map((e) => e.branch_id);
    }
  }
  const sharedScopeConditions = [];
  const sharedScopeParams = [];
  if (includeShared) {
    sharedScopeConditions.push(`ce.shared_scope = 'public'`);
    if (isSystemAdmin || isAdmin) {
      sharedScopeConditions.push(`ce.shared_scope = 'admins'`);
    }
    if (isBranchAdmin || isSystemAdmin || isAdmin) {
      if (userBranchIds.length > 0) {
        sharedScopeConditions.push(
          `(ce.shared_scope = 'branch_admins' AND (ce.shared_branch_id IS NULL OR ce.shared_branch_id IN (${userBranchIds.map(() => "?").join(",")})))`
        );
        sharedScopeParams.push(...userBranchIds);
      } else {
        sharedScopeConditions.push(`ce.shared_scope = 'branch_admins'`);
      }
    }
    if (isTutor || isSystemAdmin || isAdmin) {
      if (userBranchIds.length > 0) {
        sharedScopeConditions.push(
          `(ce.shared_scope = 'tutors' AND (ce.shared_branch_id IS NULL OR ce.shared_branch_id IN (${userBranchIds.map(() => "?").join(",")})))`
        );
        sharedScopeParams.push(...userBranchIds);
      } else {
        sharedScopeConditions.push(`ce.shared_scope = 'tutors'`);
      }
    }
    if (isStudent || isSystemAdmin || isAdmin) {
      sharedScopeConditions.push(`ce.shared_scope = 'students'`);
      if (userBranchIds.length > 0) {
        sharedScopeConditions.push(
          `(ce.shared_scope = 'branch_students' AND ce.shared_branch_id IN (${userBranchIds.map(() => "?").join(",")}))`
        );
        sharedScopeParams.push(...userBranchIds);
      }
    }
    if (isParent || isSystemAdmin || isAdmin) {
      sharedScopeConditions.push(`ce.shared_scope = 'parents'`);
      if (userBranchIds.length > 0) {
        sharedScopeConditions.push(
          `(ce.shared_scope = 'branch_parents' AND ce.shared_branch_id IN (${userBranchIds.map(() => "?").join(",")}))`
        );
        sharedScopeParams.push(...userBranchIds);
      }
    }
    sharedScopeConditions.push(
      `EXISTS (
        SELECT 1 FROM calendar_event_shared_with cesw
        WHERE cesw.event_id = ce.id AND cesw.shared_with_user_id = ?
      )`
    );
    sharedScopeParams.push(auth.userId);
  }
  let sql = `
    SELECT DISTINCT
      ce.id,
      ce.user_id,
      ce.title,
      ce.description,
      ce.start_datetime,
      ce.end_datetime,
      ce.location,
      ce.color,
      ce.is_all_day,
      ce.reminder_minutes,
      ce.is_shared,
      ce.shared_scope,
      ce.shared_branch_id,
      ce.event_type,
      ce.created_at,
      ce.updated_at,
      u.first_name,
      u.last_name,
      CASE WHEN ce.user_id = ? THEN TRUE ELSE FALSE END as is_mine
    FROM calendar_events ce
    INNER JOIN users u ON ce.user_id = u.id
    WHERE (
      ce.user_id = ?
      ${includeShared && sharedScopeConditions.length > 0 ? `OR (ce.is_shared = TRUE AND (${sharedScopeConditions.join(" OR ")}))` : ""}
    )
  `;
  const params = [auth.userId, auth.userId, ...sharedScopeParams];
  const filterConditions = [];
  if (startDate) {
    filterConditions.push(`DATE(ce.start_datetime) >= ?`);
    params.push(startDate);
  }
  if (endDate) {
    filterConditions.push(`DATE(ce.start_datetime) <= ?`);
    params.push(endDate);
  }
  if (eventType) {
    filterConditions.push(`ce.event_type = ?`);
    params.push(eventType);
  }
  if (branchId) {
    filterConditions.push(`(ce.shared_branch_id = ? OR ce.shared_branch_id IS NULL)`);
    params.push(parseInt(branchId));
  }
  if (filterConditions.length > 0) {
    sql += ` AND ${filterConditions.join(" AND ")}`;
  }
  sql += ` ORDER BY ce.start_datetime ASC`;
  try {
    const events = await query(sql, params);
    return {
      success: true,
      data: events.map((e) => ({
        id: e.id,
        user_id: e.user_id,
        title: e.title,
        description: e.description,
        start_datetime: e.start_datetime,
        end_datetime: e.end_datetime,
        location: e.location,
        color: e.color,
        is_all_day: e.is_all_day,
        reminder_minutes: e.reminder_minutes,
        is_shared: e.is_shared,
        shared_scope: e.shared_scope,
        shared_branch_id: e.shared_branch_id,
        event_type: e.event_type,
        created_at: e.created_at,
        updated_at: e.updated_at,
        is_mine: e.is_mine === 1 || e.is_mine === true,
        created_by: {
          id: e.user_id,
          first_name: e.first_name,
          last_name: e.last_name
        }
      }))
    };
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch calendar events"
    });
  }
});

export { events_get as default };
//# sourceMappingURL=events.get.mjs.map

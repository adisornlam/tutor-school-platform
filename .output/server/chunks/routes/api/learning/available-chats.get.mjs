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
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const availableChats_get = defineEventHandler(async (event) => {
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
  const placeholders = studentIds.map(() => "?").join(",");
  const sql = `
    SELECT DISTINCT
      e.id as enrollment_id,
      e.course_id,
      e.student_id,
      c.title as course_title,
      c.code as course_code,
      c.thumbnail_url as course_thumbnail,
      tutor_user.id as tutor_user_id,
      tutor_user.first_name as tutor_first_name,
      tutor_user.last_name as tutor_last_name,
      tutor_user.username as tutor_username,
      tutor_user.email as tutor_email,
      tutor_user.avatar_url as tutor_avatar,
      cr.id as chat_room_id
    FROM enrollments e
    INNER JOIN courses c ON e.course_id = c.id
    INNER JOIN tutor_courses tc ON c.id = tc.course_id
    INNER JOIN tutors tutor_table ON tc.tutor_id = tutor_table.id
    INNER JOIN users tutor_user ON tutor_table.user_id = tutor_user.id
    LEFT JOIN chat_rooms cr ON (
      cr.course_id = c.id 
      AND cr.student_id = e.student_id 
      AND cr.tutor_id = tutor_user.id
      AND cr.status = 'active'
    )
    WHERE e.student_id IN (${placeholders})
      AND e.status IN ('active', 'completed')
      AND tutor_user.status = 'active'
      AND tutor_table.status = 'active'
    ORDER BY c.title, tutor_user.first_name, tutor_user.last_name
  `;
  try {
    const results = await query(sql, studentIds);
    const chatOptions = [];
    const seen = /* @__PURE__ */ new Set();
    for (const row of results) {
      const key = `${row.course_id}-${row.tutor_user_id}-${row.student_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        chatOptions.push({
          course: {
            id: row.course_id,
            title: row.course_title,
            code: row.course_code,
            thumbnail: row.course_thumbnail
          },
          tutor: {
            id: row.tutor_user_id,
            firstName: row.tutor_first_name,
            lastName: row.tutor_last_name,
            username: row.tutor_username,
            email: row.tutor_email,
            avatar: row.tutor_avatar
          },
          enrollmentId: row.enrollment_id,
          studentId: row.student_id,
          chatRoomId: row.chat_room_id
        });
      }
    }
    return {
      success: true,
      data: chatOptions
    };
  } catch (error) {
    console.error("[Available Chats API] Error:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to fetch available chats"
    });
  }
});

export { availableChats_get as default };
//# sourceMappingURL=available-chats.get.mjs.map

import { d as defineEventHandler, b as getRouterParam, c as createError, q as query } from '../../../nitro/nitro.mjs';
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
  var _a;
  const courseId = parseInt(getRouterParam(event, "id") || "0");
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: "Invalid course ID"
    });
  }
  try {
    let courses;
    let thumbnailUrl = null;
    try {
      courses = await query(
        `SELECT 
          c.id,
          c.title,
          c.description,
          c.type,
          c.price,
          c.onsite_price,
          c.online_price,
          c.duration_hours,
          c.level,
          c.status,
          c.code,
          c.created_at,
          c.updated_at,
          c.thumbnail_url
        FROM courses c
        WHERE c.id = ? AND c.status = 'published'`,
        [courseId]
      );
      thumbnailUrl = ((_a = courses[0]) == null ? void 0 : _a.thumbnail_url) || null;
    } catch (err) {
      if (err.code === "ER_BAD_FIELD_ERROR" && err.message.includes("thumbnail_url")) {
        courses = await query(
          `SELECT 
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
            c.updated_at
          FROM courses c
          WHERE c.id = ? AND c.status = 'published'`,
          [courseId]
        );
        thumbnailUrl = null;
      } else {
        throw err;
      }
    }
    if (courses.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Course not found"
      });
    }
    const course = courses[0];
    const courseBranches = await query(
      `SELECT 
        cb.id,
        cb.course_id,
        cb.branch_id,
        cb.seat_limit,
        cb.current_enrollments,
        cb.is_available,
        b.name as branch_name,
        b.code as branch_code,
        b.status as branch_status
      FROM course_branches cb
      INNER JOIN branches b ON cb.branch_id = b.id
      WHERE cb.course_id = ? AND cb.is_available = 1 AND b.status = 'active'`,
      [courseId]
    );
    return {
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          type: course.type,
          price: course.price,
          onsite_price: course.onsite_price || course.price,
          online_price: course.online_price || course.price,
          duration_hours: course.duration_hours,
          level: course.level,
          status: course.status,
          code: course.code,
          thumbnail_url: thumbnailUrl,
          created_at: course.created_at,
          updated_at: course.updated_at
        },
        branches: courseBranches.map((cb) => ({
          branch_id: cb.branch_id,
          branch_name: cb.branch_name,
          branch_code: cb.branch_code,
          seat_limit: cb.seat_limit,
          current_enrollments: cb.current_enrollments || 0,
          is_available: cb.is_available,
          available_seats: cb.seat_limit ? cb.seat_limit - (cb.current_enrollments || 0) : null
        }))
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error fetching course detail:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch course detail"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map

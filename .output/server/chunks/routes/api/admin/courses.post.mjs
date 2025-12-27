import { d as defineEventHandler, r as readBody, c as createError, q as query, e as execute } from '../../../nitro/nitro.mjs';
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
import 'safe-buffer';
import 'util';
import 'jwa';
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

const courses_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const body = await readBody(event);
  if (!body.title || !body.type || body.price === void 0) {
    throw createError({
      statusCode: 400,
      message: "Title, type, and price are required"
    });
  }
  const validTypes = ["live_online", "vod", "hybrid"];
  if (!validTypes.includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: "Invalid course type"
    });
  }
  const validStatuses = ["draft", "published", "archived"];
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid course status"
    });
  }
  if (body.code) {
    const existing = await query(
      "SELECT id FROM courses WHERE code = ?",
      [body.code]
    );
    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        message: "Course code already exists"
      });
    }
  }
  if (body.branches && !Array.isArray(body.branches)) {
    throw createError({
      statusCode: 400,
      message: "Branches must be an array"
    });
  }
  if (body.branches && body.branches.length > 0) {
    const branchIds = body.branches.map((b) => {
      const id = typeof b === "object" ? b.branch_id : b;
      return id ? parseInt(id, 10) : null;
    }).filter((id) => id !== null && !isNaN(id));
    if (branchIds.length > 0) {
      const existingBranches = await query(
        `SELECT id FROM branches WHERE id IN (${branchIds.map(() => "?").join(",")}) AND status = "active"`,
        branchIds
      );
      if (existingBranches.length !== branchIds.length) {
        throw createError({
          statusCode: 400,
          message: "One or more branch IDs are invalid or inactive"
        });
      }
    }
  }
  try {
    const result = await execute(
      `INSERT INTO courses (
        title, description, thumbnail_url, type, price, duration_hours, level, status, code, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        body.description || null,
        body.thumbnail_url || null,
        body.type,
        body.price,
        body.duration_hours || null,
        body.level || null,
        body.status || "draft",
        body.code || null,
        auth.userId
      ]
    );
    const courseId = result.insertId;
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      for (const image of body.images) {
        await execute(
          `INSERT INTO course_images (course_id, image_url, image_type, display_order, alt_text)
           VALUES (?, ?, ?, ?, ?)`,
          [
            courseId,
            image.image_url,
            image.image_type || "gallery",
            image.display_order || 0,
            image.alt_text || null
          ]
        );
      }
    }
    if (body.branches && Array.isArray(body.branches) && body.branches.length > 0) {
      for (const branch of body.branches) {
        const branchId = typeof branch === "object" ? branch.branch_id : branch;
        const seatLimit = typeof branch === "object" ? branch.seat_limit || null : null;
        const isAvailable = typeof branch === "object" ? branch.is_available !== void 0 ? branch.is_available : true : true;
        await execute(
          `INSERT INTO course_branches (course_id, branch_id, seat_limit, is_available)
           VALUES (?, ?, ?, ?)`,
          [courseId, branchId, seatLimit, isAvailable]
        );
      }
    }
    const course = await query(
      "SELECT * FROM courses WHERE id = ?",
      [courseId]
    );
    const courseBranches = await query(
      `SELECT 
        cb.id,
        cb.course_id,
        cb.branch_id,
        cb.seat_limit,
        cb.current_enrollments,
        cb.is_available,
        b.name as branch_name,
        b.code as branch_code
      FROM course_branches cb
      INNER JOIN branches b ON cb.branch_id = b.id
      WHERE cb.course_id = ?`,
      [courseId]
    );
    const courseImages = await query(
      `SELECT 
        id,
        course_id,
        image_url,
        image_type,
        display_order,
        alt_text,
        created_at
      FROM course_images
      WHERE course_id = ?
      ORDER BY display_order ASC, created_at ASC`,
      [courseId]
    );
    return {
      success: true,
      data: {
        ...course[0],
        branches: courseBranches.map((cb) => ({
          id: cb.id,
          branch_id: cb.branch_id,
          branch_name: cb.branch_name,
          branch_code: cb.branch_code,
          seat_limit: cb.seat_limit,
          current_enrollments: cb.current_enrollments,
          is_available: cb.is_available
        })),
        images: courseImages
      }
    };
  } catch (error) {
    console.error("Error creating course:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create course"
    });
  }
});

export { courses_post as default };
//# sourceMappingURL=courses.post.mjs.map

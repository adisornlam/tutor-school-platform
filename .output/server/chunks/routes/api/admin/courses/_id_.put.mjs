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
import 'path';
import 'querystring';
import 'timers';
import 'util';
import 'ecdsa-sig-formatter';
import 'buffer-equal-constant-time';
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

const _id__put = defineEventHandler(async (event) => {
  await requireAuth(event);
  const courseId = parseInt(getRouterParam(event, "id") || "0");
  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: "Invalid course ID"
    });
  }
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
  const existing = await query(
    "SELECT id FROM courses WHERE id = ?",
    [courseId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Course not found"
    });
  }
  if (body.code) {
    const codeCheck = await query(
      "SELECT id FROM courses WHERE code = ? AND id != ?",
      [body.code, courseId]
    );
    if (codeCheck.length > 0) {
      throw createError({
        statusCode: 409,
        message: "Course code already exists"
      });
    }
  }
  if (body.branches !== void 0) {
    if (!Array.isArray(body.branches)) {
      throw createError({
        statusCode: 400,
        message: "Branches must be an array"
      });
    }
    if (body.branches.length > 0) {
      const branchIds = body.branches.map((b) => {
        const id = typeof b === "object" ? b.branch_id : b;
        return id ? parseInt(id, 10) : null;
      }).filter((id) => id !== null && !isNaN(id));
      if (branchIds.length > 0) {
        const placeholders = branchIds.map(() => "?").join(",");
        const existingBranches = await query(
          `SELECT id FROM branches WHERE id IN (${placeholders}) AND status = "active"`,
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
  }
  try {
    await execute(
      `UPDATE courses SET
        title = ?,
        description = ?,
        thumbnail_url = ?,
        type = ?,
        price = ?,
        duration_hours = ?,
        level = ?,
        status = ?,
        code = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        body.title,
        body.description || null,
        body.thumbnail_url || null,
        body.type,
        body.price,
        body.duration_hours || null,
        body.level || null,
        body.status,
        body.code || null,
        courseId
      ]
    );
    if (body.branches !== void 0) {
      const currentBranches = await query(
        "SELECT branch_id FROM course_branches WHERE course_id = ?",
        [courseId]
      );
      const currentBranchIds = currentBranches.map((b) => b.branch_id);
      const requestedBranchIds = body.branches.map(
        (b) => typeof b === "object" ? b.branch_id : b
      ).filter(Boolean);
      const branchesToDelete = currentBranchIds.filter(
        (id) => !requestedBranchIds.includes(id)
      );
      const branchesToAdd = body.branches.filter((b) => {
        const branchId = typeof b === "object" ? b.branch_id : b;
        return !currentBranchIds.includes(branchId);
      });
      const branchesToUpdate = body.branches.filter((b) => {
        const branchId = typeof b === "object" ? b.branch_id : b;
        return currentBranchIds.includes(branchId);
      });
      if (branchesToDelete.length > 0) {
        const deletePlaceholders = branchesToDelete.map(() => "?").join(",");
        await execute(
          `DELETE FROM course_branches WHERE course_id = ? AND branch_id IN (${deletePlaceholders})`,
          [courseId, ...branchesToDelete]
        );
      }
      for (const branch of branchesToAdd) {
        const branchId = typeof branch === "object" ? branch.branch_id : branch;
        const seatLimit = typeof branch === "object" ? branch.seat_limit || null : null;
        const isAvailable = typeof branch === "object" ? branch.is_available !== void 0 ? branch.is_available : true : true;
        await execute(
          `INSERT INTO course_branches (course_id, branch_id, seat_limit, is_available)
           VALUES (?, ?, ?, ?)`,
          [courseId, branchId, seatLimit, isAvailable]
        );
      }
      for (const branch of branchesToUpdate) {
        const branchId = typeof branch === "object" ? branch.branch_id : branch;
        const seatLimit = typeof branch === "object" ? branch.seat_limit : null;
        const isAvailable = typeof branch === "object" ? branch.is_available !== void 0 ? branch.is_available : true : true;
        await execute(
          `UPDATE course_branches 
           SET seat_limit = ?, is_available = ?
           WHERE course_id = ? AND branch_id = ?`,
          [seatLimit, isAvailable, courseId, branchId]
        );
      }
    }
    if (body.images !== void 0) {
      try {
        await execute(
          "DELETE FROM course_images WHERE course_id = ?",
          [courseId]
        );
        if (Array.isArray(body.images) && body.images.length > 0) {
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
      } catch (error) {
        console.warn("course_images table not found, skipping image updates:", error.message);
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
    let courseImages = [];
    try {
      courseImages = await query(
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
    } catch (error) {
      console.warn("course_images table not found, skipping:", error.message);
      courseImages = [];
    }
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
    console.error("Error updating course:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw createError({
      statusCode: 500,
      message: error.sqlMessage || error.message || "Failed to update course"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

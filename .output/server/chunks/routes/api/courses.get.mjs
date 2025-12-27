import { d as defineEventHandler, a as getQuery, q as query, c as createError } from '../../nitro/nitro.mjs';
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

const courses_get = defineEventHandler(async (event) => {
  var _a;
  const queryParams = getQuery(event);
  const search = queryParams.search;
  const type = queryParams.type;
  const level = queryParams.level;
  const branchId = queryParams.branch_id;
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 15;
  const offset = (page - 1) * limit;
  let sql = `
    SELECT 
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
      c.thumbnail_url,
      c.created_at,
      c.updated_at,
      COUNT(DISTINCT e.id) as enrollment_count
    FROM courses c
    LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
    WHERE c.status = 'published'
  `;
  const params = [];
  if (search) {
    sql += ` AND (c.title LIKE ? OR c.code LIKE ? OR c.description LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }
  if (type) {
    sql += ` AND c.type = ?`;
    params.push(type);
  }
  if (level) {
    sql += ` AND c.level = ?`;
    params.push(level);
  }
  if (branchId) {
    sql += ` AND EXISTS (
      SELECT 1 FROM course_branches cb
      INNER JOIN branches b ON cb.branch_id = b.id
      WHERE cb.course_id = c.id 
      AND cb.branch_id = ?
      AND cb.is_available = 1
      AND b.status = 'active'
    )`;
    params.push(parseInt(branchId));
  }
  sql += ` GROUP BY c.id, c.title, c.description, c.type, c.price, c.onsite_price, c.online_price, 
    c.duration_hours, c.level, c.status, c.code, c.thumbnail_url, c.created_at, c.updated_at`;
  const sortBy = queryParams.sort_by || "newest";
  if (sortBy === "price_asc") {
    sql += ` ORDER BY c.price ASC`;
  } else if (sortBy === "price_desc") {
    sql += ` ORDER BY c.price DESC`;
  } else if (sortBy === "popular") {
    sql += ` ORDER BY enrollment_count DESC`;
  } else {
    sql += ` ORDER BY c.created_at DESC`;
  }
  try {
    const countParams = [];
    let countSql = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM courses c
      WHERE c.status = 'published'
    `;
    if (search) {
      countSql += ` AND (c.title LIKE ? OR c.code LIKE ? OR c.description LIKE ?)`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }
    if (type) {
      countSql += ` AND c.type = ?`;
      countParams.push(type);
    }
    if (level) {
      countSql += ` AND c.level = ?`;
      countParams.push(level);
    }
    if (branchId) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM course_branches cb
        INNER JOIN branches b ON cb.branch_id = b.id
        WHERE cb.course_id = c.id 
        AND cb.branch_id = ?
        AND cb.is_available = 1
        AND b.status = 'active'
      )`;
      countParams.push(parseInt(branchId));
    }
    const countResult = await query(countSql, countParams);
    const total = ((_a = countResult == null ? void 0 : countResult[0]) == null ? void 0 : _a.total) || 0;
    const totalPages = Math.ceil(total / limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    const courses = await query(sql, params);
    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      type: course.type,
      price: parseFloat(course.price || "0"),
      onsite_price: course.onsite_price ? parseFloat(course.onsite_price) : null,
      online_price: course.online_price ? parseFloat(course.online_price) : null,
      duration_hours: course.duration_hours,
      level: course.level,
      code: course.code,
      thumbnail_url: course.thumbnail_url,
      enrollment_count: parseInt(course.enrollment_count || "0"),
      created_at: course.created_at,
      updated_at: course.updated_at
    }));
    return {
      success: true,
      data: formattedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
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

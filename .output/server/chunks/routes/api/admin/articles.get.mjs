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

const articles_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const queryParams = getQuery(event);
  const search = queryParams.search;
  const status = queryParams.status;
  const category = queryParams.category;
  let sql = `
    SELECT 
      a.id,
      a.title,
      a.slug,
      a.excerpt,
      a.category,
      a.icon,
      a.featured_image_url,
      a.status,
      a.is_featured,
      a.view_count,
      a.display_order,
      a.published_at,
      a.created_at,
      a.updated_at,
      u.first_name as author_first_name,
      u.last_name as author_last_name
    FROM articles a
    LEFT JOIN users u ON a.author_id = u.id
    WHERE 1=1
  `;
  const params = [];
  if (search) {
    sql += ` AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }
  if (status) {
    sql += ` AND a.status = ?`;
    params.push(status);
  }
  if (category) {
    sql += ` AND a.category = ?`;
    params.push(category);
  }
  sql += ` ORDER BY a.display_order ASC, a.created_at DESC`;
  try {
    const articles = await query(sql, params);
    return {
      success: true,
      data: articles
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch articles"
    });
  }
});

export { articles_get as default };
//# sourceMappingURL=articles.get.mjs.map

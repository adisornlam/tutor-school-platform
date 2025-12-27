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
  const queryParams = getQuery(event);
  const limit = parseInt(queryParams.limit) || 10;
  const category = queryParams.category;
  const featured = queryParams.featured === "true";
  let sql = `
    SELECT 
      id,
      title,
      slug,
      excerpt,
      category,
      icon,
      featured_image_url,
      is_featured,
      view_count,
      published_at,
      created_at
    FROM articles
    WHERE status = 'published'
  `;
  const params = [];
  if (category) {
    sql += ` AND category = ?`;
    params.push(category);
  }
  if (featured) {
    sql += ` AND is_featured = TRUE`;
  }
  sql += ` ORDER BY display_order ASC, published_at DESC LIMIT ?`;
  params.push(limit);
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

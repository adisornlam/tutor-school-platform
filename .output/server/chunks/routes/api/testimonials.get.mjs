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
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const testimonials_get = defineEventHandler(async (event) => {
  const queryParams = getQuery(event);
  const limit = parseInt(queryParams.limit) || 10;
  const sql = `
    SELECT 
      id,
      name,
      role,
      comment,
      rating,
      avatar_url,
      display_order
    FROM testimonials
    WHERE status = 'approved'
    ORDER BY display_order ASC, created_at DESC
    LIMIT ?
  `;
  try {
    const testimonials = await query(sql, [limit]);
    return {
      success: true,
      data: testimonials
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch testimonials"
    });
  }
});

export { testimonials_get as default };
//# sourceMappingURL=testimonials.get.mjs.map

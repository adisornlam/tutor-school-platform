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
import 'util';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _slug__get = defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Slug parameter is required"
    });
  }
  try {
    const pages = await query(
      "SELECT id, slug, title, content, meta_title, meta_description, meta_keywords, is_active, created_at, updated_at FROM content_pages WHERE slug = ? AND is_active = TRUE LIMIT 1",
      [slug]
    );
    if (pages.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Page not found"
      });
    }
    return {
      success: true,
      data: pages[0]
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error fetching content page:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch content page"
    });
  }
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map

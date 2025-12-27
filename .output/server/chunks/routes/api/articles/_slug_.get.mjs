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

const _slug__get = defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Article slug is required"
    });
  }
  try {
    const articles = await query(
      `SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.content,
        a.category,
        a.icon,
        a.featured_image_url,
        a.is_featured,
        a.view_count,
        a.published_at,
        a.created_at,
        a.updated_at,
        u.first_name as author_first_name,
        u.last_name as author_last_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.slug = ? AND a.status = 'published'`,
      [slug]
    );
    if (articles.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Article not found"
      });
    }
    const article = articles[0];
    try {
      await query(
        "UPDATE articles SET view_count = view_count + 1 WHERE id = ?",
        [article.id]
      );
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
    return {
      success: true,
      data: {
        ...article,
        author_name: article.author_first_name && article.author_last_name ? `${article.author_first_name} ${article.author_last_name}` : null
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error fetching article:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch article"
    });
  }
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map

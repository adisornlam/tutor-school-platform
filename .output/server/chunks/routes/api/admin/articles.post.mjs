import { d as defineEventHandler, g as getUserRoles, c as createError, r as readBody, q as query, e as execute } from '../../../nitro/nitro.mjs';
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

function generateSlug(title) {
  return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
const articles_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const body = await readBody();
  if (!body.title || !body.content) {
    throw createError({
      statusCode: 400,
      message: "Title and content are required"
    });
  }
  let slug = body.slug || generateSlug(body.title);
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existing = await query(
      "SELECT id FROM articles WHERE slug = ?",
      [uniqueSlug]
    );
    if (existing.length === 0) break;
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  const validStatuses = ["draft", "published", "archived"];
  const status = body.status && validStatuses.includes(body.status) ? body.status : "draft";
  let publishedAt = body.published_at ? new Date(body.published_at) : null;
  if (status === "published" && !publishedAt) {
    publishedAt = /* @__PURE__ */ new Date();
  }
  if (status !== "published") {
    publishedAt = null;
  }
  try {
    const result = await execute(
      `INSERT INTO articles (
        title, slug, excerpt, content, category, icon, 
        featured_image_url, author_id, status, is_featured, 
        display_order, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        uniqueSlug,
        body.excerpt || null,
        body.content,
        body.category || null,
        body.icon || null,
        body.featured_image_url || null,
        auth.userId,
        status,
        body.is_featured || false,
        body.display_order || 0,
        publishedAt
      ]
    );
    return {
      success: true,
      data: {
        id: result.insertId,
        slug: uniqueSlug
      }
    };
  } catch (error) {
    console.error("Error creating article:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create article"
    });
  }
});

export { articles_post as default };
//# sourceMappingURL=articles.post.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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

function generateSlug(title) {
  return title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
const _id__put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const articleId = parseInt(getRouterParam(event, "id") || "0");
  if (!articleId) {
    throw createError({
      statusCode: 400,
      message: "Invalid article ID"
    });
  }
  const body = await readBody();
  const existing = await query(
    "SELECT id, slug, title FROM articles WHERE id = ?",
    [articleId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Article not found"
    });
  }
  let slug = body.slug;
  if (body.title && !body.slug) {
    slug = generateSlug(body.title);
  }
  if (slug && slug !== existing[0].slug) {
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const slugCheck = await query(
        "SELECT id FROM articles WHERE slug = ? AND id != ?",
        [uniqueSlug, articleId]
      );
      if (slugCheck.length === 0) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    slug = uniqueSlug;
  }
  const validStatuses = ["draft", "published", "archived"];
  let status = body.status;
  if (status && !validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid status"
    });
  }
  let publishedAt = null;
  if (body.published_at) {
    publishedAt = new Date(body.published_at);
  } else if (status === "published") {
    const currentArticle = await query(
      "SELECT published_at, status FROM articles WHERE id = ?",
      [articleId]
    );
    if (currentArticle.length > 0 && !currentArticle[0].published_at) {
      publishedAt = /* @__PURE__ */ new Date();
    }
  }
  const updates = [];
  const values = [];
  if (body.title !== void 0) {
    updates.push("title = ?");
    values.push(body.title);
  }
  if (slug !== void 0) {
    updates.push("slug = ?");
    values.push(slug);
  }
  if (body.excerpt !== void 0) {
    updates.push("excerpt = ?");
    values.push(body.excerpt);
  }
  if (body.content !== void 0) {
    updates.push("content = ?");
    values.push(body.content);
  }
  if (body.category !== void 0) {
    updates.push("category = ?");
    values.push(body.category);
  }
  if (body.icon !== void 0) {
    updates.push("icon = ?");
    values.push(body.icon);
  }
  if (body.featured_image_url !== void 0) {
    updates.push("featured_image_url = ?");
    values.push(body.featured_image_url);
  }
  if (status !== void 0) {
    updates.push("status = ?");
    values.push(status);
  }
  if (body.is_featured !== void 0) {
    updates.push("is_featured = ?");
    values.push(body.is_featured);
  }
  if (body.display_order !== void 0) {
    updates.push("display_order = ?");
    values.push(body.display_order);
  }
  if (publishedAt !== void 0) {
    updates.push("published_at = ?");
    values.push(publishedAt);
  }
  if (updates.length === 0) {
    throw createError({
      statusCode: 400,
      message: "No fields to update"
    });
  }
  values.push(articleId);
  try {
    await execute(
      `UPDATE articles SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return {
      success: true,
      message: "Article updated successfully"
    };
  } catch (error) {
    console.error("Error updating article:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update article"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

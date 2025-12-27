import { d as defineEventHandler, g as getUserRoles, U as UserRole, c as createError, b as getRouterParam, r as readBody, q as query } from '../../../../nitro/nitro.mjs';
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
import 'mysql2/promise';
import 'node:url';

const _id__put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const id = parseInt(getRouterParam(event, "id") || "0");
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: "Valid ID is required"
    });
  }
  const body = await readBody(event);
  const { slug, title, content, meta_title, meta_description, meta_keywords, is_active, display_order } = body;
  if (!slug || !title) {
    throw createError({
      statusCode: 400,
      message: "Slug and title are required"
    });
  }
  const existing = await query(
    "SELECT id, slug FROM content_pages WHERE id = ? LIMIT 1",
    [id]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Page not found"
    });
  }
  if (slug !== existing[0].slug) {
    const slugCheck = await query(
      "SELECT id FROM content_pages WHERE slug = ? AND id != ? LIMIT 1",
      [slug, id]
    );
    if (slugCheck.length > 0) {
      throw createError({
        statusCode: 400,
        message: "Page with this slug already exists"
      });
    }
  }
  try {
    await query(
      `UPDATE content_pages 
       SET slug = ?, title = ?, content = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, 
           is_active = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        slug,
        title,
        content || null,
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        is_active !== void 0 ? is_active : true,
        display_order || 0,
        id
      ]
    );
    const [updatedPage] = await query(
      "SELECT * FROM content_pages WHERE id = ? LIMIT 1",
      [id]
    );
    return {
      success: true,
      data: updatedPage
    };
  } catch (error) {
    console.error("Error updating content page:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update content page"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

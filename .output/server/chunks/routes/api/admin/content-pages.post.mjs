import { d as defineEventHandler, g as getUserRoles, U as UserRole, c as createError, r as readBody, q as query } from '../../../nitro/nitro.mjs';
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
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const contentPages_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
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
    "SELECT id FROM content_pages WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (existing.length > 0) {
    throw createError({
      statusCode: 400,
      message: "Page with this slug already exists"
    });
  }
  try {
    const result = await query(
      `INSERT INTO content_pages (slug, title, content, meta_title, meta_description, meta_keywords, is_active, display_order, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        content || null,
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        is_active !== void 0 ? is_active : true,
        display_order || 0,
        auth.userId
      ]
    );
    const [newPage] = await query(
      "SELECT * FROM content_pages WHERE id = ? LIMIT 1",
      [result.insertId]
    );
    return {
      success: true,
      data: newPage
    };
  } catch (error) {
    console.error("Error creating content page:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create content page"
    });
  }
});

export { contentPages_post as default };
//# sourceMappingURL=content-pages.post.mjs.map

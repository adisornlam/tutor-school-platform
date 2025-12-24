globalThis.__timing__.logStart('Load chunks/routes/api/admin/articles/_id_.delete');import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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
import 'engine.io';
import 'socket.io';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__delete = defineEventHandler(async (event) => {
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
  const existing = await query(
    "SELECT id FROM articles WHERE id = ?",
    [articleId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Article not found"
    });
  }
  try {
    await execute("DELETE FROM articles WHERE id = ?", [articleId]);
    return {
      success: true,
      message: "Article deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting article:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete article"
    });
  }
});

export { _id__delete as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/admin/articles/_id_.delete');
//# sourceMappingURL=_id_.delete.mjs.map

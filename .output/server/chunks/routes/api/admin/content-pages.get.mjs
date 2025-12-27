import { d as defineEventHandler, g as getUserRoles, U as UserRole, c as createError, q as query } from '../../../nitro/nitro.mjs';
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

const contentPages_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  try {
    const pages = await query(
      "SELECT id, slug, title, content, meta_title, meta_description, meta_keywords, is_active, display_order, created_by, created_at, updated_at FROM content_pages ORDER BY display_order ASC, title ASC"
    );
    return {
      success: true,
      data: pages
    };
  } catch (error) {
    console.error("Error fetching content pages:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch content pages"
    });
  }
});

export { contentPages_get as default };
//# sourceMappingURL=content-pages.get.mjs.map

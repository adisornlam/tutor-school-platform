import { d as defineEventHandler, q as query, c as createError } from '../../../nitro/nitro.mjs';
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

const branches_get = defineEventHandler(async (event) => {
  await requireAuth(event);
  try {
    const branches = await query(
      `SELECT 
        id,
        name,
        code,
        address,
        phone,
        email,
        status,
        created_at,
        updated_at
      FROM branches
      WHERE status = 'active'
      ORDER BY name ASC`
    );
    return {
      success: true,
      data: branches
    };
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch branches"
    });
  }
});

export { branches_get as default };
//# sourceMappingURL=branches.get.mjs.map

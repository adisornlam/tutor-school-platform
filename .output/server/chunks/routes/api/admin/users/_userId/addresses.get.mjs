import { d as defineEventHandler, b as getRouterParam, c as createError, q as query } from '../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../_/auth.middleware.mjs';
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
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const addresses_get = defineEventHandler(async (event) => {
  await requireAuth(event);
  const userId = parseInt(getRouterParam(event, "userId") || "0");
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "Invalid user ID"
    });
  }
  try {
    const addresses = await query(
      `SELECT 
        id,
        user_id,
        address_type,
        recipient_name,
        phone,
        address_line1,
        address_line2,
        subdistrict,
        district,
        province,
        postal_code,
        country,
        is_default,
        created_at,
        updated_at
      FROM user_addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at ASC`,
      [userId]
    );
    return {
      success: true,
      data: addresses
    };
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch user addresses"
    });
  }
});

export { addresses_get as default };
//# sourceMappingURL=addresses.get.mjs.map

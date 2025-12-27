import { d as defineEventHandler, b as getRouterParam, c as createError, q as query, e as execute } from '../../../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../../../_/auth.middleware.mjs';
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
import 'accepts';
import 'path';
import 'querystring';
import 'base64id';
import 'timers';
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const setDefault_patch = defineEventHandler(async (event) => {
  await requireAuth(event);
  const userId = parseInt(getRouterParam(event, "userId") || "0");
  const addressId = parseInt(getRouterParam(event, "addressId") || "0");
  if (!userId || !addressId) {
    throw createError({
      statusCode: 400,
      message: "Invalid user ID or address ID"
    });
  }
  try {
    const addresses = await query(
      "SELECT id FROM user_addresses WHERE id = ? AND user_id = ?",
      [addressId, userId]
    );
    if (addresses.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Address not found"
      });
    }
    await execute(
      "UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?",
      [userId]
    );
    await execute(
      "UPDATE user_addresses SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
      [addressId, userId]
    );
    const updated = await query(
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
      WHERE id = ? AND user_id = ?`,
      [addressId, userId]
    );
    return {
      success: true,
      data: updated[0]
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error setting default address:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to set default address"
    });
  }
});

export { setDefault_patch as default };
//# sourceMappingURL=set-default.patch.mjs.map

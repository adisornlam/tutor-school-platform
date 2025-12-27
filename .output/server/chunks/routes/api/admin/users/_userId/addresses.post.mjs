import { d as defineEventHandler, b as getRouterParam, c as createError, r as readBody, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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

const addresses_post = defineEventHandler(async (event) => {
  await requireAuth(event);
  const userId = parseInt(getRouterParam(event, "userId") || "0");
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "Invalid user ID"
    });
  }
  const body = await readBody(event);
  if (!body.recipient_name || !body.phone || !body.address_line1 || !body.province || !body.postal_code) {
    throw createError({
      statusCode: 400,
      message: "Recipient name, phone, address line 1, province, and postal code are required"
    });
  }
  const validAddressTypes = ["home", "work", "other"];
  if (body.address_type && !validAddressTypes.includes(body.address_type)) {
    throw createError({
      statusCode: 400,
      message: "Invalid address type"
    });
  }
  try {
    const users = await query(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );
    if (users.length === 0) {
      throw createError({
        statusCode: 404,
        message: "User not found"
      });
    }
    if (body.is_default) {
      await execute(
        "UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?",
        [userId]
      );
    }
    const result = await execute(
      `INSERT INTO user_addresses (
        user_id, address_type, recipient_name, phone,
        address_line1, address_line2, subdistrict, district,
        province, postal_code, country, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.address_type || "home",
        body.recipient_name,
        body.phone,
        body.address_line1,
        body.address_line2 || null,
        body.subdistrict || null,
        body.district || null,
        body.province,
        body.postal_code,
        body.country || "Thailand",
        body.is_default || false
      ]
    );
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
      WHERE id = ?`,
      [result.insertId]
    );
    return {
      success: true,
      data: addresses[0]
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error creating user address:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create user address"
    });
  }
});

export { addresses_post as default };
//# sourceMappingURL=addresses.post.mjs.map

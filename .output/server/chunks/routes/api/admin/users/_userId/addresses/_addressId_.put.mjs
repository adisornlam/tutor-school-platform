import { d as defineEventHandler, b as getRouterParam, c as createError, r as readBody, q as query, e as execute } from '../../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../../_/auth.middleware.mjs';
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

const _addressId__put = defineEventHandler(async (event) => {
  await requireAuth(event);
  const userId = parseInt(getRouterParam(event, "userId") || "0");
  const addressId = parseInt(getRouterParam(event, "addressId") || "0");
  if (!userId || !addressId) {
    throw createError({
      statusCode: 400,
      message: "Invalid user ID or address ID"
    });
  }
  const body = await readBody(event);
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
  if (body.address_type) {
    const validAddressTypes = ["home", "work", "other"];
    if (!validAddressTypes.includes(body.address_type)) {
      throw createError({
        statusCode: 400,
        message: "Invalid address type"
      });
    }
  }
  try {
    if (body.is_default) {
      await execute(
        "UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?",
        [userId, addressId]
      );
    }
    const updates = [];
    const params = [];
    if (body.address_type !== void 0) {
      updates.push("address_type = ?");
      params.push(body.address_type);
    }
    if (body.recipient_name !== void 0) {
      updates.push("recipient_name = ?");
      params.push(body.recipient_name);
    }
    if (body.phone !== void 0) {
      updates.push("phone = ?");
      params.push(body.phone);
    }
    if (body.address_line1 !== void 0) {
      updates.push("address_line1 = ?");
      params.push(body.address_line1);
    }
    if (body.address_line2 !== void 0) {
      updates.push("address_line2 = ?");
      params.push(body.address_line2 || null);
    }
    if (body.subdistrict !== void 0) {
      updates.push("subdistrict = ?");
      params.push(body.subdistrict || null);
    }
    if (body.district !== void 0) {
      updates.push("district = ?");
      params.push(body.district || null);
    }
    if (body.province !== void 0) {
      updates.push("province = ?");
      params.push(body.province);
    }
    if (body.postal_code !== void 0) {
      updates.push("postal_code = ?");
      params.push(body.postal_code);
    }
    if (body.country !== void 0) {
      updates.push("country = ?");
      params.push(body.country);
    }
    if (body.is_default !== void 0) {
      updates.push("is_default = ?");
      params.push(body.is_default);
    }
    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(addressId, userId);
    await execute(
      `UPDATE user_addresses SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
      params
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
    console.error("Error updating user address:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update user address"
    });
  }
});

export { _addressId__put as default };
//# sourceMappingURL=_addressId_.put.mjs.map

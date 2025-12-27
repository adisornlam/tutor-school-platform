import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, q as query, e as execute } from '../../../../../nitro/nitro.mjs';
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
import 'util';
import 'jwa';
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

const _key__put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const settingKey = getRouterParam(event, "key");
  if (!settingKey) {
    throw createError({
      statusCode: 400,
      message: "Setting key is required"
    });
  }
  const body = await readBody();
  if (body.value === void 0) {
    throw createError({
      statusCode: 400,
      message: "Value is required"
    });
  }
  try {
    const existing = await query(
      "SELECT id, type FROM system_settings WHERE `key` = ?",
      [settingKey]
    );
    if (existing.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Setting not found"
      });
    }
    const settingType = existing[0].type;
    let valueToStore;
    if (settingType === "boolean") {
      valueToStore = body.value ? "true" : "false";
    } else if (settingType === "number") {
      valueToStore = String(body.value);
    } else if (settingType === "json") {
      valueToStore = typeof body.value === "string" ? body.value : JSON.stringify(body.value);
    } else {
      valueToStore = String(body.value);
    }
    await execute(
      "UPDATE system_settings SET value = ?, updated_at = NOW() WHERE `key` = ?",
      [valueToStore, settingKey]
    );
    const updated = await query(
      "SELECT id, `key`, value, type, category, description, is_public FROM system_settings WHERE `key` = ?",
      [settingKey]
    );
    let parsedValue = updated[0].value;
    if (settingType === "number") {
      parsedValue = updated[0].value ? parseFloat(updated[0].value) : null;
    } else if (settingType === "boolean") {
      parsedValue = updated[0].value === "true" || updated[0].value === "1";
    } else if (settingType === "json") {
      try {
        parsedValue = updated[0].value ? JSON.parse(updated[0].value) : null;
      } catch (e) {
        parsedValue = updated[0].value;
      }
    }
    return {
      success: true,
      data: {
        ...updated[0],
        value: parsedValue
      },
      message: "System setting updated successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error updating system setting:", error);
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "System settings table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to update system setting"
    });
  }
});

export { _key__put as default };
//# sourceMappingURL=_key_.put.mjs.map

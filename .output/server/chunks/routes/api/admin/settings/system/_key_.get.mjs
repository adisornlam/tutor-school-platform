import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query } from '../../../../../nitro/nitro.mjs';
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

const _key__get = defineEventHandler(async (event) => {
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
  try {
    const settings = await query(
      "SELECT id, `key`, value, type, category, description, is_public FROM system_settings WHERE `key` = ?",
      [settingKey]
    );
    if (settings.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Setting not found"
      });
    }
    const setting = settings[0];
    let parsedValue = setting.value;
    if (setting.type === "number") {
      parsedValue = setting.value ? parseFloat(setting.value) : null;
    } else if (setting.type === "boolean") {
      parsedValue = setting.value === "true" || setting.value === "1";
    } else if (setting.type === "json") {
      try {
        parsedValue = setting.value ? JSON.parse(setting.value) : null;
      } catch (e) {
        parsedValue = setting.value;
      }
    }
    return {
      success: true,
      data: {
        ...setting,
        value: parsedValue
      }
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error fetching system setting:", error);
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "System settings table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to fetch system setting"
    });
  }
});

export { _key__get as default };
//# sourceMappingURL=_key_.get.mjs.map

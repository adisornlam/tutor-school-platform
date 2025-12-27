import { d as defineEventHandler, g as getUserRoles, c as createError, a as getQuery, q as query } from '../../../../nitro/nitro.mjs';
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
import 'fs';
import 'path';
import 'querystring';
import 'timers';
import 'jws';
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

const system_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const queryParams = getQuery(event);
  const category = queryParams.category;
  const publicOnly = queryParams.public === "true";
  try {
    let sql = "SELECT id, `key`, value, type, category, description, is_public, created_at, updated_at FROM system_settings WHERE 1=1";
    const params = [];
    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    if (publicOnly) {
      sql += " AND is_public = TRUE";
    }
    sql += " ORDER BY category, `key`";
    const settings = await query(sql, params);
    const formattedSettings = settings.map((setting) => {
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
        ...setting,
        value: parsedValue
      };
    });
    if (!category) {
      const grouped = {};
      formattedSettings.forEach((setting) => {
        if (!grouped[setting.category]) {
          grouped[setting.category] = [];
        }
        grouped[setting.category].push(setting);
      });
      return {
        success: true,
        data: grouped
      };
    }
    return {
      success: true,
      data: formattedSettings
    };
  } catch (error) {
    console.error("Error fetching system settings:", error);
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "System settings table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to fetch system settings"
    });
  }
});

export { system_get as default };
//# sourceMappingURL=system.get.mjs.map

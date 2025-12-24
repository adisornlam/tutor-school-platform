globalThis.__timing__.logStart('Load chunks/routes/api/admin/settings/system.put');import { d as defineEventHandler, g as getUserRoles, c as createError, r as readBody, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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

const system_put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const body = await readBody();
  if (!body.settings || !Array.isArray(body.settings) || body.settings.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Settings array is required"
    });
  }
  try {
    const updatedSettings = [];
    for (const setting of body.settings) {
      const existing = await query(
        "SELECT id, type FROM system_settings WHERE `key` = ?",
        [setting.key]
      );
      if (existing.length === 0) {
        throw createError({
          statusCode: 404,
          message: `Setting with key "${setting.key}" not found`
        });
      }
      const settingType = existing[0].type;
      let valueToStore = setting.value;
      if (settingType === "boolean") {
        valueToStore = setting.value ? "true" : "false";
      } else if (settingType === "number") {
        valueToStore = String(setting.value);
      } else if (settingType === "json") {
        valueToStore = typeof setting.value === "string" ? setting.value : JSON.stringify(setting.value);
      } else {
        valueToStore = String(setting.value);
      }
      await execute(
        "UPDATE system_settings SET value = ?, updated_at = NOW() WHERE `key` = ?",
        [valueToStore, setting.key]
      );
      const updated = await query(
        "SELECT id, `key`, value, type, category, description, is_public FROM system_settings WHERE `key` = ?",
        [setting.key]
      );
      if (updated.length > 0) {
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
        updatedSettings.push({
          ...updated[0],
          value: parsedValue
        });
      }
    }
    return {
      success: true,
      data: updatedSettings,
      message: "System settings updated successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error updating system settings:", error);
    if (error.code === "ER_NO_SUCH_TABLE") {
      throw createError({
        statusCode: 400,
        message: "System settings table does not exist. Please run migration first."
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to update system settings"
    });
  }
});

export { system_put as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/admin/settings/system.put');
//# sourceMappingURL=system.put.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, q as query, e as execute } from '../../../../../../nitro/nitro.mjs';
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
import 'util';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const gateway_put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const paymentMethodId = parseInt(getRouterParam(event, "id") || "0");
  if (!paymentMethodId) {
    throw createError({
      statusCode: 400,
      message: "Payment method ID is required"
    });
  }
  const body = await readBody();
  if (!body.gateway_code || !body.gateway_name) {
    throw createError({
      statusCode: 400,
      message: "Gateway code and name are required"
    });
  }
  try {
    const methods = await query(
      "SELECT id, type, code FROM payment_methods WHERE id = ?",
      [paymentMethodId]
    );
    if (methods.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Payment method not found"
      });
    }
    if (methods[0].type !== "payment_gateway") {
      throw createError({
        statusCode: 400,
        message: "Gateway configuration is only available for payment_gateway payment methods"
      });
    }
    const existing = await query(
      "SELECT id, api_secret, webhook_secret FROM payment_gateways WHERE payment_method_id = ?",
      [paymentMethodId]
    );
    const configJson = body.config ? JSON.stringify(body.config) : null;
    if (existing.length > 0) {
      const updates = ["gateway_code = ?", "gateway_name = ?", "updated_at = NOW()"];
      const values = [body.gateway_code, body.gateway_name];
      if (body.api_key !== void 0) {
        updates.push("api_key = ?");
        values.push(body.api_key || null);
      }
      if (body.api_secret !== void 0 && !body.api_secret.includes("****")) {
        updates.push("api_secret = ?");
        values.push(body.api_secret || null);
      }
      if (body.merchant_id !== void 0) {
        updates.push("merchant_id = ?");
        values.push(body.merchant_id || null);
      }
      if (body.webhook_secret !== void 0 && !body.webhook_secret.includes("****")) {
        updates.push("webhook_secret = ?");
        values.push(body.webhook_secret || null);
      }
      if (body.endpoint_url !== void 0) {
        updates.push("endpoint_url = ?");
        values.push(body.endpoint_url || null);
      }
      if (body.is_test_mode !== void 0) {
        updates.push("is_test_mode = ?");
        values.push(body.is_test_mode);
      }
      if (body.is_active !== void 0) {
        updates.push("is_active = ?");
        values.push(body.is_active);
      }
      if (body.config !== void 0) {
        updates.push("config = ?");
        values.push(configJson);
      }
      values.push(existing[0].id);
      await execute(
        `UPDATE payment_gateways SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    } else {
      await execute(
        `INSERT INTO payment_gateways (
          payment_method_id, gateway_code, gateway_name,
          api_key, api_secret, merchant_id, webhook_secret,
          endpoint_url, is_test_mode, is_active, config
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          paymentMethodId,
          body.gateway_code,
          body.gateway_name,
          body.api_key || null,
          body.api_secret || null,
          body.merchant_id || null,
          body.webhook_secret || null,
          body.endpoint_url || null,
          body.is_test_mode !== void 0 ? body.is_test_mode : true,
          body.is_active !== void 0 ? body.is_active : true,
          configJson
        ]
      );
    }
    const gateways = await query(
      "SELECT * FROM payment_gateways WHERE payment_method_id = ?",
      [paymentMethodId]
    );
    if (gateways.length > 0) {
      const gateway = { ...gateways[0] };
      if (gateway.api_secret) {
        gateway.api_secret = gateway.api_secret.substring(0, 4) + "****";
      }
      if (gateway.webhook_secret) {
        gateway.webhook_secret = gateway.webhook_secret.substring(0, 4) + "****";
      }
      if (gateway.config) {
        try {
          gateway.config = JSON.parse(gateway.config);
        } catch (e) {
        }
      }
      return {
        success: true,
        data: gateway,
        message: "Payment gateway configuration updated successfully"
      };
    }
    throw createError({
      statusCode: 500,
      message: "Failed to save gateway configuration"
    });
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error updating payment gateway:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to update payment gateway"
    });
  }
});

export { gateway_put as default };
//# sourceMappingURL=gateway.put.mjs.map

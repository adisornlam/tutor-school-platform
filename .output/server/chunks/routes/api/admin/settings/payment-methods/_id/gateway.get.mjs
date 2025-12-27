import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query } from '../../../../../../nitro/nitro.mjs';
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
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const gateway_get = defineEventHandler(async (event) => {
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
    const gateways = await query(
      `SELECT 
        id,
        payment_method_id,
        gateway_code,
        gateway_name,
        api_key,
        api_secret,
        merchant_id,
        webhook_secret,
        endpoint_url,
        is_test_mode,
        is_active,
        config,
        created_at,
        updated_at
      FROM payment_gateways
      WHERE payment_method_id = ?`,
      [paymentMethodId]
    );
    if (gateways.length > 0) {
      const gateway = gateways[0];
      if (gateway.api_secret) {
        gateway.api_secret = gateway.api_secret.substring(0, 4) + "****";
      }
      if (gateway.webhook_secret) {
        gateway.webhook_secret = gateway.webhook_secret.substring(0, 4) + "****";
      }
    }
    return {
      success: true,
      data: gateways.length > 0 ? gateways[0] : null
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error fetching payment gateway:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch payment gateway"
    });
  }
});

export { gateway_get as default };
//# sourceMappingURL=gateway.get.mjs.map

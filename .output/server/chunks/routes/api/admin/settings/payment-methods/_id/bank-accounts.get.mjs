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
import 'util';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const bankAccounts_get = defineEventHandler(async (event) => {
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
      "SELECT id, type FROM payment_methods WHERE id = ?",
      [paymentMethodId]
    );
    if (methods.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Payment method not found"
      });
    }
    if (methods[0].type !== "bank_transfer") {
      throw createError({
        statusCode: 400,
        message: "Bank accounts are only available for bank_transfer payment methods"
      });
    }
    const accounts = await query(
      `SELECT 
        id,
        payment_method_id,
        bank_name,
        account_name,
        account_number,
        account_type,
        branch_name,
        qr_code_url,
        is_active,
        is_default,
        display_order,
        created_at,
        updated_at
      FROM bank_accounts
      WHERE payment_method_id = ?
      ORDER BY display_order, bank_name, account_name`,
      [paymentMethodId]
    );
    return {
      success: true,
      data: accounts
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error fetching bank accounts:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch bank accounts"
    });
  }
});

export { bankAccounts_get as default };
//# sourceMappingURL=bank-accounts.get.mjs.map

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
import 'object-assign';
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const bankAccounts_post = defineEventHandler(async (event) => {
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
  if (!body.bank_name || !body.account_name || !body.account_number) {
    throw createError({
      statusCode: 400,
      message: "Bank name, account name, and account number are required"
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
    if (body.is_default) {
      await execute(
        "UPDATE bank_accounts SET is_default = FALSE WHERE payment_method_id = ? AND is_default = TRUE",
        [paymentMethodId]
      );
    }
    await execute(
      `INSERT INTO bank_accounts (
        payment_method_id, bank_name, account_name, account_number,
        account_type, branch_name, qr_code_url,
        is_active, is_default, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentMethodId,
        body.bank_name,
        body.account_name,
        body.account_number,
        body.account_type || "savings",
        body.branch_name || null,
        body.qr_code_url || null,
        body.is_active !== void 0 ? body.is_active : true,
        body.is_default !== void 0 ? body.is_default : false,
        body.display_order || 0
      ]
    );
    const created = await query(
      "SELECT * FROM bank_accounts WHERE payment_method_id = ? AND account_number = ? ORDER BY id DESC LIMIT 1",
      [paymentMethodId, body.account_number]
    );
    return {
      success: true,
      data: created[0],
      message: "Bank account created successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error creating bank account:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to create bank account"
    });
  }
});

export { bankAccounts_post as default };
//# sourceMappingURL=bank-accounts.post.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, q as query, e as execute } from '../../../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../../../_/auth.middleware.mjs';
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

const _accountId__put = defineEventHandler(async (event) => {
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
  const accountId = parseInt(getRouterParam(event, "accountId") || "0");
  if (!paymentMethodId || !accountId) {
    throw createError({
      statusCode: 400,
      message: "Payment method ID and account ID are required"
    });
  }
  const body = await readBody();
  try {
    const accounts = await query(
      "SELECT id, payment_method_id FROM bank_accounts WHERE id = ? AND payment_method_id = ?",
      [accountId, paymentMethodId]
    );
    if (accounts.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Bank account not found"
      });
    }
    if (body.is_default) {
      await execute(
        "UPDATE bank_accounts SET is_default = FALSE WHERE payment_method_id = ? AND is_default = TRUE AND id != ?",
        [paymentMethodId, accountId]
      );
    }
    const updates = [];
    const values = [];
    if (body.bank_name !== void 0) {
      updates.push("bank_name = ?");
      values.push(body.bank_name);
    }
    if (body.account_name !== void 0) {
      updates.push("account_name = ?");
      values.push(body.account_name);
    }
    if (body.account_number !== void 0) {
      updates.push("account_number = ?");
      values.push(body.account_number);
    }
    if (body.account_type !== void 0) {
      updates.push("account_type = ?");
      values.push(body.account_type);
    }
    if (body.branch_name !== void 0) {
      updates.push("branch_name = ?");
      values.push(body.branch_name || null);
    }
    if (body.qr_code_url !== void 0) {
      updates.push("qr_code_url = ?");
      values.push(body.qr_code_url || null);
    }
    if (body.is_active !== void 0) {
      updates.push("is_active = ?");
      values.push(body.is_active);
    }
    if (body.is_default !== void 0) {
      updates.push("is_default = ?");
      values.push(body.is_default);
    }
    if (body.display_order !== void 0) {
      updates.push("display_order = ?");
      values.push(body.display_order);
    }
    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No fields to update"
      });
    }
    updates.push("updated_at = NOW()");
    values.push(accountId);
    await execute(
      `UPDATE bank_accounts SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    const updated = await query(
      "SELECT * FROM bank_accounts WHERE id = ?",
      [accountId]
    );
    return {
      success: true,
      data: updated[0],
      message: "Bank account updated successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error updating bank account:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to update bank account"
    });
  }
});

export { _accountId__put as default };
//# sourceMappingURL=_accountId_.put.mjs.map

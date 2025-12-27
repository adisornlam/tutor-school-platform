import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, q as query, e as execute } from '../../../../../../../nitro/nitro.mjs';
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

const _accountId__delete = defineEventHandler(async (event) => {
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
  try {
    const accounts = await query(
      "SELECT id, is_default FROM bank_accounts WHERE id = ? AND payment_method_id = ?",
      [accountId, paymentMethodId]
    );
    if (accounts.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Bank account not found"
      });
    }
    const account = accounts[0];
    if (account.is_default) {
      throw createError({
        statusCode: 400,
        message: "Cannot delete default bank account"
      });
    }
    await execute(
      "DELETE FROM bank_accounts WHERE id = ?",
      [accountId]
    );
    return {
      success: true,
      message: "Bank account deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error deleting bank account:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to delete bank account"
    });
  }
});

export { _accountId__delete as default };
//# sourceMappingURL=_accountId_.delete.mjs.map

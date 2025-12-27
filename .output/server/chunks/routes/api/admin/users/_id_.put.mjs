import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, o as findUserByIdentifier, p as findUserByEmail, e as execute, q as query, f as getUserWithRoles } from '../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../_/auth.middleware.mjs';
import bcrypt from 'bcryptjs';
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
import 'mysql2/promise';
import 'node:url';

const _id__put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const adminRoles = ["system_admin", "owner", "admin", "branch_admin"];
  if (!roles.some((role) => adminRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const userId = parseInt(getRouterParam(event, "id") || "0");
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "Invalid user ID"
    });
  }
  const body = await readBody(event);
  const { findUserById } = await import('../../../../nitro/nitro.mjs').then(function (n) { return n.ab; });
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: "User not found"
    });
  }
  if (body.username && body.username !== existingUser.username) {
    const usernameUser = await findUserByIdentifier(body.username);
    if (usernameUser && usernameUser.id !== userId) {
      throw createError({
        statusCode: 409,
        message: "Username already exists"
      });
    }
  }
  if (body.email !== void 0 && body.email !== existingUser.email) {
    if (body.email) {
      const emailUser = await findUserByEmail(body.email);
      if (emailUser && emailUser.id !== userId) {
        throw createError({
          statusCode: 409,
          message: "Email already exists"
        });
      }
    }
  }
  const updateFields = [];
  const updateValues = [];
  if (body.username !== void 0) {
    updateFields.push("username = ?");
    updateValues.push(body.username);
  }
  if (body.email !== void 0) {
    updateFields.push("email = ?");
    updateValues.push(body.email);
  }
  if (body.password) {
    const passwordHash = await bcrypt.hash(body.password, 12);
    updateFields.push("password_hash = ?");
    updateValues.push(passwordHash);
  }
  if (body.first_name !== void 0) {
    updateFields.push("first_name = ?");
    updateValues.push(body.first_name);
  }
  if (body.last_name !== void 0) {
    updateFields.push("last_name = ?");
    updateValues.push(body.last_name);
  }
  if (body.phone !== void 0) {
    updateFields.push("phone = ?");
    updateValues.push(body.phone);
  }
  if (updateFields.length > 0) {
    updateValues.push(userId);
    await execute(
      `UPDATE users SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );
  }
  if (body.roles !== void 0) {
    const validRoles = await query(
      "SELECT id, name FROM roles WHERE name IN (?)",
      [body.roles]
    );
    if (validRoles.length !== body.roles.length) {
      throw createError({
        statusCode: 400,
        message: "Invalid role(s) provided"
      });
    }
    await execute("DELETE FROM user_roles WHERE user_id = ?", [userId]);
    for (const role of validRoles) {
      await execute(
        "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
        [userId, role.id]
      );
    }
  }
  const user = await getUserWithRoles(userId);
  if (!user) {
    throw createError({
      statusCode: 500,
      message: "Failed to get updated user"
    });
  }
  return {
    success: true,
    data: user,
    message: "User updated successfully"
  };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

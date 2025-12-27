import { d as defineEventHandler, r as readBody, c as createError, x as createUser, f as getUserWithRoles, y as generateAccessToken, z as generateRefreshToken, u as setCookie } from '../../../nitro/nitro.mjs';
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
import 'safe-buffer';
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

const register_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.username || !body.password || !body.first_name || !body.last_name) {
    throw createError({
      statusCode: 400,
      message: "Username, password, first name, and last name are required"
    });
  }
  const { findUserByIdentifier } = await import('../../../nitro/nitro.mjs').then(function (n) { return n.ab; });
  const existingUser = await findUserByIdentifier(body.username);
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: "Username already registered"
    });
  }
  if (body.email) {
    const { findUserByEmail } = await import('../../../nitro/nitro.mjs').then(function (n) { return n.ab; });
    const existingEmailUser = await findUserByEmail(body.email);
    if (existingEmailUser) {
      throw createError({
        statusCode: 409,
        message: "Email already registered"
      });
    }
  }
  const user = await createUser(body);
  if (body.role) {
    const { queryOne, execute: execute2 } = await import('../../../nitro/nitro.mjs').then(function (n) { return n.a9; });
    const roleRecord = await queryOne(
      "SELECT id FROM roles WHERE name = ?",
      [body.role]
    );
    if (roleRecord) {
      await execute2(
        "DELETE FROM user_roles WHERE user_id = ?",
        [user.id]
      );
      await execute2(
        "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
        [user.id, roleRecord.id]
      );
    }
  }
  const userWithRoles = await getUserWithRoles(user.id);
  if (!userWithRoles) {
    throw createError({
      statusCode: 500,
      message: "Failed to create user"
    });
  }
  const accessToken = generateAccessToken(userWithRoles);
  const refreshToken = generateRefreshToken(user.id);
  const { execute } = await import('../../../nitro/nitro.mjs').then(function (n) { return n.a9; });
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await execute(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, refreshToken, expiresAt]
  );
  setCookie(event, "access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60
  });
  setCookie(event, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60
  });
  return {
    success: true,
    data: {
      user: userWithRoles,
      accessToken
    }
  };
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map

import { d as defineEventHandler, g as getUserRoles, c as createError, r as readBody, o as findUserByIdentifier, p as findUserByEmail, q as query, e as execute } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
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
import 'mime-db';
import 'path';
import 'querystring';
import 'base64id';
import 'timers';
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:url';

const users_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const adminRoles = ["system_admin", "owner"];
  if (!roles.some((role) => adminRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const body = await readBody(event);
  if (!body.username || !body.password || !body.first_name || !body.last_name) {
    throw createError({
      statusCode: 400,
      message: "Username, password, first name, and last name are required"
    });
  }
  if (!body.roles || body.roles.length === 0) {
    throw createError({
      statusCode: 400,
      message: "At least one role is required"
    });
  }
  const existingUser = await findUserByIdentifier(body.username);
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: "Username already exists"
    });
  }
  if (body.email) {
    const existingEmailUser = await findUserByEmail(body.email);
    if (existingEmailUser) {
      throw createError({
        statusCode: 409,
        message: "Email already exists"
      });
    }
  }
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
  const passwordHash = await bcrypt.hash(body.password, 12);
  const result = await execute(
    `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    [
      body.username,
      body.email || null,
      passwordHash,
      body.first_name,
      body.last_name,
      body.phone || null
    ]
  );
  const userId = result.insertId;
  for (const role of validRoles) {
    await execute(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [userId, role.id]
    );
  }
  const { getUserWithRoles } = await import('../../../nitro/nitro.mjs').then(function (n) { return n.ab; });
  const user = await getUserWithRoles(userId);
  if (!user) {
    throw createError({
      statusCode: 500,
      message: "Failed to create user"
    });
  }
  return {
    success: true,
    data: user,
    message: "User created successfully"
  };
});

export { users_post as default };
//# sourceMappingURL=users.post.mjs.map

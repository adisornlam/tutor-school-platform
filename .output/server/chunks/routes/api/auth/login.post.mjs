import { d as defineEventHandler, r as readBody, c as createError, t as login, u as setCookie } from '../../../nitro/nitro.mjs';
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
import 'base64id';
import 'timers';
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const login_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("[Login API] Received login request for username:", body.username);
    if (!body.username || !body.password) {
      console.log("[Login API] Validation failed: missing username or password");
      throw createError({
        statusCode: 400,
        message: "Username and password are required"
      });
    }
    console.log("[Login API] Calling login service...");
    const result = await login(body);
    console.log("[Login API] Login successful for user ID:", result.user.id);
    setCookie(event, "access_token", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60
      // 15 minutes
    });
    setCookie(event, "refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60
      // 7 days
    });
    return {
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    };
  } catch (error) {
    console.error("[Login API] Error:", error);
    console.error("[Login API] Error message:", error.message);
    console.error("[Login API] Error statusCode:", error.statusCode);
    throw error;
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map

import { d as defineEventHandler, b as getRouterParam, r as readBody, c as createError, w as useRuntimeConfig, p as findUserByEmail, x as createUser, U as UserRole, e as execute, f as getUserWithRoles, y as generateAccessToken, z as generateRefreshToken, u as setCookie } from '../../../../../nitro/nitro.mjs';
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

const callback_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const provider = getRouterParam(event, "provider");
  const body = await readBody(event);
  const { code, redirect_uri } = body;
  if (!["google", "facebook", "line"].includes(provider || "")) {
    throw createError({
      statusCode: 400,
      message: "Invalid OAuth provider"
    });
  }
  const config = useRuntimeConfig();
  const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`];
  if (!clientId || !clientSecret) {
    throw createError({
      statusCode: 500,
      message: `${provider} OAuth is not configured`
    });
  }
  try {
    let userInfo = {};
    if (provider === "google") {
      const tokenResponse = await $fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect_uri || `${config.public.apiBase}/auth/callback/google`,
          grant_type: "authorization_code"
        }).toString()
      });
      const userResponse = await $fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      });
      userInfo = {
        email: userResponse.email,
        firstName: userResponse.given_name,
        lastName: userResponse.family_name,
        picture: userResponse.picture
      };
    } else if (provider === "facebook") {
      const tokenResponse = await $fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
        method: "GET",
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirect_uri || `${config.public.apiBase}/auth/callback/facebook`,
          code
        }
      });
      const userResponse = await $fetch("https://graph.facebook.com/v18.0/me", {
        params: {
          fields: "id,name,email,first_name,last_name,picture",
          access_token: tokenResponse.access_token
        }
      });
      userInfo = {
        email: userResponse.email,
        firstName: userResponse.first_name,
        lastName: userResponse.last_name,
        picture: (_b = (_a = userResponse.picture) == null ? void 0 : _a.data) == null ? void 0 : _b.url
      };
    } else if (provider === "line") {
      const tokenResponse = await $fetch("https://api.line.me/oauth2/v2.1/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirect_uri || `${config.public.apiBase}/auth/callback/line`,
          client_id: clientId,
          client_secret: clientSecret
        }).toString()
      });
      const userResponse = await $fetch("https://api.line.me/v2/profile", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      });
      let email = "";
      if (tokenResponse.id_token) {
        const payload = JSON.parse(Buffer.from(tokenResponse.id_token.split(".")[1], "base64").toString());
        email = payload.email;
      }
      userInfo = {
        email: email || `${userResponse.userId}@line.me`,
        firstName: ((_c = userResponse.displayName) == null ? void 0 : _c.split(" ")[0]) || "",
        lastName: ((_d = userResponse.displayName) == null ? void 0 : _d.split(" ").slice(1).join(" ")) || "",
        picture: userResponse.pictureUrl
      };
    }
    if (!userInfo.email) {
      throw createError({
        statusCode: 400,
        message: "Unable to get email from OAuth provider"
      });
    }
    let user = await findUserByEmail(userInfo.email);
    if (!user) {
      const username = userInfo.email.split("@")[0] + "_" + provider;
      const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
      const createdUser = await createUser({
        username,
        email: userInfo.email,
        password: randomPassword,
        // Will be hashed, user can't login with password
        first_name: userInfo.firstName || "",
        last_name: userInfo.lastName || "",
        phone: void 0
      }, UserRole.PARENT);
      user = createdUser;
      if (userInfo.picture) {
        await execute(
          "UPDATE users SET avatar_url = ? WHERE id = ?",
          [userInfo.picture, user.id]
        );
      }
    } else {
      if (userInfo.picture && !user.avatar_url) {
        await execute(
          "UPDATE users SET avatar_url = ? WHERE id = ?",
          [userInfo.picture, user.id]
        );
      }
    }
    const userWithRoles = await getUserWithRoles(user.id);
    if (!userWithRoles) {
      throw createError({
        statusCode: 500,
        message: "Failed to get user roles"
      });
    }
    const accessToken = generateAccessToken(userWithRoles);
    const refreshToken = generateRefreshToken(user.id);
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await execute(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
      [user.id, refreshToken, expiresAt, refreshToken, expiresAt]
    );
    setCookie(event, "access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 2 * 60 * 60
      // 2 hours
    });
    setCookie(event, "refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60
      // 7 days
    });
    return {
      success: true,
      data: {
        user: userWithRoles,
        accessToken
      }
    };
  } catch (err) {
    console.error(`OAuth ${provider} callback error:`, err);
    throw createError({
      statusCode: 500,
      message: err.message || `Failed to authenticate with ${provider}`
    });
  }
});

export { callback_post as default };
//# sourceMappingURL=callback.post.mjs.map

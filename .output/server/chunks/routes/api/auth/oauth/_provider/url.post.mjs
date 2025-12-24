globalThis.__timing__.logStart('Load chunks/routes/api/auth/oauth/_provider/url.post');import { d as defineEventHandler, b as getRouterParam, r as readBody, c as createError, w as useRuntimeConfig } from '../../../../../nitro/nitro.mjs';
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
import 'engine.io';
import 'socket.io';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const url_post = defineEventHandler(async (event) => {
  const provider = getRouterParam(event, "provider");
  const body = await readBody(event);
  const { redirect_uri, state } = body;
  if (!["google", "facebook", "line"].includes(provider || "")) {
    throw createError({
      statusCode: 400,
      message: "Invalid OAuth provider"
    });
  }
  const config = useRuntimeConfig();
  const clientId = process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`];
  process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`];
  process.env[`OAUTH_${provider.toUpperCase()}_BASE_URL`];
  if (!clientId) {
    throw createError({
      statusCode: 500,
      message: `${provider} OAuth is not configured`
    });
  }
  const callbackUrl = `${config.public.apiBase}/auth/callback/${provider}?state=${encodeURIComponent(state || "")}`;
  let authUrl = "";
  if (provider === "google") {
    const scopes = "openid email profile";
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect_uri || callbackUrl)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state || "")}`;
  } else if (provider === "facebook") {
    const scopes = "email,public_profile";
    authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect_uri || callbackUrl)}&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state || "")}`;
  } else if (provider === "line") {
    const scopes = "profile openid email";
    authUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect_uri || callbackUrl)}&state=${encodeURIComponent(state || "")}&scope=${encodeURIComponent(scopes)}`;
  }
  return authUrl;
});

export { url_post as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/auth/oauth/_provider/url.post');
//# sourceMappingURL=url.post.mjs.map

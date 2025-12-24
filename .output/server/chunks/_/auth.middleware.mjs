globalThis.__timing__.logStart('Load chunks/_/auth.middleware');import { k as getCookie, l as getHeader, c as createError, v as verifyAccessToken } from '../nitro/nitro.mjs';

async function requireAuth(event) {
  var _a;
  const token = getCookie(event, "access_token") || ((_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace("Bearer ", ""));
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Authentication required"
    });
  }
  try {
    const payload = verifyAccessToken(token);
    event.context.user = payload;
    return payload;
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Session expired due to inactivity"
    });
  }
}

export { requireAuth as r };;globalThis.__timing__.logEnd('Load chunks/_/auth.middleware');
//# sourceMappingURL=auth.middleware.mjs.map

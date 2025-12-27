import { d as defineEventHandler, f as getUserWithRoles, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
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
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const me_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const user = await getUserWithRoles(auth.userId);
  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found"
    });
  }
  return {
    success: true,
    data: user
  };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map

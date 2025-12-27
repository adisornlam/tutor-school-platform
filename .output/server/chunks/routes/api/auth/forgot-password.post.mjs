import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
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
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const forgotPassword_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { identifier } = body;
  if (!identifier) {
    throw createError({
      statusCode: 400,
      message: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E4C\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E23\u0E2D\u0E01"
    });
  }
  return {
    success: true,
    message: "\u0E2B\u0E32\u0E01\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E4C\u0E19\u0E35\u0E49\u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A \u0E40\u0E23\u0E32\u0E08\u0E30\u0E2A\u0E48\u0E07\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E23\u0E35\u0E40\u0E0B\u0E47\u0E15\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E43\u0E2B\u0E49\u0E04\u0E38\u0E13"
  };
});

export { forgotPassword_post as default };
//# sourceMappingURL=forgot-password.post.mjs.map

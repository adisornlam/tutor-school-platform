import { d as defineEventHandler } from '../../nitro/nitro.mjs';
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

const health_get = defineEventHandler(async (event) => {
  return {
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    timezone: "Asia/Bangkok"
  };
});

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map

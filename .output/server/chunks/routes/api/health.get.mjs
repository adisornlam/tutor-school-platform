globalThis.__timing__.logStart('Load chunks/routes/api/health.get');import { d as defineEventHandler } from '../../nitro/nitro.mjs';
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

const health_get = defineEventHandler(async (event) => {
  return {
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    timezone: "Asia/Bangkok"
  };
});

export { health_get as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/health.get');
//# sourceMappingURL=health.get.mjs.map

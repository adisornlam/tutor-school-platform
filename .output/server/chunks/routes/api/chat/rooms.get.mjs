import { d as defineEventHandler, B as getUserChatRooms, c as createError } from '../../../nitro/nitro.mjs';
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
import 'accepts';
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

const rooms_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  try {
    const rooms = await getUserChatRooms(auth.userId);
    return {
      success: true,
      data: rooms
    };
  } catch (error) {
    console.error("[API] Error fetching chat rooms:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch chat rooms"
    });
  }
});

export { rooms_get as default };
//# sourceMappingURL=rooms.get.mjs.map

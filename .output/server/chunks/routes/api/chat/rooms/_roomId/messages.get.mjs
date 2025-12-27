import { d as defineEventHandler, b as getRouterParam, a as getQuery, c as createError, C as verifyRoomAccess, E as getChatMessages } from '../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../_/auth.middleware.mjs';
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
import 'negotiator';
import 'mime-types';
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

const messages_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roomId = parseInt(getRouterParam(event, "roomId") || "0");
  const query = getQuery(event);
  const limit = parseInt(query.limit) || 50;
  const offset = parseInt(query.offset) || 0;
  const since = query.since ? parseInt(query.since) : void 0;
  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: "Invalid room ID"
    });
  }
  const hasAccess = await verifyRoomAccess(auth.userId, roomId);
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: "Access denied to this room"
    });
  }
  try {
    let messages = await getChatMessages(roomId, limit, offset);
    if (since) {
      messages = messages.filter((msg) => {
        const msgId = msg.id;
        return typeof msgId === "number" && msgId > since;
      });
    }
    return {
      success: true,
      data: messages
    };
  } catch (error) {
    console.error("[API] Error fetching messages:", error);
    console.error("[API] Error details:", {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      stack: error.stack
    });
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to fetch messages",
      data: void 0
    });
  }
});

export { messages_get as default };
//# sourceMappingURL=messages.get.mjs.map

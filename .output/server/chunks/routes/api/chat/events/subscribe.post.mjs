import { d as defineEventHandler, r as readBody, c as createError, C as verifyRoomAccess } from '../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../_/auth.middleware.mjs';
import { a as subscribeToRoom, d as userConnections, b as sendSSE } from '../../../../_/sse.mjs';
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

const subscribe_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const body = await readBody(event);
  const roomId = parseInt(body.roomId || "0");
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
  subscribeToRoom(roomId, auth.userId);
  console.log(`[SSE] \u2705 User ${auth.userId} subscribed to room ${roomId} via API`);
  const connections = userConnections.get(auth.userId);
  if (connections) {
    for (const conn of connections) {
      try {
        await sendSSE(conn, "room_subscribed", {
          roomId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        console.error(`[SSE] Error sending room_subscribed to user ${auth.userId}:`, error);
      }
    }
  }
  return {
    success: true,
    roomId
  };
});

export { subscribe_post as default };
//# sourceMappingURL=subscribe.post.mjs.map

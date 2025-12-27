import { d as defineEventHandler, b as getRouterParam, r as readBody, c as createError, C as verifyRoomAccess, H as markMessagesAsRead, G as useNitroApp } from '../../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../../_/auth.middleware.mjs';
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
import 'util';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const read_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roomId = parseInt(getRouterParam(event, "roomId") || "0");
  const body = await readBody(event);
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
    await markMessagesAsRead(roomId, auth.userId, body.messageId);
    const nitroApp = useNitroApp();
    const io = nitroApp.io;
    if (io) {
      try {
        io.to(`room:${roomId}`).emit("messages_read", {
          roomId,
          userId: auth.userId,
          messageId: body.messageId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (emitError) {
        if (emitError.code !== "ECONNRESET" && emitError.message !== "read ECONNRESET") {
          console.error("[API] Error emitting messages_read event:", emitError);
        }
      }
    }
    return {
      success: true
    };
  } catch (error) {
    console.error("[API] Error marking messages as read:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to mark messages as read"
    });
  }
});

export { read_post as default };
//# sourceMappingURL=read.post.mjs.map

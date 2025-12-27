import { d as defineEventHandler, b as getRouterParam, c as createError, C as verifyRoomAccess, G as useNitroApp } from '../../../../../nitro/nitro.mjs';
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
import 'path';
import 'querystring';
import 'timers';
import 'jws';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const typing_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roomId = parseInt(getRouterParam(event, "roomId") || "0");
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
    const nitroApp = useNitroApp();
    const io = nitroApp.io;
    if (io) {
      try {
        io.to(`room:${roomId}`).emit("user_typing", {
          userId: auth.userId,
          roomId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (emitError) {
        if (emitError.code !== "ECONNRESET" && emitError.message !== "read ECONNRESET") {
          console.error("[API] Error emitting typing event:", emitError);
        }
      }
    }
    return {
      success: true
    };
  } catch (error) {
    if (error.code !== "ECONNRESET" && error.message !== "read ECONNRESET") {
      console.error("[API] Error emitting typing event:", error);
      throw createError({
        statusCode: 500,
        message: error.message || "Failed to emit typing event"
      });
    }
    return { success: true };
  }
});

export { typing_post as default };
//# sourceMappingURL=typing.post.mjs.map

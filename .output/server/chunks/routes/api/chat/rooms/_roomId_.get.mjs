import { d as defineEventHandler, b as getRouterParam, c as createError, D as verifyRoomAccess, i as getChatRoom } from '../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../_/auth.middleware.mjs';
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
import 'mysql2/promise';
import 'node:url';

const _roomId__get = defineEventHandler(async (event) => {
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
    const room = await getChatRoom(roomId);
    if (!room) {
      throw createError({
        statusCode: 404,
        message: "Chat room not found"
      });
    }
    return {
      success: true,
      data: room
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("[API] Error fetching chat room:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch chat room"
    });
  }
});

export { _roomId__get as default };
//# sourceMappingURL=_roomId_.get.mjs.map

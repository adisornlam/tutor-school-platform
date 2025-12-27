import { d as defineEventHandler, a as getQuery, c as createError, A as setHeader, B as getUserChatRooms, C as verifyRoomAccess } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
import { s as subscribeUser, a as subscribeToRoom, b as sendSSE, u as unsubscribeUser, c as unsubscribeFromRoom } from '../../../_/sse.mjs';
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
import 'object-assign';
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const events_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  let userId;
  if (query.token) {
    try {
      const { verifyAccessToken } = await import('../../../nitro/nitro.mjs').then(function (n) { return n.a8; });
      const { getUserWithRoles } = await import('../../../nitro/nitro.mjs').then(function (n) { return n.ab; });
      const payload = verifyAccessToken(query.token);
      const user = await getUserWithRoles(payload.userId);
      if (!user) {
        throw createError({
          statusCode: 401,
          message: "User not found"
        });
      }
      userId = user.id;
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: "Invalid token"
      });
    }
  } else {
    const auth = await requireAuth(event);
    userId = auth.userId;
  }
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");
  setHeader(event, "X-Accel-Buffering", "no");
  setHeader(event, "Access-Control-Allow-Origin", "*");
  setHeader(event, "Access-Control-Allow-Credentials", "true");
  console.log(`[SSE] User ${userId} connecting to chat events stream`);
  subscribeUser(userId, event);
  try {
    const rooms = await getUserChatRooms(userId);
    console.log(`[SSE] User ${userId} has ${rooms.length} rooms:`, rooms.map((r) => ({ id: r.id, course_id: r.course_id, student_id: r.student_id, tutor_id: r.tutor_id })));
    for (const room of rooms) {
      subscribeToRoom(room.id, userId);
    }
    console.log(`[SSE] \u2705 User ${userId} subscribed to ${rooms.length} rooms`);
  } catch (error) {
    console.error(`[SSE] \u274C Error loading rooms for user ${userId}:`, error);
  }
  await sendSSE(event, "connected", {
    userId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  const heartbeatInterval = setInterval(async () => {
    try {
      await sendSSE(event, "heartbeat", {
        timestamp: Date.now()
      });
    } catch (error) {
      clearInterval(heartbeatInterval);
    }
  }, 3e4);
  if (query.roomId) {
    const roomId = parseInt(query.roomId);
    if (roomId) {
      try {
        const hasAccess = await verifyRoomAccess(userId, roomId);
        if (hasAccess) {
          subscribeToRoom(roomId, userId);
          await sendSSE(event, "room_subscribed", {
            roomId,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      } catch (error) {
        console.error(`[SSE] Error subscribing to room ${roomId}:`, error);
      }
    }
  }
  event.node.req.on("close", () => {
    console.log(`[SSE] User ${userId} disconnected`);
    clearInterval(heartbeatInterval);
    unsubscribeUser(userId, event);
    try {
      const rooms = getUserChatRooms(userId);
      rooms.then((roomList) => {
        for (const room of roomList) {
          unsubscribeFromRoom(room.id, userId);
        }
      }).catch(console.error);
    } catch (error) {
      console.error(`[SSE] Error unsubscribing from rooms:`, error);
    }
  });
  event.node.req.on("error", (error) => {
    console.error(`[SSE] Connection error for user ${userId}:`, error);
    clearInterval(heartbeatInterval);
    unsubscribeUser(userId, event);
  });
  return new Promise(() => {
  });
});

export { events_get as default };
//# sourceMappingURL=events.get.mjs.map

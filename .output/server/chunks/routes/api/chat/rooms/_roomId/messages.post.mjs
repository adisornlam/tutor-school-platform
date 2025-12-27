import { d as defineEventHandler, b as getRouterParam, r as readBody, c as createError, C as verifyRoomAccess, F as saveMessage, G as useNitroApp, i as getChatRoom } from '../../../../../nitro/nitro.mjs';
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
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const messages_post = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = await requireAuth(event);
  const roomId = parseInt(getRouterParam(event, "roomId") || "0");
  const body = await readBody(event);
  console.log("[API] \u{1F4E8} POST /chat/rooms/[roomId]/messages called:", {
    roomId,
    userId: auth.userId,
    content: (_a = body.content) == null ? void 0 : _a.substring(0, 50),
    messageType: body.message_type,
    hasFile: !!body.file_url,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (!roomId) {
    console.error("[API] \u274C Invalid room ID:", roomId);
    throw createError({
      statusCode: 400,
      message: "Invalid room ID"
    });
  }
  if (!body.content && !body.file_url) {
    console.error("[API] \u274C Message content or file is required");
    throw createError({
      statusCode: 400,
      message: "Message content or file is required"
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
    console.log("[API] \u{1F4BE} Saving message to database...");
    const message = await saveMessage({
      room_id: roomId,
      sender_id: auth.userId,
      content: body.content || null,
      message_type: body.message_type || "text",
      file_url: body.file_url || null,
      file_name: body.file_name || null,
      file_size: body.file_size || null,
      file_type: body.file_type || null,
      reply_to_id: body.reply_to_id || null
    });
    console.log("[API] \u2705 Message saved to database:", {
      messageId: message.id,
      roomId: message.room_id,
      senderId: message.sender_id,
      content: (_b = message.content) == null ? void 0 : _b.substring(0, 50),
      createdAt: message.created_at
    });
    try {
      const nitroApp = useNitroApp();
      const io = nitroApp.io;
      if (io) {
        console.log(`[API] \u{1F4E4} Sending message ${message.id} via Socket.IO to room ${roomId}, sender: ${auth.userId}`);
        const room = await getChatRoom(roomId);
        const recipientId = room ? room.student_id === auth.userId ? room.tutor_id : room.student_id : null;
        const courseId = room == null ? void 0 : room.course_id;
        try {
          const DEBUG_MODE = process.env.DEBUG_SOCKET_ROOMS === "true";
          if (DEBUG_MODE) {
            const roomSockets = await io.in(`room:${roomId}`).fetchSockets();
            console.log(`[API] \u{1F50D} Room ${roomId} has ${roomSockets.length} connected socket(s)`);
            const userIdsInRoom = roomSockets.map((s) => {
              var _a2, _b2, _c;
              const userId = ((_a2 = s.data) == null ? void 0 : _a2.userId) || ((_c = (_b2 = s.data) == null ? void 0 : _b2.user) == null ? void 0 : _c.id);
              return {
                socketId: s.id,
                userId,
                rooms: Array.from(s.rooms || [])
              };
            });
            console.log(`[API] \u{1F465} Users in room ${roomId}:`, JSON.stringify(userIdsInRoom, null, 2));
            if (room && recipientId) {
              const recipientInRoom = userIdsInRoom.some((u) => u.userId === recipientId);
              console.log(`[API] \u{1F3AF} Recipient ${recipientId} in room ${roomId}:`, recipientInRoom);
            }
          }
          try {
            io.to(`room:${roomId}`).emit("new_message", message);
            if (DEBUG_MODE) {
              console.log(`[API] \u2705 Emitted 'new_message' to room ${roomId} (excluded sender ${auth.userId})`);
            }
          } catch (emitError) {
            if (emitError.code !== "ECONNRESET" && emitError.message !== "read ECONNRESET") {
              console.error(`[API] \u274C Error emitting to room ${roomId}:`, emitError);
            }
          }
          if (courseId) {
            try {
              io.to(`course:${courseId}`).emit("course_message_notification", {
                roomId,
                message,
                recipientId
              });
              if (DEBUG_MODE) {
                console.log(`[API] \u{1F4E2} Sent course notification to course:${courseId}`);
              }
            } catch (courseError) {
              if (courseError.code !== "ECONNRESET" && courseError.message !== "read ECONNRESET") {
                console.error(`[API] \u274C Error emitting to course ${courseId}:`, courseError);
              }
            }
          }
          if (room && recipientId) {
            try {
              io.to(`user:${recipientId}`).emit("new_message_notification", {
                roomId,
                message
              });
              if (DEBUG_MODE) {
                console.log(`[API] \u2705 Sent notification to recipient ${recipientId}`);
              }
            } catch (notifyError) {
              if (notifyError.code !== "ECONNRESET" && notifyError.message !== "read ECONNRESET") {
                console.error(`[API] \u274C Error sending notification to recipient ${recipientId}:`, notifyError);
              }
            }
          }
        } catch (socketError) {
          if (socketError.code !== "ECONNRESET" && socketError.message !== "read ECONNRESET") {
            console.error("[API] \u274C Socket.IO error:", socketError);
          }
        }
      } else {
        console.warn("[API] \u26A0\uFE0F  Socket.IO not available");
      }
    } catch (socketError) {
      console.error("[API] \u274C Socket.IO error for real-time update:", socketError);
    }
    return {
      success: true,
      data: message
    };
  } catch (error) {
    console.error("[API] Error sending message:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to send message"
    });
  }
});

export { messages_post as default };
//# sourceMappingURL=messages.post.mjs.map

globalThis.__timing__.logStart('Load chunks/routes/api/chat/rooms/_roomId/tags.get');import { d as defineEventHandler, b as getRouterParam, c as createError, C as verifyRoomAccess, q as query } from '../../../../../nitro/nitro.mjs';
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
import 'engine.io';
import 'socket.io';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const tags_get = defineEventHandler(async (event) => {
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
    const tags = await query(`
      SELECT 
        crt.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM chat_room_tags crt
      LEFT JOIN users u ON crt.created_by = u.id
      WHERE crt.room_id = ?
      ORDER BY crt.created_at DESC
    `, [roomId]);
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      room_id: tag.room_id,
      tag_name: tag.tag_name,
      color: tag.color,
      created_by: tag.created_by,
      created_at: tag.created_at,
      creator: {
        id: tag.created_by,
        first_name: tag.creator_first_name,
        last_name: tag.creator_last_name
      }
    }));
    return {
      success: true,
      data: formattedTags
    };
  } catch (error) {
    console.error("[API] Error fetching tags:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch tags"
    });
  }
});

export { tags_get as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/chat/rooms/_roomId/tags.get');
//# sourceMappingURL=tags.get.mjs.map

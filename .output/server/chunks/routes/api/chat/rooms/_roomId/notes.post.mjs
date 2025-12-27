import { d as defineEventHandler, b as getRouterParam, r as readBody, c as createError, C as verifyRoomAccess, e as execute, q as query } from '../../../../../nitro/nitro.mjs';
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

const notes_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roomId = parseInt(getRouterParam(event, "roomId") || "0");
  const body = await readBody(event);
  if (!roomId) {
    throw createError({
      statusCode: 400,
      message: "Invalid room ID"
    });
  }
  if (!body.content || !body.content.trim()) {
    throw createError({
      statusCode: 400,
      message: "Note content is required"
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
    const result = await execute(
      "INSERT INTO chat_room_notes (room_id, content, created_by) VALUES (?, ?, ?)",
      [roomId, body.content.trim(), auth.userId]
    );
    const notes = await query(`
      SELECT 
        crn.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name
      FROM chat_room_notes crn
      LEFT JOIN users creator ON crn.created_by = creator.id
      WHERE crn.id = ?
    `, [result.insertId]);
    if (!notes || notes.length === 0) {
      throw createError({
        statusCode: 500,
        message: "Failed to retrieve created note"
      });
    }
    const note = notes[0];
    const formattedNote = {
      id: note.id,
      room_id: note.room_id,
      content: note.content,
      created_by: note.created_by,
      updated_by: note.updated_by,
      created_at: note.created_at,
      updated_at: note.updated_at,
      creator: {
        id: note.created_by,
        first_name: note.creator_first_name,
        last_name: note.creator_last_name
      },
      updater: null
    };
    return {
      success: true,
      data: formattedNote
    };
  } catch (error) {
    console.error("[API] Error creating note:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to create note"
    });
  }
});

export { notes_post as default };
//# sourceMappingURL=notes.post.mjs.map

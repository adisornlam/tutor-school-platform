import { d as defineEventHandler, b as getRouterParam, c as createError, C as verifyRoomAccess, q as query } from '../../../../../nitro/nitro.mjs';
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
import 'safe-buffer';
import 'util';
import 'jwa';
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

const notes_get = defineEventHandler(async (event) => {
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
    const notes = await query(`
      SELECT 
        crn.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name,
        updater.first_name as updater_first_name,
        updater.last_name as updater_last_name
      FROM chat_room_notes crn
      LEFT JOIN users creator ON crn.created_by = creator.id
      LEFT JOIN users updater ON crn.updated_by = updater.id
      WHERE crn.room_id = ?
      ORDER BY crn.updated_at DESC, crn.created_at DESC
    `, [roomId]);
    const formattedNotes = notes.map((note) => ({
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
      updater: note.updated_by ? {
        id: note.updated_by,
        first_name: note.updater_first_name,
        last_name: note.updater_last_name
      } : null
    }));
    return {
      success: true,
      data: formattedNotes
    };
  } catch (error) {
    console.error("[API] Error fetching notes:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch notes"
    });
  }
});

export { notes_get as default };
//# sourceMappingURL=notes.get.mjs.map

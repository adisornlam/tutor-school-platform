import { d as defineEventHandler, b as getRouterParam, c as createError, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__delete = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const eventId = parseInt(getRouterParam(event, "id") || "0");
  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: "Invalid event ID"
    });
  }
  try {
    const events = await query(
      "SELECT user_id FROM calendar_events WHERE id = ?",
      [eventId]
    );
    if (events.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Event not found"
      });
    }
    const eventData = events[0];
    if (eventData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: "You can only delete your own events"
      });
    }
    await execute(
      "DELETE FROM calendar_events WHERE id = ?",
      [eventId]
    );
    return {
      success: true,
      message: "Event deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error deleting calendar event:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete calendar event"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

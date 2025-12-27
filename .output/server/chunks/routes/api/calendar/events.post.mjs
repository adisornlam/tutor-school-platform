import { d as defineEventHandler, r as readBody, c as createError, e as execute, q as query } from '../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../_/auth.middleware.mjs';
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
import 'negotiator';
import 'mime-types';
import 'path';
import 'querystring';
import 'base64id';
import 'timers';
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const events_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const body = await readBody(event);
  if (!body.title || !body.start_datetime || !body.end_datetime) {
    throw createError({
      statusCode: 400,
      message: "Title, start_datetime, and end_datetime are required"
    });
  }
  const startDate = new Date(body.start_datetime);
  const endDate = new Date(body.end_datetime);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw createError({
      statusCode: 400,
      message: "Invalid datetime format"
    });
  }
  if (endDate < startDate) {
    throw createError({
      statusCode: 400,
      message: "end_datetime must be after start_datetime"
    });
  }
  const isShared = body.is_shared || false;
  const sharedScope = isShared ? body.shared_scope || "public" : "private";
  const eventType = body.event_type || "personal";
  const color = body.color || "#3B82F6";
  const isAllDay = body.is_all_day || false;
  try {
    const result = await execute(
      `INSERT INTO calendar_events (
        user_id, title, description, start_datetime, end_datetime,
        location, color, is_all_day, reminder_minutes,
        is_shared, shared_scope, shared_branch_id, event_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        auth.userId,
        body.title,
        body.description || null,
        body.start_datetime,
        body.end_datetime,
        body.location || null,
        color,
        isAllDay,
        body.reminder_minutes || null,
        isShared,
        sharedScope,
        body.shared_branch_id || null,
        eventType
      ]
    );
    const eventId = result.insertId;
    if (isShared && body.shared_with_user_ids && body.shared_with_user_ids.length > 0) {
      for (const userId of body.shared_with_user_ids) {
        await execute(
          "INSERT INTO calendar_event_shared_with (event_id, shared_with_user_id) VALUES (?, ?)",
          [eventId, userId]
        );
      }
    }
    const events = await query(
      `SELECT 
        ce.id,
        ce.user_id,
        ce.title,
        ce.description,
        ce.start_datetime,
        ce.end_datetime,
        ce.location,
        ce.color,
        ce.is_all_day,
        ce.reminder_minutes,
        ce.is_shared,
        ce.shared_scope,
        ce.shared_branch_id,
        ce.event_type,
        ce.created_at,
        ce.updated_at,
        u.first_name,
        u.last_name
      FROM calendar_events ce
      INNER JOIN users u ON ce.user_id = u.id
      WHERE ce.id = ?`,
      [eventId]
    );
    if (events.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Event not found after creation"
      });
    }
    const createdEvent = events[0];
    return {
      success: true,
      data: {
        id: createdEvent.id,
        user_id: createdEvent.user_id,
        title: createdEvent.title,
        description: createdEvent.description,
        start_datetime: createdEvent.start_datetime,
        end_datetime: createdEvent.end_datetime,
        location: createdEvent.location,
        color: createdEvent.color,
        is_all_day: createdEvent.is_all_day,
        reminder_minutes: createdEvent.reminder_minutes,
        is_shared: createdEvent.is_shared,
        shared_scope: createdEvent.shared_scope,
        shared_branch_id: createdEvent.shared_branch_id,
        event_type: createdEvent.event_type,
        created_at: createdEvent.created_at,
        updated_at: createdEvent.updated_at,
        created_by: {
          id: createdEvent.user_id,
          first_name: createdEvent.first_name,
          last_name: createdEvent.last_name
        }
      }
    };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "Failed to create calendar event"
    });
  }
});

export { events_post as default };
//# sourceMappingURL=events.post.mjs.map

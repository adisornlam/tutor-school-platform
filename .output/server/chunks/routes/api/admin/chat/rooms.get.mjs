import { d as defineEventHandler, f as getUserWithRoles, U as UserRole, c as createError, a as getQuery, h as getAllChatRooms } from '../../../../nitro/nitro.mjs';
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
import 'vary';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const rooms_get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const user = await getUserWithRoles(auth.userId);
  const adminRoles = [UserRole.SYSTEM_ADMIN, UserRole.OWNER, UserRole.ADMIN];
  if (!user || !adminRoles.some((role) => user.roles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const query = getQuery(event);
  const limit = parseInt(query.limit) || 50;
  const offset = parseInt(query.offset) || 0;
  const filters = {};
  if (query.status) {
    filters.status = query.status;
  }
  if (query.courseId) {
    filters.courseId = parseInt(query.courseId);
  }
  if (query.studentId) {
    filters.studentId = parseInt(query.studentId);
  }
  if (query.tutorId) {
    filters.tutorId = parseInt(query.tutorId);
  }
  try {
    const result = await getAllChatRooms(limit, offset, filters);
    return {
      success: true,
      data: result.rooms,
      pagination: {
        total: result.total,
        limit,
        offset,
        totalPages: Math.ceil(result.total / limit)
      }
    };
  } catch (error) {
    console.error("[API] Error fetching chat rooms (admin):", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch chat rooms"
    });
  }
});

export { rooms_get as default };
//# sourceMappingURL=rooms.get.mjs.map

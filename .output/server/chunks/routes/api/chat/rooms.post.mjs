import { d as defineEventHandler, r as readBody, f as getUserWithRoles, U as UserRole, c as createError, D as createChatRoom } from '../../../nitro/nitro.mjs';
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

const rooms_post = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const body = await readBody(event);
  const user = await getUserWithRoles(auth.userId);
  if (!user || !user.roles.includes(UserRole.STUDENT)) {
    throw createError({
      statusCode: 403,
      message: "Only students can create chat rooms"
    });
  }
  if (!body.course_id || !body.tutor_id) {
    throw createError({
      statusCode: 400,
      message: "course_id and tutor_id are required"
    });
  }
  try {
    const room = await createChatRoom(auth.userId, body);
    return {
      success: true,
      data: room
    };
  } catch (error) {
    console.error("[API] Error creating chat room:", error);
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to create chat room"
    });
  }
});

export { rooms_post as default };
//# sourceMappingURL=rooms.post.mjs.map

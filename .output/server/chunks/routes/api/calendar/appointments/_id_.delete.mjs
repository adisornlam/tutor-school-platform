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
import 'accepts';
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

const _id__delete = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const appointmentId = parseInt(getRouterParam(event, "id") || "0");
  if (!appointmentId) {
    throw createError({
      statusCode: 400,
      message: "Invalid appointment ID"
    });
  }
  try {
    const appointments = await query(
      "SELECT user_id FROM calendar_appointments WHERE id = ?",
      [appointmentId]
    );
    if (appointments.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Appointment not found"
      });
    }
    const appointmentData = appointments[0];
    if (appointmentData.user_id !== auth.userId) {
      throw createError({
        statusCode: 403,
        message: "You can only delete appointments you created"
      });
    }
    await execute(
      "DELETE FROM calendar_appointments WHERE id = ?",
      [appointmentId]
    );
    return {
      success: true,
      message: "Appointment deleted successfully"
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error deleting calendar appointment:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete calendar appointment"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map

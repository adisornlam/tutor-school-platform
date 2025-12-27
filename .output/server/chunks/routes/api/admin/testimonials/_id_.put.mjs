import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam, r as readBody, q as query, e as execute } from '../../../../nitro/nitro.mjs';
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
import 'cookie';
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__put = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner", "admin"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
  const testimonialId = parseInt(getRouterParam(event, "id") || "0");
  if (!testimonialId) {
    throw createError({
      statusCode: 400,
      message: "Invalid testimonial ID"
    });
  }
  const body = await readBody();
  const existing = await query(
    "SELECT id FROM testimonials WHERE id = ?",
    [testimonialId]
  );
  if (existing.length === 0) {
    throw createError({
      statusCode: 404,
      message: "Testimonial not found"
    });
  }
  if (body.rating !== void 0 && (body.rating < 1 || body.rating > 5)) {
    throw createError({
      statusCode: 400,
      message: "Rating must be between 1 and 5"
    });
  }
  if (body.status) {
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(body.status)) {
      throw createError({
        statusCode: 400,
        message: "Invalid status"
      });
    }
  }
  const updates = [];
  const values = [];
  if (body.name !== void 0) {
    updates.push("name = ?");
    values.push(body.name);
  }
  if (body.role !== void 0) {
    updates.push("role = ?");
    values.push(body.role);
  }
  if (body.comment !== void 0) {
    updates.push("comment = ?");
    values.push(body.comment);
  }
  if (body.rating !== void 0) {
    updates.push("rating = ?");
    values.push(body.rating);
  }
  if (body.avatar_url !== void 0) {
    updates.push("avatar_url = ?");
    values.push(body.avatar_url);
  }
  if (body.status !== void 0) {
    updates.push("status = ?");
    values.push(body.status);
  }
  if (body.display_order !== void 0) {
    updates.push("display_order = ?");
    values.push(body.display_order);
  }
  if (updates.length === 0) {
    throw createError({
      statusCode: 400,
      message: "No fields to update"
    });
  }
  values.push(testimonialId);
  try {
    await execute(
      `UPDATE testimonials SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return {
      success: true,
      message: "Testimonial updated successfully"
    };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update testimonial"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map

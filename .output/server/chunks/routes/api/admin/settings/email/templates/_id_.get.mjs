import { d as defineEventHandler, g as getUserRoles, c as createError, b as getRouterParam } from '../../../../../../nitro/nitro.mjs';
import { r as requireAuth } from '../../../../../../_/auth.middleware.mjs';
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
import 'util';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

const _id__get = defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const roles = await getUserRoles(auth.userId);
  const allowedRoles = ["system_admin", "owner"];
  if (!roles.some((role) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      message: "Access denied. System Admin or Owner role required."
    });
  }
  const templateId = parseInt(getRouterParam(event, "id") || "0");
  if (!templateId) {
    throw createError({
      statusCode: 400,
      message: "Invalid template ID"
    });
  }
  try {
    const templates = {
      1: {
        id: 1,
        code: "welcome",
        name: "Welcome Email",
        subject: "\u0E22\u0E34\u0E19\u0E14\u0E35\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A",
        body: "<p>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35 {{first_name}} {{last_name}},</p><p>\u0E22\u0E34\u0E19\u0E14\u0E35\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32</p>",
        variables: ["first_name", "last_name", "email"]
      },
      2: {
        id: 2,
        code: "password_reset",
        name: "Password Reset",
        subject: "\u0E23\u0E35\u0E40\u0E0B\u0E47\u0E15\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19",
        body: "<p>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35 {{first_name}},</p><p>\u0E04\u0E25\u0E34\u0E01\u0E17\u0E35\u0E48\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E19\u0E35\u0E49\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E23\u0E35\u0E40\u0E0B\u0E47\u0E15\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19: {{reset_link}}</p>",
        variables: ["first_name", "reset_link"]
      },
      3: {
        id: 3,
        code: "enrollment_confirmation",
        name: "Enrollment Confirmation",
        subject: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E25\u0E07\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19",
        body: "<p>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35 {{student_name}},</p><p>\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E25\u0E07\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E04\u0E2D\u0E23\u0E4C\u0E2A {{course_name}} \u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27</p>",
        variables: ["student_name", "course_name", "enrollment_date"]
      }
    };
    const template = templates[templateId];
    if (!template) {
      throw createError({
        statusCode: 404,
        message: "Template not found"
      });
    }
    return {
      success: true,
      data: template
    };
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error fetching email template:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch email template"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map

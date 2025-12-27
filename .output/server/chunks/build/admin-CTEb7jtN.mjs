import { a0 as executeAsync } from '../nitro/nitro.mjs';
import { g as defineNuxtRouteMiddleware, u as useAuth, n as navigateTo, h as createError } from './server.mjs';
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
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@heroicons/vue/24/outline';

const admin = defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  const { isAuthenticated, fetchUser, hasAnyRole } = useAuth();
  if (!isAuthenticated.value) {
    [__temp, __restore] = executeAsync(() => fetchUser()), await __temp, __restore();
    [__temp, __restore] = executeAsync(() => new Promise((resolve) => setTimeout(resolve, 100))), await __temp, __restore();
  }
  if (!isAuthenticated.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
  const { UserRole } = ([__temp, __restore] = executeAsync(() => import('../nitro/nitro.mjs').then(function (n) { return n.aa; })), __temp = await __temp, __restore(), __temp);
  const adminRoles = [
    UserRole.SYSTEM_ADMIN,
    UserRole.OWNER,
    UserRole.ADMIN,
    // Admin กลาง
    UserRole.BRANCH_ADMIN,
    UserRole.TUTOR
    // Tutors also use admin layout
  ];
  if (!hasAnyRole(adminRoles)) {
    throw createError({
      statusCode: 403,
      message: "Access denied. Admin role required."
    });
  }
});

export { admin as default };
//# sourceMappingURL=admin-CTEb7jtN.mjs.map

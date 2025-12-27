import { a0 as executeAsync } from '../nitro/nitro.mjs';
import { getRedirectPathByRole } from './auth-COdMvhp6.mjs';
import { g as defineNuxtRouteMiddleware, u as useAuth, n as navigateTo } from './server.mjs';
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

const guest = defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  const { isAuthenticated, fetchUser, user } = useAuth();
  if (!isAuthenticated.value) {
    [__temp, __restore] = executeAsync(() => fetchUser()), await __temp, __restore();
  }
  if (isAuthenticated.value) {
    const redirect = to.query.redirect;
    const redirectPath = getRedirectPathByRole(user.value, redirect);
    return navigateTo(redirectPath);
  }
});

export { guest as default };
//# sourceMappingURL=guest-CZSH4cDN.mjs.map

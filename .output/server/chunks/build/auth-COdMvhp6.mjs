import { U as UserRole } from '../nitro/nitro.mjs';
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

function getRedirectPathByRole(user, redirect) {
  if (redirect) {
    return redirect;
  }
  if (!user || !user.roles || user.roles.length === 0) {
    return "/my-courses";
  }
  if (user.roles.includes(UserRole.SYSTEM_ADMIN) || user.roles.includes(UserRole.OWNER) || user.roles.includes(UserRole.ADMIN) || user.roles.includes(UserRole.BRANCH_ADMIN) || user.roles.includes(UserRole.TUTOR)) {
    return "/admin";
  }
  return "/my-courses";
}
function isAdmin(user) {
  if (!user || !user.roles) return false;
  const adminRoles = [
    UserRole.SYSTEM_ADMIN,
    UserRole.OWNER,
    UserRole.ADMIN,
    UserRole.BRANCH_ADMIN
  ];
  return user.roles.some(
    (role) => adminRoles.includes(role)
  );
}
function isStudentOrParent(user) {
  if (!user || !user.roles) return false;
  const studentRoles = [UserRole.STUDENT, UserRole.PARENT];
  return user.roles.some(
    (role) => studentRoles.includes(role)
  );
}

export { getRedirectPathByRole, isAdmin, isStudentOrParent };
//# sourceMappingURL=auth-COdMvhp6.mjs.map

import { q as query, d as defineEventHandler, c as createError, g as getUserRoles } from '../../../nitro/nitro.mjs';
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
import 'ws';
import 'cors';
import '@socket.io/component-emitter';
import 'jsonwebtoken';
import 'bcryptjs';
import 'mysql2/promise';
import 'node:url';

async function getAdminMenus(userRoles) {
  try {
    console.log("[Menu Service] Getting menus for roles:", userRoles);
    const allMenus = await query(
      `SELECT id, code, name, name_en, icon, href, parent_code, display_order, is_active, roles
       FROM admin_menus
       WHERE is_active = TRUE
       ORDER BY display_order ASC, name ASC`
    );
    console.log("[Menu Service] Total menus in DB:", allMenus.length);
    if (!allMenus || allMenus.length === 0) {
      console.warn("[Menu Service] No admin menus found in database. Please run migration: bun run db:migrate-menus");
      return [];
    }
    const filteredMenus = allMenus.filter((menu) => {
      if (!menu.roles) {
        console.log(`[Menu Service] Menu ${menu.code} has no roles restriction - allowing`);
        return true;
      }
      try {
        const allowedRoles = JSON.parse(menu.roles);
        const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
        console.log(`[Menu Service] Menu ${menu.code} - Allowed roles: ${allowedRoles.join(", ")}, User has access: ${hasAccess}`);
        return hasAccess;
      } catch (error) {
        console.error(`[Menu Service] Error parsing roles for menu ${menu.code}:`, error);
        return true;
      }
    });
    console.log("[Menu Service] Filtered menus:", filteredMenus.length);
    const menuMap = /* @__PURE__ */ new Map();
    const rootMenus = [];
    filteredMenus.forEach((menu) => {
      menuMap.set(menu.code, { ...menu, children: [] });
    });
    filteredMenus.forEach((menu) => {
      const menuItem = menuMap.get(menu.code);
      if (menu.parent_code) {
        const parent = menuMap.get(menu.parent_code);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(menuItem);
        }
      } else {
        rootMenus.push(menuItem);
      }
    });
    const sortMenus = (menus) => {
      menus.sort((a, b) => a.display_order - b.display_order);
      menus.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          sortMenus(menu.children);
        }
      });
    };
    sortMenus(rootMenus);
    return rootMenus;
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      console.error("admin_menus table does not exist. Please run migration: bun run db:migrate-menus");
      return [];
    }
    throw error;
  }
}

const menus_get = defineEventHandler(async (event) => {
  try {
    const auth = await requireAuth(event);
    const userId = auth.userId;
    console.log("[Admin Menus API] User ID:", userId);
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Invalid token payload"
      });
    }
    const roles = await getUserRoles(userId);
    console.log("[Admin Menus API] User roles:", roles);
    if (!roles || roles.length === 0) {
      console.warn("[Admin Menus API] User has no roles");
      throw createError({
        statusCode: 403,
        message: "User has no roles"
      });
    }
    const menus = await getAdminMenus(roles);
    console.log("[Admin Menus API] Menus found:", menus.length);
    console.log("[Admin Menus API] Menu codes:", menus.map((m) => m.code));
    return {
      success: true,
      data: menus
    };
  } catch (error) {
    console.error("[Admin Menus API] Error fetching admin menus:", error);
    console.error("[Admin Menus API] Error details:", {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack
    });
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch menus"
    });
  }
});

export { menus_get as default };
//# sourceMappingURL=menus.get.mjs.map

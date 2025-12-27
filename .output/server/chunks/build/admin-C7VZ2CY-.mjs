import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, createTextVNode, computed, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderSlot, ssrRenderVNode } from 'vue/server-renderer';
import { NewspaperIcon, ChatBubbleLeftRightIcon, MegaphoneIcon, CalendarIcon, AcademicCapIcon, Cog6ToothIcon, EnvelopeIcon, CogIcon, ChartBarIcon, TagIcon, CurrencyDollarIcon, ClipboardDocumentCheckIcon, BookOpenIcon, BuildingOfficeIcon, ShieldCheckIcon, UserCircleIcon, UserIcon, UserGroupIcon, UsersIcon, HomeIcon } from '@heroicons/vue/24/outline';
import { u as useAuth, a as useRoute } from './server.mjs';
import { u as useUnreadMessages } from './useUnreadMessages-hQ6KJWBd.mjs';
import '../nitro/nitro.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MenuIcon",
  __ssrInlineRender: true,
  props: {
    icon: { default: null },
    class: { default: "w-5 h-5" }
  },
  setup(__props) {
    const props = __props;
    const iconMap = {
      HomeIcon,
      UsersIcon,
      UserGroupIcon,
      UserIcon,
      UserCircleIcon,
      ShieldCheckIcon,
      BuildingOfficeIcon,
      BuildingIcon: BuildingOfficeIcon,
      BookOpenIcon,
      BookIcon: BookOpenIcon,
      ClipboardDocumentCheckIcon,
      ClipboardIcon: ClipboardDocumentCheckIcon,
      CurrencyDollarIcon,
      CurrencyIcon: CurrencyDollarIcon,
      TagIcon,
      ChartBarIcon,
      ChartIcon: ChartBarIcon,
      CogIcon,
      EnvelopeIcon,
      Cog6ToothIcon,
      AcademicCapIcon,
      CalendarIcon,
      MegaphoneIcon,
      ChatBubbleLeftRightIcon,
      NewspaperIcon
    };
    const iconComponent = computed(() => {
      if (!props.icon) return null;
      return iconMap[props.icon] || null;
    });
    const iconClass = computed(() => props.class);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(iconComponent)), mergeProps({ class: unref(iconClass) }, _attrs), null), _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MenuIcon.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "MenuIcon" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const route = useRoute();
    const sidebarOpen = ref(false);
    const showUserMenu = ref(false);
    const menus = ref([]);
    const loadingMenus = ref(true);
    const menuError = ref(null);
    const expandedMenus = ref({});
    const { unreadCount } = useUnreadMessages();
    const isActive = (href) => {
      if (!href || href === "#") return false;
      if (href === "/admin") {
        return route.path === "/admin";
      }
      return route.path.startsWith(href);
    };
    const isMenuActive = (menu) => {
      if (menu.href && isActive(menu.href)) {
        return true;
      }
      if (menu.children && menu.children.length > 0) {
        return menu.children.some((child) => child.href && isActive(child.href));
      }
      return false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_MenuIcon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><aside class="${ssrRenderClass([
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
        unref(sidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      ])}"><div class="flex flex-col h-full"><div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "flex items-center space-x-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-xl font-bold text-green-600"${_scopeId}>KDC Admin</span>`);
          } else {
            return [
              createVNode("span", { class: "text-xl font-bold text-green-600" }, "KDC Admin")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="lg:hidden p-2 rounded-lg hover:bg-gray-100"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><nav class="flex-1 overflow-y-auto py-4 scrollbar-light"><div class="px-3 space-y-1"><!--[-->`);
      ssrRenderList(unref(menus), (menu) => {
        _push(`<!--[-->`);
        if (menu.children && menu.children.length > 0) {
          _push(`<div><button class="${ssrRenderClass([isMenuActive(menu) ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100", "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"])}"><div class="flex items-center space-x-3">`);
          if (menu.icon) {
            _push(ssrRenderComponent(_component_MenuIcon, {
              icon: menu.icon,
              class: "w-5 h-5"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(menu.name)}</span></div><svg class="${ssrRenderClass([{ "rotate-90": unref(expandedMenus)[menu.code] }, "w-4 h-4 transition-transform"])}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button><div class="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2" style="${ssrRenderStyle(unref(expandedMenus)[menu.code] ? null : { display: "none" })}"><!--[-->`);
          ssrRenderList(menu.children, (child) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: child.code,
              to: child.href || "#",
              class: ["flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", isActive(child.href || "") ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-100"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (child.icon) {
                    _push2(ssrRenderComponent(_component_MenuIcon, {
                      icon: child.icon,
                      class: "w-4 h-4"
                    }, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<span${_scopeId}>${ssrInterpolate(child.name)}</span>`);
                } else {
                  return [
                    child.icon ? (openBlock(), createBlock(_component_MenuIcon, {
                      key: 0,
                      icon: child.icon,
                      class: "w-4 h-4"
                    }, null, 8, ["icon"])) : createCommentVNode("", true),
                    createVNode("span", null, toDisplayString(child.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: menu.href || "#",
            class: ["flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors", isActive(menu.href || "") ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center space-x-3"${_scopeId}>`);
                if (menu.icon) {
                  _push2(ssrRenderComponent(_component_MenuIcon, {
                    icon: menu.icon,
                    class: "w-5 h-5"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span${_scopeId}>${ssrInterpolate(menu.name)}</span></div>`);
                if (menu.code === "CHAT" && unref(unreadCount) > 0) {
                  _push2(`<span class="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full"${_scopeId}>${ssrInterpolate(unref(unreadCount) > 99 ? "99+" : unref(unreadCount))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode("div", { class: "flex items-center space-x-3" }, [
                    menu.icon ? (openBlock(), createBlock(_component_MenuIcon, {
                      key: 0,
                      icon: menu.icon,
                      class: "w-5 h-5"
                    }, null, 8, ["icon"])) : createCommentVNode("", true),
                    createVNode("span", null, toDisplayString(menu.name), 1)
                  ]),
                  menu.code === "CHAT" && unref(unreadCount) > 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full"
                  }, toDisplayString(unref(unreadCount) > 99 ? "99+" : unref(unreadCount)), 1)) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]-->`);
      if (unref(loadingMenus)) {
        _push(`<div class="px-3 py-2 text-sm text-gray-500"> กำลังโหลดเมนู... </div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(menuError)) {
        _push(`<div class="px-3 py-2 text-sm text-red-500">${ssrInterpolate(unref(menuError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></nav><div class="p-4 border-t border-gray-200"><div class="flex items-center space-x-3"><div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">${ssrInterpolate(unref(user)?.first_name?.[0] || "A")}</div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-gray-900 truncate">${ssrInterpolate(unref(user)?.first_name)} ${ssrInterpolate(unref(user)?.last_name)}</p><p class="text-xs text-gray-500 truncate">${ssrInterpolate(unref(user)?.email)}</p></div></div></div></div></aside>`);
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="lg:pl-64"><header class="sticky top-0 z-30 bg-white border-b border-gray-200"><div class="flex items-center justify-between h-16 px-4"><button class="lg:hidden p-2 rounded-lg hover:bg-gray-100"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button><div class="flex-1 flex items-center justify-end space-x-4"><div class="hidden md:block relative"><input type="text" placeholder="ค้นหา..." class="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"><svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><button class="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg><span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span></button><div class="relative"><button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"><div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">${ssrInterpolate(unref(user)?.first_name?.[0] || "A")}</div></button>`);
      if (unref(showUserMenu)) {
        _push(`<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/profile",
          class: "block px-4 py-2 text-sm text-green-600 hover:bg-gray-100 hover:text-green-700",
          onClick: ($event) => showUserMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` โปรไฟล์ `);
            } else {
              return [
                createTextVNode(" โปรไฟล์ ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "block px-4 py-2 text-sm text-green-600 hover:bg-gray-100 hover:text-green-700",
          onClick: ($event) => showUserMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` กลับไปหน้าแรก `);
            } else {
              return [
                createTextVNode(" กลับไปหน้าแรก ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<hr class="my-2 border-gray-200"><button class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"> ออกจากระบบ </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></header><main class="p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-white border-t border-gray-200 py-6 mt-auto"><div class="container mx-auto px-4"><div class="flex items-center justify-center"><p class="text-sm text-gray-600"> © 2024 KDC Tutor School. สงวนลิขสิทธิ์ </p></div></div></footer></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-C7VZ2CY-.mjs.map

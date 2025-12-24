globalThis.__timing__.logStart('Load chunks/build/student-CM_re3zP');import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, createBlock, createVNode, openBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuth } from './server.mjs';
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
import 'engine.io';
import 'socket.io';
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
import '@heroicons/vue/24/outline';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "student",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const { unreadCount } = useUnreadMessages();
    const showUserMenu = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"><div class="container mx-auto px-4"><div class="flex items-center justify-between h-16">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-xl font-bold text-green-600"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` KDC School `);
          } else {
            return [
              createTextVNode(" KDC School ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center space-x-4"><button class="relative p-2 text-gray-700 hover:text-green-600"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg><span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span></button><div class="relative"><button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"><div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">${ssrInterpolate(unref(user)?.first_name?.[0] || "U")}</div><span class="hidden md:block text-gray-700">${ssrInterpolate(unref(user)?.first_name)} ${ssrInterpolate(unref(user)?.last_name)}</span></button>`);
      if (unref(showUserMenu)) {
        _push(`<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          class: "block px-4 py-2 text-gray-700 hover:bg-gray-100",
          onClick: ($event) => showUserMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` โปรไฟล์ของฉัน `);
            } else {
              return [
                createTextVNode(" โปรไฟล์ของฉัน ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"> ออกจากระบบ </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></header><div class="flex"><aside class="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16"><nav class="p-4"><div class="mb-6"><h2 class="text-sm font-semibold text-gray-500 uppercase mb-2">ข้อมูลการเรียน</h2><ul class="space-y-1"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/my-courses",
        class: ["flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors", _ctx.$route.path === "/my-courses" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"${_scopeId}></path></svg><span${_scopeId}>คอร์สเรียนของฉัน</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-5 w-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                })
              ])),
              createVNode("span", null, "คอร์สเรียนของฉัน")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/chat",
        class: ["flex items-center justify-between px-3 py-2 rounded-lg transition-colors", _ctx.$route.path.startsWith("/chat") ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center space-x-3"${_scopeId}><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"${_scopeId}></path></svg><span${_scopeId}>แชท</span></div>`);
            if (unref(unreadCount) > 0) {
              _push2(`<span class="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full"${_scopeId}>${ssrInterpolate(unref(unreadCount) > 99 ? "99+" : unref(unreadCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex items-center space-x-3" }, [
                (openBlock(), createBlock("svg", {
                  class: "h-5 w-5",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  })
                ])),
                createVNode("span", null, "แชท")
              ]),
              unref(unreadCount) > 0 ? (openBlock(), createBlock("span", {
                key: 0,
                class: "flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full"
              }, toDisplayString(unref(unreadCount) > 99 ? "99+" : unref(unreadCount)), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h2 class="text-sm font-semibold text-gray-500 uppercase mb-2">ข้อมูลโปรไฟล์</h2><ul class="space-y-1"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/profile",
        class: ["flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors", _ctx.$route.path === "/profile" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg><span${_scopeId}>โปรไฟล์ของฉัน</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-5 w-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                })
              ])),
              createVNode("span", null, "โปรไฟล์ของฉัน")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/payment-history",
        class: ["flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors", _ctx.$route.path === "/payment-history" ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span${_scopeId}>ประวัติการชำระเงิน</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-5 w-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                })
              ])),
              createVNode("span", null, "ประวัติการชำระเงิน")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></nav></aside><main class="flex-1 p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/student.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/student-CM_re3zP');
//# sourceMappingURL=student-CM_re3zP.mjs.map

import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createBlock, createVNode, openBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuth } from './server.mjs';
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
import 'util';
import 'jwa';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
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
  __name: "chat",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, hasAnyRole } = useAuth();
    const showUserMenu = ref(false);
    const backUrl = computed(() => {
      if (hasAnyRole(["tutor", "system_admin", "owner", "admin", "branch_admin"])) {
        return "/admin";
      }
      return "/my-courses";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"><div class="container mx-auto px-4"><div class="flex items-center justify-between h-16"><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(backUrl),
        class: "flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors",
        title: unref(backUrl) === "/admin" ? "กลับไปที่ Admin Dashboard" : "กลับไปที่คอร์สเรียน"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg><span class="font-medium"${_scopeId}>กลับ</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                })
              ])),
              createVNode("span", { class: "font-medium" }, "กลับ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(backUrl),
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
      _push(`</div><div class="flex items-center space-x-4">`);
      if (unref(backUrl) === "/my-courses") {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/my-courses",
          class: "text-gray-700 hover:text-green-600 font-medium"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` คอร์สเรียน `);
            } else {
              return [
                createTextVNode(" คอร์สเรียน ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin",
          class: "text-gray-700 hover:text-green-600 font-medium"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Dashboard `);
            } else {
              return [
                createTextVNode(" Dashboard ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<div class="relative"><button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"><div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">${ssrInterpolate(unref(user)?.first_name?.[0] || "U")}</div><span class="hidden md:block text-gray-700">${ssrInterpolate(unref(user)?.first_name)} ${ssrInterpolate(unref(user)?.last_name)}</span></button>`);
      if (unref(showUserMenu)) {
        _push(`<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">`);
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
      _push(`</div></div></div></div></header><main class="h-[calc(100vh-4rem)] overflow-hidden">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/chat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=chat-DEZCJvs0.mjs.map

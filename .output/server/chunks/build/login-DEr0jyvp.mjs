import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuth, a as useRoute, b as useRouter } from './server.mjs';
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
import 'cookie';
import 'ws';
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
import '@heroicons/vue/24/outline';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    useRoute();
    useRouter();
    const form = reactive({
      username: "",
      password: ""
    });
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-[calc(100vh-200px)] flex items-center justify-center py-12" }, _attrs))}><div class="max-w-md w-full mx-4"><div class="bg-white rounded-lg shadow-lg p-8"><h1 class="text-3xl font-bold text-center mb-8">เข้าสู่ระบบ</h1><form class="space-y-6"><div><label for="username" class="block text-sm font-medium text-gray-700 mb-2"> ชื่อผู้ใช้งาน </label><input id="username"${ssrRenderAttr("value", unref(form).username)} type="text" required class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400" placeholder="username หรือ email"></div><div><label for="password" class="block text-sm font-medium text-gray-700 mb-2"> รหัสผ่าน </label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400" placeholder="••••••••"></div><div class="flex items-center justify-between"><label class="flex items-center cursor-pointer"><input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 bg-white checked:bg-green-600 checked:border-green-600"><span class="ml-2 text-sm text-gray-600">จดจำฉัน</span></label>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/forgot-password",
        class: "text-sm text-green-600 hover:text-green-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ลืมรหัสผ่าน? `);
          } else {
            return [
              createTextVNode(" ลืมรหัสผ่าน? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
      if (unref(loading)) {
        _push(`<span>กำลังเข้าสู่ระบบ...</span>`);
      } else {
        _push(`<span>เข้าสู่ระบบ</span>`);
      }
      _push(`</button></form><div class="mt-6 text-center"><p class="text-gray-600"> ยังไม่มีบัญชี? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "text-green-600 hover:text-green-700 font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` สมัครสมาชิก `);
          } else {
            return [
              createTextVNode(" สมัครสมาชิก ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DEr0jyvp.mjs.map

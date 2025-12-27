import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, withAsyncContext, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { a as useRoute, b as useRouter, u as useAuth } from './server.mjs';
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
  __name: "[provider]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    useAuth();
    const { getRedirectPathByRole } = ([__temp, __restore] = withAsyncContext(() => import('./auth-COdMvhp6.mjs')), __temp = await __temp, __restore(), __temp);
    route.params.provider;
    const loading = ref(true);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-50" }, _attrs))}><div class="text-center">`);
      if (unref(loading)) {
        _push(`<div class="space-y-4"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="text-gray-600">กำลังเข้าสู่ระบบ...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="space-y-4"><div class="text-red-600 text-xl">เกิดข้อผิดพลาด</div><p class="text-gray-600">${ssrInterpolate(unref(error))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/login",
          class: "text-green-600 hover:text-green-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` กลับไปหน้าเข้าสู่ระบบ `);
            } else {
              return [
                createTextVNode(" กลับไปหน้าเข้าสู่ระบบ ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/callback/[provider].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_provider_-KjhVxuSc.mjs.map

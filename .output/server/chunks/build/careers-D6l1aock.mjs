import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useHead } from './composables-D6rK8HzN.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import 'vary';
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
  __name: "careers",
  __ssrInlineRender: true,
  setup(__props) {
    const page = ref(null);
    const loading = ref(true);
    const error = ref(null);
    useHead({
      title: () => page.value?.meta_title || page.value?.title || "งาน/โอกาสการทำงาน",
      meta: [
        {
          name: "description",
          content: () => page.value?.meta_description || "งาน/โอกาสการทำงาน - KDC Tutor School"
        },
        {
          name: "keywords",
          content: () => page.value?.meta_keywords || ""
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 py-8" }, _attrs))} data-v-c92df7ab><div class="container mx-auto px-4 py-12 max-w-4xl" data-v-c92df7ab>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-20" data-v-c92df7ab><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" data-v-c92df7ab></div><p class="mt-4 text-gray-600" data-v-c92df7ab>กำลังโหลด...</p></div>`);
      } else if (unref(page)) {
        _push(`<div class="bg-white rounded-lg shadow-sm p-8" data-v-c92df7ab><h1 class="text-4xl font-bold text-gray-900 mb-6" data-v-c92df7ab>${ssrInterpolate(unref(page).title)}</h1><div class="prose prose-lg max-w-none" data-v-c92df7ab>${unref(page).content ?? ""}</div></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-white rounded-lg shadow-sm p-8 text-center" data-v-c92df7ab><h1 class="text-3xl font-bold text-gray-900 mb-4" data-v-c92df7ab>เกิดข้อผิดพลาด</h1><p class="text-gray-600 mb-6" data-v-c92df7ab>${ssrInterpolate(unref(error))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` กลับหน้าหลัก `);
            } else {
              return [
                createTextVNode(" กลับหน้าหลัก ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="bg-white rounded-lg shadow-sm p-8 text-center" data-v-c92df7ab><h1 class="text-3xl font-bold text-gray-900 mb-4" data-v-c92df7ab>ไม่พบหน้า</h1><p class="text-gray-600 mb-6" data-v-c92df7ab>ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` กลับหน้าหลัก `);
            } else {
              return [
                createTextVNode(" กลับหน้าหลัก ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/careers.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const careers = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c92df7ab"]]);

export { careers as default };
//# sourceMappingURL=careers-D6l1aock.mjs.map

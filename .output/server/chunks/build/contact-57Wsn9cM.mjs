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
import 'util';
import 'ecdsa-sig-formatter';
import 'buffer-equal-constant-time';
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
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    const page = ref(null);
    const loading = ref(true);
    const error = ref(null);
    useHead({
      title: () => page.value?.meta_title || page.value?.title || "ติดต่อเรา",
      meta: [
        {
          name: "description",
          content: () => page.value?.meta_description || "ติดต่อเรา - KDC Tutor School"
        },
        {
          name: "keywords",
          content: () => page.value?.meta_keywords || ""
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 py-8" }, _attrs))} data-v-db1b781d><div class="container mx-auto px-4 py-12 max-w-4xl" data-v-db1b781d>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-20" data-v-db1b781d><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" data-v-db1b781d></div><p class="mt-4 text-gray-600" data-v-db1b781d>กำลังโหลด...</p></div>`);
      } else if (unref(page)) {
        _push(`<div class="bg-white rounded-lg shadow-sm p-8" data-v-db1b781d><h1 class="text-4xl font-bold text-gray-900 mb-6" data-v-db1b781d>${ssrInterpolate(unref(page).title)}</h1><div class="prose prose-lg max-w-none" data-v-db1b781d>${unref(page).content ?? ""}</div></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-white rounded-lg shadow-sm p-8 text-center" data-v-db1b781d><h1 class="text-3xl font-bold text-gray-900 mb-4" data-v-db1b781d>เกิดข้อผิดพลาด</h1><p class="text-gray-600 mb-6" data-v-db1b781d>${ssrInterpolate(unref(error))}</p>`);
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
        _push(`<div class="bg-white rounded-lg shadow-sm p-8 text-center" data-v-db1b781d><h1 class="text-3xl font-bold text-gray-900 mb-4" data-v-db1b781d>ไม่พบหน้า</h1><p class="text-gray-600 mb-6" data-v-db1b781d>ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db1b781d"]]);

export { contact as default };
//# sourceMappingURL=contact-57Wsn9cM.mjs.map

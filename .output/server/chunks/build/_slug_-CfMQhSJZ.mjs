import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRoute } from './server.mjs';
import { u as useHead } from './composables-D6rK8HzN.mjs';
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
import 'negotiator';
import 'mime-types';
import 'path';
import 'querystring';
import 'base64id';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const article = ref(null);
    const loading = ref(true);
    const error = ref("");
    const formatDate = (date) => {
      if (!date) return "";
      try {
        const d = new Date(date);
        const months = [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม"
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      } catch {
        return "";
      }
    };
    useHead({
      title: computed(() => article.value ? article.value.title : "บทความ")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-eb0d7bd9><div class="container mx-auto px-4 py-12 max-w-4xl" data-v-eb0d7bd9>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12" data-v-eb0d7bd9><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" data-v-eb0d7bd9></div><p class="mt-2 text-gray-600" data-v-eb0d7bd9>กำลังโหลดบทความ...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" data-v-eb0d7bd9>${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(article)) {
        _push(`<article class="bg-white rounded-lg shadow-lg overflow-hidden" data-v-eb0d7bd9><div class="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center" data-v-eb0d7bd9><div class="text-6xl" data-v-eb0d7bd9>${ssrInterpolate(unref(article).icon || "📝")}</div></div><div class="p-8 border-b" data-v-eb0d7bd9><div class="flex items-center justify-between mb-4" data-v-eb0d7bd9><div class="flex items-center space-x-4" data-v-eb0d7bd9>`);
        if (unref(article).category) {
          _push(`<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium" data-v-eb0d7bd9>${ssrInterpolate(unref(article).category)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-gray-500 text-sm" data-v-eb0d7bd9>${ssrInterpolate(formatDate(unref(article).published_at || unref(article).created_at))}</span></div>`);
        if (unref(article).author_name) {
          _push(`<div class="text-sm text-gray-600" data-v-eb0d7bd9> โดย ${ssrInterpolate(unref(article).author_name)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-4xl font-bold text-gray-900 mb-4" data-v-eb0d7bd9>${ssrInterpolate(unref(article).title)}</h1>`);
        if (unref(article).excerpt) {
          _push(`<p class="text-xl text-gray-600 leading-relaxed" data-v-eb0d7bd9>${ssrInterpolate(unref(article).excerpt)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="p-8 prose prose-lg max-w-none" data-v-eb0d7bd9><div data-v-eb0d7bd9>${unref(article).content ?? ""}</div></div><div class="p-8 bg-gray-50 border-t" data-v-eb0d7bd9><div class="flex items-center justify-between" data-v-eb0d7bd9>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "text-green-600 hover:text-green-700 font-semibold flex items-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-eb0d7bd9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-v-eb0d7bd9${_scopeId}></path></svg> กลับหน้าหลัก `);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5 mr-2",
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
                createTextVNode(" กลับหน้าหลัก ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="text-sm text-gray-500" data-v-eb0d7bd9> อ่าน ${ssrInterpolate(unref(article).view_count)} ครั้ง </div></div></div></article>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/articles/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eb0d7bd9"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-CfMQhSJZ.mjs.map

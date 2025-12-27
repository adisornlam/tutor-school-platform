import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { _ as _export_sfc } from './server.mjs';
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
import 'path';
import 'querystring';
import 'timers';
import 'object-assign';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const articles = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const formatDate = (date) => {
      if (!date) return "";
      return format(new Date(date), "dd MMMM yyyy", { locale: th });
    };
    useHead({
      title: () => "บทความ - KDC Tutor School",
      meta: [
        {
          name: "description",
          content: () => "บทความและข่าวสารที่น่าสนใจจาก KDC Tutor School"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 py-8" }, _attrs))} data-v-fe7937e4><div class="container mx-auto px-4" data-v-fe7937e4><div class="mb-8" data-v-fe7937e4><h1 class="text-4xl font-bold text-gray-900 mb-4" data-v-fe7937e4>บทความ</h1><p class="text-gray-600" data-v-fe7937e4>บทความและข่าวสารที่น่าสนใจจาก KDC Tutor School</p></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-20" data-v-fe7937e4><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" data-v-fe7937e4></div><p class="mt-4 text-gray-600" data-v-fe7937e4>กำลังโหลดบทความ...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" data-v-fe7937e4>${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(articles).length > 0) {
        _push(`<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-v-fe7937e4><!--[-->`);
        ssrRenderList(unref(articles), (article) => {
          _push(`<article class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer" data-v-fe7937e4><div class="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center" data-v-fe7937e4><div class="text-6xl" data-v-fe7937e4>${ssrInterpolate(article.icon || "📝")}</div></div><div class="p-6" data-v-fe7937e4><div class="flex items-center space-x-2 mb-3" data-v-fe7937e4>`);
          if (article.category) {
            _push(`<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium" data-v-fe7937e4>${ssrInterpolate(article.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-gray-500 text-xs" data-v-fe7937e4>${ssrInterpolate(formatDate(article.published_at || article.created_at))}</span></div><h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2" data-v-fe7937e4>${ssrInterpolate(article.title)}</h2>`);
          if (article.excerpt) {
            _push(`<p class="text-gray-600 text-sm mb-4 line-clamp-3" data-v-fe7937e4>${ssrInterpolate(article.excerpt)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center justify-between" data-v-fe7937e4><span class="text-green-600 text-sm font-medium hover:text-green-700" data-v-fe7937e4> อ่านต่อ → </span><span class="text-gray-400 text-xs" data-v-fe7937e4>${ssrInterpolate(article.view_count)} views </span></div></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="bg-white rounded-lg shadow-sm p-12 text-center" data-v-fe7937e4><div class="text-6xl mb-4" data-v-fe7937e4>📝</div><h2 class="text-2xl font-bold text-gray-900 mb-2" data-v-fe7937e4>ยังไม่มีบทความ</h2><p class="text-gray-600" data-v-fe7937e4>กำลังเตรียมบทความที่น่าสนใจให้คุณ</p></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/articles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fe7937e4"]]);

export { index as default };
//# sourceMappingURL=index-CLWrykF8.mjs.map

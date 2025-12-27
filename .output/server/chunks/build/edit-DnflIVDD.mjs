import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, computed, ref, withCtx, createBlock, openBlock, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { R as RichTextEditor } from './RichTextEditor-BKbhyB-N.mjs';
import { a as useRoute, b as useRouter } from './server.mjs';
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
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-image';
import '@tiptap/extension-link';
import '@tiptap/extension-text-align';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@heroicons/vue/24/outline';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const pageId = computed(() => route.params.id === "new" ? null : parseInt(route.params.id));
    const page = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const saving = ref(false);
    const submitError = ref(null);
    const form = ref({
      slug: "",
      title: "",
      content: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      is_active: true,
      display_order: 0
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/content/pages",
        class: "p-2 hover:bg-gray-100 rounded-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-6 h-6",
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
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-3xl font-bold">${ssrInterpolate(unref(page) ? "แก้ไขหน้าเว็บไซต์" : "เพิ่มหน้าเว็บไซต์ใหม่")}</h1></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(error)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="bg-white rounded-lg shadow p-6 space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Slug <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).slug)} type="text" required placeholder="about, contact, help" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"><p class="mt-1 text-sm text-gray-500">URL path สำหรับหน้าเว็บไซต์ (เช่น: /about, /contact)</p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อหน้า <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" required placeholder="เกี่ยวกับเรา" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> สถานะ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><option${ssrRenderAttr("value", true)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, true) : ssrLooseEqual(unref(form).is_active, true)) ? " selected" : ""}>ใช้งาน</option><option${ssrRenderAttr("value", false)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, false) : ssrLooseEqual(unref(form).is_active, false)) ? " selected" : ""}>ไม่ใช้งาน</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ลำดับการแสดงผล </label><input${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> เนื้อหา </label>`);
        _push(ssrRenderComponent(RichTextEditor, {
          modelValue: unref(form).content,
          "onUpdate:modelValue": ($event) => unref(form).content = $event,
          "entity-type": "content-pages",
          "entity-id": unref(pageId) || void 0,
          class: "w-full"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Meta Title </label><input${ssrRenderAttr("value", unref(form).meta_title)} type="text" placeholder="หน้าเว็บไซต์ - KDC Tutor School" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><p class="mt-1 text-sm text-gray-500">ใช้สำหรับ SEO (ถ้าไม่กรอกจะใช้ชื่อหน้า)</p></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Meta Keywords </label><input${ssrRenderAttr("value", unref(form).meta_keywords)} type="text" placeholder="keyword1, keyword2, keyword3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Meta Description </label><textarea rows="3" placeholder="คำอธิบายสั้นๆ สำหรับ SEO" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).meta_description)}</textarea></div>`);
        if (unref(submitError)) {
          _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">${ssrInterpolate(unref(submitError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex justify-end space-x-4 pt-4 border-t">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/content/pages",
          class: "px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ยกเลิก `);
            } else {
              return [
                createTextVNode(" ยกเลิก ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">`);
        if (unref(saving)) {
          _push(`<span>กำลังบันทึก...</span>`);
        } else {
          _push(`<span>บันทึก</span>`);
        }
        _push(`</button></div></form><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/content/pages/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-DnflIVDD.mjs.map

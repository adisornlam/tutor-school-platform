import { _ as __nuxt_component_0 } from './nuxt-link-CODr8WH9.mjs';
import { defineComponent, computed, ref, withCtx, createBlock, openBlock, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { a as useRoute, u as useAuth } from './server.mjs';
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
  __name: "[roomId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useAuth();
    const roomId = computed(() => parseInt(route.params.roomId));
    const room = ref(null);
    const messages = ref([]);
    const loading = ref(true);
    const loadingMessages = ref(false);
    const error = ref("");
    const previewImage = ref(null);
    ref(0);
    const hasMoreMessages = ref(true);
    const formatTime = (dateString) => {
      try {
        return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: th });
      } catch {
        return dateString;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/chat",
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
      _push(`<h1 class="text-3xl font-bold">ดูแชท #${ssrInterpolate(unref(roomId))}</h1></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div><p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">${ssrInterpolate(unref(error))}</div>`);
      } else if (unref(room)) {
        _push(`<div class="h-[calc(100vh-200px)] flex flex-col bg-white rounded-lg shadow"><div class="border-b p-4 bg-gray-50"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><p class="text-sm text-gray-500">ผู้เรียน</p><p class="font-semibold">${ssrInterpolate(unref(room).student?.first_name)} ${ssrInterpolate(unref(room).student?.last_name)}</p></div><div><p class="text-sm text-gray-500">อาจารย์</p><p class="font-semibold">${ssrInterpolate(unref(room).tutor?.first_name)} ${ssrInterpolate(unref(room).tutor?.last_name)}</p></div><div><p class="text-sm text-gray-500">คอร์ส</p><p class="font-semibold">${ssrInterpolate(unref(room).course?.title)}</p></div></div></div><div class="flex-1 overflow-y-auto p-4 space-y-1">`);
        if (unref(loadingMessages)) {
          _push(`<div class="text-center py-2 text-sm text-gray-500"> กำลังโหลด... </div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(hasMoreMessages) && !unref(loadingMessages)) {
          _push(`<div class="text-center py-2"><button class="text-sm text-green-600 hover:text-green-700 font-medium"> โหลดข้อความเก่า </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(messages), (message) => {
          _push(`<div class="${ssrRenderClass([message.sender_id === unref(room).student_id ? "justify-end" : "justify-start", "flex mb-4"])}"><div class="flex space-x-2 max-w-[70%]"><div class="${ssrRenderClass([
            "rounded-lg px-4 py-2",
            message.sender_id === unref(room).student_id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"
          ])}">`);
          if (message.message_type === "text") {
            _push(`<p class="whitespace-pre-wrap">${ssrInterpolate(message.content)}</p>`);
          } else if (message.message_type === "image" && message.file_url) {
            _push(`<img${ssrRenderAttr("src", message.file_url)} alt="Image" class="rounded-lg max-w-sm cursor-pointer">`);
          } else if (message.message_type === "file" && message.file_url) {
            _push(`<a${ssrRenderAttr("href", message.file_url)} target="_blank" class="flex items-center space-x-2 text-sm hover:underline"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>${ssrInterpolate(message.file_name || "ไฟล์")}</span></a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="text-xs opacity-75 mt-1">${ssrInterpolate(formatTime(message.created_at))}</p></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(previewImage)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"><img${ssrRenderAttr("src", unref(previewImage))} alt="Preview" class="max-w-full max-h-full object-contain"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/chat/[roomId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_roomId_-Qi9MxOXe.mjs.map

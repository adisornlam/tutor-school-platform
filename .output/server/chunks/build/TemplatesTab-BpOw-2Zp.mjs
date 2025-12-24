globalThis.__timing__.logStart('Load chunks/build/TemplatesTab-BpOw-2Zp');import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './TemplateModal-GRTNwPnN.mjs';
import { u as useAuth, c as useRuntimeConfig } from './server.mjs';
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
  __name: "TemplatesTab",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { accessToken } = useAuth();
    const templates = ref([]);
    const loading = ref(false);
    const error = ref("");
    const showModal = ref(false);
    const selectedTemplate = ref(null);
    const modalMode = ref("view");
    const loadTemplates = async () => {
      loading.value = true;
      error.value = "";
      try {
        const response = await $fetch(`${config.public.apiBase}/admin/settings/email/templates`, {
          headers: {
            Authorization: `Bearer ${accessToken.value}`
          }
        });
        if (response.success) {
          templates.value = response.data;
        }
      } catch (err) {
        console.error("Error loading templates:", err);
        error.value = err.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
      } finally {
        loading.value = false;
      }
    };
    const closeModal = () => {
      showModal.value = false;
      selectedTemplate.value = null;
    };
    const handleTemplateSaved = () => {
      closeModal();
      loadTemplates();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow" }, _attrs))}><div class="p-6 border-b border-gray-200"><h2 class="text-2xl font-bold mb-2">เทมเพลตอีเมล</h2><p class="text-gray-600">จัดการเทมเพลตอีเมลสำหรับการส่งอีเมลต่างๆ</p></div>`);
      if (unref(loading)) {
        _push(`<div class="p-8 text-center"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div><p class="mt-2 text-gray-600">กำลังโหลด...</p></div>`);
      } else if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded m-6">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<div>`);
        if (unref(templates).length === 0) {
          _push(`<div class="p-8 text-center text-gray-500"> ไม่พบเทมเพลต </div>`);
        } else {
          _push(`<table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หัวเรื่อง</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตัวแปร</th><th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
          ssrRenderList(unref(templates), (template) => {
            _push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">${ssrInterpolate(template.name)}</div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-500">${ssrInterpolate(template.code)}</div></td><td class="px-6 py-4"><div class="text-sm text-gray-900 max-w-xs truncate">${ssrInterpolate(template.subject)}</div></td><td class="px-6 py-4"><div class="flex flex-wrap gap-1"><!--[-->`);
            ssrRenderList(template.variables, (variable) => {
              _push(`<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">${ssrInterpolate(variable)}</span>`);
            });
            _push(`<!--]--></div></td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex items-center justify-end space-x-2"><button class="text-blue-600 hover:text-blue-900" title="ดู"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button><button class="text-green-600 hover:text-green-900" title="แก้ไข"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button></div></td></tr>`);
          });
          _push(`<!--]--></tbody></table>`);
        }
        _push(`</div>`);
      }
      if (unref(showModal) && unref(selectedTemplate)) {
        _push(ssrRenderComponent(_sfc_main$1, {
          show: unref(showModal),
          template: unref(selectedTemplate),
          mode: unref(modalMode),
          onClose: closeModal,
          onSaved: handleTemplateSaved
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/email/components/TemplatesTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/TemplatesTab-BpOw-2Zp');
//# sourceMappingURL=TemplatesTab-BpOw-2Zp.mjs.map

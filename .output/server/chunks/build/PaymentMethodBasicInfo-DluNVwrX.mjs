import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
  __name: "PaymentMethodBasicInfo",
  __ssrInlineRender: true,
  props: {
    method: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const saving = ref(false);
    const error = ref("");
    const form = reactive({
      name: "",
      name_en: "",
      description: "",
      icon: "",
      is_active: true,
      is_default: false,
      display_order: 0
    });
    watch(() => props.method, (method) => {
      if (method) {
        form.name = method.name || "";
        form.name_en = method.name_en || "";
        form.description = method.description || "";
        form.icon = method.icon || "";
        form.is_active = method.is_active !== void 0 ? method.is_active : true;
        form.is_default = method.is_default !== void 0 ? method.is_default : false;
        form.display_order = method.display_order || 0;
      }
      error.value = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ (ภาษาไทย) <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).name)} type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ชื่อ (ภาษาอังกฤษ) </label><input${ssrRenderAttr("value", unref(form).name_en)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2"> คำอธิบาย </label><textarea rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).description)}</textarea></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Icon URL </label><input${ssrRenderAttr("value", unref(form).icon)} type="url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> ลำดับการแสดงผล </label><input${ssrRenderAttr("value", unref(form).display_order)} type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div class="md:col-span-2 flex items-center space-x-4"><label class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_active) ? ssrLooseContain(unref(form).is_active, null) : unref(form).is_active) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="ml-2 text-sm text-gray-700">เปิดใช้งาน</span></label><label class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_default) ? ssrLooseContain(unref(form).is_default, null) : unref(form).is_default) ? " checked" : ""} type="checkbox" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><span class="ml-2 text-sm text-gray-700">ตั้งเป็นค่าเริ่มต้น</span></label></div></div>`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-end space-x-3 pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
      if (unref(saving)) {
        _push(`<span>กำลังบันทึก...</span>`);
      } else {
        _push(`<span>บันทึก</span>`);
      }
      _push(`</button></div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/payment-methods/components/PaymentMethodBasicInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=PaymentMethodBasicInfo-DluNVwrX.mjs.map

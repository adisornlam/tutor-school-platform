import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  __name: "DisplayTab",
  __ssrInlineRender: true,
  props: {
    settings: {}
  },
  emits: ["saved"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuth();
    const saving = ref(false);
    const form = reactive({
      items_per_page: 20,
      theme_mode: "light",
      primary_color: "#10b981",
      secondary_color: "#2563eb"
    });
    watch(() => props.settings, (newSettings) => {
      if (newSettings && newSettings.length > 0) {
        newSettings.forEach((setting) => {
          const key = setting.key;
          if (key in form) {
            if (typeof form[key] === "number") {
              form[key] = Number(setting.value) || form[key];
            } else {
              form[key] = setting.value || form[key];
            }
          }
        });
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">การตั้งค่าการแสดงผล</h2><form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1"> จำนวนรายการต่อหน้า </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><option${ssrRenderAttr("value", 10)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).items_per_page) ? ssrLooseContain(unref(form).items_per_page, 10) : ssrLooseEqual(unref(form).items_per_page, 10)) ? " selected" : ""}>10</option><option${ssrRenderAttr("value", 20)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).items_per_page) ? ssrLooseContain(unref(form).items_per_page, 20) : ssrLooseEqual(unref(form).items_per_page, 20)) ? " selected" : ""}>20</option><option${ssrRenderAttr("value", 50)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).items_per_page) ? ssrLooseContain(unref(form).items_per_page, 50) : ssrLooseEqual(unref(form).items_per_page, 50)) ? " selected" : ""}>50</option><option${ssrRenderAttr("value", 100)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).items_per_page) ? ssrLooseContain(unref(form).items_per_page, 100) : ssrLooseEqual(unref(form).items_per_page, 100)) ? " selected" : ""}>100</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> Theme Mode </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><option value="light"${ssrIncludeBooleanAttr(Array.isArray(unref(form).theme_mode) ? ssrLooseContain(unref(form).theme_mode, "light") : ssrLooseEqual(unref(form).theme_mode, "light")) ? " selected" : ""}>Light</option><option value="dark"${ssrIncludeBooleanAttr(Array.isArray(unref(form).theme_mode) ? ssrLooseContain(unref(form).theme_mode, "dark") : ssrLooseEqual(unref(form).theme_mode, "dark")) ? " selected" : ""}>Dark</option><option value="auto"${ssrIncludeBooleanAttr(Array.isArray(unref(form).theme_mode) ? ssrLooseContain(unref(form).theme_mode, "auto") : ssrLooseEqual(unref(form).theme_mode, "auto")) ? " selected" : ""}>Auto (ตามระบบ)</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> Primary Color (Hex) </label><div class="flex items-center gap-2"><input${ssrRenderAttr("value", unref(form).primary_color)} type="color" class="w-16 h-10 border border-gray-300 rounded cursor-pointer"><input${ssrRenderAttr("value", unref(form).primary_color)} type="text" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm" placeholder="#10b981"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> Secondary Color (Hex) </label><div class="flex items-center gap-2"><input${ssrRenderAttr("value", unref(form).secondary_color)} type="color" class="w-16 h-10 border border-gray-300 rounded cursor-pointer"><input${ssrRenderAttr("value", unref(form).secondary_color)} type="text" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm" placeholder="#2563eb"></div></div></div><div class="flex justify-end pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">`);
      if (unref(saving)) {
        _push(`<span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` บันทึก </button></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/system/components/DisplayTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=DisplayTab-CsMJSnCo.mjs.map

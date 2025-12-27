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
  __name: "LanguageTab",
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
      default_language: "th",
      supported_languages: "th,en"
    });
    watch(() => props.settings, (newSettings) => {
      if (newSettings && newSettings.length > 0) {
        newSettings.forEach((setting) => {
          const key = setting.key;
          if (key in form) {
            form[key] = setting.value || form[key];
          }
        });
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">การตั้งค่าภาษา</h2><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1"> ภาษาหลัก </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><option value="th"${ssrIncludeBooleanAttr(Array.isArray(unref(form).default_language) ? ssrLooseContain(unref(form).default_language, "th") : ssrLooseEqual(unref(form).default_language, "th")) ? " selected" : ""}>ไทย (Thai)</option><option value="en"${ssrIncludeBooleanAttr(Array.isArray(unref(form).default_language) ? ssrLooseContain(unref(form).default_language, "en") : ssrLooseEqual(unref(form).default_language, "en")) ? " selected" : ""}>English</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> ภาษาที่รองรับ (คั่นด้วย comma) </label><input${ssrRenderAttr("value", unref(form).supported_languages)} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="th,en" required><p class="mt-1 text-sm text-gray-500"> ตัวอย่าง: th,en (ไทย, อังกฤษ) </p></div></div><div class="flex justify-end pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/system/components/LanguageTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LanguageTab-DbPMqoWD.mjs.map

import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  __name: "TimezoneTab",
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
      timezone: "Asia/Bangkok",
      date_format: "DD/MM/YYYY",
      time_format: "24-hour"
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">การตั้งค่าเวลาและวันที่</h2><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1"> Timezone </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><option value="Asia/Bangkok"${ssrIncludeBooleanAttr(Array.isArray(unref(form).timezone) ? ssrLooseContain(unref(form).timezone, "Asia/Bangkok") : ssrLooseEqual(unref(form).timezone, "Asia/Bangkok")) ? " selected" : ""}>Asia/Bangkok (+07:00)</option><option value="UTC"${ssrIncludeBooleanAttr(Array.isArray(unref(form).timezone) ? ssrLooseContain(unref(form).timezone, "UTC") : ssrLooseEqual(unref(form).timezone, "UTC")) ? " selected" : ""}>UTC (+00:00)</option><option value="Asia/Jakarta"${ssrIncludeBooleanAttr(Array.isArray(unref(form).timezone) ? ssrLooseContain(unref(form).timezone, "Asia/Jakarta") : ssrLooseEqual(unref(form).timezone, "Asia/Jakarta")) ? " selected" : ""}>Asia/Jakarta (+07:00)</option><option value="Asia/Singapore"${ssrIncludeBooleanAttr(Array.isArray(unref(form).timezone) ? ssrLooseContain(unref(form).timezone, "Asia/Singapore") : ssrLooseEqual(unref(form).timezone, "Asia/Singapore")) ? " selected" : ""}>Asia/Singapore (+08:00)</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> รูปแบบวันที่ </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><option value="DD/MM/YYYY"${ssrIncludeBooleanAttr(Array.isArray(unref(form).date_format) ? ssrLooseContain(unref(form).date_format, "DD/MM/YYYY") : ssrLooseEqual(unref(form).date_format, "DD/MM/YYYY")) ? " selected" : ""}>DD/MM/YYYY</option><option value="YYYY-MM-DD"${ssrIncludeBooleanAttr(Array.isArray(unref(form).date_format) ? ssrLooseContain(unref(form).date_format, "YYYY-MM-DD") : ssrLooseEqual(unref(form).date_format, "YYYY-MM-DD")) ? " selected" : ""}>YYYY-MM-DD</option><option value="MM/DD/YYYY"${ssrIncludeBooleanAttr(Array.isArray(unref(form).date_format) ? ssrLooseContain(unref(form).date_format, "MM/DD/YYYY") : ssrLooseEqual(unref(form).date_format, "MM/DD/YYYY")) ? " selected" : ""}>MM/DD/YYYY</option><option value="DD MMM YYYY"${ssrIncludeBooleanAttr(Array.isArray(unref(form).date_format) ? ssrLooseContain(unref(form).date_format, "DD MMM YYYY") : ssrLooseEqual(unref(form).date_format, "DD MMM YYYY")) ? " selected" : ""}>DD MMM YYYY</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> รูปแบบเวลา </label><select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><option value="24-hour"${ssrIncludeBooleanAttr(Array.isArray(unref(form).time_format) ? ssrLooseContain(unref(form).time_format, "24-hour") : ssrLooseEqual(unref(form).time_format, "24-hour")) ? " selected" : ""}>24-hour (00:00 - 23:59)</option><option value="12-hour"${ssrIncludeBooleanAttr(Array.isArray(unref(form).time_format) ? ssrLooseContain(unref(form).time_format, "12-hour") : ssrLooseEqual(unref(form).time_format, "12-hour")) ? " selected" : ""}>12-hour (AM/PM)</option></select></div></div><div class="flex justify-end pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/system/components/TimezoneTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=TimezoneTab-Dw893pUd.mjs.map

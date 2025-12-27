import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate } from 'vue/server-renderer';
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
import 'mime-db';
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
  __name: "SMTPTab",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const form = reactive({
      host: "",
      port: 587,
      secure: false,
      username: "",
      password: "",
      from_email: "",
      from_name: "",
      enabled: false
    });
    const loading = ref(false);
    const error = ref("");
    const success = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-lg shadow p-6" }, _attrs))}><div class="mb-6"><h2 class="text-2xl font-bold mb-2">ตั้งค่า SMTP</h2><p class="text-gray-600">กำหนดค่าการส่งอีเมลผ่าน SMTP Server</p></div><form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-sm font-medium text-gray-700 mb-2"> SMTP Host <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).host)} type="text" required placeholder="smtp.gmail.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> SMTP Port <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).port)} type="number" required min="1" max="65535" placeholder="587" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Username <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).username)} type="text" required placeholder="your-email@gmail.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Password <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).password)} type="password" required placeholder="••••••••" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> จากอีเมล (From Email) <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).from_email)} type="email" required placeholder="noreply@example.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> จากชื่อ (From Name) <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", unref(form).from_name)} type="text" required placeholder="Tutor School" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div><div class="space-y-4"><div class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).secure) ? ssrLooseContain(unref(form).secure, null) : unref(form).secure) ? " checked" : ""} type="checkbox" id="secure" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><label for="secure" class="ml-2 text-sm font-medium text-gray-700"> ใช้ SSL/TLS (Secure) </label></div><div class="flex items-center"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).enabled) ? ssrLooseContain(unref(form).enabled, null) : unref(form).enabled) ? " checked" : ""} type="checkbox" id="enabled" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"><label for="enabled" class="ml-2 text-sm font-medium text-gray-700"> เปิดใช้งานการส่งอีเมล </label></div></div>`);
      if (unref(error)) {
        _push(`<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(success)) {
        _push(`<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">${ssrInterpolate(unref(success))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-end"><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">`);
      if (unref(loading)) {
        _push(`<span>กำลังบันทึก...</span>`);
      } else {
        _push(`<span>บันทึกการตั้งค่า</span>`);
      }
      _push(`</button></div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/email/components/SMTPTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=SMTPTab-Bmss-J9-.mjs.map

import { defineComponent, ref, reactive, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
import 'accepts';
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
  __name: "NotificationTab",
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
      email_notifications_enabled: true,
      sms_notifications_enabled: false,
      course_reminder_before_minutes: 60,
      payment_reminder_before_days: 3
    });
    watch(() => props.settings, (newSettings) => {
      if (newSettings && newSettings.length > 0) {
        newSettings.forEach((setting) => {
          const key = setting.key;
          if (key in form) {
            if (typeof form[key] === "number") {
              form[key] = Number(setting.value) || form[key];
            } else if (typeof form[key] === "boolean") {
              form[key] = setting.value || false;
            } else {
              form[key] = setting.value || form[key];
            }
          }
        });
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">การตั้งค่าการแจ้งเตือน</h2><form class="space-y-6"><div class="border-b border-gray-200 pb-4"><h3 class="text-lg font-medium mb-4">ช่องทางการแจ้งเตือน</h3><div class="space-y-4"><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="block text-sm font-medium text-gray-700"> อีเมล </label><p class="text-sm text-gray-500 mt-1"> เปิดใช้งานการแจ้งเตือนทางอีเมล </p></div><label class="relative inline-flex items-center cursor-pointer"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).email_notifications_enabled) ? ssrLooseContain(unref(form).email_notifications_enabled, null) : unref(form).email_notifications_enabled) ? " checked" : ""} type="checkbox" class="sr-only peer"><div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div></label></div><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="block text-sm font-medium text-gray-700"> SMS </label><p class="text-sm text-gray-500 mt-1"> เปิดใช้งานการแจ้งเตือนทาง SMS </p></div><label class="relative inline-flex items-center cursor-pointer"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).sms_notifications_enabled) ? ssrLooseContain(unref(form).sms_notifications_enabled, null) : unref(form).sms_notifications_enabled) ? " checked" : ""} type="checkbox" class="sr-only peer"><div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div></label></div></div></div><div><h3 class="text-lg font-medium mb-4">การแจ้งเตือนอัตโนมัติ</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1"> แจ้งเตือนก่อนคอร์สเริ่ม (นาที) </label><input${ssrRenderAttr("value", unref(form).course_reminder_before_minutes)} type="number" min="5" max="1440" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><p class="mt-1 text-sm text-gray-500">ส่งการแจ้งเตือนก่อนคอร์สเริ่มกี่นาที</p></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> แจ้งเตือนก่อนวันชำระเงิน (วัน) </label><input${ssrRenderAttr("value", unref(form).payment_reminder_before_days)} type="number" min="1" max="30" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required><p class="mt-1 text-sm text-gray-500">ส่งการแจ้งเตือนก่อนวันชำระเงินกี่วัน</p></div></div></div><div class="flex justify-end pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/system/components/NotificationTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=NotificationTab-CXea2PWy.mjs.map

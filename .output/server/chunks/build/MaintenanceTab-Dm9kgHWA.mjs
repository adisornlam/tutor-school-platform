import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
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
import 'safe-buffer';
import 'util';
import 'jwa';
import 'ms';
import 'semver';
import 'lodash.includes';
import 'lodash.isboolean';
import 'lodash.isinteger';
import 'lodash.isnumber';
import 'lodash.isplainobject';
import 'lodash.isstring';
import 'lodash.once';
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
  __name: "MaintenanceTab",
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
      maintenance_mode: false,
      maintenance_message: "",
      maintenance_allowed_ips: []
    });
    const allowedIPsString = computed({
      get: () => form.maintenance_allowed_ips.join(", "),
      set: (value) => {
        form.maintenance_allowed_ips = value.split(",").map((ip) => ip.trim()).filter((ip) => ip.length > 0);
      }
    });
    watch(() => props.settings, (newSettings) => {
      if (newSettings && newSettings.length > 0) {
        newSettings.forEach((setting) => {
          if (setting.key === "maintenance_mode") {
            form.maintenance_mode = setting.value || false;
          } else if (setting.key === "maintenance_message") {
            form.maintenance_message = setting.value || "";
          } else if (setting.key === "maintenance_allowed_ips") {
            form.maintenance_allowed_ips = Array.isArray(setting.value) ? setting.value : [];
          }
        });
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-white rounded-lg shadow p-6"><h2 class="text-xl font-semibold mb-4">การตั้งค่า Maintenance Mode</h2><form class="space-y-4"><div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><label class="block text-sm font-medium text-gray-700"> เปิดใช้งาน Maintenance Mode </label><p class="text-sm text-gray-500 mt-1"> เมื่อเปิดใช้งาน ผู้ใช้ทั่วไปจะเห็นหน้า Maintenance แทนหน้าเว็บปกติ </p></div><label class="relative inline-flex items-center cursor-pointer"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).maintenance_mode) ? ssrLooseContain(unref(form).maintenance_mode, null) : unref(form).maintenance_mode) ? " checked" : ""} type="checkbox" class="sr-only peer"><div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div></label></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> ข้อความ Maintenance </label><textarea rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="ระบบกำลังบำรุงรักษา กรุณาลองใหม่อีกครั้งในภายหลัง">${ssrInterpolate(unref(form).maintenance_message)}</textarea></div><div><label class="block text-sm font-medium text-gray-700 mb-1"> IP ที่สามารถเข้าถึงได้ระหว่าง Maintenance (คั่นด้วย comma) </label><input${ssrRenderAttr("value", unref(allowedIPsString))} type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="127.0.0.1, 192.168.1.1"><p class="mt-1 text-sm text-gray-500"> IP ที่ระบุจะสามารถเข้าถึงระบบได้ปกติแม้จะเปิด Maintenance Mode </p></div><div class="flex justify-end pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings/system/components/MaintenanceTab.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MaintenanceTab-Dm9kgHWA.mjs.map
